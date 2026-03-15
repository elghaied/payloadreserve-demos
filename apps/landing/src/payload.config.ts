import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { s3Storage } from '@payloadcms/storage-s3'
import { resendAdapter } from '@payloadcms/email-resend'
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Demos } from './collections/Demos'
import { DemoInstances } from './collections/DemoInstances'
import { DemoRequests } from './collections/DemoRequests'
import { SiteSettings } from './globals/SiteSettings'
import { Navigation } from './globals/Navigation'
import { HomePage } from './globals/HomePage'
import { Footer } from './globals/Footer'
import { InfrastructureSettings } from './globals/InfrastructureSettings'
import { DemoDashboard } from './globals/DemoDashboard'
import { seoPlugin } from '@payloadcms/plugin-seo'
import * as Sentry from '@sentry/nextjs'
import { sentryPlugin } from '@payloadcms/plugin-sentry'
import { cleanupExpiredDemosHandler } from './jobs/cleanupExpiredDemos'

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

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  graphQL: {
    disable: true,
  },
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ' — payload-reserve',
      icons: [{ rel: 'icon', url: '/reserve-logo.svg' }],
    },
    components: {
      beforeDashboard: ['@/components/admin/SeedButton'],
      graphics: {
        Logo: '@/components/admin/Logo',
        Icon: '@/components/admin/Icon',
      },
      providers: ['@/components/admin/ReturnToWebsite'],
    },
  },
  localization: {
    locales: ['en', 'fr'],
    defaultLocale: 'en',
    fallback: true,
  },
  collections: [Users, Media, Demos, DemoInstances, DemoRequests],
  globals: [SiteSettings, Navigation, HomePage, Footer, InfrastructureSettings, DemoDashboard],
  editor: lexicalEditor(),
  secret: requireEnv('PAYLOAD_SECRET'),
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: requireEnv('DATABASE_URL'),
  }),
  sharp,
  ...(process.env.RESEND_API_KEY
    ? {
        email: resendAdapter({
          defaultFromAddress: process.env.RESEND_FROM_ADDRESS || 'noreply@payloadreserve.com',
          defaultFromName: process.env.RESEND_FROM_NAME || 'payload-reserve',
          apiKey: process.env.RESEND_API_KEY,
        }),
      }
    : {}),
  jobs: {
    tasks: [
      {
        slug: 'cleanupExpiredDemos',
        label: 'Cleanup Expired Demos',
        outputSchema: [
          { name: 'expired', type: 'number' },
          { name: 'failed', type: 'number' },
          { name: 'queued', type: 'number' },
        ],
        retries: 0,
        handler: cleanupExpiredDemosHandler,
        schedule: [
          {
            cron: '* * * * *', // every minute
            queue: 'cleanup',
          },
        ],
      },
    ],
    autoRun: [
      {
        cron: '* * * * *', // check for queued jobs every minute
        queue: 'cleanup',
        limit: 1,
      },
    ],
    deleteJobOnComplete: true,
  },
  plugins: [
    s3Storage({
      collections: {
        media: {
          prefix: process.env.S3_PREFIX || 'media',
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
    seoPlugin({
      collections: ['demos'],
      globals: ['home-page'],
      uploadsCollection: 'media',
      generateTitle: ({ doc }) =>
        `payload-reserve — ${(doc as Record<string, unknown>).name ?? ''}`,
      generateDescription: ({ doc }) => {
        const d = doc as Record<string, unknown>
        return (d.description ?? d.detailDescription ?? '') as string
      },
    }),
    sentryPlugin({ Sentry }),
  ],
})
