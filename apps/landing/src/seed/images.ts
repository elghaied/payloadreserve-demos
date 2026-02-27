import fs from 'fs'
import path from 'path'

/**
 * Reads a local .webp from src/seed/ and returns a File-compatible object
 * for use with payload.create({ file: ... }).
 *
 * Uses process.cwd() (project root) instead of __dirname — __dirname points
 * to the bundle location (.next/server/...) in a Next.js server build.
 */
export function fetchFile(filename: string): {
  name: string
  data: Buffer
  mimetype: string
  size: number
} {
  const data = fs.readFileSync(path.join(process.cwd(), 'src/seed', filename))
  return { name: filename, data, mimetype: 'image/webp', size: data.length }
}
