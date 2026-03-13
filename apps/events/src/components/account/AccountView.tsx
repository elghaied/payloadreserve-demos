'use client'

import { useState, useCallback, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { LoginForm } from './LoginForm'
import { RegisterForm } from './RegisterForm'
import { BookingCard } from './BookingCard'
import { CancelDialog } from './CancelDialog'
import {
  login,
  register,
  fetchBookings,
  cancelBooking,
} from '@/app/(frontend)/[locale]/compte/actions'
import type { Booking, Customer } from '@/payload-types'

interface AccountViewProps {
  locale: string
}

export function AccountView({ locale }: AccountViewProps) {
  const t = useTranslations('account')

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)

  // Cancel dialog state
  const [cancelTarget, setCancelTarget] = useState<Booking | null>(null)
  const [cancelLoading, setCancelLoading] = useState(false)

  const loadBookings = useCallback(async (customerId: string) => {
    const result = await fetchBookings(customerId)
    if (result.success) {
      setBookings(result.bookings as Booking[])
    }
  }, [])

  const handleLogin = useCallback(
    async (email: string, password: string) => {
      setLoading(true)
      setAuthError(null)
      const result = await login(email, password)
      if (result.success && result.customer) {
        const cust = result.customer as Customer
        setCustomer(cust)
        setIsLoggedIn(true)
        await loadBookings(cust.id)
      } else {
        setAuthError(result.success ? null : (result.error ?? null))
      }
      setLoading(false)
    },
    [loadBookings],
  )

  const handleRegister = useCallback(
    async (data: {
      email: string
      password: string
      firstName: string
      lastName: string
      phone: string
    }) => {
      setLoading(true)
      setAuthError(null)
      const result = await register(data)
      if (result.success && result.customer) {
        const cust = result.customer as Customer
        setCustomer(cust)
        setIsLoggedIn(true)
        await loadBookings(cust.id)
      } else {
        setAuthError(result.success ? null : (result.error ?? null))
      }
      setLoading(false)
    },
    [loadBookings],
  )

  const handleLogout = useCallback(() => {
    setIsLoggedIn(false)
    setCustomer(null)
    setBookings([])
    setAuthError(null)
  }, [])

  const handleCancelRequest = useCallback(
    (bookingId: string) => {
      const booking = bookings.find((b) => b.id === bookingId)
      if (booking) setCancelTarget(booking)
    },
    [bookings],
  )

  const handleCancelConfirm = useCallback(async () => {
    if (!cancelTarget || !customer) return
    setCancelLoading(true)
    const result = await cancelBooking(cancelTarget.id)
    if (result.success) {
      await loadBookings(customer.id)
    }
    setCancelLoading(false)
    setCancelTarget(null)
  }, [cancelTarget, customer, loadBookings])

  const now = new Date()
  const upcomingBookings = bookings.filter(
    (b) =>
      new Date(b.startTime) > now &&
      b.status !== 'cancelled' &&
      b.status !== 'completed',
  )
  const pastBookings = bookings.filter(
    (b) =>
      new Date(b.startTime) <= now ||
      b.status === 'cancelled' ||
      b.status === 'completed',
  )

  if (!isLoggedIn) {
    return (
      <section className="px-6 py-16 lg:px-12 lg:py-24">
        <h1 className="mb-2 text-4xl font-black uppercase tracking-[-1px] md:text-5xl">
          {t('title')}
        </h1>
        <div className="mb-10 h-[3px] w-16 bg-black" />

        <div className="mx-auto max-w-md">
          <Tabs defaultValue="login">
            <TabsList className="mb-8 flex w-full rounded-none border-[3px] border-black bg-transparent p-0">
              <TabsTrigger
                value="login"
                className="flex-1 rounded-none border-0 px-4 py-3 font-mono text-[10px] uppercase tracking-[2px] data-active:bg-black data-active:text-white"
              >
                {t('login')}
              </TabsTrigger>
              <TabsTrigger
                value="register"
                className="flex-1 rounded-none border-0 border-l-[3px] border-black px-4 py-3 font-mono text-[10px] uppercase tracking-[2px] data-active:bg-black data-active:text-white"
              >
                {t('register')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <LoginForm
                onLogin={handleLogin}
                error={authError}
                loading={loading}
              />
            </TabsContent>

            <TabsContent value="register">
              <RegisterForm
                onRegister={handleRegister}
                error={authError}
                loading={loading}
              />
            </TabsContent>
          </Tabs>
        </div>
      </section>
    )
  }

  // Logged in — Dashboard
  return (
    <section className="px-6 py-16 lg:px-12 lg:py-24">
      {/* Header */}
      <div className="mb-10 flex items-start justify-between">
        <div>
          <h1 className="mb-2 text-4xl font-black uppercase tracking-[-1px] md:text-5xl">
            {t('title')}
          </h1>
          <div className="mb-4 h-[3px] w-16 bg-black" />
          {customer && (
            <p className="font-mono text-[10px] uppercase tracking-[2px] text-neutral-500">
              {customer.firstName} {customer.lastName} — {customer.email}
            </p>
          )}
        </div>
        <button
          onClick={handleLogout}
          className="border-[3px] border-black bg-white px-4 py-2 font-mono text-[10px] uppercase tracking-[2px] text-black transition-colors hover:bg-black hover:text-white"
        >
          {t('logout')}
        </button>
      </div>

      {/* Upcoming bookings */}
      <div className="mb-12">
        <h2 className="mb-1 text-2xl font-black uppercase tracking-[-0.5px]">
          {t('upcomingBookings')}
        </h2>
        <div className="mb-6 h-[3px] w-12 bg-black" />

        {upcomingBookings.length === 0 ? (
          <p className="py-10 text-center font-mono text-[10px] uppercase tracking-[2px] text-neutral-400">
            {t('noUpcoming')}
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {upcomingBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onCancel={handleCancelRequest}
              />
            ))}
          </div>
        )}
      </div>

      {/* Past bookings */}
      <div>
        <h2 className="mb-1 text-2xl font-black uppercase tracking-[-0.5px]">
          {t('pastBookings')}
        </h2>
        <div className="mb-6 h-[3px] w-12 bg-black" />

        {pastBookings.length === 0 ? (
          <p className="py-10 text-center font-mono text-[10px] uppercase tracking-[2px] text-neutral-400">
            {t('noPast')}
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pastBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        )}
      </div>

      {/* Cancel dialog */}
      {cancelTarget && (
        <CancelDialog
          booking={cancelTarget}
          open={!!cancelTarget}
          onOpenChange={(open) => {
            if (!open) setCancelTarget(null)
          }}
          onConfirm={handleCancelConfirm}
          loading={cancelLoading}
        />
      )}
    </section>
  )
}
