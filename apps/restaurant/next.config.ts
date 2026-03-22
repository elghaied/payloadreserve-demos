import { withPayload } from '@payloadcms/next/withPayload'
import createNextIntlPlugin from 'next-intl/plugin'
import type { NextConfig } from 'next'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

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
        pathname: '/photos/**',
      },
      ...(process.env.S3_ENDPOINT
        ? [
            {
              protocol: 'https' as const,
              hostname: new URL(process.env.S3_ENDPOINT).hostname,
            },
          ]
        : []),
    ],
  },
}

const payloadConfig = withPayload(withNextIntl(nextConfig), { devBundleServerPackages: false })
export default payloadConfig
