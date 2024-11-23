'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import jwt from 'jsonwebtoken'

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('token')
      console.log('Token in dashboard:', token)

      if (!token) {
        console.log('No token found, redirecting to login')
        router.push('/login')
        return
      }

      try {
        // Verify and decode the token
        const decodedToken = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET as string) as { exp: number }

        // Check if the token has expired
        if (Date.now() >= decodedToken.exp * 1000) {
          console.log('Token has expired, redirecting to login')
          localStorage.removeItem('token')
          router.push('/login')
        } else {
          console.log('Token is valid, loading dashboard')
          setIsLoading(false)
        }
      } catch (error) {
        console.error('Invalid token:', error)
        localStorage.removeItem('token')
        router.push('/login')
      }
    }

    validateToken()
  }, [router])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome to your protected dashboard!</p>
    </div>
  )
}

