import { redirect } from 'next/navigation'
import { getEmailFromToken } from '@/utils/auth'
import Dashboard from '@/components/Dashboard'

export default async function DashboardPage() {
  const email = await getEmailFromToken()

  if (!email) {
    console.error("Not logged in.")
    redirect('/login')
  }

  return <Dashboard initialEmail={email} />
}

