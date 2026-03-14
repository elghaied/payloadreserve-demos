import type { NextConfig } from 'next'
import { withSentryConfig } from '@sentry/nextjs'
import { createMDX } from 'fumadocs-mdx/next'

const withMDX = createMDX()

const nextConfig: NextConfig = {
  output: 'standalone',
  outputFileTracingRoot: '../../',
  experimental: {
    mdxRs: false,
  },
}

export default withSentryConfig(withMDX(nextConfig), {
  silent: true,
  disableLogger: true,
})
