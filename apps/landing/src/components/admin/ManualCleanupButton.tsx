'use client'

import { useState } from 'react'

export function ManualCleanupButton() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [result, setResult] = useState('')

  async function handleCleanup() {
    if (status === 'loading') return
    setStatus('loading')
    setResult('')

    try {
      const res = await fetch('/api/demo/cleanup', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${prompt('Enter CLEANUP_SECRET:')}`,
        },
      })
      const data = await res.json()

      if (!res.ok) {
        setStatus('error')
        setResult(data.error ?? 'Cleanup failed')
      } else {
        setStatus('done')
        setResult(`Expired: ${data.expired}, Failed: ${data.failed}`)
      }
    } catch {
      setStatus('error')
      setResult('Network error')
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <button
        onClick={handleCleanup}
        disabled={status === 'loading'}
        style={{
          padding: '8px 16px',
          borderRadius: '6px',
          border: 'none',
          cursor: status === 'loading' ? 'not-allowed' : 'pointer',
          fontWeight: 600,
          fontSize: '13px',
          background: status === 'loading' ? 'var(--theme-elevation-200)' : 'var(--theme-error-500)',
          color: '#fff',
        }}
      >
        {status === 'loading' ? 'Cleaning up…' : 'Run Cleanup'}
      </button>
      {result && (
        <span
          style={{
            fontSize: '12px',
            fontWeight: 500,
            color: status === 'error' ? 'var(--theme-error-500)' : 'var(--theme-success-500)',
          }}
        >
          {result}
        </span>
      )}
    </div>
  )
}
