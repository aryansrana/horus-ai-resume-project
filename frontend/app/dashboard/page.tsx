'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    console.log('Token in dashboard:', token)
    if (!token) {
      console.log('No token found, redirecting to login')
      router.push('/login')
    } else {
      console.log('Token found, loading dashboard')
      setIsLoading(false)
    }
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

