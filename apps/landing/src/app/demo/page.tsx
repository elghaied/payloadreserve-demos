import { DemoRequestForm } from '@/components/DemoRequestForm'

export const metadata = {
  title: 'Try a Live Demo — payload-reserve',
  description: 'Spin up a pre-seeded demo and explore the full booking flow in under a minute.',
}

export default function DemoPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-24">
      {/* Back link */}
      <a
        href="/"
        className="mb-10 text-xs font-mono text-zinc-500 hover:text-zinc-300 transition-colors self-start max-w-lg w-full mx-auto"
      >
        ← payload-reserve
      </a>

      <div className="w-full max-w-lg mx-auto">
        <div className="mb-8">
          <h1 className="font-display text-4xl text-white mb-3 tracking-tight">Request a demo</h1>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Fill in your email and we&apos;ll spin up a pre-seeded environment. You&apos;ll receive credentials
            within a couple of minutes. Demos auto-expire after{' '}
            <span className="text-zinc-200">{process.env.DEMO_TTL_HOURS ?? 24} hours</span>.
          </p>
        </div>

        <DemoRequestForm />
      </div>
    </main>
  )
}
