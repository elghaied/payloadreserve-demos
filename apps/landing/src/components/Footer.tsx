import { Link } from '@/i18n/navigation'
import { GShellBrand } from './GShellBrand'
import type { Footer as FooterType, SiteSetting } from '@/payload-types'

type Props = {
  footerData: FooterType
  urls: SiteSetting['externalUrls']
}

export function Footer({ footerData, urls }: Props) {
  const product = footerData.productSection
  const demos = footerData.demosSection
  const links = footerData.linksSection

  return (
    <footer className="bg-[#1C1917] text-white px-6 lg:px-8 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-start justify-between gap-12 mb-12">
          {/* Brand */}
          <div className="max-w-[260px]">
            <Link href="/" className="font-mono text-sm font-semibold">
              payload<span className="text-amber-400">-reserve</span>
            </Link>
            <p className="text-[#78716C] text-sm mt-3 leading-relaxed">{footerData.description}</p>
            <div className="flex items-center gap-2 mt-4">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-[#78716C] border border-white/10 rounded-full px-3 py-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Open Source
              </span>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-[#78716C] border border-white/10 rounded-full px-3 py-1">
                MIT
              </span>
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-16 gap-y-8 text-sm">
            <div>
              <p className="text-[#78716C] font-semibold text-xs uppercase tracking-widest mb-4">
                {product?.heading}
              </p>
              <ul className="space-y-2.5">
                <li>
                  <a
                    href={urls?.docs ?? '#'}
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    {product?.documentation}
                  </a>
                </li>
                <li>
                  <Link href="/demo" className="text-white/60 hover:text-white transition-colors">
                    {product?.liveDemo}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#features"
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    {product?.features}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-[#78716C] font-semibold text-xs uppercase tracking-widest mb-4">
                {demos?.heading}
              </p>
              <ul className="space-y-2.5">
                <li>
                  <Link
                    href="/demos/salon"
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    {demos?.salon}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/demos/hotel"
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    {demos?.hotel}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/demos/restaurant"
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    {demos?.restaurant}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/demos/events"
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    {demos?.events}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-[#78716C] font-semibold text-xs uppercase tracking-widest mb-4">
                {links?.heading}
              </p>
              <ul className="space-y-2.5">
                <li>
                  <a
                    href={urls?.github ?? '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    {links?.github}
                  </a>
                </li>
                <li>
                  <a
                    href={urls?.payloadcms ?? '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    {links?.payloadCms}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-7 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[#78716C] text-xs">{footerData.copyright}</p>
          <GShellBrand showPrefix prefixText={footerData.madeByLabel ?? 'Made by'} size="sm" />
        </div>
      </div>
    </footer>
  )
}
