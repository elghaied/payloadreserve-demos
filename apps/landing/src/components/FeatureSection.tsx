const features = [
  {
    title: 'One Plugin, Any Use Case',
    description: 'Salon, hotel, restaurant, events — all configurable from a single unified plugin.',
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    title: 'Flexible Status Machine',
    description: 'Pending → confirmed → completed — fully customizable states and transitions per resource.',
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <circle cx="5" cy="12" r="2" />
        <circle cx="12" cy="12" r="2" />
        <circle cx="19" cy="12" r="2" />
        <path d="M7 12h3M14 12h3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Conflict Detection',
    description: 'Automatic double-booking prevention built in — no bespoke overlap logic required.',
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinejoin="round" />
        <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Buffer Times',
    description: 'Add prep and cleanup gaps between bookings — automatically enforced on every slot.',
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3.5 2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Stripe Payments',
    description: 'Optional payment gate before confirmation — full Stripe Checkout integration out of the box.',
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <path d="M2 10h20" strokeLinecap="round" />
        <path d="M6 15h4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Email Notifications',
    description: 'Built-in hooks for confirmation, reminder, and cancellation — plug in any mailer.',
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M2 7l10 7 10-7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
]

export function FeatureSection() {
  return (
    <section className="py-24 lg:py-32 px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="max-w-xl mb-14">
          <p className="font-mono text-[11px] text-amber-400 uppercase tracking-[0.15em] mb-4">Features</p>
          <h2 className="font-display text-[clamp(2rem,3.5vw,3.2rem)] leading-[1.1] tracking-tight text-white mb-4">
            Everything you need,
            <br />
            <em className="not-italic text-zinc-400">nothing you don&apos;t</em>
          </h2>
          <p className="text-zinc-500 text-base leading-relaxed">
            payload-reserve handles the complex scheduling logic so you can focus on your product.
          </p>
        </div>

        {/* Feature grid — seamless border effect via bg + gap */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-zinc-800/40 rounded-xl overflow-hidden border border-zinc-800/50 shadow-[0_0_60px_rgba(0,0,0,0.3)]">
          {features.map((f) => (
            <div
              key={f.title}
              className="group bg-[#09090b] hover:bg-[#0e0e10] transition-colors duration-200 p-7 flex flex-col gap-4"
            >
              {/* Icon */}
              <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 text-amber-400 group-hover:border-amber-500/30 group-hover:bg-amber-500/5 transition-all duration-200 shrink-0">
                {f.icon}
              </div>

              {/* Text */}
              <div>
                <h3 className="text-white text-sm font-semibold mb-1.5 tracking-tight">{f.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{f.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
