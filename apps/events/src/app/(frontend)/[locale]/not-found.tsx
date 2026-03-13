import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-6">
      <h1 className="text-6xl font-black tracking-[-3px]">404</h1>
      <p className="font-mono text-[11px] uppercase tracking-[3px] text-muted-text">
        Page not found
      </p>
      <Link
        href="/en"
        className="border-[3px] border-black px-6 py-3 font-mono text-[10px] uppercase tracking-[2px] transition-colors hover:bg-black hover:text-white"
      >
        Back to Homepage
      </Link>
    </div>
  )
}
