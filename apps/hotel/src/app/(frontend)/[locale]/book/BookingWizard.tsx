'use client'

import { useTranslations } from 'next-intl'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Image from 'next/image'

import { Container } from '@/components/Container'
import {
  getAvailableRooms,
  createReservation,
} from './actions'
import { TestCardBanner } from './TestCardBanner'

type AvailableRoom = {
  roomTypeId: string
  roomId: string
  name: string
  description: string | null | undefined
  price: number
  imageUrl: string | null
  available: boolean
}

export function BookingWizard() {
  const t = useTranslations('booking')
  const tCommon = useTranslations('common')
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const locale = params.locale as string

  const [step, setStep] = useState(0)
  const [availableRooms, setAvailableRooms] = useState<AvailableRoom[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [checkInDate, setCheckInDate] = useState('')
  const [checkOutDate, setCheckOutDate] = useState('')
  const [guestCount, setGuestCount] = useState(2)
  const [selectedRoom, setSelectedRoom] = useState<AvailableRoom | null>(null)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [notes, setNotes] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const dayAfter = new Date()
    dayAfter.setDate(dayAfter.getDate() + 2)
    setCheckInDate(tomorrow.toISOString().split('T')[0])
    setCheckOutDate(dayAfter.toISOString().split('T')[0])
  }, [])

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

  useEffect(() => {
    const preselectedRoom = searchParams.get('room')
    if (preselectedRoom && checkInDate && checkOutDate) {
      handleSearchAvailability(preselectedRoom)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, checkInDate, checkOutDate])

  const handleSearchAvailability = async (preselectedRoomTypeId?: string) => {
    if (!checkInDate || !checkOutDate) return
    setLoading(true)
    setError('')
    try {
      const rooms = await getAvailableRooms(checkInDate, checkOutDate, locale)
      setAvailableRooms(rooms)

      if (preselectedRoomTypeId) {
        const room = rooms.find((r) => r.roomTypeId === preselectedRoomTypeId && r.available)
        if (room) {
          setSelectedRoom(room)
          setStep(2)
          setLoading(false)
          return
        }
      }

      setStep(1)
    } catch {
      setError(tCommon('error'))
    }
    setLoading(false)
  }

  const nights = checkInDate && checkOutDate
    ? Math.ceil((new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / (1000 * 60 * 60 * 24))
    : 0

  const totalPrice = selectedRoom ? selectedRoom.price * nights : 0

  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split('T')[0]

  const minCheckout = checkInDate
    ? (() => {
        const d = new Date(checkInDate)
        d.setDate(d.getDate() + 1)
        return d.toISOString().split('T')[0]
      })()
    : minDate

  const handleSubmit = async () => {
    if (!selectedRoom) return
    setLoading(true)
    setError('')
    try {
      const result = await createReservation({
        roomTypeId: selectedRoom.roomTypeId,
        roomId: selectedRoom.roomId,
        checkInDate,
        checkOutDate,
        guestCount,
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

  const stepLabels = [
    t('stepDates'),
    t('stepRoom'),
    t('stepDetails'),
    t('stepPayment'),
  ]

  return (
    <Container className="max-w-3xl py-16 lg:py-24">
      <h1 className="font-heading text-3xl lg:text-4xl font-semibold text-center mb-3 tracking-tight">
        {t('title')}
      </h1>
      <div className="w-12 h-px bg-primary mx-auto mb-12" />

      {/* Step indicator — copper dots connected by lines */}
      <div className="flex items-center justify-center mb-14 px-4">
        {stepLabels.map((label, i) => (
          <div key={i} className="flex items-center">
            <div className="flex flex-col items-center gap-2">
              <div
                className={`relative w-9 h-9 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-500 ${
                  i < step
                    ? 'bg-primary/20 text-primary border border-primary/40'
                    : i === step
                      ? 'bg-primary text-background border border-primary copper-glow-sm'
                      : 'bg-surface text-muted border border-border'
                }`}
              >
                {i < step ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              <span className={`text-[11px] tracking-wide uppercase hidden sm:block transition-colors duration-300 ${
                i <= step ? 'text-foreground' : 'text-muted-light'
              }`}>
                {label}
              </span>
            </div>
            {i < stepLabels.length - 1 && (
              <div className={`w-10 sm:w-16 h-px mx-2 sm:mx-3 mb-5 sm:mb-6 transition-colors duration-500 ${
                i < step ? 'bg-primary/40' : 'bg-border'
              }`} />
            )}
          </div>
        ))}
      </div>

      {error && (
        <div className="glass border-error/30 text-error text-sm p-4 mb-8 text-center">
          {error}
        </div>
      )}

      {/* Step 1: Select Dates */}
      {step === 0 && (
        <div className="glass p-6 sm:p-10">
          <h2 className="font-heading text-xl font-semibold mb-8">{t('selectDates')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
            <div>
              <label className="block text-xs uppercase tracking-wider text-muted mb-2">{t('checkIn')}</label>
              <input
                type="date"
                value={checkInDate}
                min={minDate}
                onChange={(e) => {
                  setCheckInDate(e.target.value)
                  if (e.target.value >= checkOutDate) {
                    const d = new Date(e.target.value)
                    d.setDate(d.getDate() + 1)
                    setCheckOutDate(d.toISOString().split('T')[0])
                  }
                }}
                className="w-full border border-border bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary focus:shadow-[0_0_12px_rgba(196,125,90,0.15)] transition-all duration-300"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-muted mb-2">{t('checkOut')}</label>
              <input
                type="date"
                value={checkOutDate}
                min={minCheckout}
                onChange={(e) => setCheckOutDate(e.target.value)}
                className="w-full border border-border bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary focus:shadow-[0_0_12px_rgba(196,125,90,0.15)] transition-all duration-300"
              />
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-xs uppercase tracking-wider text-muted mb-2">{t('numberOfGuests')}</label>
            <select
              value={guestCount}
              onChange={(e) => setGuestCount(Number(e.target.value))}
              className="w-full sm:w-auto border border-border bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary focus:shadow-[0_0_12px_rgba(196,125,90,0.15)] transition-all duration-300"
            >
              {[1, 2, 3, 4].map((n) => (
                <option key={n} value={n}>
                  {n} {tCommon('guests')}
                </option>
              ))}
            </select>
          </div>
          {nights > 0 && (
            <p className="text-sm text-muted mb-8">
              {nights} {tCommon('nights')}
            </p>
          )}
          <button
            onClick={() => handleSearchAvailability()}
            disabled={loading || !checkInDate || !checkOutDate || nights < 1}
            className="bg-primary text-background px-8 py-3.5 text-sm tracking-widest uppercase hover:bg-primary-dark transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed copper-glow-sm"
          >
            {loading ? tCommon('loading') : t('selectRoom')}
          </button>
        </div>
      )}

      {/* Step 2: Select Room */}
      {step === 1 && (
        <div>
          <div className="text-center mb-8">
            <h2 className="font-heading text-xl font-semibold mb-2">{t('selectRoom')}</h2>
            <p className="text-sm text-muted">
              {checkInDate} — {checkOutDate} · {nights} {tCommon('nights')}
            </p>
          </div>

          {availableRooms.filter((r) => r.available).length === 0 ? (
            <div className="glass p-8 text-center">
              <p className="text-muted">{t('noAvailability')}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {availableRooms.map((room) => (
                <button
                  key={room.roomTypeId}
                  onClick={() => {
                    if (room.available) {
                      setSelectedRoom(room)
                      setStep(2)
                    }
                  }}
                  disabled={!room.available}
                  className={`room-card w-full text-left border transition-all duration-500 flex gap-0 sm:gap-0 items-stretch overflow-hidden group ${
                    !room.available
                      ? 'border-border opacity-40 cursor-not-allowed'
                      : 'border-border hover:border-primary/50 hover:copper-glow-sm cursor-pointer'
                  }`}
                >
                  {room.imageUrl && (
                    <div className="relative w-28 sm:w-40 flex-shrink-0 overflow-hidden">
                      <Image
                        src={room.imageUrl}
                        alt={room.name}
                        fill
                        className="object-cover room-image"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-surface/30" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0 p-4 sm:p-6 bg-surface/50">
                    <h3 className="font-heading text-lg font-semibold mb-1">{room.name}</h3>
                    <p className="text-sm text-muted mb-3 line-clamp-1">{room.description}</p>
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="text-primary font-semibold text-lg">
                        €{room.price}<span className="text-xs text-muted font-normal">{tCommon('perNight')}</span>
                      </span>
                      <span className="text-sm text-muted">
                        {t('totalStay')}: <strong className="text-foreground">€{room.price * nights}</strong>
                      </span>
                    </div>
                    {!room.available && (
                      <span className="text-xs text-error mt-2 inline-block">{t('noAvailability')}</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          <button
            onClick={() => setStep(0)}
            className="mt-8 text-sm text-muted hover:text-primary transition-colors duration-300 flex items-center gap-1.5"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            {tCommon('back')}
          </button>
        </div>
      )}

      {/* Step 3: Guest Details */}
      {step === 2 && (
        <div>
          <div className="glass p-6 sm:p-10">
            <h2 className="font-heading text-xl font-semibold mb-8">{t('yourDetails')}</h2>
            <div className="space-y-5 max-w-md">
              <div>
                <label className="block text-xs uppercase tracking-wider text-muted mb-2">{t('firstName')}</label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full border border-border bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary focus:shadow-[0_0_12px_rgba(196,125,90,0.15)] transition-all duration-300"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-muted mb-2">{t('lastName')}</label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full border border-border bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary focus:shadow-[0_0_12px_rgba(196,125,90,0.15)] transition-all duration-300"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-muted mb-2">{t('email')}</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-border bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary focus:shadow-[0_0_12px_rgba(196,125,90,0.15)] transition-all duration-300"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-muted mb-2">{t('phone')}</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border border-border bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary focus:shadow-[0_0_12px_rgba(196,125,90,0.15)] transition-all duration-300"
                />
              </div>
              {!isLoggedIn && (
                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted mb-2">{t('password')}</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-border bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary focus:shadow-[0_0_12px_rgba(196,125,90,0.15)] transition-all duration-300"
                  />
                  <p className="text-xs text-muted-light mt-2">{t('passwordHint')}</p>
                </div>
              )}
              <div>
                <label className="block text-xs uppercase tracking-wider text-muted mb-2">{t('notes')}</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full border border-border bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary focus:shadow-[0_0_12px_rgba(196,125,90,0.15)] transition-all duration-300 resize-none"
                  placeholder={locale === 'fr' ? 'Arrivée tardive, lit supplémentaire...' : 'Late arrival, extra bed...'}
                />
              </div>
            </div>
          </div>

          {/* Summary */}
          {selectedRoom && (
            <div className="mt-8 glass-strong p-6">
              <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-primary mb-4">
                {locale === 'fr' ? 'Résumé' : 'Summary'}
              </h3>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">{t('stepRoom')}</span>
                  <span className="font-medium">{selectedRoom.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">{t('checkIn')}</span>
                  <span>{checkInDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">{t('checkOut')}</span>
                  <span>{checkOutDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">{t('numberOfGuests')}</span>
                  <span>{guestCount}</span>
                </div>
                <div className="hr-copper my-3" />
                <div className="flex justify-between items-center">
                  <span className="font-medium">
                    {t('totalStay')} ({nights} {tCommon('nights')})
                  </span>
                  <span className="font-semibold text-lg text-gradient-copper">€{totalPrice}</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-6 mt-8">
            <button
              onClick={() => setStep(1)}
              className="text-sm text-muted hover:text-primary transition-colors duration-300 flex items-center gap-1.5"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              {tCommon('back')}
            </button>
            <button
              onClick={() => {
                if (!firstName || !email) return
                if (!isLoggedIn && !password) return
                setStep(3)
              }}
              disabled={!firstName || !email || (!isLoggedIn && !password)}
              className="bg-primary text-background px-8 py-3.5 text-sm tracking-widest uppercase hover:bg-primary-dark transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed copper-glow-sm"
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

          {selectedRoom && (
            <div className="glass-strong max-w-sm mx-auto p-8 mb-10">
              <h3 className="font-heading text-xl font-semibold mb-3">{selectedRoom.name}</h3>
              <p className="text-muted text-sm mb-1">
                {checkInDate} — {checkOutDate}
              </p>
              <p className="text-muted text-sm mb-6">
                {nights} {tCommon('nights')} · {guestCount} {tCommon('guests')}
              </p>
              <div className="hr-copper mb-6" />
              <p className="text-3xl font-semibold text-gradient-copper">€{totalPrice}</p>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="cta-shimmer bg-primary text-background px-10 py-4 text-sm tracking-[0.2em] uppercase hover:bg-primary-dark transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed copper-glow"
          >
            {loading ? tCommon('loading') : t('proceedToPayment')}
          </button>

          <div className="mt-6">
            <button
              onClick={() => setStep(2)}
              className="text-sm text-muted hover:text-primary transition-colors duration-300 flex items-center gap-1.5 mx-auto"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              {tCommon('back')}
            </button>
          </div>
        </div>
      )}
    </Container>
  )
}
