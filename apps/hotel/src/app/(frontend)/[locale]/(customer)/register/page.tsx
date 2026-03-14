'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

import { Container } from '@/components/Container'
import { Ornament } from '@/components/Ornament'
import { Button } from '@/components/ui/button'

export default function RegisterPage() {
  const t = useTranslations('auth')
  const tBooking = useTranslations('booking')
  const params = useParams()
  const locale = params.locale as string
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ firstName, lastName, email, password, phone }),
      })

      if (res.ok) {
        await fetch('/api/customers/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ email, password }),
        })
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

  const inputClassName =
    'w-full border border-border bg-background/50 px-4 py-3 text-sm text-foreground rounded-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all placeholder:text-muted-light'

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
            {t('registerTitle')}
          </h1>
          <p className="text-sm text-muted">
            {locale === 'fr'
              ? 'Rejoignez-nous pour une experience personnalisee'
              : 'Join us for a personalized experience'}
          </p>
        </div>

        <div className="glass-strong rounded-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-error/10 border border-error/20 text-error text-sm p-3 rounded-md">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-xs tracking-wider uppercase text-muted mb-2 font-medium">
                  {tBooking('firstName')}
                </label>
                <input id="firstName" type="text" required value={firstName}
                  onChange={(e) => setFirstName(e.target.value)} className={inputClassName} />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-xs tracking-wider uppercase text-muted mb-2 font-medium">
                  {tBooking('lastName')}
                </label>
                <input id="lastName" type="text" required value={lastName}
                  onChange={(e) => setLastName(e.target.value)} className={inputClassName} />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-xs tracking-wider uppercase text-muted mb-2 font-medium">
                {t('email')}
              </label>
              <input id="email" type="email" required value={email}
                onChange={(e) => setEmail(e.target.value)} className={inputClassName}
                placeholder="guest@grandhotel.com" />
            </div>

            <div>
              <label htmlFor="phone" className="block text-xs tracking-wider uppercase text-muted mb-2 font-medium">
                {tBooking('phone')}
              </label>
              <input id="phone" type="tel" value={phone}
                onChange={(e) => setPhone(e.target.value)} className={inputClassName}
                placeholder="+33 1 42 68 00 00" />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs tracking-wider uppercase text-muted mb-2 font-medium">
                {t('password')}
              </label>
              <input id="password" type="password" required minLength={6} value={password}
                onChange={(e) => setPassword(e.target.value)} className={inputClassName} />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? '...' : t('registerButton')}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border text-center">
            <p className="text-sm text-muted">
              {t('hasAccount')}{' '}
              <Link href={`/${locale}/login`} className="text-primary hover:text-primary-light transition-colors">
                {t('loginLink')}
              </Link>
            </p>
          </div>
        </div>
      </Container>
    </section>
  )
}
