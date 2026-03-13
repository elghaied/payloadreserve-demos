export default function ProgrammeLoading() {
  return (
    <section className="border-t-[3px] border-black px-6 py-16 lg:px-12 lg:py-24">
      {/* Title skeleton */}
      <div className="mb-10 h-12 w-64 animate-pulse bg-neutral-200" />

      {/* Filter bar skeleton */}
      <div className="mb-8 space-y-5">
        <div className="flex gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-8 w-24 animate-pulse bg-neutral-200" />
          ))}
        </div>
        <div className="flex gap-6">
          <div className="h-10 w-40 animate-pulse bg-neutral-200" />
          <div className="h-10 w-56 animate-pulse bg-neutral-200" />
          <div className="ml-auto h-10 w-44 animate-pulse bg-neutral-200" />
        </div>
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="border-[3px] border-neutral-200">
            <div className="h-52 animate-pulse bg-neutral-200" />
            <div className="space-y-3 p-5">
              <div className="h-4 w-20 animate-pulse bg-neutral-200" />
              <div className="h-6 w-3/4 animate-pulse bg-neutral-200" />
              <div className="h-3 w-1/2 animate-pulse bg-neutral-200" />
              <div className="flex items-center justify-between">
                <div className="h-5 w-12 animate-pulse bg-neutral-200" />
                <div className="h-9 w-20 animate-pulse bg-neutral-200" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
