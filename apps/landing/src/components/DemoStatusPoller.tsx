'use client'

import { useState, useEffect } from 'react'
import type { DemoStatus } from '@payload-reserve-demos/types'
import { CredentialsSuccess } from './CredentialsSuccess'

interface StatusResponse {
  status: DemoStatus
  demoUrl?: string
  expiresAt?: string
}

const statusMessages: Record<DemoStatus, string> = {
  provisioning: 'Spinning up your container…',
  ready: 'Your demo is ready!',
  failed: 'Something went wrong during provisioning.',
  expired: 'This demo has expired.',
}

export function DemoStatusPoller({ demoId }: { demoId: string }) {
  const [status, setStatus] = useState<DemoStatus>('provisioning')
  const [demoUrl, setDemoUrl] = useState<string | undefined>()
  const [expiresAt, setExpiresAt] = useState<Date | undefined>()
  const [dots, setDots] = useState('.')

  // Animated dots for spinner feel
  useEffect(() => {
    const id = setInterval(() => setDots((d) => (d.length >= 3 ? '.' : d + '.')), 600)
    return () => clearInterval(id)
  }, [])

  // Poll for status
  useEffect(() => {
    if (status === 'ready' || status === 'failed' || status === 'expired') return

    const id = setInterval(async () => {
      try {
        const res = await fetch(`/api/demo/status/${demoId}`)
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
  }, [demoId, status])

  if (status === 'ready' && demoUrl) {
    return <CredentialsSuccess demoUrl={demoUrl} expiresAt={expiresAt} />
  }

  if (status === 'failed') {
    return (
      <div className="text-center py-10">
        <p className="text-red-400 font-medium mb-2">Provisioning failed</p>
        <p className="text-zinc-500 text-sm">Please try requesting a new demo.</p>
      </div>
    )
  }

  return (
    <div className="text-center py-10 space-y-6">
      {/* Spinner ring */}
      <div className="relative w-14 h-14 mx-auto">
        <div className="absolute inset-0 rounded-full border-2 border-zinc-800" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-amber-500 animate-spin" />
      </div>

      {/* Status message */}
      <div>
        <p className="text-white font-medium text-sm mb-1">
          {statusMessages[status]}
          {status === 'provisioning' && <span className="text-amber-400">{dots}</span>}
        </p>
        <p className="text-zinc-500 text-xs">This usually takes 1–3 minutes.</p>
      </div>

      {/* Progress steps */}
      <div className="flex items-center justify-center gap-3 text-xs font-mono text-zinc-600">
        <span className="text-emerald-500">✓ Container created</span>
        <span className="text-zinc-700">·</span>
        <span className={status === 'provisioning' ? 'text-amber-400 animate-pulse' : 'text-emerald-500'}>
          Waiting for health…
        </span>
        <span className="text-zinc-700">·</span>
        <span className="text-zinc-600">Seeding data</span>
      </div>

      <p className="text-[11px] text-zinc-600">Demo ID: {demoId}</p>
    </div>
  )
}
