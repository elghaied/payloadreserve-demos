'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

import { Container } from '@/components/Container'

export default function RegisterPage() {
  const t = useTranslations('auth')
  const tBooking = useTranslations('booking')
  const params = useParams()
  const locale = params.locale as string
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError(t('registerError'))
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ firstName, lastName, email, password, phone }),
      })

      if (res.ok) {
        // Auto-login after registration
        await fetch('/api/customers/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ email, password }),
        })
        // Full reload so the Header (persistent layout component) remounts and re-fetches auth state.
        window.location.href = `/${locale}/account`
      } else {
        setError(t('registerError'))
      }
    } catch {
      setError(t('registerError'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="py-16 lg:py-24">
      <Container className="max-w-md">
        <h1 className="font-heading text-3xl font-semibold text-center mb-2">
          {t('registerTitle')}
        </h1>
        <p className="text-center text-muted text-sm mb-8">
          {t('hasAccount')}{' '}
          <Link href={`/${locale}/login`} className="text-primary hover:underline">
            {t('loginLink')}
          </Link>
        </p>

        <div className="glass p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg border border-destructive/20">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium mb-1.5">
                  {tBooking('firstName')}
                </label>
                <input
                  id="firstName"
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full border border-border px-4 py-3 text-sm bg-surface text-foreground rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors placeholder:text-muted"
                  autoComplete="given-name"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium mb-1.5">
                  {tBooking('lastName')}
                </label>
                <input
                  id="lastName"
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full border border-border px-4 py-3 text-sm bg-surface text-foreground rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors placeholder:text-muted"
                  autoComplete="family-name"
                />
              </div>
            </div>

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

            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-1.5">
                {tBooking('phone')}
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-border px-4 py-3 text-sm bg-surface text-foreground rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors placeholder:text-muted"
                autoComplete="tel"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1.5">
                {t('password')}
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-border px-4 py-3 text-sm bg-surface text-foreground rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                autoComplete="new-password"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1.5">
                {t('confirmPassword')}
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border border-border px-4 py-3 text-sm bg-surface text-foreground rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                autoComplete="new-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-background py-3 text-sm tracking-wide hover:bg-primary-hover transition-colors disabled:opacity-50 rounded-lg font-medium"
            >
              {loading ? '...' : t('registerButton')}
            </button>
          </form>
        </div>
      </Container>
    </section>
  )
}
