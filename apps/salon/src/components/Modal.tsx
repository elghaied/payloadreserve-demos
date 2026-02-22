'use client'

import React, { useEffect, useRef, useId } from 'react'

type Props = {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export function Modal({ open, onClose, title, children }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open) {
      dialog.showModal()
      // Focus first focusable element inside the dialog
      const focusable = dialog.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )
      focusable?.focus()
    } else {
      dialog.close()
    }
  }, [open])

  // Trap focus within the dialog
  useEffect(() => {
    if (!open) return
    const dialog = dialogRef.current
    if (!dialog) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      const focusables = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => !el.hasAttribute('disabled'))
      if (focusables.length === 0) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open])

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={handleBackdropClick}
      aria-labelledby={titleId}
      className="backdrop:bg-foreground/40 bg-surface border border-border rounded-sm p-0 max-w-md w-[calc(100%-2rem)] m-auto max-h-[90vh] overflow-y-auto"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 id={titleId} className="font-heading text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="text-muted hover:text-foreground p-1" aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M5 5l10 10M15 5L5 15" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </dialog>
  )
}
