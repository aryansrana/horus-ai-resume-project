'use client'

import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { /*RegisterProps,*/ RegisterFormData } from "@/app/types/auth"

export function Register({}/*: RegisterProps*/) {
  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    username: '',
    password: '',
  })
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string>('')
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name === 'confirmPassword') {
      setConfirmPassword(value)
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    try {
      const response = await axios.post('http://localhost:8080/api/register', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (response.status === 201) {
        router.push('/login')
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.error || 'Failed to register. Please try again.')
      } else {
        setError('An unexpected error occurred. Please try again.')
      }
      console.error('Registration error:', err)
    }
  }

  return (
    <Card className="w-full max-w-[90%] sm:max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl sm:text-3xl md:text-4xl font-bold text-center">Register</CardTitle>
        <CardDescription className="text-center text-sm sm:text-base">Create a new account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm sm:text-base">Email</Label>
            <Input 
              id="email" 
              name="email" 
              type="email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
              className="w-full px-3 py-2 text-sm sm:text-base"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm sm:text-base">Username</Label>
            <Input 
              id="username" 
              name="username" 
              value={formData.username} 
              onChange={handleChange} 
              required 
              className="w-full px-3 py-2 text-sm sm:text-base"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm sm:text-base">Password</Label>
            <Input 
              id="password" 
              name="password" 
              type="password" 
              value={formData.password} 
              onChange={handleChange} 
              required 
              className="w-full px-3 py-2 text-sm sm:text-base"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm sm:text-base">Confirm Password</Label>
            <Input 
              id="confirmPassword" 
              name="confirmPassword" 
              type="password" 
              value={confirmPassword} 
              onChange={handleChange} 
              required 
              className="w-full px-3 py-2 text-sm sm:text-base"
            />
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Button type="submit" className="w-full text-sm sm:text-base py-2 sm:py-3">Register</Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-xs sm:text-sm text-muted-foreground">
          Already have an account? {' '}
          <Link href="/login" className="text-primary hover:underline">
            Login
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}

