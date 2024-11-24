'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { jwtDecode } from "jwt-decode"
import Cookies from 'js-cookie'

interface DecodedToken {
  userId : string;
  email : string;
  username : string;
  exp: number;
}

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const validateToken = () => {
      const token = Cookies.get('token')
      if (!token) {
        router.push('/login')
        return
      }

      try {
        const decodedToken = jwtDecode(token) as DecodedToken
        const currentTime = Date.now() / 1000

        if (decodedToken.exp < currentTime) {
          // Token has expired
          Cookies.remove('token')
          router.push('/login')
        } else {
          setIsLoading(false)
        }
      } catch (error) {
        console.error('Invalid token:', error)
        Cookies.remove('token')
        router.push('/login')
      }
    }

    validateToken()
  }, [router])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p>Welcome to your protected dashboard!</p>
    </div>
  )
}

