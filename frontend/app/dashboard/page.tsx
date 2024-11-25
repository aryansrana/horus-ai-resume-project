'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { jwtDecode } from "jwt-decode"
import Cookies from 'js-cookie'

import { Dashboard } from "@/components/dashboard"
import { NavigationBar } from "@/components/navbar"

interface DecodedToken {
  userId : string;
  email : string;
  username : string;
  exp: number;
}

export default function DashboardPage() {
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
    <div className="flex justify-center items-center min-h-screen">
      <div className="items-center justify-center min-h-screen fixed top-7">
        <NavigationBar />
      </div>
      <Dashboard />
    </div>
  )
}