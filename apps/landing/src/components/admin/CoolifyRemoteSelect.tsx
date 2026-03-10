'use client'
import React, { useState, useEffect, useCallback } from 'react'
import { useField, FieldLabel } from '@payloadcms/ui'
import type { TextFieldClientComponent } from 'payload'

interface Option {
  value: string
  label: string
}

function CoolifyRemoteSelect({
  path,
  field,
  resource,
}: {
  path: string
  field: { label?: string; name?: string; required?: boolean }
  resource: 'projects' | 'servers'
}) {
  const { value, setValue } = useField<string>({ path })
  const [options, setOptions] = useState<Option[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchOptions = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/coolify-browse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ resource }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error || `Failed to fetch ${resource}`)
        return
      }
      const data = await res.json()
      setOptions(data.options || [])
    } catch {
      setError(`Failed to fetch ${resource}`)
    } finally {
      setLoading(false)
    }
  }, [resource])

  useEffect(() => {
    fetchOptions()
  }, [fetchOptions])

  const currentLabel =
    options.find((o) => o.value === value)?.label ??
    (value ? `(unknown: ${value})` : '')

  return (
    <div className="field-type text" style={{ marginBottom: '1.25rem' }}>
      <FieldLabel
        label={field?.label || field?.name || path}
        required={field?.required}
        path={path}
      />

      {error ? (
        <div style={{ marginTop: '0.25rem' }}>
          <p style={{ color: 'var(--theme-error-500)', fontSize: '0.875rem', margin: 0 }}>
            {error}
          </p>
          <button
            type="button"
            className="btn btn--size-small btn--style-secondary"
            onClick={fetchOptions}
            style={{ marginTop: '0.5rem' }}
          >
            Retry
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
          <select
            value={value || ''}
            onChange={(e) => setValue(e.target.value)}
            disabled={loading}
            style={{
              flex: 1,
              padding: '0.5rem',
              border: '1px solid var(--theme-elevation-150)',
              borderRadius: '4px',
              background: 'var(--theme-input-bg)',
              color: 'var(--theme-elevation-800)',
              fontSize: '0.875rem',
            }}
          >
            <option value="">
              {loading ? 'Loading…' : `Select a ${resource.slice(0, -1)}…`}
            </option>
            {/* If current value doesn't match any option, show it so it isn't lost */}
            {value && !options.some((o) => o.value === value) && (
              <option value={value}>{currentLabel}</option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="btn btn--size-small btn--style-secondary"
            onClick={fetchOptions}
            disabled={loading}
            title={`Refresh ${resource} list`}
            style={{ whiteSpace: 'nowrap' }}
          >
            {loading ? '…' : '↻'}
          </button>
        </div>
      )}

      {value && !error && (
        <code
          style={{
            display: 'block',
            marginTop: '0.25rem',
            fontSize: '0.75rem',
            color: 'var(--theme-elevation-500)',
            wordBreak: 'break-all',
          }}
        >
          {value}
        </code>
      )}
    </div>
  )
}

export const CoolifyProjectSelect: TextFieldClientComponent = ({ path, field }) => (
  <CoolifyRemoteSelect path={path} field={field} resource="projects" />
)

export const CoolifyServerSelect: TextFieldClientComponent = ({ path, field }) => (
  <CoolifyRemoteSelect path={path} field={field} resource="servers" />
)
