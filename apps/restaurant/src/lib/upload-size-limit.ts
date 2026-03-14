import { NextResponse } from 'next/server'

const MAX_UPLOAD_SIZE = 5 * 1024 * 1024 // 5MB

export function checkUploadSize(req: Request): NextResponse | null {
  const contentLength = req.headers.get('content-length')
  if (contentLength && parseInt(contentLength, 10) > MAX_UPLOAD_SIZE) {
    return NextResponse.json(
      { error: `File too large. Maximum size is ${MAX_UPLOAD_SIZE / 1024 / 1024}MB` },
      { status: 413 },
    )
  }
  return null
}
