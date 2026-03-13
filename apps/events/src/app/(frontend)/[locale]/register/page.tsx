'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

export default function RegisterPage() {
  const t = useTranslations('account')
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

  return (
    <section className="px-6 py-16 lg:px-12 lg:py-24">
      <div className="mx-auto max-w-md">
        <h1 className="mb-2 text-4xl font-black uppercase tracking-[-1px]">
          {t('register')}
        </h1>
        <div className="mb-10 h-[3px] w-16 bg-black" />

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="border-[2px] border-red-600 bg-red-50 px-4 py-3 font-mono text-[11px] text-red-600">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="firstName" className="mb-2 block font-mono text-[10px] uppercase tracking-[2px] text-neutral-500">
              {tBooking('firstName')}
            </label>
            <input
              id="firstName"
              type="text"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full border-[3px] border-black px-4 py-3 text-sm focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="lastName" className="mb-2 block font-mono text-[10px] uppercase tracking-[2px] text-neutral-500">
              {tBooking('lastName')}
            </label>
            <input
              id="lastName"
              type="text"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full border-[3px] border-black px-4 py-3 text-sm focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block font-mono text-[10px] uppercase tracking-[2px] text-neutral-500">
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

          <div>
            <label htmlFor="phone" className="mb-2 block font-mono text-[10px] uppercase tracking-[2px] text-neutral-500">
              {tBooking('phone')}
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border-[3px] border-black px-4 py-3 text-sm focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block font-mono text-[10px] uppercase tracking-[2px] text-neutral-500">
              {t('password')}
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-[3px] border-black px-4 py-3 text-sm focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black px-5 py-3 font-mono text-[10px] uppercase tracking-[2px] text-white transition-colors hover:bg-neutral-800 disabled:opacity-50"
          >
            {loading ? '...' : t('registerButton')}
          </button>
        </form>

        <p className="mt-6 text-center font-mono text-[10px] uppercase tracking-[2px] text-neutral-500">
          {t('hasAccount')}{' '}
          <Link href={`/${locale}/login`} className="text-black underline underline-offset-4">
            {t('loginLink')}
          </Link>
        </p>
      </div>
    </section>
  )
}
