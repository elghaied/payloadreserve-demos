'use client'

import { useTranslations } from 'next-intl'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import { Container } from '@/components/Container'
import {
  getDiningExperiences,
  getAvailableSlots,
  createReservation,
} from './actions'
import { TestCardBanner } from './TestCardBanner'

type Experience = {
  id: string
  name: string
  description?: string | null
  duration: number
  price: number
}

type Slot = { time: string; tableIds: string[] }

const PARTY_SIZE_OPTIONS = Array.from({ length: 20 }, (_, i) => i + 1)

export function BookingWizard() {
  const t = useTranslations('booking')
  const tCommon = useTranslations('common')
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const locale = params.locale as string

  const [step, setStep] = useState(0)
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [slots, setSlots] = useState<Slot[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Selections
  const [selectedExperience, setSelectedExperience] = useState<string>('')
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [selectedTableId, setSelectedTableId] = useState<string>('')
  const [partySize, setPartySize] = useState(2)

  // Guest details
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [notes, setNotes] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Load experiences on mount + check session
  useEffect(() => {
    getDiningExperiences(locale).then((docs) => {
      setExperiences(docs as unknown as Experience[])
      const preselected = searchParams.get('experience')
      if (preselected) {
        setSelectedExperience(preselected)
        setStep(1)
      }
    })
  }, [locale, searchParams])

  useEffect(() => {
    fetch('/api/customer-session', { credentials: 'include' })
      .then((r) => r.json())
      .then((data) => {
        if (data.user) {
          setFirstName(data.user.firstName || '')
          setLastName(data.user.lastName || '')
          setEmail(data.user.email || '')
          setPhone(data.user.phone || '')
          setIsLoggedIn(true)
        }
      })
      .catch(() => {})
  }, [])

  // Load slots when experience and date selected
  useEffect(() => {
    if (selectedExperience && selectedDate) {
      setSlots([])
      setSelectedTime('')
      setSelectedTableId('')
      getAvailableSlots(selectedExperience, selectedDate).then(
        (s) => setSlots(s as Slot[]),
      )
    }
  }, [selectedExperience, selectedDate])

  const selectedExperienceData = experiences.find((e) => e.id === selectedExperience)

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    try {
      const result = await createReservation({
        serviceId: selectedExperience,
        tableId: selectedTableId,
        date: selectedDate,
        time: selectedTime,
        partySize,
        firstName,
        lastName,
        email,
        phone,
        password: isLoggedIn ? undefined : password,
        notes,
        locale,
      })
      if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl
      } else {
        router.push(`/${locale}/book/success?reservation=${result.reservationId}`)
      }
    } catch {
      setError(tCommon('error'))
      setLoading(false)
    }
  }

  // Generate next 30 days for date picker
  const dates: string[] = []
  const today = new Date()
  for (let i = 1; i <= 30; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() + i)
    dates.push(d.toISOString().split('T')[0])
  }

  const stepLabels = [
    t('stepExperience'),
    t('stepDateTime'),
    t('stepDetails'),
    t('stepPayment'),
  ]

  return (
    <Container className="max-w-3xl py-16 lg:py-24">
      <h1 className="font-heading text-3xl lg:text-4xl font-semibold text-center mb-4">
        {t('title')}
      </h1>

      {/* Step indicator */}
      <div className="flex items-center justify-center gap-2 mb-12">
        {stepLabels.map((label, i) => (
          <div key={i} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                i <= step ? 'bg-primary text-background' : 'bg-border text-muted'
              }`}
            >
              {i + 1}
            </div>
            <span
              className={`text-xs hidden sm:inline ${
                i <= step ? 'text-foreground' : 'text-muted'
              }`}
            >
              {label}
            </span>
            {i < stepLabels.length - 1 && <div className="w-6 h-px bg-border" />}
          </div>
        ))}
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive text-sm p-3 mb-6 text-center">
          {error}
        </div>
      )}

      {/* Step 1: Select Experience */}
      {step === 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-6">{t('selectExperience')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {experiences.map((experience) => (
              <button
                key={experience.id}
                onClick={() => {
                  setSelectedExperience(experience.id)
                  setStep(1)
                }}
                className={`text-left glass border p-6 transition-all hover:shadow-md ${
                  selectedExperience === experience.id
                    ? 'border-primary'
                    : 'border-border'
                }`}
              >
                <h3 className="font-heading text-lg font-semibold mb-1">
                  {experience.name}
                </h3>
                <p className="text-sm text-muted mb-3 line-clamp-2">
                  {experience.description}
                </p>
                <div className="flex justify-between text-sm">
                  <span className="text-muted">
                    {experience.duration} {tCommon('minutes')}
                  </span>
                  <span className="text-primary font-semibold">
                    €{experience.price}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Date, Time & Party Size */}
      {step === 1 && (
        <div>
          <h2 className="text-lg font-semibold mb-6">{t('selectDate')}</h2>

          {/* Date picker */}
          <div className="flex gap-2 overflow-x-auto pb-4 mb-8">
            {dates.map((date) => {
              const d = new Date(date + 'T12:00:00')
              const dayName = d.toLocaleDateString(locale, { weekday: 'short' })
              const dayNum = d.getDate()
              const month = d.toLocaleDateString(locale, { month: 'short' })
              return (
                <button
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  className={`flex-shrink-0 w-16 py-3 text-center border transition-all ${
                    selectedDate === date
                      ? 'border-primary bg-primary text-background'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="text-xs uppercase">{dayName}</div>
                  <div className="text-lg font-semibold">{dayNum}</div>
                  <div className="text-xs">{month}</div>
                </button>
              )
            })}
          </div>

          {/* Party size */}
          <div className="mb-8">
            <label className="block text-sm font-medium mb-2">{t('partySize')}</label>
            <select
              value={partySize}
              onChange={(e) => setPartySize(Number(e.target.value))}
              className="border border-border px-4 py-3 text-sm bg-surface focus:outline-none focus:border-primary transition-colors"
            >
              {PARTY_SIZE_OPTIONS.map((n) => (
                <option key={n} value={n}>
                  {t('partySizeLabel', { count: n })}
                </option>
              ))}
            </select>
          </div>

          {/* Time slots */}
          {selectedDate && (
            <>
              <h2 className="text-lg font-semibold mb-4">{t('selectTime')}</h2>
              {slots.length === 0 ? (
                <p className="text-muted text-sm">{t('noSlots')}</p>
              ) : (
                <div className="max-h-[320px] overflow-y-auto">
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
                    {slots.map(({ time, tableIds }) => (
                      <button
                        key={time}
                        onClick={() => {
                          setSelectedTime(time)
                          setSelectedTableId(tableIds[0])
                          setStep(2)
                        }}
                        className={`py-3 text-sm border transition-all ${
                          selectedTime === time
                            ? 'border-primary bg-primary text-background'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          <button
            onClick={() => setStep(0)}
            className="mt-6 text-sm text-muted hover:text-foreground"
          >
            &larr; {tCommon('back')}
          </button>
        </div>
      )}

      {/* Step 3: Guest Details */}
      {step === 2 && (
        <div>
          <h2 className="text-lg font-semibold mb-6">{t('yourDetails')}</h2>
          <div className="space-y-5 max-w-md">
            <div>
              <label className="block text-sm font-medium mb-1.5">{t('firstName')}</label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full border border-border px-4 py-3 text-sm bg-surface focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">{t('lastName')}</label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full border border-border px-4 py-3 text-sm bg-surface focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">{t('email')}</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-border px-4 py-3 text-sm bg-surface focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">{t('phone')}</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-border px-4 py-3 text-sm bg-surface focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            {!isLoggedIn && (
              <div>
                <label className="block text-sm font-medium mb-1.5">{t('password')}</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-border px-4 py-3 text-sm bg-surface focus:outline-none focus:border-primary transition-colors"
                />
                <p className="text-xs text-muted mt-1.5">{t('passwordHint')}</p>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-1.5">{t('notes')}</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t('notesPlaceholder')}
                rows={3}
                className="w-full border border-border px-4 py-3 text-sm bg-surface focus:outline-none focus:border-primary transition-colors resize-none"
              />
            </div>
          </div>

          {/* Summary */}
          {selectedExperienceData && (
            <div className="mt-8 glass p-6 border border-border">
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-3">
                {locale === 'fr' ? 'Résumé' : 'Summary'}
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">{t('stepExperience')}</span>
                  <span>{selectedExperienceData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">{t('stepDateTime')}</span>
                  <span>
                    {selectedDate} {selectedTime}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">{t('partySize')}</span>
                  <span>{t('partySizeLabel', { count: partySize })}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-2 mt-2">
                  <span className="font-medium">Total</span>
                  <span className="font-semibold text-primary">
                    €{selectedExperienceData.price}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-4 mt-8">
            <button
              onClick={() => setStep(1)}
              className="text-sm text-muted hover:text-foreground"
            >
              &larr; {tCommon('back')}
            </button>
            <button
              onClick={() => {
                if (!firstName || !email) return
                if (!isLoggedIn && !password) return
                setStep(3)
              }}
              disabled={!firstName || !email || (!isLoggedIn && !password)}
              className="bg-primary text-background px-6 py-3 text-sm tracking-wide hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {tCommon('next')}
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Payment */}
      {step === 3 && (
        <div className="text-center">
          <TestCardBanner />

          {selectedExperienceData && (
            <div className="max-w-sm mx-auto glass p-6 border border-border mb-8">
              <h3 className="font-heading text-xl font-semibold mb-2">
                {selectedExperienceData.name}
              </h3>
              <p className="text-muted text-sm mb-1">
                {selectedDate} {locale === 'fr' ? 'à' : 'at'} {selectedTime}
              </p>
              <p className="text-muted text-sm">
                {t('partySizeLabel', { count: partySize })}
              </p>
              <p className="text-2xl font-semibold text-primary mt-4">
                €{selectedExperienceData.price}
              </p>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-primary text-background px-8 py-4 text-sm tracking-widest uppercase hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? tCommon('loading') : t('proceedToPayment')}
          </button>

          <div className="mt-4">
            <button
              onClick={() => setStep(2)}
              className="text-sm text-muted hover:text-foreground"
            >
              &larr; {tCommon('back')}
            </button>
          </div>
        </div>
      )}
    </Container>
  )
}
