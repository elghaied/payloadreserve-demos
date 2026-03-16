import type { NextConfig } from 'next'
import { createMDX } from 'fumadocs-mdx/next'

const withMDX = createMDX()

const nextConfig: NextConfig = {
  output: 'standalone',
  outputFileTracingRoot: '../../',
  experimental: {
    mdxRs: false,
  },
}

export default withMDX(nextConfig)
