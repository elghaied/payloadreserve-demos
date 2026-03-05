'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function DeleteInstanceButton({ id, demoId }: { id: string; demoId: string }) {
  const [status, setStatus] = useState<'idle' | 'loading'>('idle')
  const router = useRouter()

  async function handleDelete() {
    if (!confirm(`Delete instance "${demoId}"? This will tear down its Coolify service, database, and S3 files.`)) {
      return
    }
    setStatus('loading')
    try {
      const res = await fetch(`/api/demo-instances/${id}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        alert(data?.errors?.[0]?.message ?? 'Delete failed')
        setStatus('idle')
        return
      }
      router.refresh()
    } catch {
      alert('Network error')
      setStatus('idle')
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={status === 'loading'}
      title={`Delete ${demoId}`}
      style={{
        padding: '2px 8px',
        borderRadius: '4px',
        border: '1px solid var(--theme-error-500)',
        background: 'transparent',
        color: 'var(--theme-error-500)',
        fontSize: '12px',
        fontWeight: 600,
        cursor: status === 'loading' ? 'not-allowed' : 'pointer',
        opacity: status === 'loading' ? 0.5 : 1,
      }}
    >
      {status === 'loading' ? '…' : '✕'}
    </button>
  )
}
