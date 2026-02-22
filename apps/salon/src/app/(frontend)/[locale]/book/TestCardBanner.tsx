'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'

const CARD_NUMBER = '4242 4242 4242 4242'

export function TestCardBanner() {
  const t = useTranslations('booking')
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(CARD_NUMBER)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard API unavailable — silently ignore
    }
  }

  return (
    <div className="border border-warning/40 bg-warning/5 rounded-sm p-5 mb-8 text-left max-w-sm mx-auto">
      <div className="flex items-center gap-2 mb-3">
        {/* Lab flask icon */}
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          className="text-warning flex-shrink-0"
          aria-hidden="true"
        >
          <path d="M9 3h6M9 3v8l-4.5 9a1 1 0 00.9 1.5h13.2a1 1 0 00.9-1.5L15 11V3M9 3H6M15 3h3" />
        </svg>
        <span className="text-sm font-semibold text-warning">{t('testMode')}</span>
      </div>

      <div className="flex items-center gap-2 mb-2">
        <code className="font-mono text-base tracking-widest text-foreground bg-background border border-border px-3 py-1.5 flex-1 text-center select-all">
          {CARD_NUMBER}
        </code>
        <button
          onClick={handleCopy}
          aria-label={copied ? t('testCardCopied') : t('testCardCopy')}
          className="flex-shrink-0 px-3 py-1.5 text-xs border border-border hover:border-primary hover:text-primary transition-colors min-w-[60px] text-center"
        >
          {copied ? (
            <span className="text-success">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="inline" aria-hidden="true">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </span>
          ) : t('testCardCopy')}
        </button>
      </div>

      <p className="text-xs text-muted mb-1">{t('testCardHint')}</p>
      <p className="text-xs text-muted/70">{t('testCardNoCharge')}</p>
    </div>
  )
}
