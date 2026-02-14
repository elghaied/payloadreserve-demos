import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { stripePlugin } from '@payloadcms/plugin-stripe'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { payloadReserve } from 'payload-reserve'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { reservationNotificationHook } from './hooks/reservationNotifications'
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { ServiceCategories } from './collections/ServiceCategories'
import { Testimonials } from './collections/Testimonials'
import { Gallery } from './collections/Gallery'
import { Homepage } from './globals/Homepage'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, ServiceCategories, Testimonials, Gallery],
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
      { label: 'Français', code: 'fr' },
    ],
    defaultLocale: 'en',
    fallback: true,
  },
  email: nodemailerAdapter({
    defaultFromAddress: process.env.SMTP_FROM || 'salon@example.com',
    defaultFromName: process.env.SMTP_FROM_NAME || 'Lumière Salon',
    transportOptions: {
      host: process.env.SMTP_HOST || 'localhost',
      port: Number(process.env.SMTP_PORT || 587),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    },
  }),
  plugins: [
    payloadReserve({
      slugs: {
        services: 'services',
        resources: 'specialists',
        schedules: 'schedules',
        reservations: 'reservations',
      },
      userCollection: 'users',
      adminGroup: 'Salon',
      defaultBufferTime: 5,
      cancellationNoticePeriod: 24,
      customerRole: 'customer',
      access: {
        services: { read: () => true },
        resources: { read: () => true },
        schedules: { read: () => true },
        reservations: {
          create: () => true,
          read: ({ req }) => {
            if (!req.user) return false
            if (req.user.role === 'admin') return true
            return { customer: { equals: req.user.id } }
          },
          update: ({ req }) => {
            if (!req.user) return false
            if (req.user.role === 'admin') return true
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
    // Add reservation notification hooks after payload-reserve runs
    (config) => {
      const reservations = config.collections?.find((c) => c.slug === 'reservations')
      if (reservations) {
        if (!reservations.hooks) reservations.hooks = {}
        if (!reservations.hooks.afterChange) reservations.hooks.afterChange = []
        reservations.hooks.afterChange.push(reservationNotificationHook)
      }
      return config
    },
  ],
})
