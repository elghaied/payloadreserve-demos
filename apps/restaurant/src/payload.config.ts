import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { stripePlugin } from '@payloadcms/plugin-stripe'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { payloadReserve } from 'payload-reserve'
import { createAdminUser } from '@payload-reserve-demos/seed-utils'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Menu } from './collections/Menu'
import { Team } from './collections/Team'
import { WineList } from './collections/WineList'
import { Spaces } from './collections/Spaces'
import { Announcements } from './collections/Announcements'
import { Testimonials } from './collections/Testimonials'
import { Homepage } from './globals/Homepage'
import { SiteSettings } from './globals/SiteSettings'
import { seedEndpoint } from './endpoints/seed'
import { cancelStaleReservationsTask } from './tasks/cancelStaleReservations'
import { notifyAfterConfirm, notifyAfterCancel } from './hooks/reservationNotifications'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      beforeDashboard: ['@/components/BeforeDashboard/index.js'],
    },
  },
  endpoints: [seedEndpoint],
  collections: [Users, Media, Menu, Team, WineList, Spaces, Announcements, Testimonials],
  globals: [Homepage, SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  onInit: async (payload) => {
    if (!process.env.S3_PREFIX) {
      throw new Error('S3_PREFIX environment variable is required')
    }

    const adminEmail = process.env.ADMIN_EMAIL
    const adminPassword = process.env.ADMIN_PASSWORD
    if (adminEmail && adminPassword) {
      await createAdminUser(payload, adminEmail, adminPassword)
    }
  },
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URL || '',
  }),
  sharp,
  localization: {
    locales: [
      { label: 'English', code: 'en' },
      { label: 'Français', code: 'fr' },
    ],
    defaultLocale: 'en',
    fallback: true,
  },
  // Only initialise the email transport when SMTP vars are present.
  // Without this guard, nodemailerAdapter calls transporter.verify() at
  // startup, which fails during `next build` (Docker builder stage) where
  // runtime env vars are not available.
  ...(process.env.SMTP_HOST
    ? {
        email: nodemailerAdapter({
          defaultFromAddress: process.env.SMTP_FROM!,
          defaultFromName: process.env.SMTP_FROM_NAME!,
          transportOptions: {
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT) || 587,
            auth: {
              user: process.env.SMTP_USER!,
              pass: process.env.SMTP_PASS!,
            },
          },
        }),
      }
    : {}),
  jobs: {
    tasks: [cancelStaleReservationsTask],
    autoRun: [
      {
        cron: '*/5 * * * *',
        limit: 100,
        queue: 'default',
      },
    ],
  },
  plugins: [
    payloadReserve({
      slugs: {
        services: 'dining-experiences',
        resources: 'tables',
        schedules: 'schedules',
        reservations: 'reservations',
      },
      extraReservationFields: [
        {
          name: 'partySize',
          type: 'number',
          min: 1,
          max: 20,
          defaultValue: 2,
          admin: {
            description: 'Number of guests in the party',
          },
        },
      ],
      adminGroup: 'Restaurant',
      defaultBufferTime: 15,
      cancellationNoticePeriod: 4,
      hooks: {
        afterBookingConfirm: [notifyAfterConfirm],
        afterBookingCancel: [notifyAfterCancel],
      },
      access: {
        customers: {
          create: () => true,
          read: ({ req }) => {
            if (!req.user) return false
            if (req.user.collection === 'users') return true
            return { id: { equals: req.user.id } }
          },
          update: ({ req }) => {
            if (!req.user) return false
            if (req.user.collection === 'users') return true
            return { id: { equals: req.user.id } }
          },
        },
        services: { read: () => true },
        resources: { read: () => true },
        schedules: { read: () => true },
        reservations: {
          create: () => true,
          read: ({ req }) => {
            if (!req.user) return false
            if (req.user.collection === 'users') return true
            return { customer: { equals: req.user.id } }
          },
          update: ({ req }) => {
            if (!req.user) return false
            if (req.user.collection === 'users') return true
            return { customer: { equals: req.user.id } }
          },
        },
      },
    }),
    stripePlugin({
      stripeSecretKey: process.env.STRIPE_SECRET_KEY || '',
      stripeWebhooksEndpointSecret: process.env.STRIPE_WEBHOOK_SECRET,
      isTestKey: true,
    }),
    s3Storage({
      collections: {
        media: {
          prefix: process.env.S3_PREFIX || 'restaurant',
        },
      },
      bucket: process.env.S3_BUCKET!,
      config: {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY || '',
          secretAccessKey: process.env.S3_SECRET_KEY || '',
        },
        region: process.env.S3_REGION || 'us-east-1',
        forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true',
        endpoint: process.env.S3_ENDPOINT,
      },
    }),
  ],
})
