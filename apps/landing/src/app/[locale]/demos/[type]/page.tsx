import { Link } from '@/i18n/navigation'
import { notFound } from 'next/navigation'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import Image from 'next/image'

type DemoType = 'salon' | 'hotel' | 'restaurant' | 'events'

interface DemoPageConfig {
  name: string
  tagline: string
  emoji: string
  description: string
  liveUrl: string | null
  features: { title: string; description: string }[]
  pluginSnippet: string
  screenshots?: { src: string; alt: string }[]
}

const demoConfigs: Record<DemoType, DemoPageConfig> = {
  salon: {
    name: 'Lumière Salon',
    tagline: 'Appointment scheduling built for beauty professionals',
    emoji: '✂️',
    description:
      'A complete salon booking system built with payload-reserve. Clients book specific stylists, choose from service menus, and pay a deposit — all without leaving your site.',
    liveUrl: 'https://salon.payloadreserve.com',
    features: [
      {
        title: 'Per-specialist scheduling',
        description: 'Clients select a stylist then see their individual calendar and open slots.',
      },
      {
        title: 'Service menus with durations',
        description:
          'Define services (cut, colour, treatment) with exact durations; slot length adjusts automatically.',
      },
      {
        title: 'Buffer times',
        description: 'Automatic 5-minute gap between appointments; no manual blocking needed.',
      },
      {
        title: 'Email confirmations',
        description:
          "Confirmation and cancellation emails sent automatically via the plugin's lifecycle hooks.",
      },
      {
        title: 'Stripe payment gate',
        description: 'Charge a deposit or card-on-file before confirming — reduces no-shows.',
      },
      {
        title: 'Cancellation policy',
        description:
          '24-hour minimum notice enforced server-side; late cancellations flagged for staff.',
      },
    ],
    pluginSnippet: `    payloadReserve({
      slugs: {
        services: 'services',
        resources: 'specialists',
        schedules: 'schedules',
        reservations: 'reservations',
      },
      extraReservationFields: [
        {
          name: 'paymentReminderSent',
          type: 'checkbox',
          defaultValue: false,
          admin: { position: 'sidebar' },
        },
      ],
      adminGroup: 'Salon',
      defaultBufferTime: 5,
      cancellationNoticePeriod: 24,
      hooks: {
        afterBookingConfirm: [notifyAfterConfirm],
        afterBookingCancel: [notifyAfterCancel],
      },
      access: {
        customers: {
          create: () => true,
          read: ({ req }) => {
            if (!req.user) return false
            if (req.user.collection === 'users') return true
            return { id: { equals: req.user.id } }
          },
          update: ({ req }) => {
            if (!req.user) return false
            if (req.user.collection === 'users') return true
            return { id: { equals: req.user.id } }
          },
        },
        services: { read: () => true },
        resources: { read: () => true },
        schedules: { read: () => true },
        reservations: {
          create: () => true,
          read: ({ req }) => {
            if (!req.user) return false
            if (req.user.collection === 'users') return true
            return { customer: { equals: req.user.id } }
          },
          update: ({ req }) => {
            if (!req.user) return false
            if (req.user.collection === 'users') return true
            return { customer: { equals: req.user.id } }
          },
        },
      },
    }),`,
    screenshots: [{ src: '/imgs/salon-screenshot.png', alt: 'Salon demo screenshot' }],
  },

  hotel: {
    name: 'Grand Hotel',
    tagline: 'Room reservations with multi-night stay management',
    emoji: '🏨',
    description:
      'A hotel reservation system powered by payload-reserve. Guests select check-in and check-out dates, choose room types, and receive booking confirmations — all managed from Payload admin.',
    liveUrl: null,
    features: [
      {
        title: 'Multi-night stays',
        description:
          'Date-range booking with check-in and check-out. Conflict detection prevents double-booking.',
      },
      {
        title: 'Room types',
        description:
          'Define room categories (Standard, Deluxe, Suite) each with their own availability and pricing.',
      },
      {
        title: 'Capacity management',
        description:
          'Set per-room capacity and automatically prevent overbooking across your property.',
      },
      {
        title: 'Guest management',
        description:
          'Capture guest details, special requests, and preferences in Payload collections.',
      },
    ],
    pluginSnippet: `payloadReserve({
  slugs: {
    services: 'room-types',
    resources: 'rooms',
    schedules: 'schedules',
    reservations: 'reservations',
  },
  defaultBufferTime: 0,
  cancellationNoticePeriod: 48,
  adminGroup: 'Hotel',
})`,
  },

  restaurant: {
    name: 'Maison Restaurant',
    tagline: 'Table booking with party size and time slot management',
    emoji: '🍽️',
    description:
      'A restaurant reservation system built on payload-reserve. Guests pick a time slot, specify party size, and add special requests — automatically assigned to available tables.',
    liveUrl: null,
    features: [
      {
        title: 'Time slot booking',
        description:
          'Define service windows (lunch, dinner) and slot intervals. Guests pick from available times.',
      },
      {
        title: 'Party size',
        description:
          'Guests specify their party size and the system matches them to an appropriately sized table.',
      },
      {
        title: 'Special requests',
        description:
          'Guests add dietary requirements, occasion notes, or seating preferences at booking.',
      },
      {
        title: 'Auto table assignment',
        description:
          'Tables are assigned automatically based on party size, availability, and capacity.',
      },
    ],
    pluginSnippet: `payloadReserve({
  slugs: {
    services: 'dining-options',
    resources: 'tables',
    schedules: 'schedules',
    reservations: 'reservations',
  },
  defaultBufferTime: 15,
  cancellationNoticePeriod: 2,
  adminGroup: 'Restaurant',
})`,
  },

  events: {
    name: 'Event Venue',
    tagline: 'Event scheduling with capacity and multi-resource booking',
    emoji: '🎪',
    description:
      'A venue booking system powered by payload-reserve. Event organizers reserve spaces, select configurations, and manage capacity — with conflict detection across all spaces.',
    liveUrl: null,
    features: [
      {
        title: 'Capacity limits',
        description:
          'Each space has a maximum capacity. The system prevents overbooking automatically.',
      },
      {
        title: 'Multi-resource booking',
        description:
          'Book multiple spaces or resources in a single reservation — great for complex events.',
      },
      {
        title: 'Event types',
        description:
          'Configure different event categories (conference, wedding, concert) with distinct rules.',
      },
      {
        title: 'Ticketing integration',
        description:
          'Hook into Stripe or your ticketing system to gate capacity with ticket sales.',
      },
    ],
    pluginSnippet: `payloadReserve({
  slugs: {
    services: 'event-types',
    resources: 'spaces',
    schedules: 'schedules',
    reservations: 'reservations',
  },
  defaultBufferTime: 30,
  cancellationNoticePeriod: 72,
  adminGroup: 'Events',
})`,
  },
}

