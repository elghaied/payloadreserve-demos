'use client'

import { useState } from 'react'

type Status = 'idle' | 'loading' | 'success' | 'error'

export function SeedButton() {
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')

  async function handleSeed() {
    if (status === 'loading') return
    setStatus('loading')
    setMessage('')

    try {
      const res = await fetch('/api/seed', { method: 'POST' })
      const json = await res.json()

      if (!res.ok) {
        setStatus('error')
        setMessage(json.error ?? 'Seed failed.')
      } else {
        setStatus('success')
        setMessage(json.message ?? 'Done.')
      }
    } catch {
      setStatus('error')
      setMessage('Network error — check server logs.')
    }
  }

  const isLoading = status === 'loading'

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '16px 24px',
        marginBottom: '24px',
        borderRadius: '8px',
        border: '1px solid var(--theme-elevation-150)',
        background: 'var(--theme-elevation-50)',
      }}
    >
      <div style={{ flex: 1 }}>
        <p
          style={{
            margin: 0,
            fontWeight: 600,
            fontSize: '14px',
            color: 'var(--theme-text)',
          }}
        >
          Seed Website Content
        </p>
        <p
          style={{
            margin: '2px 0 0',
            fontSize: '12px',
            color: 'var(--theme-elevation-600)',
          }}
        >
          Populates all globals and demo cards from the English &amp; French message files.
          Existing data will be overwritten.
        </p>
      </div>

      <button
        onClick={handleSeed}
        disabled={isLoading}
        style={{
          padding: '8px 20px',
          borderRadius: '6px',
          border: 'none',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          fontWeight: 600,
          fontSize: '13px',
          background: isLoading ? 'var(--theme-elevation-200)' : 'var(--theme-success-500)',
          color: isLoading ? 'var(--theme-elevation-500)' : '#fff',
          transition: 'background 0.15s',
          whiteSpace: 'nowrap',
        }}
      >
        {isLoading ? '⏳ Seeding…' : '🌱 Run Seed'}
      </button>

      {message && (
        <span
          style={{
            fontSize: '12px',
            fontWeight: 500,
            color: status === 'success' ? 'var(--theme-success-500)' : 'var(--theme-error-500)',
          }}
        >
          {status === 'success' ? '✓' : '✗'} {message}
        </span>
      )}
    </div>
  )
}

export default SeedButton
