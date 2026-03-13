export default function BookingLoading() {
  return (
    <section className="px-6 py-16 lg:px-12 lg:py-24">
      <div className="mx-auto max-w-4xl">
        {/* Title skeleton */}
        <div className="mb-2 h-12 w-72 animate-pulse bg-neutral-200" />
        <div className="mb-10 h-[3px] w-16 bg-neutral-200" />

        {/* Progress bar skeleton */}
        <div className="mb-10">
          <div className="flex gap-1">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-2 flex-1 animate-pulse bg-neutral-200" />
            ))}
          </div>
          <div className="mt-3 flex gap-1">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-1 items-center gap-1.5">
                <div className="h-5 w-5 animate-pulse bg-neutral-200" />
                <div className="hidden h-3 w-20 animate-pulse bg-neutral-200 sm:block" />
              </div>
            ))}
          </div>
        </div>

        {/* Cards skeleton */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="border-[3px] border-neutral-200">
              <div className="h-1 animate-pulse bg-neutral-200" />
              <div className="p-5">
                <div className="mb-3 h-5 w-24 animate-pulse bg-neutral-200" />
                <div className="flex items-center justify-between">
                  <div className="h-3 w-16 animate-pulse bg-neutral-200" />
                  <div className="h-4 w-10 animate-pulse bg-neutral-200" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
