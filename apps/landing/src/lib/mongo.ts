import { MongoClient } from 'mongodb'

const uri = process.env.DATABASE_URL!
const DB_NAME = 'payloadreserve-landing'

declare global {
  // eslint-disable-next-line no-var
  var _mongoClient: MongoClient | undefined
}

function getClient(): MongoClient {
  if (!global._mongoClient) {
    global._mongoClient = new MongoClient(uri)
  }
  return global._mongoClient
}

export async function getDb() {
  const client = getClient()
  await client.connect()
  return client.db(DB_NAME)
}

export { MongoClient }
