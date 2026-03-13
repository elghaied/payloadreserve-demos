import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config.js'
import { runSeed } from './index.js'

async function main() {
  const payload = await getPayload({ config })
  await runSeed(payload)
  payload.logger.info('Seed complete!')
  process.exit(0)
}

main().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
