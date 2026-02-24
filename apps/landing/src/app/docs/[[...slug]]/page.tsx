import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type React from 'react'
import { DocsPage, DocsBody, DocsTitle, DocsDescription } from 'fumadocs-ui/page'
import defaultMdxComponents from 'fumadocs-ui/mdx'
import { source } from '@/lib/source'

interface PageProps {
  params: Promise<{ slug?: string[] }>
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params
  const page = source.getPage(slug)
  if (!page) notFound()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = page.data as any
  const MDX = data.body as React.ComponentType<{ components?: Record<string, unknown> }>

  return (
    <DocsPage toc={data.toc ?? []} full={data.full}>
      <DocsTitle>{data.title}</DocsTitle>
      <DocsDescription>{data.description}</DocsDescription>
      <DocsBody>
        <MDX components={defaultMdxComponents as Record<string, unknown>} />
      </DocsBody>
    </DocsPage>
  )
}

export async function generateStaticParams() {
  return source.generateParams()
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const page = source.getPage(slug)
  if (!page) notFound()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = page.data as any
  return {
    title: `${data.title} — payload-reserve docs`,
    description: data.description,
  }
}
