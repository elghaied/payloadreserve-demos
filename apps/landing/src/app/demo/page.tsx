import { DemoRequestForm } from '@/components/DemoRequestForm'
import { Nav } from '@/components/Nav'
import Link from 'next/link'

export const metadata = {
  title: 'Try a Live Demo — payload-reserve',
  description: 'Spin up a pre-seeded demo and explore the full booking flow in under a minute.',
}

export default function DemoPage() {
  return (
    <>
      <Nav />
      <main className="min-h-screen bg-[#FAFAF8] pt-16 px-6 py-20">
        <div className="max-w-lg mx-auto">

          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-[#78716C] hover:text-[#1C1917] transition-colors mb-10"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to home
          </Link>

          {/* Card */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm shadow-gray-100/50 p-8">
            {/* Header */}
            <div className="mb-7">
              <h1 className="font-display text-[2.2rem] text-[#1C1917] leading-tight mb-3">
                Request a demo
              </h1>
              <p className="text-[#78716C] text-sm leading-relaxed">
                Fill in your email and we&apos;ll spin up a pre-seeded environment. You&apos;ll receive credentials
                within a couple of minutes. Demos auto-expire after{' '}
                <span className="font-semibold text-[#1C1917]">{process.env.DEMO_TTL_HOURS ?? 24} hours</span>.
              </p>
            </div>

            <DemoRequestForm />
          </div>

          {/* Reassurance */}
          <div className="mt-6 flex items-center justify-center gap-6 text-xs text-[#78716C]">
            <span className="flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-emerald-600">
                <circle cx="6" cy="6" r="5.5" stroke="currentColor" />
                <path d="M3.5 6l1.8 1.8L8.5 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              No account needed
            </span>
            <span className="flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-emerald-600">
                <circle cx="6" cy="6" r="5.5" stroke="currentColor" />
                <path d="M3.5 6l1.8 1.8L8.5 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Auto-expires
            </span>
            <span className="flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-emerald-600">
                <circle cx="6" cy="6" r="5.5" stroke="currentColor" />
                <path d="M3.5 6l1.8 1.8L8.5 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Pre-seeded data
            </span>
          </div>
        </div>
      </main>
    </>
  )
}
