'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<void>
  error: string | null
  loading: boolean
}

export function LoginForm({ onLogin, error, loading }: LoginFormProps) {
  const t = useTranslations('account')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await onLogin(email, password)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="login-email"
          className="mb-2 block font-mono text-[10px] uppercase tracking-[2px]"
        >
          {t('email')}
        </label>
        <input
          id="login-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border-[3px] border-black bg-white px-4 py-3 font-mono text-sm outline-none placeholder:text-neutral-400 focus:ring-0"
          placeholder="nom@example.com"
        />
      </div>

      <div>
        <label
          htmlFor="login-password"
          className="mb-2 block font-mono text-[10px] uppercase tracking-[2px]"
        >
          {t('password')}
        </label>
        <input
          id="login-password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border-[3px] border-black bg-white px-4 py-3 font-mono text-sm outline-none placeholder:text-neutral-400 focus:ring-0"
        />
      </div>

      {error && (
        <p className="border-l-[3px] border-[#e53e3e] bg-[#e53e3e]/5 px-4 py-2 font-mono text-[10px] uppercase tracking-[2px] text-[#e53e3e]">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-black px-6 py-3 font-mono text-[10px] uppercase tracking-[2px] text-white transition-colors hover:bg-neutral-800 disabled:opacity-50"
      >
        {loading ? '...' : t('loginButton')}
      </button>
    </form>
  )
}
