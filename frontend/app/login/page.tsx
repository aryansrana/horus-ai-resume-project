'use server';
import { redirect } from 'next/navigation'
import { getEmailFromToken } from '@/utils/auth'
import { LoginForm } from '@/components/LoginForm'
import { Logo } from '@/components/Logo'

export default async function LoginPage() {
  const email = await getEmailFromToken()

  if (email) {
    redirect('/dashboard')
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <Logo className="mb-8" />
      <LoginForm />
    </div>
  )
}

