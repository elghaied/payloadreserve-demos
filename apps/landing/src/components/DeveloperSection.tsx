import type { HomePage } from '@/payload-types'

type Props = {
  developerSection: HomePage['developerSection']
  githubUrl: string
}

export function DeveloperSection({ developerSection, githubUrl }: Props) {
  if (!developerSection) {
    return null
  }

  const steps = developerSection.devSteps ?? []

  return (
    <section className="py-24 lg:py-32 px-6 lg:px-8 bg-[#1C1917] dark:bg-stone-950">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs font-bold text-violet-400 uppercase tracking-[0.2em] mb-4">
            {developerSection.devLabel}
          </p>
          <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] text-stone-50 leading-[1.1] mb-5">
            {developerSection.devHeadline}
          </h2>
          <p className="text-stone-400 text-lg leading-relaxed">
            {developerSection.devSubtitle}
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {steps.map((step, i) => (
            <div
              key={step.id ?? i}
              className="bg-[#111110] rounded-2xl border border-white/10 p-6"
            >
              {/* Step number */}
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-violet-700 text-white mb-4">
                {i + 1}
              </div>

              <h3 className="font-bold text-stone-100 text-base mb-3">{step.title}</h3>

              {/* Code block */}
              {step.code && (
                <div className="bg-[#0d0d0f] rounded-xl border border-white/10 overflow-hidden">
                  <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/10">
                    <span className="w-2 h-2 rounded-full bg-[#ff5f57]" />
                    <span className="w-2 h-2 rounded-full bg-[#febc2e]" />
                    <span className="w-2 h-2 rounded-full bg-[#28c840]" />
                  </div>
                  <pre className="p-4 font-mono text-[12px] leading-relaxed text-violet-300 overflow-x-auto">
                    <code>{step.code}</code>
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA + note */}
        <div className="text-center space-y-4">
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white hover:bg-stone-100 active:scale-95 text-[#1C1917] font-bold text-sm px-7 py-3.5 rounded-full transition-all duration-150 shadow-lg"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            {developerSection.devCta}
          </a>
          <p className="text-stone-500 text-sm">{developerSection.devNote}</p>
        </div>
      </div>
    </section>
  )
}
