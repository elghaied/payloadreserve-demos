'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { updateProfile, changePassword } from '@/app/(frontend)/[locale]/(customer)/account/actions'

interface ProfileFormProps {
  locale: string
}

export function ProfileForm({ locale }: ProfileFormProps) {
  const t = useTranslations('profile')
  const tAccount = useTranslations('account')

  // Profile state
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Password state
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [passwordSaved, setPasswordSaved] = useState(false)
  const [passwordError, setPasswordError] = useState<string | null>(null)

  // Loading state
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/customer-session', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setFirstName(data.user.firstName || '')
          setLastName(data.user.lastName || '')
          setEmail(data.user.email || '')
          setPhone(data.user.phone || '')
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    setError(null)
    const result = await updateProfile({ firstName, lastName, email, phone })
    if (result.success) {
      setSaved(true)
    } else {
      setError(t('updateError'))
    }
    setSaving(false)
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordSaved(false)
    setPasswordError(null)

    if (newPassword !== confirmPassword) {
      setPasswordError(t('passwordMismatch'))
      return
    }

    setPasswordSaving(true)
    const result = await changePassword({
      currentPassword,
      newPassword,
    })
    if (result.success) {
      setPasswordSaved(true)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } else {
      setPasswordError(t('passwordError'))
    }
    setPasswordSaving(false)
  }

  if (loading) {
    return (
      <div>
        <p className="text-center font-mono text-[10px] uppercase tracking-[2px] text-neutral-400">
          {t('title')}...
        </p>
      </div>
    )
  }

  return (
    <div>
      {/* Profile heading */}
      <h1 className="mb-1 text-2xl font-black uppercase tracking-[-0.5px]">
        {t('title')}
      </h1>
      <div className="mb-6 h-[3px] w-12 bg-black" />

      {/* Profile form */}
      <form onSubmit={handleProfileSubmit} className="max-w-md space-y-5">
        {saved && (
          <p className="border-l-[3px] border-[#22c55e] bg-[#22c55e]/5 px-4 py-2 font-mono text-[10px] uppercase tracking-[2px] text-[#22c55e]">
            {t('updateSuccess')}
          </p>
        )}
        {error && (
          <p className="border-l-[3px] border-[#e53e3e] bg-[#e53e3e]/5 px-4 py-2 font-mono text-[10px] uppercase tracking-[2px] text-[#e53e3e]">
            {error}
          </p>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="profile-firstName"
              className="mb-2 block font-mono text-[10px] uppercase tracking-[2px]"
            >
              {tAccount('firstName')}
            </label>
            <input
              id="profile-firstName"
              type="text"
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value)
                setSaved(false)
              }}
              className="w-full border-[3px] border-black bg-white px-4 py-3 font-mono text-sm outline-none placeholder:text-neutral-400 focus:ring-0"
            />
          </div>
          <div>
            <label
              htmlFor="profile-lastName"
              className="mb-2 block font-mono text-[10px] uppercase tracking-[2px]"
            >
              {tAccount('lastName')}
            </label>
            <input
              id="profile-lastName"
              type="text"
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value)
                setSaved(false)
              }}
              className="w-full border-[3px] border-black bg-white px-4 py-3 font-mono text-sm outline-none placeholder:text-neutral-400 focus:ring-0"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="profile-email"
            className="mb-2 block font-mono text-[10px] uppercase tracking-[2px]"
          >
            {tAccount('email')}
          </label>
          <input
            id="profile-email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setSaved(false)
            }}
            className="w-full border-[3px] border-black bg-white px-4 py-3 font-mono text-sm outline-none placeholder:text-neutral-400 focus:ring-0"
          />
        </div>

        <div>
          <label
            htmlFor="profile-phone"
            className="mb-2 block font-mono text-[10px] uppercase tracking-[2px]"
          >
            {tAccount('phone')}
          </label>
          <input
            id="profile-phone"
            type="tel"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value)
              setSaved(false)
            }}
            className="w-full border-[3px] border-black bg-white px-4 py-3 font-mono text-sm outline-none placeholder:text-neutral-400 focus:ring-0"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-black px-6 py-3 font-mono text-[10px] uppercase tracking-[2px] text-white transition-colors hover:bg-neutral-800 disabled:opacity-50"
        >
          {saving ? '...' : t('save')}
        </button>
      </form>

      {/* Password change section */}
      <div className="mt-10 max-w-md border-t-[3px] border-black pt-8">
        <h2 className="mb-1 text-xl font-black uppercase tracking-[-0.5px]">
          {t('changePassword')}
        </h2>
        <div className="mb-6 h-[2px] w-8 bg-black" />

        <form onSubmit={handlePasswordSubmit} className="space-y-5">
          {passwordSaved && (
            <p className="border-l-[3px] border-[#22c55e] bg-[#22c55e]/5 px-4 py-2 font-mono text-[10px] uppercase tracking-[2px] text-[#22c55e]">
              {t('passwordSuccess')}
            </p>
          )}
          {passwordError && (
            <p className="border-l-[3px] border-[#e53e3e] bg-[#e53e3e]/5 px-4 py-2 font-mono text-[10px] uppercase tracking-[2px] text-[#e53e3e]">
              {passwordError}
            </p>
          )}

          <div>
            <label
              htmlFor="profile-currentPassword"
              className="mb-2 block font-mono text-[10px] uppercase tracking-[2px]"
            >
              {t('currentPassword')}
            </label>
            <input
              id="profile-currentPassword"
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full border-[3px] border-black bg-white px-4 py-3 font-mono text-sm outline-none placeholder:text-neutral-400 focus:ring-0"
            />
          </div>

          <div>
            <label
              htmlFor="profile-newPassword"
              className="mb-2 block font-mono text-[10px] uppercase tracking-[2px]"
            >
              {t('newPassword')}
            </label>
            <input
              id="profile-newPassword"
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border-[3px] border-black bg-white px-4 py-3 font-mono text-sm outline-none placeholder:text-neutral-400 focus:ring-0"
            />
          </div>

          <div>
            <label
              htmlFor="profile-confirmPassword"
              className="mb-2 block font-mono text-[10px] uppercase tracking-[2px]"
            >
              {t('confirmPassword')}
            </label>
            <input
              id="profile-confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border-[3px] border-black bg-white px-4 py-3 font-mono text-sm outline-none placeholder:text-neutral-400 focus:ring-0"
            />
          </div>

          <button
            type="submit"
            disabled={passwordSaving}
            className="bg-black px-6 py-3 font-mono text-[10px] uppercase tracking-[2px] text-white transition-colors hover:bg-neutral-800 disabled:opacity-50"
          >
            {passwordSaving ? '...' : t('updatePassword')}
          </button>
        </form>
      </div>
    </div>
  )
}
