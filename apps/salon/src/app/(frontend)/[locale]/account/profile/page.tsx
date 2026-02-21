'use client'

import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import { updateProfile } from '../actions'

export default function ProfilePage() {
  const t = useTranslations('profile')
  const tBooking = useTranslations('booking')
  const params = useParams()
  const locale = params.locale as string

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/customers/me', { credentials: 'include' })
      .then((r) => r.json())
      .then((data) => {
        if (data.user) {
          setFirstName(data.user.firstName || '')
          setLastName(data.user.lastName || '')
          setEmail(data.user.email || '')
          setPhone(data.user.phone || '')
        }
      })
      .catch(() => {})
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    try {
      await updateProfile({ firstName, lastName, email, phone })
      setSaved(true)
    } catch {
      // ignore
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-md">
      <h1 className="font-heading text-2xl font-semibold mb-6">{t('title')}</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {saved && (
          <div className="bg-success/10 text-success text-sm p-3">{t('updateSuccess')}</div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1.5">{tBooking('firstName')}</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full border border-border px-4 py-3 text-sm bg-surface focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">{tBooking('lastName')}</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full border border-border px-4 py-3 text-sm bg-surface focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">{tBooking('email')}</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-border px-4 py-3 text-sm bg-surface focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">{tBooking('phone')}</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border border-border px-4 py-3 text-sm bg-surface focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-primary text-white px-6 py-3 text-sm tracking-wide hover:bg-primary-dark transition-colors disabled:opacity-50"
        >
          {saving ? '...' : (locale === 'fr' ? 'Enregistrer' : 'Save')}
        </button>
      </form>
    </div>
  )
}
