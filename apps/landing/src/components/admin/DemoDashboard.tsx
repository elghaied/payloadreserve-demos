import type { AdminViewServerProps } from 'payload'
import { DefaultTemplate } from '@payloadcms/next/templates'
import { Gutter } from '@payloadcms/ui'
import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'
import { ManualCleanupButton } from './ManualCleanupButton'

export default async function DemoDashboard({
  initPageResult,
  params,
  searchParams,
}: AdminViewServerProps) {
  const payload = await getPayload({ config })

  const [readyCount, provisioningCount, failedCount, totalRequests, recentInstances] =
    await Promise.all([
      payload.count({
        collection: 'demo-instances',
        where: { status: { equals: 'ready' } },
      }),
      payload.count({
        collection: 'demo-instances',
        where: { status: { equals: 'provisioning' } },
      }),
      payload.count({
        collection: 'demo-instances',
        where: { status: { equals: 'failed' } },
      }),
      payload.count({ collection: 'demo-requests' }),
      payload.find({
        collection: 'demo-instances',
        sort: '-createdAt',
        limit: 10,
      }),
    ])

  return (
    <DefaultTemplate
      i18n={initPageResult.req.i18n}
      locale={initPageResult.locale}
      params={params}
      payload={payload}
      permissions={initPageResult.permissions}
      searchParams={searchParams}
      user={initPageResult.req.user ?? undefined}
      visibleEntities={initPageResult.visibleEntities}
    >
      <Gutter>
        <h1 style={{ marginBottom: '24px' }}>Demo Dashboard</h1>

        {/* Stats grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '16px',
            marginBottom: '32px',
          }}
        >
          <StatCard label="Running" value={readyCount.totalDocs} color="#166534" bg="#dcfce7" />
          <StatCard label="Provisioning" value={provisioningCount.totalDocs} color="#92400e" bg="#fef3c7" />
          <StatCard label="Failed" value={failedCount.totalDocs} color="#991b1b" bg="#fee2e2" />
          <StatCard label="Total Requests" value={totalRequests.totalDocs} color="#1e40af" bg="#dbeafe" />
        </div>

        {/* Actions */}
        <div style={{ marginBottom: '32px', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <ManualCleanupButton />
          <Link
            href="/admin/collections/demo-instances"
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: '1px solid var(--theme-elevation-150)',
              background: 'var(--theme-elevation-50)',
              color: 'var(--theme-text)',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: 600,
            }}
          >
            View All Instances
          </Link>
          <Link
            href="/admin/collections/demo-requests"
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: '1px solid var(--theme-elevation-150)',
              background: 'var(--theme-elevation-50)',
              color: 'var(--theme-text)',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: 600,
            }}
          >
            View All Requests
          </Link>
        </div>

        {/* Recent instances table */}
        <h2 style={{ marginBottom: '12px' }}>Recent Instances</h2>
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '13px',
            }}
          >
            <thead>
              <tr
                style={{
                  borderBottom: '2px solid var(--theme-elevation-150)',
                  textAlign: 'left',
                }}
              >
                <th style={{ padding: '8px' }}>Demo ID</th>
                <th style={{ padding: '8px' }}>Type</th>
                <th style={{ padding: '8px' }}>Status</th>
                <th style={{ padding: '8px' }}>Email</th>
                <th style={{ padding: '8px' }}>Expires</th>
                <th style={{ padding: '8px' }}>Created</th>
              </tr>
            </thead>
            <tbody>
              {recentInstances.docs.map((inst) => (
                <tr
                  key={inst.id}
                  style={{ borderBottom: '1px solid var(--theme-elevation-100)' }}
                >
                  <td style={{ padding: '8px' }}>
                    <a href={`/admin/collections/demo-instances/${inst.id}`}>{inst.demoId}</a>
                  </td>
                  <td style={{ padding: '8px' }}>{inst.type}</td>
                  <td style={{ padding: '8px' }}>
                    <StatusPill status={inst.status} />
                  </td>
                  <td style={{ padding: '8px' }}>{inst.adminEmail}</td>
                  <td style={{ padding: '8px' }}>
                    {inst.expiresAt ? new Date(inst.expiresAt).toLocaleString() : '—'}
                  </td>
                  <td style={{ padding: '8px' }}>
                    {inst.createdAt ? new Date(inst.createdAt).toLocaleString() : '—'}
                  </td>
                </tr>
              ))}
              {recentInstances.docs.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding: '16px', textAlign: 'center', color: 'var(--theme-elevation-500)' }}>
                    No demo instances yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Gutter>
    </DefaultTemplate>
  )
}

function StatCard({ label, value, color, bg }: { label: string; value: number; color: string; bg: string }) {
  return (
    <div
      style={{
        padding: '20px',
        borderRadius: '8px',
        backgroundColor: bg,
        border: `1px solid ${color}20`,
      }}
    >
      <div style={{ fontSize: '28px', fontWeight: 700, color }}>{value}</div>
      <div style={{ fontSize: '13px', fontWeight: 600, color, opacity: 0.8, marginTop: '4px' }}>
        {label}
      </div>
    </div>
  )
}

function StatusPill({ status }: { status: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    ready: { bg: '#dcfce7', text: '#166534' },
    provisioning: { bg: '#fef3c7', text: '#92400e' },
    failed: { bg: '#fee2e2', text: '#991b1b' },
    expired: { bg: '#f3f4f6', text: '#4b5563' },
  }
  const c = colors[status] ?? { bg: '#f3f4f6', text: '#4b5563' }

  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 8px',
        borderRadius: '9999px',
        fontSize: '12px',
        fontWeight: 600,
        backgroundColor: c.bg,
        color: c.text,
      }}
    >
      {status}
    </span>
  )
}
