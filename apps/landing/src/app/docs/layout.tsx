import type { ReactNode } from 'react'
import { RootProvider } from 'fumadocs-ui/provider'
import { DocsLayout } from 'fumadocs-ui/layouts/docs'
import { source } from '@/lib/source'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <RootProvider>
      <DocsLayout
        tree={source.pageTree}
        nav={{
          title: (
            <span className="font-mono text-sm font-semibold text-[#1C1917]">
              payload<span className="text-violet-700">-reserve</span>
            </span>
          ),
        }}
      >
        {children}
      </DocsLayout>
    </RootProvider>
  )
}
