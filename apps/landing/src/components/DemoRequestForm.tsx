'use client'

import { useState, type FormEvent } from 'react'
import { Turnstile } from '@marsidev/react-turnstile'
import { DemoStatusPoller } from './DemoStatusPoller'
import { ErrorScreen } from './ErrorScreen'
import type { DemoType } from '@payload-reserve-demos/types'

type Stage = 'form' | 'polling' | 'error'

const demoTypes: { value: DemoType; label: string; description: string }[] = [
  { value: 'salon', label: 'Lumière Salon', description: 'Specialists, services, buffer times' },
  { value: 'hotel', label: 'Grand Hotel', description: 'Rooms, check-in/out, capacity' },
  { value: 'restaurant', label: 'Maison Restaurant', description: 'Tables, party size, time slots' },
  { value: 'events', label: 'Event Venue', description: 'Events, ticketing, multi-resource' },
]

export function DemoRequestForm() {
  const [stage, setStage] = useState<Stage>('form')
  const [demoId, setDemoId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<DemoType>('salon')

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? ''

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const form = e.currentTarget
    const name = (form.elements.namedItem('name') as HTMLInputElement).value
    const email = (form.elements.namedItem('email') as HTMLInputElement).value

    try {
      const res = await fetch('/api/demo/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, demoType: selectedType, turnstileToken }),
      })

      const data = (await res.json()) as { demoId?: string; error?: string }

      if (!res.ok || !data.demoId) {
        setError(data.error ?? 'Failed to create demo. Please try again.')
        setStage('error')
        return
      }

      setDemoId(data.demoId)
      setStage('polling')
    } catch {
      setError('Network error. Please check your connection and try again.')
      setStage('error')
    } finally {
      setLoading(false)
    }
  }

  if (stage === 'polling' && demoId) {
    return <DemoStatusPoller demoId={demoId} />
  }

  if (stage === 'error') {
    return <ErrorScreen message={error ?? 'Something went wrong.'} onRetry={() => setStage('form')} />
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-xs font-medium text-zinc-400 mb-1.5">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          placeholder="Jane Smith"
          className="w-full bg-zinc-900 border border-zinc-700/70 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition-colors"
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-xs font-medium text-zinc-400 mb-1.5">
          Email — credentials will be sent here
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="you@example.com"
          className="w-full bg-zinc-900 border border-zinc-700/70 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition-colors"
        />
      </div>

      {/* Demo type */}
      <div>
        <p className="text-xs font-medium text-zinc-400 mb-2">Demo type</p>
        <div className="grid grid-cols-2 gap-2">
          {demoTypes.map((t) => {
            const active = t.value === selectedType
            return (
              <button
                key={t.value}
                type="button"
                onClick={() => setSelectedType(t.value)}
                className={`flex flex-col items-start gap-0.5 rounded-lg border px-3.5 py-3 text-left transition-colors ${
                  active
                    ? 'border-amber-500/50 bg-amber-500/[0.07] text-white'
                    : 'border-zinc-700/60 bg-zinc-900/50 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200'
                }`}
              >
                <span className="text-xs font-medium">{t.label}</span>
                <span className="text-[10px] text-zinc-500">{t.description}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Turnstile */}
      {siteKey && (
        <div>
          <Turnstile
            siteKey={siteKey}
            onSuccess={(token) => setTurnstileToken(token)}
            onError={() => setTurnstileToken(null)}
            options={{ theme: 'dark', size: 'normal' }}
          />
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading || (!!siteKey && !turnstileToken)}
        className="w-full bg-amber-500 hover:bg-amber-400 disabled:bg-zinc-700 disabled:text-zinc-500 disabled:cursor-not-allowed text-black font-semibold text-sm px-5 py-3 rounded-lg transition-colors"
      >
        {loading ? 'Requesting…' : 'Request Demo'}
      </button>

      <p className="text-[11px] text-zinc-600 text-center leading-relaxed">
        By submitting, you agree to receive a single transactional email with demo credentials.
        <br />
        Demos are auto-deleted after expiry. No account required.
      </p>
    </form>
  )
}
