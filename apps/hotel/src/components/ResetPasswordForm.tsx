'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

import { Button } from '@/components/ui/button'

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

  const inputClassName =
    'w-full border border-border bg-background/50 px-4 py-3 text-sm text-foreground rounded-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all placeholder:text-muted-light'

  if (!token) {
    return (
      <div className="text-center">
        <div className="bg-error/10 border border-error/20 text-error text-sm p-3 rounded-md mb-6">
          {t('resetErrorNoToken')}
        </div>
        <Link
          href={`/${locale}/forgot-password`}
          className="text-primary text-sm hover:text-primary-light transition-colors"
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
          className="inline-block bg-primary text-white px-6 py-3 text-sm tracking-wide rounded-md hover:bg-primary-dark transition-colors"
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
          <div className="bg-error/10 border border-error/20 text-error text-sm p-3 rounded-md">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="password" className="block text-xs tracking-wider uppercase text-muted mb-2 font-medium">
            {t('newPassword')}
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClassName}
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-xs tracking-wider uppercase text-muted mb-2 font-medium">
            {t('confirmPassword')}
          </label>
          <input
            id="confirmPassword"
            type="password"
            required
            minLength={6}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={inputClassName}
          />
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? '...' : t('resetPasswordButton')}
        </Button>
      </form>

      <div className="mt-6 pt-6 border-t border-border text-center">
        <Link href={`/${locale}/forgot-password`} className="text-primary text-sm hover:text-primary-light transition-colors">
          {t('requestNewLink')}
        </Link>
      </div>
    </>
  )
}
