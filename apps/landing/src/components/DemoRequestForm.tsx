'use client'

import { useState, type FormEvent } from 'react'
import { Turnstile } from '@marsidev/react-turnstile'
import { useTranslations } from 'next-intl'
import { DemoStatusPoller } from './DemoStatusPoller'
import { ErrorScreen } from './ErrorScreen'
import type { DemoType } from '@payload-reserve-demos/types'

type Stage = 'form' | 'polling' | 'error'

type DemoOption = {
  value: DemoType
  label: string
  description: string
  emoji: string
}

const activeClass = 'border-violet-500 bg-violet-50 text-violet-900 ring-2 ring-violet-200 shadow-sm'
const inactiveClass =
  'border-gray-200 bg-white text-gray-700 hover:border-violet-300 hover:bg-violet-50/40'

export function DemoRequestForm() {
  const t = useTranslations('demoRequestForm')

  const demoTypes = t.raw('demoTypes') as DemoOption[]

  const [stage, setStage] = useState<Stage>('form')
  const [demoId, setDemoId] = useState<string | null>(null)
  const [statusToken, setStatusToken] = useState<string | null>(null)
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

      const data = (await res.json()) as { demoId?: string; statusToken?: string; error?: string }

      if (!res.ok || !data.demoId || !data.statusToken) {
        setError(data.error ?? t('errors.createFailed'))
        setStage('error')
        return
      }

      setDemoId(data.demoId)
      setStatusToken(data.statusToken)
      setStage('polling')
    } catch {
      setError(t('errors.network'))
      setStage('error')
    } finally {
      setLoading(false)
    }
  }

  if (stage === 'polling' && demoId && statusToken) {
    return <DemoStatusPoller demoId={demoId} statusToken={statusToken} />
  }

  if (stage === 'error') {
    return <ErrorScreen message={error ?? t('errors.default')} onRetry={() => setStage('form')} />
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
          {t('nameLabel')}
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          placeholder={t('namePlaceholder')}
          className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all"
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
          {t('emailLabel')} <span className="text-gray-400 font-normal">- {t('emailHint')}</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder={t('emailPlaceholder')}
          className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all"
        />
      </div>

      {/* Demo type */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">{t('demoTypeLabel')}</p>
        <div className="grid grid-cols-2 gap-2">
          {demoTypes.map((demoType) => {
            const active = demoType.value === selectedType
            return (
              <button
                key={demoType.value}
                type="button"
                onClick={() => setSelectedType(demoType.value)}
                className={`relative flex flex-col items-start gap-1 rounded-xl border px-3.5 py-3 text-left transition-all duration-150 ${active ? activeClass : inactiveClass}`}
              >
                {/* Radio dot indicator */}
                <span
                  className={`absolute top-3 right-3 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                    active ? 'border-violet-600 bg-violet-600' : 'border-gray-300 bg-white'
                  }`}
                >
                  {active && (
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                      <path
                        d="M1.5 4l1.8 1.8L6.5 2.5"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </span>
                <span className="text-lg leading-none">{demoType.emoji}</span>
                <span className="text-xs font-semibold pr-5">{demoType.label}</span>
                <span className={`text-[10px] leading-tight ${active ? 'text-violet-600' : 'text-gray-400'}`}>
                  {demoType.description}
                </span>
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
            options={{ theme: 'light', size: 'normal' }}
          />
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading || (!!siteKey && !turnstileToken)}
        className="w-full bg-violet-700 hover:bg-violet-600 active:scale-[0.99] disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-semibold text-sm px-5 py-3 rounded-xl transition-all shadow-sm shadow-violet-500/20"
      >
        {loading ? t('submitLoading') : t('submitIdle')}
      </button>

      <p className="text-[11px] text-gray-400 text-center leading-relaxed">
        {t('disclaimerLine1')}
        <br />
        {t('disclaimerLine2')}
      </p>
    </form>
  )
}
