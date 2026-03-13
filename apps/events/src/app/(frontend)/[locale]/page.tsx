import { setRequestLocale } from 'next-intl/server'

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <h1 className="text-5xl font-black tracking-[-3px]">ÉCLAT</h1>
    </div>
  )
}
