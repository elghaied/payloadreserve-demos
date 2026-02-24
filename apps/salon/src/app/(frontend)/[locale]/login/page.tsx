'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

import { Container } from '@/components/Container'

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
        // Full reload so the Header (persistent layout component) remounts and re-fetches auth state.
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
    <section className="py-16 lg:py-24">
      <Container className="max-w-md">
        <h1 className="font-heading text-3xl font-semibold text-center mb-8">
          {t('loginTitle')}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-error/10 text-error text-sm p-3 rounded-sm">{error}</div>
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
              className="w-full border border-border px-4 py-3 text-sm bg-surface focus:outline-none focus:border-primary transition-colors"
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-border px-4 py-3 text-sm bg-surface focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3 text-sm tracking-wide hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {loading ? '...' : t('loginButton')}
          </button>
        </form>

        <p className="text-center text-sm text-muted mt-6">
          {t('noAccount')}{' '}
          <Link href={`/${locale}/register`} className="text-primary hover:underline">
            {t('registerLink')}
          </Link>
        </p>
      </Container>
    </section>
  )
}
