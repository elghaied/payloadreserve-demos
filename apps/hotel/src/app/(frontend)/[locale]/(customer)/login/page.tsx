'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

import { Container } from '@/components/Container'
import { Ornament } from '@/components/Ornament'
import { Button } from '@/components/ui/button'

export default function LoginPage() {
  const t = useTranslations('auth')
  const params = useParams()
  const locale = params.locale as string
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/customers/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })

      if (res.ok) {
        window.location.href = `/${locale}/account`
      } else {
        setError(t('loginError'))
      }
    } catch {
      setError(t('loginError'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="min-h-[80vh] flex items-center py-20 lg:py-28 relative overflow-hidden">
      {/* Atmospheric background */}
      <div className="absolute inset-0 bg-gradient-to-b from-accent/50 via-background to-background" />
      <div className="absolute inset-0 noise pointer-events-none" />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[500px] bg-primary/[0.03] rounded-full blur-[150px]" />
      </div>

      <Container className="relative z-10 max-w-md w-full">
        <div className="text-center mb-10">
          <Ornament className="mb-6" />
          <h1 className="font-heading text-3xl lg:text-4xl font-bold mb-3">
            {t('loginTitle')}
          </h1>
          <p className="text-sm text-muted">
            {locale === 'fr'
              ? 'Connectez-vous pour gerer vos reservations'
              : 'Sign in to manage your reservations'}
          </p>
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

            <div>
              <label htmlFor="password" className="block text-xs tracking-wider uppercase text-muted mb-2 font-medium">
                {t('password')}
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-border bg-background/50 px-4 py-3 text-sm text-foreground rounded-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all placeholder:text-muted-light"
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? '...' : t('loginButton')}
            </Button>
          </form>

          <p className="text-center text-sm text-muted mt-4">
            <Link href={`/${locale}/forgot-password`} className="text-primary hover:text-primary-light transition-colors">
              {t('forgotPasswordLink')}
            </Link>
          </p>

          <div className="mt-6 pt-6 border-t border-border text-center">
            <p className="text-sm text-muted">
              {t('noAccount')}{' '}
              <Link href={`/${locale}/register`} className="text-primary hover:text-primary-light transition-colors">
                {t('registerLink')}
              </Link>
            </p>
          </div>
        </div>
      </Container>
    </section>
  )
}
