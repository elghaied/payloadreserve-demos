'use client'
import React, { useState, useCallback } from 'react'
import { useField, FieldLabel } from '@payloadcms/ui'
import type { TextFieldClientComponent } from 'payload'
import { SECRET_MASK } from '@/globals/InfrastructureSettings'

function generateSecret(): string {
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
}

export const SecretField: TextFieldClientComponent = ({ path, field }) => {
  const { value, setValue } = useField<string>({ path })
  const [editing, setEditing] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [revealedValue, setRevealedValue] = useState<string | null>(null)
  const [revealing, setRevealing] = useState(false)

  const hasValue = value === SECRET_MASK || (!!value && value !== '')

  const handleApply = useCallback(() => {
    if (inputValue) {
      setValue(inputValue)
    }
    setEditing(false)
    setInputValue('')
    setRevealedValue(null)
  }, [inputValue, setValue])

  const handleCancel = useCallback(() => {
    setEditing(false)
    setInputValue('')
  }, [])

  const handleReveal = useCallback(async () => {
    if (revealedValue !== null) {
      setRevealedValue(null)
      return
    }
    setRevealing(true)
    try {
      const res = await fetch('/api/admin/reveal-secret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ fieldName: path }),
      })
      if (!res.ok) {
        const err = await res.json()
        console.error('Reveal failed:', err.error)
        return
      }
      const { value: secret } = await res.json()
      setRevealedValue(secret ?? '(empty)')
    } catch (e) {
      console.error('Reveal failed:', e)
    } finally {
      setRevealing(false)
    }
  }, [revealedValue, path])

  const handleGenerate = useCallback(() => {
    const secret = generateSecret()
    setValue(secret)
    setRevealedValue(null)
    setEditing(false)
    setInputValue('')
  }, [setValue])

  return (
    <div className="field-type text" style={{ marginBottom: '1.25rem' }}>
      <FieldLabel label={field?.label || field?.name || path} required={field?.required} path={path} />
      {!editing ? (
        <div style={{ marginTop: '0.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <code
              style={{
                color: hasValue ? 'var(--theme-elevation-800)' : 'var(--theme-elevation-400)',
                wordBreak: 'break-all',
              }}
            >
              {revealedValue !== null ? revealedValue : hasValue ? SECRET_MASK : '(not set)'}
            </code>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            {hasValue && (
              <button
                type="button"
                className="btn btn--size-small btn--style-secondary"
                onClick={handleReveal}
                disabled={revealing}
              >
                {revealing ? 'Loading…' : revealedValue !== null ? 'Hide' : 'Reveal'}
              </button>
            )}
            <button
              type="button"
              className="btn btn--size-small btn--style-secondary"
              onClick={() => {
                setEditing(true)
                setRevealedValue(null)
              }}
            >
              {hasValue ? 'Update' : 'Set'}
            </button>
            <button
              type="button"
              className="btn btn--size-small btn--style-secondary"
              onClick={handleGenerate}
              title="Generate a random 64-character hex secret"
            >
              Generate
            </button>
          </div>
        </div>
      ) : (
        <div style={{ marginTop: '0.25rem' }}>
          <input
            type="password"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter new value"
            autoComplete="off"
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid var(--theme-elevation-150)',
              borderRadius: '4px',
              background: 'var(--theme-input-bg)',
              color: 'var(--theme-elevation-800)',
              marginBottom: '0.5rem',
            }}
          />
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="button" className="btn btn--size-small btn--style-primary" onClick={handleApply}>
              Apply
            </button>
            <button type="button" className="btn btn--size-small btn--style-secondary" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default SecretField
