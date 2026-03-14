'use client'

import { useState, useEffect } from 'react'
import type { DemoStatus } from '@payload-reserve-demos/types'
import { useTranslations } from 'next-intl'
import { CredentialsSuccess } from './CredentialsSuccess'

interface StatusResponse {
  status: DemoStatus
  demoUrl?: string
  expiresAt?: string
}

export function DemoStatusPoller({ demoId, statusToken }: { demoId: string; statusToken: string }) {
  const t = useTranslations('demoStatus')

  const statusMessages: Record<DemoStatus, string> = {
    provisioning: t('states.provisioning'),
    ready: t('states.ready'),
    ready_email_failed: t('states.ready'),
    failed: t('states.failed'),
    expired: t('states.expired'),
    cleanup_failed: t('states.failed'),
  }

  const [status, setStatus] = useState<DemoStatus>('provisioning')
  const [demoUrl, setDemoUrl] = useState<string | undefined>()
  const [expiresAt, setExpiresAt] = useState<Date | undefined>()
  const [dots, setDots] = useState('.')

  useEffect(() => {
    const id = setInterval(() => setDots((d) => (d.length >= 3 ? '.' : d + '.')), 600)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (status === 'ready' || status === 'failed' || status === 'expired') return

    const id = setInterval(async () => {
      try {
        const res = await fetch(`/api/demo/status/${demoId}?token=${encodeURIComponent(statusToken)}`)
        if (!res.ok) return
        const data = (await res.json()) as StatusResponse
        setStatus(data.status)
        if (data.demoUrl) setDemoUrl(data.demoUrl)
        if (data.expiresAt) setExpiresAt(new Date(data.expiresAt))
      } catch {
        // ignore transient errors
      }
    }, 5_000)

    return () => clearInterval(id)
  }, [demoId, statusToken, status])

  if (status === 'ready' && demoUrl) {
    return <CredentialsSuccess demoUrl={demoUrl} expiresAt={expiresAt} />
  }

  if (status === 'failed') {
    return (
      <div className="text-center py-10">
        <p className="text-red-600 dark:text-red-400 font-medium mb-2">{t('failedTitle')}</p>
        <p className="text-[#78716C] dark:text-zinc-500 text-sm">{t('failedSubtitle')}</p>
      </div>
    )
  }

  return (
    <div className="text-center py-10 space-y-6">
      {/* Spinner ring */}
      <div className="relative w-14 h-14 mx-auto">
        <div className="absolute inset-0 rounded-full border-2 border-gray-200 dark:border-zinc-800" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-violet-600 dark:border-t-amber-500 animate-spin" />
      </div>

      {/* Status message */}
      <div>
        <p className="text-[#1C1917] dark:text-white font-medium text-sm mb-1">
          {statusMessages[status]}
          {status === 'provisioning' && <span className="text-violet-600 dark:text-amber-400">{dots}</span>}
        </p>
        <p className="text-[#78716C] dark:text-zinc-500 text-xs">{t('eta')}</p>
      </div>

      {/* Progress steps */}
      <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-mono text-[#78716C] dark:text-zinc-600">
        <span className="text-emerald-600 dark:text-emerald-500">✓ {t('progress.containerCreated')}</span>
        <span className="text-gray-300 dark:text-zinc-700">·</span>
        <span className={status === 'provisioning' ? 'text-violet-600 dark:text-amber-400 animate-pulse' : 'text-emerald-600 dark:text-emerald-500'}>
          {t('progress.waitingHealth')}
        </span>
        <span className="text-gray-300 dark:text-zinc-700">·</span>
        <span className="text-[#78716C] dark:text-zinc-600">{t('progress.seedingData')}</span>
      </div>

      <p className="text-[11px] text-[#78716C] dark:text-zinc-600">
        {t('demoIdLabel')}: {demoId}
      </p>
    </div>
  )
}
