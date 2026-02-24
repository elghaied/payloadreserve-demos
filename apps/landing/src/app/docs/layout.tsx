import type { ReactNode } from 'react'
import { DocsLayout } from 'fumadocs-ui/layouts/docs'
import { source } from '@/lib/source'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      tree={source.pageTree}
      nav={{
        title: (
          <span className="font-mono text-sm font-medium">
            payload<span className="text-amber-400">-reserve</span>
          </span>
        ),
      }}
    >
      {children}
    </DocsLayout>
  )
}
