import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'
import { runSeed } from './index'

async function main() {
  const payload = await getPayload({ config })
  await runSeed(payload)
  process.exit(0)
}

main().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
