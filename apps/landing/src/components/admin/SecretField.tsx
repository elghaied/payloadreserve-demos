'use client'
import React, { useState, useCallback } from 'react'
import { useField, FieldLabel } from '@payloadcms/ui'
import type { TextFieldClientComponent } from 'payload'

const SECRET_MASK = '••••••••'

export const SecretField: TextFieldClientComponent = ({ path, field }) => {
  const { value, setValue } = useField<string>({ path })
  const [editing, setEditing] = useState(false)
  const [inputValue, setInputValue] = useState('')

  const hasValue = value === SECRET_MASK || (!!value && value !== '')

  const handleApply = useCallback(() => {
    if (inputValue) {
      setValue(inputValue)
    }
    setEditing(false)
    setInputValue('')
  }, [inputValue, setValue])

  const handleCancel = useCallback(() => {
    setEditing(false)
    setInputValue('')
  }, [])

  return (
    <div className="field-type text" style={{ marginBottom: '1.25rem' }}>
      <FieldLabel label={field?.label || field?.name || path} required={field?.required} path={path} />
      {!editing ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
          <code style={{ color: hasValue ? 'var(--theme-elevation-800)' : 'var(--theme-elevation-400)' }}>
            {hasValue ? SECRET_MASK : '(not set)'}
          </code>
          <button
            type="button"
            className="btn btn--size-small btn--style-secondary"
            onClick={() => setEditing(true)}
          >
            {hasValue ? 'Update' : 'Set'}
          </button>
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
