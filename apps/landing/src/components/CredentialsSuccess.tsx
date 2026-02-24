export function CredentialsSuccess({
  demoUrl,
  expiresAt,
}: {
  demoUrl: string
  expiresAt?: Date
}) {
  const expiresFormatted = expiresAt
    ? expiresAt.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
    : null

  return (
    <div className="space-y-6">
      {/* Success header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-emerald-500/15 flex items-center justify-center shrink-0">
          <svg
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
            className="text-emerald-400"
          >
            <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div>
          <p className="text-white font-semibold text-sm">Your demo is ready</p>
          <p className="text-zinc-500 text-xs">Credentials have been sent to your email.</p>
        </div>
      </div>

      {/* Demo URL card */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-zinc-500 font-mono">Demo URL</span>
          <span className="text-[10px] text-zinc-600 font-mono">{expiresFormatted && `Expires ${expiresFormatted}`}</span>
        </div>
        <a
          href={demoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-sm text-amber-400 font-mono hover:text-amber-300 transition-colors break-all"
        >
          {demoUrl}
        </a>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col gap-2">
        <a
          href={`${demoUrl}/admin`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-semibold text-sm px-5 py-3 rounded-lg transition-colors"
        >
          Open Admin Panel
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
        <a
          href={demoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center gap-2 text-zinc-300 hover:text-white border border-zinc-700/70 hover:border-zinc-500 font-medium text-sm px-5 py-2.5 rounded-lg transition-colors"
        >
          View Booking Page
        </a>
      </div>

      <p className="text-[11px] text-zinc-600 text-center">
        The demo is pre-seeded with realistic data. All data is permanently deleted on expiry.
      </p>
    </div>
  )
}
