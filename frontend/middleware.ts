import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import {jwtDecode} from 'jwt-decode'

interface DecodedToken {
  exp: number;
  [key: string]: any;
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  try {
    const decodedToken = jwtDecode(token) as DecodedToken
    const currentTime = Date.now() / 1000

    if (decodedToken.exp < currentTime) {
      // Token has expired
      const response = NextResponse.redirect(new URL('/login', request.url))
      response.cookies.delete('token')
      return response
    }
  } catch (error) {
    console.error('Invalid token:', error)
    const response = NextResponse.redirect(new URL('/login', request.url))
    response.cookies.delete('token')
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*']
}

