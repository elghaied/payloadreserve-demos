import type { Payload } from 'payload'
import type { InfrastructureSetting } from '@/payload-types'

/**
 * Fetch infrastructure settings with unmasked secret values.
 * Uses `context.includeSecrets` to bypass the afterRead masking hook.
 */
export async function getInfraSettings(payload: Payload): Promise<InfrastructureSetting> {
  return payload.findGlobal({
    slug: 'infrastructure-settings',
    context: { includeSecrets: true },
  })
}
