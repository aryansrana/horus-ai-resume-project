'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Login } from '@/components/login'
import { jwtDecode } from "jwt-decode"
import Cookies from 'js-cookie'

interface DecodedToken {
  userId : string;
  email : string;
  username : string;
  exp: number;
}

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const validateToken = () => {
      const token = Cookies.get('token')
      if (token) {
        try {
          const decodedToken = jwtDecode(token) as DecodedToken
          const currentTime = Date.now() / 1000

          if (decodedToken.exp > currentTime) {
            // Token is valid and not expired
            router.push('/dashboard')
          } else {
            // Token has expired
            Cookies.remove('token')
            setIsLoading(false)
          }
        } catch (error) {
          console.error('Invalid token:', error)
          Cookies.remove('token')
          setIsLoading(false)
        }
      } else {
        setIsLoading(false)
      }
    }

    validateToken()
  }, [router])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Login />
    </div>
  )
}

