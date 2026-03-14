'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

import { Container } from '@/components/Container'

export default function ForgotPasswordPage() {
  const t = useTranslations('auth')
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
        setError(t('forgotPasswordError'))
      }
    } catch {
      setError(t('forgotPasswordError'))
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <section className="py-16 lg:py-24">
        <Container className="max-w-md">
          <h1 className="font-heading text-3xl font-semibold text-center mb-8">
            {t('forgotPassword')}
          </h1>
          <div className="glass p-8 text-center">
            <p className="text-sm text-muted mb-6">{t('resetEmailSent')}</p>
            <Link
              href={`/${locale}/login`}
              className="text-primary text-sm hover:underline"
            >
              {t('backToLogin')}
            </Link>
          </div>
        </Container>
      </section>
    )
  }

  return (
    <section className="py-16 lg:py-24">
      <Container className="max-w-md">
        <h1 className="font-heading text-3xl font-semibold text-center mb-2">
          {t('forgotPassword')}
        </h1>
        <p className="text-center text-muted text-sm mb-8">
          {t('forgotPasswordMessage')}
        </p>

        <div className="glass p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg border border-destructive/20">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1.5">
                {t('email')}
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-border px-4 py-3 text-sm bg-surface text-foreground rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors placeholder:text-muted"
                autoComplete="email"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-background py-3 text-sm tracking-wide hover:bg-primary-hover transition-colors disabled:opacity-50 rounded-lg font-medium"
            >
              {loading ? '...' : t('sendResetLink')}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-border text-center">
            <Link href={`/${locale}/login`} className="text-primary text-sm hover:underline">
              {t('backToLogin')}
            </Link>
          </div>
        </div>
      </Container>
    </section>
  )
}
