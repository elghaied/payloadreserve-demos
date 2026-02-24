import Link from 'next/link'
import type { DemoType } from '@payload-reserve-demos/types'

interface DemoCardConfig {
  type: DemoType
  name: string
  description: string
  active: boolean
  href: string
  accentBorder: string
  accentBg: string
  accentText: string
  accentButton: string
  badgeBg: string
  badgeText: string
  badgeBorder: string
  glowBg: string
}

const demos: DemoCardConfig[] = [
  {
    type: 'salon',
    name: 'Lumière Salon',
    description: 'Per-stylist scheduling with buffer times, service menus, and Stripe deposit.',
    active: true,
    href: '/demo?type=salon',
    accentBorder: 'border-violet-500/40 hover:border-violet-500/70',
    accentBg: 'bg-violet-500/[0.07]',
    accentText: 'text-violet-300',
    accentButton: 'bg-violet-600 hover:bg-violet-500 text-white',
    badgeBg: 'bg-violet-500/10',
    badgeText: 'text-violet-400',
    badgeBorder: 'border-violet-500/25',
    glowBg: 'bg-violet-500/10',
  },
  {
    type: 'hotel',
    name: 'Grand Hotel',
    description: 'Room reservations with check-in/out, multi-night stays, and capacity management.',
    active: false,
    href: '#',
    accentBorder: 'border-blue-500/20',
    accentBg: 'bg-blue-500/[0.05]',
    accentText: 'text-blue-400',
    accentButton: 'bg-zinc-800 text-zinc-600 cursor-not-allowed',
    badgeBg: 'bg-blue-500/10',
    badgeText: 'text-blue-500',
    badgeBorder: 'border-blue-500/20',
    glowBg: 'bg-blue-500/10',
  },
  {
    type: 'restaurant',
    name: 'Maison Restaurant',
    description: 'Table bookings with party size, time slots, and special request notes.',
    active: false,
    href: '#',
    accentBorder: 'border-amber-500/20',
    accentBg: 'bg-amber-500/[0.05]',
    accentText: 'text-amber-400',
    accentButton: 'bg-zinc-800 text-zinc-600 cursor-not-allowed',
    badgeBg: 'bg-amber-500/10',
    badgeText: 'text-amber-500',
    badgeBorder: 'border-amber-500/20',
    glowBg: 'bg-amber-500/10',
  },
  {
    type: 'events',
    name: 'Event Venue',
    description: 'Event scheduling with capacity limits, multi-resource booking, and ticketing.',
    active: false,
    href: '#',
    accentBorder: 'border-emerald-500/20',
    accentBg: 'bg-emerald-500/[0.05]',
    accentText: 'text-emerald-400',
    accentButton: 'bg-zinc-800 text-zinc-600 cursor-not-allowed',
    badgeBg: 'bg-emerald-500/10',
    badgeText: 'text-emerald-500',
    badgeBorder: 'border-emerald-500/20',
    glowBg: 'bg-emerald-500/10',
  },
]

export function DemoCards() {
  return (
    <section className="py-24 lg:py-32 px-6 lg:px-8 border-t border-zinc-800/60">
      <div className="max-w-6xl mx-auto">
        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <p className="font-mono text-[11px] text-amber-400 uppercase tracking-[0.15em] mb-3">Live Demos</p>
            <h2 className="font-display text-[clamp(2rem,3.5vw,3.2rem)] leading-[1.1] tracking-tight text-white">
              See it in action
            </h2>
          </div>
          <p className="text-zinc-500 text-sm leading-relaxed max-w-xs">
            Spin up a pre-seeded demo and explore the admin panel and booking flow.
          </p>
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {demos.map((demo) => (
            <div
              key={demo.type}
              className={`relative flex flex-col bg-[#0d0d0f] border rounded-xl p-6 transition-all duration-200 ${demo.accentBorder} ${demo.active ? 'hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/40' : 'opacity-60'}`}
            >
              {/* Coming soon badge */}
              {!demo.active && (
                <span
                  className={`absolute top-4 right-4 font-mono text-[10px] px-2 py-0.5 rounded-full border ${demo.badgeBg} ${demo.badgeText} ${demo.badgeBorder}`}
                >
                  soon
                </span>
              )}

              {/* Icon area */}
              <div className={`w-10 h-10 rounded-lg ${demo.accentBg} flex items-center justify-center mb-5 ${demo.accentText}`}>
                <DemoTypeIcon type={demo.type} />
              </div>

              {/* Text */}
              <h3 className="text-white text-sm font-semibold mb-1.5 tracking-tight">{demo.name}</h3>
              <p className="text-zinc-500 text-xs leading-relaxed flex-1 mb-5">{demo.description}</p>

              {/* CTA */}
              {demo.active ? (
                <Link
                  href={demo.href}
                  className={`inline-flex items-center justify-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg transition-colors ${demo.accentButton}`}
                >
                  Try Demo
                  <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              ) : (
                <button
                  disabled
                  className={`inline-flex items-center justify-center text-xs font-semibold px-3 py-2 rounded-lg ${demo.accentButton}`}
                >
                  Coming Soon
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function DemoTypeIcon({ type }: { type: DemoType }) {
  switch (type) {
    case 'salon':
      return (
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path d="M7 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2h-2" strokeLinecap="round" />
          <rect x="7" y="2" width="10" height="4" rx="1.5" />
          <path d="M8 12h8M8 16h5" strokeLinecap="round" />
        </svg>
      )
    case 'hotel':
      return (
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path d="M3 21V7a2 2 0 012-2h14a2 2 0 012 2v14" strokeLinecap="round" />
          <path d="M3 21h18M9 21v-5h6v5" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="9" y="9" width="2" height="2" rx="0.4" fill="currentColor" stroke="none" />
          <rect x="13" y="9" width="2" height="2" rx="0.4" fill="currentColor" stroke="none" />
        </svg>
      )
    case 'restaurant':
      return (
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2" strokeLinecap="round" />
          <path d="M7 2v20M21 15V2a5 5 0 00-5 5v6h3.5a1.5 1.5 0 010 3H19v4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'events':
      return (
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M3 10h18M8 2v4M16 2v4" strokeLinecap="round" />
          <circle cx="8" cy="15" r="1" fill="currentColor" stroke="none" />
          <circle cx="12" cy="15" r="1" fill="currentColor" stroke="none" />
          <circle cx="16" cy="15" r="1" fill="currentColor" stroke="none" />
        </svg>
      )
  }
}
