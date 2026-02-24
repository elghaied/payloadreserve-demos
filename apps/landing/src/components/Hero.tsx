import Link from 'next/link'

export function Hero() {
  return (
    <>
      {/* ─── Top nav ─────────────────────────────────────────────────────── */}
      <header className="fixed top-0 inset-x-0 z-50 border-b border-white/[0.05] bg-[#09090b]/85 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 h-14 flex items-center justify-between">
          <span className="font-mono text-sm font-medium text-white tracking-tight select-none">
            payload<span className="text-amber-400">-reserve</span>
          </span>
          <nav className="flex items-center gap-6">
            <Link href="/docs" className="text-xs text-zinc-400 hover:text-white transition-colors">
              Docs
            </Link>
            <Link href="/demo" className="text-xs text-zinc-400 hover:text-white transition-colors">
              Demo
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              GitHub
            </a>
          </nav>
        </div>
      </header>

      {/* ─── Hero ────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden px-6 lg:px-8 pt-14">
        {/* Ambient light blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 right-1/3 w-[700px] h-[700px] rounded-full bg-amber-500/[0.025] blur-3xl" />
          <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-violet-500/[0.03] blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto w-full grid lg:grid-cols-[1fr_1.15fr] gap-12 lg:gap-16 items-center py-28 lg:py-36">
          {/* ── Left: copy ──────────────────────────────────────────────── */}
          <div className="space-y-8">
            {/* Eyebrow */}
            <div className="hero-up hero-up-1">
              <span className="inline-flex items-center gap-2 font-mono text-[11px] text-zinc-500 border border-zinc-800 rounded-full px-3 py-1.5 select-none">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                v1.1.0 &nbsp;·&nbsp; Open Source &nbsp;·&nbsp; MIT
              </span>
            </div>

            {/* Headline */}
            <div className="hero-up hero-up-2">
              <h1 className="font-display text-[clamp(2.8rem,5.5vw,5rem)] leading-[1.06] tracking-[-0.02em] text-white">
                Reservations
                <br />
                <em className="not-italic text-amber-400">for Payload CMS</em>
              </h1>
            </div>

            {/* Sub-copy */}
            <div className="hero-up hero-up-3">
              <p className="text-[1.05rem] text-zinc-400 leading-relaxed max-w-[360px]">
                Add bookings, appointments, and scheduling to any Payload 3.x project — with one plugin.
              </p>
            </div>

            {/* CTAs */}
            <div className="hero-up hero-up-4 flex flex-wrap gap-3">
              <Link
                href="/demo"
                className="group inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 active:scale-95 text-black font-semibold text-sm px-5 py-2.5 rounded-lg transition-all duration-150 shadow-lg shadow-amber-500/20"
              >
                Try a Live Demo
                <svg
                  width="14"
                  height="14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                  className="group-hover:translate-x-0.5 transition-transform"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <Link
                href="/docs"
                className="inline-flex items-center gap-2 text-zinc-300 hover:text-white border border-zinc-700/70 hover:border-zinc-500 font-medium text-sm px-5 py-2.5 rounded-lg transition-all duration-150 hover:bg-white/[0.03]"
              >
                Read the Docs
              </Link>
            </div>
          </div>

          {/* ── Right: code card ────────────────────────────────────────── */}
          <div className="hero-up hero-up-3">
            <div className="relative">
              {/* Glow backdrop */}
              <div className="absolute -inset-px bg-gradient-to-br from-amber-500/10 via-transparent to-violet-500/10 rounded-xl blur-xl scale-95 opacity-70" />

              {/* Card */}
              <div className="relative bg-[#0d0d0f] border border-zinc-800/80 rounded-xl overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.6)]">
                {/* Window chrome */}
                <div className="flex items-center gap-1.5 px-4 py-3 border-b border-zinc-800/70 bg-[#111113]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                  <span className="ml-auto font-mono text-[11px] text-zinc-600">payload.config.ts</span>
                </div>

                {/* Code */}
                <div className="p-5 font-mono text-[12.5px] leading-[1.85] overflow-x-auto">
                  {/* Terminal install */}
                  <div className="code-line">
                    <span className="text-zinc-600">$ </span>
                    <span className="text-emerald-400">npm install payload-reserve</span>
                  </div>
                  <div className="code-line text-[11px] text-zinc-600 mb-4">
                    <span className="text-emerald-500">+</span> added 1 package · payload-reserve@1.1.0
                  </div>

                  {/* Divider comment */}
                  <div className="code-line text-zinc-700 text-[11px] mb-1">
                    {'// payload.config.ts'}
                  </div>

                  {/* Imports */}
                  <div className="code-line">
                    <span className="text-blue-400">import</span>
                    <span className="text-zinc-300"> {'{ '}</span>
                    <span className="text-amber-300">reservePlugin</span>
                    <span className="text-zinc-300">{' } '}</span>
                    <span className="text-blue-400">from</span>
                    <span className="text-emerald-300"> {'\'payload-reserve\''}</span>
                  </div>
                  <div className="code-line mb-3">
                    <span className="text-blue-400">import</span>
                    <span className="text-zinc-300"> {'{ '}</span>
                    <span className="text-amber-300">buildConfig</span>
                    <span className="text-zinc-300">{' } '}</span>
                    <span className="text-blue-400">from</span>
                    <span className="text-emerald-300"> {'\'payload\''}</span>
                  </div>

                  {/* Config */}
                  <div className="code-line">
                    <span className="text-blue-400">export default</span>
                    <span className="text-amber-300"> buildConfig</span>
                    <span className="text-zinc-300">{'({'}</span>
                  </div>
                  <div className="code-line">
                    <span className="text-zinc-300">&nbsp;&nbsp;plugins: [</span>
                  </div>
                  <div className="code-line">
                    <span className="text-zinc-300">&nbsp;&nbsp;&nbsp;&nbsp;</span>
                    <span className="text-amber-300">reservePlugin</span>
                    <span className="text-zinc-300">{'({'}</span>
                  </div>
                  <div className="code-line">
                    <span className="text-zinc-600">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{'/* resources, statuses, */'}</span>
                  </div>
                  <div className="code-line">
                    <span className="text-zinc-300">&nbsp;&nbsp;&nbsp;&nbsp;{'}'}),</span>
                  </div>
                  <div className="code-line">
                    <span className="text-zinc-300">&nbsp;&nbsp;],</span>
                  </div>
                  <div className="code-line">
                    <span className="text-zinc-300">{'})'}</span>
                    <span className="cursor-blink" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 opacity-30 pointer-events-none select-none">
          <span className="text-[9px] font-mono text-zinc-400 tracking-[0.2em] uppercase">scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-transparent to-zinc-500" />
        </div>
      </section>
    </>
  )
}
