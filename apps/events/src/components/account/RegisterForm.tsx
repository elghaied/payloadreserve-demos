'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

interface RegisterFormProps {
  onRegister: (data: {
    email: string
    password: string
    firstName: string
    lastName: string
    phone: string
  }) => Promise<void>
  error: string | null
  loading: boolean
}

export function RegisterForm({ onRegister, error, loading }: RegisterFormProps) {
  const t = useTranslations('account')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await onRegister({ email, password, firstName, lastName, phone })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="register-firstName"
            className="mb-2 block font-mono text-[10px] uppercase tracking-[2px]"
          >
            {t('firstName')}
          </label>
          <input
            id="register-firstName"
            type="text"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full border-[3px] border-black bg-white px-4 py-3 font-mono text-sm outline-none placeholder:text-neutral-400 focus:ring-0"
          />
        </div>
        <div>
          <label
            htmlFor="register-lastName"
            className="mb-2 block font-mono text-[10px] uppercase tracking-[2px]"
          >
            {t('lastName')}
          </label>
          <input
            id="register-lastName"
            type="text"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full border-[3px] border-black bg-white px-4 py-3 font-mono text-sm outline-none placeholder:text-neutral-400 focus:ring-0"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="register-email"
          className="mb-2 block font-mono text-[10px] uppercase tracking-[2px]"
        >
          {t('email')}
        </label>
        <input
          id="register-email"
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
          htmlFor="register-phone"
          className="mb-2 block font-mono text-[10px] uppercase tracking-[2px]"
        >
          {t('phone')}
        </label>
        <input
          id="register-phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border-[3px] border-black bg-white px-4 py-3 font-mono text-sm outline-none placeholder:text-neutral-400 focus:ring-0"
          placeholder="+33 1 23 45 67 89"
        />
      </div>

      <div>
        <label
          htmlFor="register-password"
          className="mb-2 block font-mono text-[10px] uppercase tracking-[2px]"
        >
          {t('password')}
        </label>
        <input
          id="register-password"
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
        {loading ? '...' : t('registerButton')}
      </button>
    </form>
  )
}