const validTypes: DemoType[] = ['salon', 'hotel', 'restaurant', 'events']

export function generateStaticParams() {
  return validTypes.map((type) => ({ type }))
}

export async function generateMetadata({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params
  if (!validTypes.includes(type as DemoType)) return {}
  const config = demoConfigs[type as DemoType]
  return {
    title: `${config.name} Demo — payload-reserve`,
    description: config.description,
  }
}

export default async function DemoDetailPage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params

  if (!validTypes.includes(type as DemoType)) {
    notFound()
  }

  const config = demoConfigs[type as DemoType]
  const isLive = config.liveUrl !== null

  return (
    <>
      <Nav />
      <main className="pt-16 bg-[#FAFAF8] dark:bg-stone-900 min-h-screen">
        {/* ── Hero ── */}
        <section className="bg-[#FAFAF8] dark:bg-stone-900 px-6 lg:px-8 py-20">
          <div className="max-w-4xl mx-auto">
            {/* Back nav */}
            <Link
              href="/#demos"
              className="inline-flex items-center gap-2 text-sm text-[#78716C] dark:text-stone-400 hover:text-[#1C1917] dark:hover:text-stone-100 transition-colors mb-10"
            >
              <svg
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              All Demos
            </Link>

            <div className="flex items-center gap-5 mb-6">
              <span className="text-6xl">{config.emoji}</span>
              <div>
                <h1 className="font-display text-[clamp(2.2rem,5vw,4rem)] text-[#1C1917] dark:text-stone-50 leading-[1.05]">
                  {config.name}
                </h1>
                <p className="text-base font-medium mt-1 text-violet-700 dark:text-violet-400">
                  {config.tagline}
                </p>
              </div>
            </div>

            <p className="text-[#78716C] dark:text-stone-400 text-lg leading-relaxed max-w-2xl">
              {config.description}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 mt-8">
              {isLive ? (
                <a
                  href={config.liveUrl!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-bold text-sm px-6 py-3 rounded-full transition-all bg-violet-700 hover:bg-violet-600 text-white shadow-sm shadow-violet-400/20"
                >
                  Visit Live Demo ↗
                </a>
              ) : (
                <span className="inline-flex items-center gap-2 font-bold text-sm px-6 py-3 rounded-full bg-gray-100 dark:bg-stone-800 text-gray-400 dark:text-stone-500 cursor-default">
                  Demo Coming Soon
                </span>
              )}
              <Link
                href={`/demo?type=${type}`}
                className="inline-flex items-center gap-2 font-bold text-sm px-6 py-3 rounded-full transition-all bg-amber-500 hover:bg-amber-400 text-black shadow-sm shadow-amber-400/20"
              >
                Request Private Demo
              </Link>
            </div>
          </div>
        </section>

        {/* ── Use-case features ── */}
        <section className="py-20 px-6 lg:px-8 bg-white dark:bg-stone-800">
          <div className="max-w-4xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3 text-violet-700 dark:text-violet-400">
              Features
            </p>
            <h2 className="font-display text-[clamp(1.8rem,3.5vw,2.8rem)] text-[#1C1917] dark:text-stone-50 leading-[1.1] mb-12">
              Built for {config.name.split(' ')[1] ?? 'your'} workflows
            </h2>

            <div className="grid sm:grid-cols-2 gap-6">
              {config.features.map((f) => (
                <div
                  key={f.title}
                  className="rounded-2xl border p-6 bg-[#F7F7F5] dark:bg-stone-700 border-gray-200 dark:border-stone-600"
                >
                  <h3 className="font-bold text-base mb-2 text-[#1C1917] dark:text-stone-100">
                    {f.title}
                  </h3>
                  <p className="text-sm text-[#78716C] dark:text-stone-400 leading-relaxed">
                    {f.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Screenshot placeholder ── */}
        <section className="py-20 px-6 lg:px-8 bg-[#FAFAF8] dark:bg-stone-900">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-[clamp(1.8rem,3.5vw,2.5rem)] text-[#1C1917] dark:text-stone-50 leading-[1.1] mb-8">
              Screenshots
            </h2>
            <div className="relative rounded-2xl border border-gray-200 dark:border-stone-700 bg-gradient-to-br from-gray-100 dark:from-stone-800 to-gray-50 dark:to-stone-700 aspect-video flex flex-col items-center justify-center gap-3 shadow-sm">
              {config.screenshots ? (
                config.screenshots.map((shot) => (
                  <Image
                    key={shot.src}
                    src={shot.src}
                    alt={shot.alt}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 1024px) 100vw, 960px"
                  />
                ))
              ) : (
                <>
                  <span className="text-4xl opacity-30">{config.emoji}</span>

                  <p className="text-sm font-medium text-gray-400 dark:text-stone-500">
                    Screenshots coming soon
                  </p>
                  {isLive && (
                    <p className="text-xs text-gray-400 dark:text-stone-500">
                      Visit the{' '}
                      <a
                        href={config.liveUrl!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline text-violet-700 dark:text-violet-400"
                      >
                        live demo
                      </a>{' '}
                      to see it in action
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </section>

        {/* ── Plugin config snippet ── */}
        <section className="py-20 px-6 lg:px-8 bg-[#1C1917]">
          <div className="max-w-4xl mx-auto">
            <p className="text-xs font-bold text-amber-400 uppercase tracking-[0.2em] mb-3">
              Configuration
            </p>
            <h2 className="font-display text-[clamp(1.8rem,3.5vw,2.5rem)] text-white leading-[1.1] mb-8">
              Plugin config for {config.name}
            </h2>
            <div className="bg-[#0d0d0f] rounded-2xl border border-white/10 overflow-hidden">
              {/* Window chrome */}
              <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/10 bg-[#111113]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                <span className="ml-auto font-mono text-[11px] text-zinc-600">
                  payload.config.ts
                </span>
              </div>
              <pre className="p-6 font-mono text-[13px] leading-relaxed text-zinc-300 overflow-x-auto">
                <code>{config.pluginSnippet}</code>
              </pre>
            </div>
            <p className="mt-4 text-sm text-zinc-500">
              See the{' '}
              <a
                href="https://docs.payloadreserve.com"
                className="text-amber-400 hover:text-amber-300 transition-colors underline"
              >
                full documentation
              </a>{' '}
              for all available options.
            </p>
          </div>
        </section>

        {/* ── CTA strip ── */}
        <section className="py-16 px-6 lg:px-8 bg-[#FAFAF8] dark:bg-stone-900 border-t border-gray-200 dark:border-stone-800">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-bold text-[#1C1917] dark:text-stone-100 text-lg">
                Ready to explore {config.name}?
              </h3>
              <p className="text-[#78716C] dark:text-stone-400 text-sm mt-1">
                Try the live demo or request your own private environment.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {isLive ? (
                <a
                  href={config.liveUrl!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-bold text-sm px-6 py-3 rounded-full transition-all bg-violet-700 hover:bg-violet-600 text-white shadow-sm shadow-violet-400/20"
                >
                  Visit Live Demo ↗
                </a>
              ) : (
                <span className="inline-flex items-center gap-2 font-bold text-sm px-6 py-3 rounded-full bg-gray-100 dark:bg-stone-800 text-gray-400 dark:text-stone-500 cursor-default">
                  Demo Coming Soon
                </span>
              )}
              <Link
                href={`/demo?type=${type}`}
                className="inline-flex items-center gap-2 font-bold text-sm px-6 py-3 rounded-full transition-all bg-amber-500 hover:bg-amber-400 text-black shadow-sm shadow-amber-400/20"
              >
                Request Private Demo
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
