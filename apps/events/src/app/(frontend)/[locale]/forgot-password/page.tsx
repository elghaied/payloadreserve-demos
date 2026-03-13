'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

export default function ForgotPasswordPage() {
  const t = useTranslations('account')
  const params = useParams()
  const locale = params.locale as string
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch(`/api/customers/forgot-password?locale=${locale}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email }),
      })

      if (res.ok) {
        setSent(true)
      } else {
        setError(t('loginError'))
      }
    } catch {
      setError(t('loginError'))
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <section className="px-6 py-16 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-md">
          <h1 className="mb-2 text-4xl font-black uppercase tracking-[-1px]">
            {t('forgotPassword')}
          </h1>
          <div className="mb-10 h-[3px] w-16 bg-black" />
          <p className="mb-8 text-sm text-neutral-600">{t('resetEmailSent')}</p>
          <Link
            href={`/${locale}/login`}
            className="font-mono text-[10px] uppercase tracking-[2px] text-black underline underline-offset-4"
          >
            {t('backToLogin')}
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="px-6 py-16 lg:px-12 lg:py-24">
      <div className="mx-auto max-w-md">
        <h1 className="mb-2 text-4xl font-black uppercase tracking-[-1px]">
          {t('forgotPassword')}
        </h1>
        <div className="mb-10 h-[3px] w-16 bg-black" />
        <p className="mb-8 text-sm text-neutral-600">{t('forgotPasswordMessage')}</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="border-[2px] border-red-600 bg-red-50 px-4 py-3 font-mono text-[11px] text-red-600">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="mb-2 block font-mono text-[10px] uppercase tracking-[2px] text-neutral-500"
            >
              {t('email')}
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-[3px] border-black px-4 py-3 text-sm focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black px-5 py-3 font-mono text-[10px] uppercase tracking-[2px] text-white transition-colors hover:bg-neutral-800 disabled:opacity-50"
          >
            {loading ? '...' : t('sendResetLink')}
          </button>
        </form>

        <p className="mt-6 text-center font-mono text-[10px] uppercase tracking-[2px] text-neutral-500">
          <Link
            href={`/${locale}/login`}
            className="text-black underline underline-offset-4"
          >
            {t('backToLogin')}
          </Link>
        </p>
      </div>
    </section>
  )
}
