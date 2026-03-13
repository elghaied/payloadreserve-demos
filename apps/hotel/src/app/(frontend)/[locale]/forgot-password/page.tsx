'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

import { Container } from '@/components/Container'
import { Ornament } from '@/components/Ornament'
import { Button } from '@/components/ui/button'

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
      <section className="min-h-[80vh] flex items-center py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/50 via-background to-background" />
        <div className="absolute inset-0 noise pointer-events-none" />
        <Container className="relative z-10 max-w-md w-full">
          <div className="text-center mb-10">
            <Ornament className="mb-6" />
            <h1 className="font-heading text-3xl lg:text-4xl font-bold mb-3">
              {t('forgotPassword')}
            </h1>
          </div>
          <div className="glass-strong rounded-xl p-8 text-center">
            <p className="text-sm text-muted mb-6">{t('resetEmailSent')}</p>
            <Link
              href={`/${locale}/login`}
              className="text-primary text-sm hover:text-primary-light transition-colors"
            >
              {t('backToLogin')}
            </Link>
          </div>
        </Container>
      </section>
    )
  }

  return (
    <section className="min-h-[80vh] flex items-center py-20 lg:py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-accent/50 via-background to-background" />
      <div className="absolute inset-0 noise pointer-events-none" />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[500px] bg-primary/[0.03] rounded-full blur-[150px]" />
      </div>

      <Container className="relative z-10 max-w-md w-full">
        <div className="text-center mb-10">
          <Ornament className="mb-6" />
          <h1 className="font-heading text-3xl lg:text-4xl font-bold mb-3">
            {t('forgotPassword')}
          </h1>
          <p className="text-sm text-muted">{t('forgotPasswordMessage')}</p>
        </div>

        <div className="glass-strong rounded-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-error/10 border border-error/20 text-error text-sm p-3 rounded-md">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-xs tracking-wider uppercase text-muted mb-2 font-medium">
                {t('email')}
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-border bg-background/50 px-4 py-3 text-sm text-foreground rounded-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all placeholder:text-muted-light"
                placeholder="guest@grandhotel.com"
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? '...' : t('sendResetLink')}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border text-center">
            <Link href={`/${locale}/login`} className="text-primary text-sm hover:text-primary-light transition-colors">
              {t('backToLogin')}
            </Link>
          </div>
        </div>
      </Container>
    </section>
  )
}
