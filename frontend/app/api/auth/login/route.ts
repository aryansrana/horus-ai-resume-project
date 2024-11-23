import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json()
  const { email, password } = body

  // This is a mock authentication. In a real app, you'd verify against a database.
  if (email === 'test@example.com' && password === 'password') {
    return NextResponse.json({ token: 'fake-jwt-token' })
  } else {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }
}

