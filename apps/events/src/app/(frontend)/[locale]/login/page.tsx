'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

export default function LoginPage() {
  const t = useTranslations('account')
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
    <section className="px-6 py-16 lg:px-12 lg:py-24">
      <div className="mx-auto max-w-md">
        <h1 className="mb-2 text-4xl font-black uppercase tracking-[-1px]">
          {t('login')}
        </h1>
        <div className="mb-10 h-[3px] w-16 bg-black" />

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="border-[2px] border-red-600 bg-red-50 px-4 py-3 font-mono text-[11px] text-red-600">
              {error}
            </div>
          )}

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
            <label htmlFor="password" className="mb-2 block font-mono text-[10px] uppercase tracking-[2px] text-neutral-500">
              {t('password')}
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-[3px] border-black px-4 py-3 text-sm focus:outline-none"
            />
          </div>

          <div className="text-right">
            <Link
              href={`/${locale}/forgot-password`}
              className="font-mono text-[10px] uppercase tracking-[2px] text-neutral-500 underline underline-offset-4 hover:text-black"
            >
              {t('forgotPasswordLink')}
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black px-5 py-3 font-mono text-[10px] uppercase tracking-[2px] text-white transition-colors hover:bg-neutral-800 disabled:opacity-50"
          >
            {loading ? '...' : t('loginButton')}
          </button>
        </form>

        <p className="mt-6 text-center font-mono text-[10px] uppercase tracking-[2px] text-neutral-500">
          {t('noAccount')}{' '}
          <Link href={`/${locale}/register`} className="text-black underline underline-offset-4">
            {t('registerLink')}
          </Link>
        </p>
      </div>
    </section>
  )
}
