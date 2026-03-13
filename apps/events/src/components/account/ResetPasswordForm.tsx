'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

type Props = {
  token: string | null
  locale: string
}

export default function ResetPasswordForm({ token, locale }: Props) {
  const t = useTranslations('account')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (!token) {
    return (
      <>
        <div className="mb-8 border-[2px] border-red-600 bg-red-50 px-4 py-3 font-mono text-[11px] text-red-600">
          {t('resetErrorNoToken')}
        </div>
        <Link
          href={`/${locale}/forgot-password`}
          className="font-mono text-[10px] uppercase tracking-[2px] text-black underline underline-offset-4"
        >
          {t('requestNewLink')}
        </Link>
      </>
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
      <>
        <p className="mb-8 text-sm text-neutral-600">{t('resetSuccess')}</p>
        <Link
          href={`/${locale}/account`}
          className="inline-block bg-black px-5 py-3 font-mono text-[10px] uppercase tracking-[2px] text-white transition-colors hover:bg-neutral-800"
        >
          {t('goToAccount')}
        </Link>
      </>
    )
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="border-[2px] border-red-600 bg-red-50 px-4 py-3 font-mono text-[11px] text-red-600">
            {error}
          </div>
        )}

        <div>
          <label
            htmlFor="password"
            className="mb-2 block font-mono text-[10px] uppercase tracking-[2px] text-neutral-500"
          >
            {t('newPassword')}
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

        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-2 block font-mono text-[10px] uppercase tracking-[2px] text-neutral-500"
          >
            {t('confirmPassword')}
          </label>
          <input
            id="confirmPassword"
            type="password"
            required
            minLength={6}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border-[3px] border-black px-4 py-3 text-sm focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black px-5 py-3 font-mono text-[10px] uppercase tracking-[2px] text-white transition-colors hover:bg-neutral-800 disabled:opacity-50"
        >
          {loading ? '...' : t('resetPasswordButton')}
        </button>
      </form>

      <p className="mt-6 text-center font-mono text-[10px] uppercase tracking-[2px] text-neutral-500">
        <Link
          href={`/${locale}/forgot-password`}
          className="text-black underline underline-offset-4"
        >
          {t('requestNewLink')}
        </Link>
      </p>
    </>
  )
}
