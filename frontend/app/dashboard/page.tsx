"use server";
import { redirect } from 'next/navigation'
import { getEmailFromToken } from '@/utils/auth'
import Dashboard from '@/components/Dashboard'

export default async function DashboardPage() {
  const email = await getEmailFromToken()

  if (!email) {
    redirect('/login')
  }

  return <Dashboard initialEmail={email} />
}

