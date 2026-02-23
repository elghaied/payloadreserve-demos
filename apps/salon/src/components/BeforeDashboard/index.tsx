'use client'
import { useState } from 'react'
import { toast } from '@payloadcms/ui'

export default function BeforeDashboard() {
  const [loading, setLoading] = useState(false)

  const handleSeed = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/seed', { method: 'POST', credentials: 'include' })
      const data = await res.json()
      if (res.ok) {
        toast.success('Database seeded!')
      } else {
        toast.error(data.error ?? 'Seed failed')
      }
    } catch {
      toast.error('Seed failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ marginBottom: '1rem' }}>
      <button onClick={handleSeed} disabled={loading}>
        {loading ? 'Seeding…' : '🌱 Seed demo data'}
      </button>
    </div>
  )
}
