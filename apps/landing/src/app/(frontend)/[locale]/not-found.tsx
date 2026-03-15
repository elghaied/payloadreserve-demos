import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <h1 className="font-display text-3xl text-[#1C1917] dark:text-stone-50 mb-3">
          Page not found
        </h1>
        <p className="text-[#78716C] dark:text-stone-400 text-sm mb-6">
          The page you are looking for does not exist.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-bold text-sm px-6 py-3 rounded-full transition-all bg-violet-700 hover:bg-violet-600 text-white shadow-sm shadow-violet-400/20"
        >
          Go home
        </Link>
      </div>
    </main>
  )
}
