'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

type Props = {
  token: string | null
  locale: string
}

export default function ResetPasswordForm({ token, locale }: Props) {
  const t = useTranslations('auth')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (!token) {
    return (
      <div className="text-center">
        <div className="bg-error/10 text-error text-sm p-3 rounded-sm mb-6">
          {t('resetErrorNoToken')}
        </div>
        <Link
          href={`/${locale}/forgot-password`}
          className="text-primary text-sm hover:underline"
        >
          {t('requestNewLink')}
        </Link>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError(t('passwordsDoNotMatch'))
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/customers/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ token, password }),
      })

      if (res.ok) {
        setSuccess(true)
      } else {
        setError(t('resetError'))
      }
    } catch {
      setError(t('resetError'))
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center">
        <p className="text-sm text-muted mb-6">{t('resetSuccess')}</p>
        <Link
          href={`/${locale}/account`}
          className="inline-block bg-primary text-white px-6 py-3 text-sm tracking-wide hover:bg-primary-dark transition-colors"
        >
          {t('goToAccount')}
        </Link>
      </div>
    )
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="bg-error/10 text-error text-sm p-3 rounded-sm">{error}</div>
        )}

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1.5">
            {t('newPassword')}
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-border px-4 py-3 text-sm bg-surface focus:outline-none focus:border-primary transition-colors"
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
            className="w-full border border-border px-4 py-3 text-sm bg-surface focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white py-3 text-sm tracking-wide hover:bg-primary-dark transition-colors disabled:opacity-50"
        >
          {loading ? '...' : t('resetPasswordButton')}
        </button>
      </form>

      <p className="text-center text-sm text-muted mt-6">
        <Link href={`/${locale}/forgot-password`} className="text-primary hover:underline">
          {t('requestNewLink')}
        </Link>
      </p>
    </>
  )
}
