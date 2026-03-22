import { withPayload } from '@payloadcms/next/withPayload'
import createNextIntlPlugin from 'next-intl/plugin'
import type { NextConfig } from 'next'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const s3Endpoint = process.env.S3_ENDPOINT
let minioPattern = null
if (s3Endpoint) {
  try {
    const u = new URL(s3Endpoint)
    minioPattern = {
      protocol: u.protocol.replace(':', '') as 'http' | 'https',
      hostname: u.hostname,
      ...(u.port ? { port: u.port } : {}),
    }
  } catch { /* invalid URL, skip */ }
}

const nextConfig: NextConfig = {
  output: 'standalone',
  // Monorepo: trace files relative to the repo root so workspace packages
  // (packages/seed-utils, etc.) are included in the standalone output.
  outputFileTracingRoot: '../../',
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
      },
      ...(minioPattern ? [minioPattern] : []),
    ],
  },
}

const payloadConfig = withPayload(withNextIntl(nextConfig), { devBundleServerPackages: false })
export default payloadConfig
