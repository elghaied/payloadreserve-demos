'use client'

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-6">
      <h1 className="text-4xl font-black tracking-[-2px]">Something went wrong</h1>
      <button
        onClick={reset}
        className="border-[3px] border-black px-6 py-3 font-mono text-[10px] uppercase tracking-[2px] transition-colors hover:bg-black hover:text-white"
      >
        Try Again
      </button>
    </div>
  )
}
