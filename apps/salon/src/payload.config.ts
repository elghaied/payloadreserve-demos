import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { resendAdapter } from '@payloadcms/email-resend'
import { stripePlugin } from '@payloadcms/plugin-stripe'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { payloadReserve } from 'payload-reserve'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { createAdminUser } from '@payload-reserve-demos/seed-utils'
import { resetPasswordEmail, resetPasswordSubject } from './email/templates/resetPassword'

import { seedEndpoint } from './endpoints/seed.js'
import { notifyAfterConfirm, notifyAfterCancel } from './hooks/reservationNotifications'
import { cancelStaleReservationsTask } from './tasks/cancelStaleReservations'
import { notifyAbandonedPaymentsTask } from './tasks/notifyAbandonedPayments'
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { ServiceCategories } from './collections/ServiceCategories'
import { Testimonials } from './collections/Testimonials'
import { Gallery } from './collections/Gallery'
import { Homepage } from './globals/Homepage'
import { SiteSettings } from './globals/SiteSettings'
import { s3Storage } from '@payloadcms/storage-s3'
import * as Sentry from '@sentry/nextjs'
import { sentryPlugin } from '@payloadcms/plugin-sentry'
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

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ' — Lumière Salon',
      icons: [{ rel: 'icon', url: '/favicon.svg' }],
    },
    components: {
      beforeDashboard: ['@/components/BeforeDashboard/index.js'],
      graphics: {
        Logo: '@/components/payload/Logo',
        Icon: '@/components/payload/Icon',
      },
      providers: ['@/components/payload/ReturnToWebsite'],
    },
  },
  endpoints: [seedEndpoint],
  collections: [Users, Media, ServiceCategories, Testimonials, Gallery],
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
  ...(process.env.RESEND_API_KEY
    ? {
        email: resendAdapter({
          defaultFromAddress: process.env.RESEND_FROM_ADDRESS || 'noreply@payload-reserve.com',
          defaultFromName: process.env.RESEND_FROM_NAME || 'Lumière Salon',
          apiKey: process.env.RESEND_API_KEY,
        }),
      }
    : {}),

  jobs: {
    tasks: [cancelStaleReservationsTask, notifyAbandonedPaymentsTask],
    autoRun: [
      {
        cron: '*/5 * * * *', // process the queue every 5 minutes
        limit: 100,
        queue: 'default',
      },
    ],
  },
  plugins: [
    payloadReserve({
      slugs: {
        services: 'services',
        resources: 'specialists',
        schedules: 'schedules',
        reservations: 'reservations',
      },
      extraReservationFields: [
        {
          name: 'paymentReminderSent',
          type: 'checkbox',
          defaultValue: false,
          admin: { position: 'sidebar' },
        },
      ],
      adminGroup: 'Salon',
      defaultBufferTime: 5,
      cancellationNoticePeriod: 24,
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
          prefix: process.env.S3_PREFIX || 'media',
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
    sentryPlugin({ Sentry }),
  ],
})
