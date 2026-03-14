import { withPayload } from '@payloadcms/next/withPayload'
import { withSentryConfig } from '@sentry/nextjs'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  outputFileTracingRoot: new URL('../../', import.meta.url).pathname,
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
              protocol: /** @type {const} */ ('https'),
              hostname: new URL(process.env.S3_ENDPOINT).hostname,
            },
          ]
        : []),
    ],
  },
}

const payloadConfig = withPayload(withNextIntl(nextConfig), { devBundleServerPackages: false })
export default withSentryConfig(payloadConfig, { silent: true, disableLogger: true })
