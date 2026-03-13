'use client'

import { useState, useTransition, useCallback, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import type { EventType, Venue } from '@/payload-types'
import { StepIndicator } from './StepIndicator'
import { EventTypeStep } from './EventTypeStep'
import { VenueTimeStep } from './VenueTimeStep'
import { TicketInfoStep, type CustomerInfo } from './TicketInfoStep'
import { ReviewStep } from './ReviewStep'
import { createBooking } from '@/app/(frontend)/[locale]/book/actions'
import { EVENT_TYPE_COLOR_LIST } from '@/lib/event-colors'

const STRIPE_GRADIENT = `linear-gradient(90deg, ${EVENT_TYPE_COLOR_LIST.join(', ')})`

export function BookingWizard({
  eventTypes,
  venues,
  locale,
  preselectedEventTypeId,
  preselectedVenueId,
  cancellationPolicy,
}: {
  eventTypes: EventType[]
  venues: Venue[]
  locale: string
  preselectedEventTypeId?: string
  preselectedVenueId?: string
  cancellationPolicy: string
}) {
  const t = useTranslations('booking')
  const [isPending, startTransition] = useTransition()

  const [currentStep, setCurrentStep] = useState(1)
  const [selectedEventType, setSelectedEventType] = useState<EventType | null>(null)
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [ticketQuantity, setTicketQuantity] = useState(1)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
  })
  const [bookingResult, setBookingResult] = useState<{
    success: boolean
    bookingId?: string
    checkoutUrl?: string | null
    error?: string
  } | null>(null)

  // Check auth state and auto-populate customer info
  useEffect(() => {
    fetch('/api/customer-session', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setIsLoggedIn(true)
          setCustomerInfo({
            firstName: data.user.firstName || '',
            lastName: data.user.lastName || '',
            email: data.user.email || '',
            phone: data.user.phone || '',
            password: '',
          })
        }
      })
      .catch(() => {})
  }, [])

  // Pre-selection
  useEffect(() => {
    if (preselectedEventTypeId) {
      const found = eventTypes.find((et) => et.id === preselectedEventTypeId)
      if (found) {
        setSelectedEventType(found)
        setCurrentStep(2)
      }
    }
    if (preselectedVenueId) {
      const found = venues.find((v) => v.id === preselectedVenueId)
      if (found) setSelectedVenue(found)
    }
  }, [preselectedEventTypeId, preselectedVenueId, eventTypes, venues])

  const handleSelectEventType = useCallback((et: EventType) => {
    setSelectedEventType(et)
    // Reset downstream selections
    setSelectedVenue(null)
    setSelectedDate(null)
    setSelectedTime(null)
  }, [])

  const handleSelectVenue = useCallback((venue: Venue) => {
    setSelectedVenue(venue)
    setSelectedDate(null)
    setSelectedTime(null)
  }, [])

  const handleSelectDate = useCallback((date: Date) => {
    setSelectedDate(date)
    setSelectedTime(null)
  }, [])

  const handleSelectTime = useCallback((time: string) => {
    setSelectedTime(time)
  }, [])

  const canProceedFromStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return selectedEventType !== null
      case 2:
        return selectedVenue !== null && selectedDate !== null && selectedTime !== null
      case 3:
        return (
          ticketQuantity >= 1 &&
          customerInfo.firstName.trim() !== '' &&
          customerInfo.lastName.trim() !== '' &&
          customerInfo.email.trim() !== '' &&
          customerInfo.phone.trim() !== '' &&
          (isLoggedIn || customerInfo.password.length >= 6)
        )
      default:
        return true
    }
  }

  const goNext = () => {
    if (canProceedFromStep(currentStep) && currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const goPrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleConfirm = () => {
    if (!selectedEventType || !selectedVenue || !selectedDate || !selectedTime) return

    const dateStr = selectedDate.toISOString().split('T')[0]
    const startTime = `${dateStr}T${selectedTime}:00.000Z`

    startTransition(async () => {
      const result = await createBooking({
        serviceId: selectedEventType.id,
        resourceId: selectedVenue.id,
        startTime,
        ticketQuantity,
        customer: customerInfo,
        locale,
      })

      if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl
        return
      }

      setBookingResult(result)
    })
  }

  // Success state
  if (bookingResult?.success) {
    return (
      <section className="px-6 py-16 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-6 h-[4px] w-full" style={{ background: STRIPE_GRADIENT }} />
          <h1 className="mb-4 text-4xl font-black uppercase tracking-[-1px]">
            {t('success')}
          </h1>
          <p className="mb-8 text-lg text-neutral-600">{t('successMessage')}</p>
          <div className="inline-block border-[3px] border-black px-6 py-3 font-mono text-[10px] uppercase tracking-[2px]">
            ID: {bookingResult.bookingId}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="px-6 py-16 lg:px-12 lg:py-24">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-2 text-4xl font-black uppercase tracking-[-1px] md:text-5xl">
          {t('title')}
        </h1>
        <div className="mb-10 h-[3px] w-16 bg-black" />

        <StepIndicator currentStep={currentStep} />

        {bookingResult && !bookingResult.success && (
          <div className="mb-6 border-[3px] border-red-500 bg-red-50 p-4 font-mono text-sm text-red-700">
            {bookingResult.error}
          </div>
        )}

        {currentStep === 1 && (
          <EventTypeStep
            eventTypes={eventTypes}
            selectedId={selectedEventType?.id ?? null}
            onSelect={handleSelectEventType}
          />
        )}

        {currentStep === 2 && selectedEventType && (
          <VenueTimeStep
            venues={venues}
            selectedEventType={selectedEventType}
            selectedVenueId={selectedVenue?.id ?? null}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            locale={locale}
            onSelectVenue={handleSelectVenue}
            onSelectDate={handleSelectDate}
            onSelectTime={handleSelectTime}
          />
        )}

        {currentStep === 3 && selectedEventType && (
          <TicketInfoStep
            eventType={selectedEventType}
            ticketQuantity={ticketQuantity}
            customerInfo={customerInfo}
            isLoggedIn={isLoggedIn}
            onChangeQuantity={setTicketQuantity}
            onChangeCustomerInfo={setCustomerInfo}
          />
        )}

        {currentStep === 4 &&
          selectedEventType &&
          selectedVenue &&
          selectedDate &&
          selectedTime && (
            <ReviewStep
              eventType={selectedEventType}
              venue={selectedVenue}
              date={selectedDate}
              time={selectedTime}
              ticketQuantity={ticketQuantity}
              customerInfo={customerInfo}
              cancellationPolicy={cancellationPolicy}
              locale={locale}
              isSubmitting={isPending}
              onConfirm={handleConfirm}
            />
          )}

        {/* Navigation */}
        {currentStep < 4 && (
          <div className="mt-10 flex items-center justify-between">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={goPrevious}
                className="border-[3px] border-black px-6 py-3 font-mono text-[10px] uppercase tracking-[2px] transition-colors hover:bg-neutral-100"
              >
                {t('previous')}
              </button>
            ) : (
              <div />
            )}
            <button
              type="button"
              onClick={goNext}
              disabled={!canProceedFromStep(currentStep)}
              className="bg-black px-8 py-3 font-mono text-[10px] uppercase tracking-[2px] text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-30"
            >
              {t('next')}
            </button>
          </div>
        )}

        {currentStep === 4 && (
          <div className="mt-6">
            <button
              type="button"
              onClick={goPrevious}
              className="border-[3px] border-black px-6 py-3 font-mono text-[10px] uppercase tracking-[2px] transition-colors hover:bg-neutral-100"
            >
              {t('previous')}
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
