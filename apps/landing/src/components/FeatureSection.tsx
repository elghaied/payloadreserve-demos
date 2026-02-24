const features = [
  {
    title: 'Configurable for Any Use Case',
    description: 'Services, resources, and schedules adapt to salons, hotels, restaurants, venues, and anything else that takes bookings.',
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    title: 'Calendar Admin View',
    description: 'Month/week/day calendar replaces the default Payload list view — at-a-glance availability for the whole team.',
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Double-Booking Prevention',
    description: 'Server-side conflict detection with configurable buffer times between reservations.',
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinejoin="round" />
        <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Three Booking Types',
    description: 'Fixed-duration (appointment), flexible end time, or full-day bookings — set per resource.',
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3.5 2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Configurable Status Machine',
    description: 'Define your own statuses, transitions, and terminal states — e.g. pending → confirmed → completed → cancelled.',
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <circle cx="5" cy="12" r="2" />
        <circle cx="12" cy="12" r="2" />
        <circle cx="19" cy="12" r="2" />
        <path d="M7 12h3M14 12h3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Capacity Management',
    description: 'quantity > 1 allows concurrent bookings; per-reservation or per-guest capacity modes.',
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Multi-Resource Reservations',
    description: 'A single booking can span multiple resources simultaneously via the items array.',
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <rect x="2" y="3" width="20" height="18" rx="2" />
        <path d="M8 3v18M16 3v18" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Hooks API',
    description: 'Seven lifecycle hooks (beforeCreate, afterConfirm, afterCancel, etc.) for plugging in email, Stripe, or any external system.',
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Public REST API',
    description: 'Five pre-built endpoints: availability check, slot listing, booking creation, cancellation, and customer search.',
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
]

export function FeatureSection() {
  return (
    <section id="features" className="py-24 lg:py-32 px-6 lg:px-8 bg-[#F7F7F5] dark:bg-stone-950">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs font-bold text-violet-700 dark:text-violet-400 uppercase tracking-[0.2em] mb-4">Features</p>
          <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] leading-[1.1] text-[#1C1917] dark:text-stone-50 mb-5">
            Everything you need,
            <br />
            <span className="text-violet-700 dark:text-violet-400">nothing you don&apos;t</span>
          </h2>
          <p className="text-[#78716C] dark:text-stone-400 text-lg leading-relaxed">
            payload-reserve handles the complex scheduling logic so you can focus on your product.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-white dark:bg-stone-800 rounded-2xl border border-gray-200 dark:border-stone-700 shadow-sm p-7 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/30 hover:-translate-y-0.5 transition-all duration-200"
            >
              {/* Icon */}
              <div className="w-12 h-12 bg-violet-100 dark:bg-violet-900/30 rounded-xl flex items-center justify-center text-violet-700 dark:text-violet-400 mb-5 shrink-0">
                {f.icon}
              </div>

              {/* Text */}
              <h3 className="font-bold text-[#1C1917] dark:text-stone-100 text-base mb-2">{f.title}</h3>
              <p className="text-[#78716C] dark:text-stone-400 text-sm leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
