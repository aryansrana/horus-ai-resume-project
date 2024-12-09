import { NextResponse } from 'next/server'
import { getEmailFromToken } from '@/utils/auth'

export async function GET() {
  const email = await getEmailFromToken()

  if (!email) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }

  return NextResponse.json({ email })
}