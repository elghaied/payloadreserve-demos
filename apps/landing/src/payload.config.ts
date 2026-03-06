import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { s3Storage } from '@payloadcms/storage-s3'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
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

function requireEnv(name: string): string {
  const val = process.env[name]
  if (!val) throw new Error(`Missing required environment variable: ${name}`)
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
    components: {
      beforeDashboard: ['@/components/admin/SeedButton'],
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
              // Google App Passwords contain spaces — pass as-is, no quotes
              // in .env (Docker Compose preserves spaces in unquoted values).
              pass: process.env.SMTP_PASS!,
            },
          },
        }),
      }
    : {}),
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
  ],
})
