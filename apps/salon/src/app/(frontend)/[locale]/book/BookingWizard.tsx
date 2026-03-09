'use client'

import { useTranslations } from 'next-intl'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import Image from 'next/image'

import { Container } from '@/components/Container'
import {
  getServices,
  getSpecialists,
  getAvailableSlots,
  createReservation,
} from './actions'
import { TestCardBanner } from './TestCardBanner'

type Service = { id: string; name: string; description?: string | null; duration: number; price: number }
type Specialist = { id: string; name: string; description?: string | null; image?: { url?: string | null } | string | null }

const _steps = ['service', 'specialist', 'dateTime', 'details', 'payment'] as const

export function BookingWizard() {
  const t = useTranslations('booking')
  const tCommon = useTranslations('common')
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const locale = params.locale as string

  const [step, setStep] = useState(0)
  const [services, setServices] = useState<Service[]>([])
  const [specialists, setSpecialists] = useState<Specialist[]>([])
  const [slots, setSlots] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Selections
  const [selectedService, setSelectedService] = useState<string>('')
  const [selectedSpecialist, setSelectedSpecialist] = useState<string>('')
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [notes, setNotes] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Load services on mount
  useEffect(() => {
    getServices(locale).then((s) => {
      setServices(s as unknown as Service[])
      const preselected = searchParams.get('service')
      if (preselected) {
        setSelectedService(preselected)
        setStep(1)
      }
    })
  }, [locale, searchParams])

  // Load specialists when service selected
  useEffect(() => {
    if (selectedService) {
      getSpecialists(locale, selectedService).then((s) =>
        setSpecialists(s as unknown as Specialist[]),
      )
    }
  }, [selectedService, locale])

  // Load slots when specialist and date selected
  useEffect(() => {
    if (selectedSpecialist && selectedDate) {
      setSlots([])
      setSelectedTime('')
      getAvailableSlots(selectedService, selectedSpecialist, selectedDate).then(setSlots)
    }
  }, [selectedService, selectedSpecialist, selectedDate])

  // Check if user is logged in
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

  const selectedServiceData = services.find((s) => s.id === selectedService)

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    try {
      const result = await createReservation({
        serviceId: selectedService,
        resourceId: selectedSpecialist,
        date: selectedDate,
        time: selectedTime,
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
    t('stepService'),
    t('stepSpecialist'),
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
                i <= step ? 'bg-primary text-white' : 'bg-border text-muted'
              }`}
            >
              {i + 1}
            </div>
            <span className={`text-xs hidden sm:inline ${i <= step ? 'text-foreground' : 'text-muted'}`}>
              {label}
            </span>
            {i < stepLabels.length - 1 && <div className="w-6 h-px bg-border" />}
          </div>
        ))}
      </div>

      {error && (
        <div className="bg-error/10 text-error text-sm p-3 mb-6 text-center">{error}</div>
      )}

      {/* Step 1: Select Service */}
      {step === 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-6">{t('selectService')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((service) => (
              <button
                key={service.id}
                onClick={() => {
                  setSelectedService(service.id)
                  setStep(1)
                }}
                className={`text-left border p-6 transition-all hover:shadow-md ${
                  selectedService === service.id ? 'border-primary' : 'border-border'
                }`}
              >
                <h3 className="font-heading text-lg font-semibold mb-1">{service.name}</h3>
                <p className="text-sm text-muted mb-3 line-clamp-2">{service.description}</p>
                <div className="flex justify-between text-sm">
                  <span className="text-muted">{service.duration} {tCommon('minutes')}</span>
                  <span className="text-primary font-semibold">${service.price}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Select Specialist */}
      {step === 1 && (
        <div>
          <h2 className="text-lg font-semibold mb-6">{t('selectSpecialist')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {specialists.map((specialist) => (
              <button
                key={specialist.id}
                onClick={() => {
                  setSelectedSpecialist(specialist.id)
                  setStep(2)
                }}
                className={`text-center border p-6 transition-all hover:shadow-md ${
                  selectedSpecialist === specialist.id ? 'border-primary' : 'border-border'
                }`}
              >
                <div className="w-16 h-16 rounded-full bg-border/50 mx-auto mb-3 flex items-center justify-center overflow-hidden">
                  {specialist.image && typeof specialist.image === 'object' && specialist.image.url ? (
                    <Image src={specialist.image.url} alt={specialist.name} width={64} height={64} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xl text-muted">{specialist.name.charAt(0)}</span>
                  )}
                </div>
                <h3 className="font-semibold">{specialist.name}</h3>
                <p className="text-xs text-muted mt-1">{specialist.description}</p>
              </button>
            ))}
          </div>
          <button
            onClick={() => setStep(0)}
            className="mt-6 text-sm text-muted hover:text-foreground"
          >
            &larr; {tCommon('back')}
          </button>
        </div>
      )}

      {/* Step 3: Date & Time */}
      {step === 2 && (
        <div>
          <h2 className="text-lg font-semibold mb-6">{t('selectDate')}</h2>
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
                      ? 'border-primary bg-primary text-white'
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

          {selectedDate && (
            <>
              <h2 className="text-lg font-semibold mb-4">{t('selectTime')}</h2>
              {slots.length === 0 ? (
                <p className="text-muted text-sm">{t('noSlots')}</p>
              ) : (
                <div className="max-h-[320px] overflow-y-auto">
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
                    {slots.map((time) => (
                      <button
                        key={time}
                        onClick={() => {
                          setSelectedTime(time)
                          setStep(3)
                        }}
                        className={`py-3 text-sm border transition-all ${
                          selectedTime === time
                            ? 'border-primary bg-primary text-white'
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
            onClick={() => setStep(1)}
            className="mt-6 text-sm text-muted hover:text-foreground"
          >
            &larr; {tCommon('back')}
          </button>
        </div>
      )}

      {/* Step 4: Details */}
      {step === 3 && (
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
                rows={3}
                className="w-full border border-border px-4 py-3 text-sm bg-surface focus:outline-none focus:border-primary transition-colors resize-none"
              />
            </div>
          </div>

          {/* Summary */}
          {selectedServiceData && (
            <div className="mt-8 p-6 border border-border bg-background">
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-3">
                {locale === 'fr' ? 'Résumé' : 'Summary'}
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">{t('stepService')}</span>
                  <span>{selectedServiceData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">{t('stepDateTime')}</span>
                  <span>{selectedDate} {selectedTime}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-2 mt-2">
                  <span className="font-medium">{locale === 'fr' ? 'Total' : 'Total'}</span>
                  <span className="font-semibold text-primary">${selectedServiceData.price}</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-4 mt-8">
            <button
              onClick={() => setStep(2)}
              className="text-sm text-muted hover:text-foreground"
            >
              &larr; {tCommon('back')}
            </button>
            <button
              onClick={() => {
                if (!firstName || !email) return
                if (!isLoggedIn && !password) return
                setStep(4)
              }}
              disabled={!firstName || !email || (!isLoggedIn && !password)}
              className="bg-primary text-white px-6 py-3 text-sm tracking-wide hover:bg-primary-dark transition-colors disabled:opacity-50"
            >
              {tCommon('next')}
            </button>
          </div>
        </div>
      )}

      {/* Step 5: Payment */}
      {step === 4 && (
        <div className="text-center">
          <TestCardBanner />

          {selectedServiceData && (
            <div className="max-w-sm mx-auto p-6 border border-border mb-8">
              <h3 className="font-heading text-xl font-semibold mb-2">{selectedServiceData.name}</h3>
              <p className="text-muted text-sm mb-1">{selectedDate} {locale === 'fr' ? 'à' : 'at'} {selectedTime}</p>
              <p className="text-2xl font-semibold text-primary mt-4">${selectedServiceData.price}</p>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-primary text-white px-8 py-4 text-sm tracking-widest uppercase hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {loading ? tCommon('loading') : t('proceedToPayment')}
          </button>

          <div className="mt-4">
            <button
              onClick={() => setStep(3)}
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
