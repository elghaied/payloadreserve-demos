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
    <div className="mb-8 border-[3px] border-amber-400 bg-amber-50 p-5">
      <div className="mb-3 flex items-center gap-2">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="flex-shrink-0 text-amber-600"
          aria-hidden="true"
        >
          <path d="M9 3h6M9 3v8l-4.5 9a1 1 0 00.9 1.5h13.2a1 1 0 00.9-1.5L15 11V3M9 3H6M15 3h3" />
        </svg>
        <span className="font-mono text-[10px] uppercase tracking-[2px] font-bold text-amber-700">
          {t('testMode')}
        </span>
      </div>

      <div className="mb-2 flex items-center gap-2">
        <code className="flex-1 border-[3px] border-black bg-white px-3 py-2 text-center font-mono text-base tracking-widest select-all">
          {CARD_NUMBER}
        </code>
        <button
          onClick={handleCopy}
          aria-label={copied ? t('testCardCopied') : t('testCardCopy')}
          className="flex-shrink-0 border-[3px] border-black bg-black px-3 py-2 font-mono text-[10px] uppercase tracking-[2px] text-white transition-colors hover:bg-neutral-800 min-w-[70px] text-center"
        >
          {copied ? (
            <span className="text-green-400">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="inline" aria-hidden="true">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </span>
          ) : t('testCardCopy')}
        </button>
      </div>

      <p className="font-mono text-xs text-amber-800">{t('testCardHint')}</p>
      <p className="mt-1 font-mono text-[10px] text-amber-700/70">{t('testCardNoCharge')}</p>
    </div>
  )
}
