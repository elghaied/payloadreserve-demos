import type { HomePage } from '@/payload-types'

type Props = {
  homepage: HomePage
}

export function UseCaseStrip({ homepage }: Props) {
  const items = homepage.useCasesItems ?? []

  return (
    <section className="py-16 px-6 lg:px-8 bg-white dark:bg-stone-900 border-b border-gray-100 dark:border-stone-800">
      <div className="max-w-6xl mx-auto">
        <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-[#78716C] dark:text-stone-400 mb-10">
          {homepage.useCasesLabel}
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((uc) => (
            <div
              key={uc.label}
              className="flex flex-col items-center text-center gap-3 py-6 px-4 rounded-2xl bg-white dark:bg-stone-800 border border-gray-200 dark:border-stone-700"
            >
              <span className="text-4xl">{uc.emoji}</span>
              <div>
                <p className="font-bold text-sm text-[#1C1917] dark:text-stone-100">{uc.label}</p>
                <p className="text-xs text-[#78716C] dark:text-stone-400 mt-1 leading-snug">{uc.description}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-[#78716C] dark:text-stone-500 mt-6">
          {homepage.useCasesFootnote}
        </p>
      </div>
    </section>
  )
}
