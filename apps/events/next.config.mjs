import { withPayload } from '@payloadcms/next/withPayload'
import { withSentryConfig } from '@sentry/nextjs'
import createNextIntlPlugin from 'next-intl/plugin'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const s3Endpoint = process.env.S3_ENDPOINT
let minioPattern = null
if (s3Endpoint) {
  try {
    const u = new URL(s3Endpoint)
    minioPattern = {
      protocol: u.protocol.replace(':', ''),
      hostname: u.hostname,
      ...(u.port ? { port: u.port } : {}),
    }
  } catch { /* invalid URL, skip */ }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  outputFileTracingRoot: path.join(__dirname, '../../'),
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        pathname: '/photos/**',
      },
      ...(minioPattern ? [minioPattern] : []),
    ],
  },
}

const payloadConfig = withPayload(withNextIntl(nextConfig), { devBundleServerPackages: false })
export default withSentryConfig(payloadConfig, { silent: true, disableLogger: true })
