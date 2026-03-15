'use client'

import { useEffect } from 'react'
import * as Sentry from '@sentry/nextjs'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <main className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <h1 className="font-display text-3xl text-[#1C1917] dark:text-stone-50 mb-3">
          Something went wrong
        </h1>
        <p className="text-[#78716C] dark:text-stone-400 text-sm mb-6">
          An unexpected error occurred. Please try again.
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 font-bold text-sm px-6 py-3 rounded-full transition-all bg-violet-700 hover:bg-violet-600 text-white shadow-sm shadow-violet-400/20"
        >
          Try again
        </button>
      </div>
    </main>
  )
}
