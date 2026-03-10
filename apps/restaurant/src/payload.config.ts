import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { stripePlugin } from '@payloadcms/plugin-stripe'
import { s3Storage } from '@payloadcms/storage-s3'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { payloadReserve } from 'payload-reserve'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { MenuCategories } from './collections/MenuCategories'
import { Testimonials } from './collections/Testimonials'
import { Gallery } from './collections/Gallery'
import { Homepage } from './globals/Homepage'
import { SiteSettings } from './globals/SiteSettings'
import { seedEndpoint } from './endpoints/seed'
import { cancelStaleReservationsTask } from './tasks/cancelStaleReservations'
import { notifyAfterConfirm, notifyAfterCancel } from './hooks/reservationNotifications'
import { createAdminUser } from '@payload-reserve-demos/seed-utils'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    components: {
      beforeDashboard: ['@/components/BeforeDashboard/index.js'],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, MenuCategories, Testimonials, Gallery],
  globals: [Homepage, SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
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
      { label: 'French', code: 'fr' },
    ],
    defaultLocale: 'en',
    fallback: true,
  },
  ...(process.env.SMTP_HOST
    ? {
        email: nodemailerAdapter({
          defaultFromAddress: process.env.SMTP_FROM || 'reservations@lejardin.com',
          defaultFromName: process.env.SMTP_FROM_NAME || 'Le Jardin Dore',
          transportOptions: {
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT) || 587,
            auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS,
            },
          },
        }),
      }
    : {}),
  endpoints: [seedEndpoint],
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
      userCollection: 'users',
      adminGroup: 'Restaurant',
      defaultBufferTime: 15,
      cancellationNoticePeriod: 4,
      access: {
        services: { read: () => true },
        resources: { read: () => true },
        schedules: { read: () => true },
        reservations: { create: () => true },
      },
      hooks: {
        afterBookingConfirm: [notifyAfterConfirm],
        afterBookingCancel: [notifyAfterCancel],
      },
    }),
    // Add restaurant-specific fields to plugin collections
    (config) => {
      // Add partySize to reservations
      const reservations = config.collections?.find((c) => c.slug === 'reservations')
      if (reservations) {
        reservations.fields.push({
          name: 'partySize',
          type: 'number',
          min: 1,
          max: 20,
          defaultValue: 2,
          admin: {
            description: 'Number of guests in the party',
          },
        })
      }

      // Add seats to tables (resources)
      const tables = config.collections?.find((c) => c.slug === 'tables')
      if (tables) {
        tables.fields.push({
          name: 'seats',
          type: 'number',
          min: 1,
          max: 30,
          admin: {
            description: 'Number of seats at this table type',
          },
        })
      }

      return config
    },
    // Stripe (optional)
    ...(process.env.STRIPE_SECRET_KEY
      ? [
          stripePlugin({
            stripeSecretKey: process.env.STRIPE_SECRET_KEY,
            stripeWebhooksEndpointSecret: process.env.STRIPE_WEBHOOK_SECRET,
            isTestKey: process.env.STRIPE_SECRET_KEY?.startsWith('sk_test_'),
          }),
        ]
      : []),
    // S3 Storage (optional)
    ...(process.env.S3_ENDPOINT
      ? [
          s3Storage({
            collections: { media: { prefix: process.env.S3_PREFIX || 'restaurant' } },
            bucket: process.env.S3_BUCKET || '',
            config: {
              region: process.env.S3_REGION || 'auto',
              endpoint: process.env.S3_ENDPOINT,
              credentials: {
                accessKeyId: process.env.S3_ACCESS_KEY || '',
                secretAccessKey: process.env.S3_SECRET_KEY || '',
              },
              forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true',
            },
          }),
        ]
      : []),
  ],
  onInit: async (payload) => {
    if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
      await createAdminUser(payload, process.env.ADMIN_EMAIL, process.env.ADMIN_PASSWORD)
    }
  },
})
