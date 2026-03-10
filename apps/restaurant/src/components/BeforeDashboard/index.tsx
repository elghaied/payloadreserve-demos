'use client'

import { useState } from 'react'

export default function BeforeDashboard() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSeed = async () => {
    if (!confirm('This will clear and reseed the database. Continue?')) return
    setLoading(true)
    setMessage('')

    try {
      const res = await fetch('/api/seed', { method: 'POST', credentials: 'include' })
      const data = await res.json()
      if (data.success) {
        setMessage('Database seeded successfully! Refreshing...')
        setTimeout(() => window.location.reload(), 1500)
      } else {
        setMessage(`Error: ${data.error}`)
      }
    } catch (error) {
      setMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        padding: '24px',
        margin: '0 0 24px',
        borderRadius: '8px',
        background: 'var(--theme-elevation-50)',
        border: '1px solid var(--theme-elevation-150)',
      }}
    >
      <h3 style={{ margin: '0 0 8px', fontSize: '16px' }}>Le Jardin Dore — Restaurant Demo</h3>
      <p style={{ margin: '0 0 16px', color: 'var(--theme-elevation-500)', fontSize: '14px' }}>
        Seed the database with sample dining experiences, tables, menu, and reservations.
      </p>
      <button
        onClick={handleSeed}
        disabled={loading}
        style={{
          padding: '8px 16px',
          background: loading ? '#999' : '#722F37',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: '14px',
        }}
      >
        {loading ? 'Seeding...' : 'Seed Database'}
      </button>
      {message && (
        <p
          style={{
            margin: '12px 0 0',
            fontSize: '14px',
            color: message.startsWith('Error') ? '#dc2626' : '#16a34a',
          }}
        >
          {message}
        </p>
      )}
    </div>
  )
}
