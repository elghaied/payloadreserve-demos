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
import { resetPasswordEmail, resetPasswordSubject } from './email/templates/resetPassword'
import * as Sentry from '@sentry/nextjs'
import { sentryPlugin } from '@payloadcms/plugin-sentry'

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

function requireEnv(name: string): string {
  const val = process.env[name]
  if (!val) {
    // Skip during Next.js build or Payload CLI (generate:types, etc.)
    if (process.env.NEXT_PHASE === 'phase-production-build') return ''
    if (process.argv.some((arg) => arg.includes('payload'))) return ''
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return val
}

// SMTP all-or-nothing validation: if SMTP_HOST is set, require the other SMTP vars too.
if (process.env.SMTP_HOST && process.env.NEXT_PHASE !== 'phase-production-build') {
  const required = ['SMTP_FROM', 'SMTP_USER', 'SMTP_PASS'] as const
  const missing = required.filter((k) => !process.env[k])
  if (missing.length > 0) {
    throw new Error(
      `SMTP_HOST is set but the following required SMTP variables are missing: ${missing.join(', ')}`,
    )
  }
}

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
  secret: requireEnv('PAYLOAD_SECRET'),
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
    url: requireEnv('DATABASE_URL'),
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
    // Customize customers forgot-password email template.
    // After payloadReserve, auth is still the raw `true` value — Payload's
    // sanitizer hasn't run yet. We replace it with an object containing only
    // forgotPassword overrides; the sanitizer fills in all other auth defaults.
    (incomingConfig) => {
      const config = { ...incomingConfig }
      const customersCollection = config.collections?.find((c) => c.slug === 'customers')
      if (customersCollection) {
        const forgotPassword = {
          generateEmailHTML: (args?: { token?: string; user?: any; req?: any }) => {
            const locale = args?.req?.locale || 'en'
            const name = args?.user?.firstName || ''
            const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || ''
            return resetPasswordEmail({
              customerName: name,
              token: args?.token ?? '',
              locale,
              serverURL,
            }).html
          },
          generateEmailSubject: (args?: { req?: any }) => {
            const locale = args?.req?.locale || 'en'
            return resetPasswordSubject(locale)
          },
        }

        if (typeof customersCollection.auth === 'object') {
          customersCollection.auth.forgotPassword = {
            ...customersCollection.auth.forgotPassword,
            ...forgotPassword,
          }
        } else {
          customersCollection.auth = { forgotPassword }
        }
      }
      return config
    },
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
      bucket: requireEnv('S3_BUCKET'),
      config: {
        credentials: {
          accessKeyId: requireEnv('S3_ACCESS_KEY'),
          secretAccessKey: requireEnv('S3_SECRET_KEY'),
        },
        region: process.env.S3_REGION || 'us-east-1',
        forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true',
        endpoint: process.env.S3_ENDPOINT,
      },
    }),
    ...(process.env.NEXT_PUBLIC_SENTRY_DSN
      ? [sentryPlugin({ Sentry })]
      : []),
  ],
})
