'use client'

import { useTranslations } from 'next-intl'
import { EVENT_TYPE_COLOR_LIST } from '@/lib/event-colors'

const STRIPE_GRADIENT = `linear-gradient(90deg, ${EVENT_TYPE_COLOR_LIST.join(', ')})`

export function StepIndicator({ currentStep }: { currentStep: number }) {
  const t = useTranslations('booking')
  const steps = [t('step1'), t('step2'), t('step3'), t('step4')]

  return (
    <div className="mb-10">
      <div className="flex gap-1">
        {steps.map((_, i) => {
          const stepNum = i + 1
          const isCompleted = stepNum < currentStep
          const isCurrent = stepNum === currentStep

          return (
            <div key={i} className="flex-1">
              <div
                className="h-2"
                style={{
                  background: isCompleted
                    ? STRIPE_GRADIENT
                    : isCurrent
                      ? '#000000'
                      : '#e5e5e5',
                }}
              />
            </div>
          )
        })}
      </div>
      <div className="mt-3 flex gap-1">
        {steps.map((label, i) => {
          const stepNum = i + 1
          const isCompleted = stepNum < currentStep
          const isCurrent = stepNum === currentStep

          return (
            <div key={i} className="flex flex-1 items-center gap-1.5">
              {isCompleted ? (
                <span className="flex h-5 w-5 items-center justify-center bg-black text-[10px] text-white">
                  &#10003;
                </span>
              ) : (
                <span
                  className={`flex h-5 w-5 items-center justify-center font-mono text-[10px] ${
                    isCurrent
                      ? 'bg-black text-white'
                      : 'bg-neutral-200 text-neutral-400'
                  }`}
                >
                  {stepNum}
                </span>
              )}
              <span
                className={`hidden font-mono text-[10px] uppercase tracking-[2px] sm:inline ${
                  isCurrent
                    ? 'font-bold text-black'
                    : isCompleted
                      ? 'text-neutral-600'
                      : 'text-neutral-400'
                }`}
              >
                {label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
