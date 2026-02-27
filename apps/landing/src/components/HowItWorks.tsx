import type { HomePage } from '@/payload-types'

type Props = {
  homepage: HomePage
}

export function HowItWorks({ homepage }: Props) {
  const steps = homepage.howSteps ?? []

  return (
    <section className="py-24 lg:py-32 px-6 lg:px-8 bg-white dark:bg-stone-900">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-16">
          <p className="text-xs font-bold text-violet-700 dark:text-violet-400 uppercase tracking-[0.2em] mb-4">
            {homepage.howLabel}
          </p>
          <h2 className="font-display text-[clamp(2rem,4vw,3rem)] text-[#1C1917] dark:text-stone-50 leading-[1.1]">
            {homepage.howHeadline}
          </h2>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-10">
          {steps.map((step, i) => (
            <div key={step.id ?? i} className="flex flex-col gap-5">
              {/* Number */}
              <div className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-base shrink-0 bg-[#1C1917] dark:bg-stone-100 text-white dark:text-stone-900">
                {i + 1}
              </div>

              {/* Text */}
              <div>
                <h3 className="font-bold text-[#1C1917] dark:text-stone-100 text-lg mb-2">{step.title}</h3>
                <p className="text-[#78716C] dark:text-stone-400 text-sm leading-relaxed">{step.description}</p>
              </div>

              {/* Code snippet */}
              {step.code && (
                <code className="text-xs font-mono px-4 py-3 rounded-xl border bg-[#F7F7F5] dark:bg-stone-800 text-[#1C1917] dark:text-stone-200 border-gray-200 dark:border-stone-700">
                  {step.code}
                </code>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
