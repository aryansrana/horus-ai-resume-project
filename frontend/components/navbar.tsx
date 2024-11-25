'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"

export function NavigationBar() {
  const router = useRouter()

  const handleLogout = async () => {
    // TODO: Implement actual logout logic here
    // For example, call an API to invalidate the session
    console.log('Logging out...')
    
    // Redirect to login page after logout
    router.push('/login')
  }

  return (
    <nav className="bg-background border-b rounded-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              {
                //logo here if needed
              }
              <span className="text-2xl font-bold text-[#9c8679]">Horus Resume Analyzer</span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <NavLink href="/dashboard">Dashboard</NavLink>
              <NavLink href="/resumeUpload">Resume Upload</NavLink>
              <NavLink href="/jobDescription">Job Description</NavLink>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <Button
              className="hover:bg-[#8a7668] hover:text-white"
              onClick={handleLogout} variant="ghost">Logout
            </Button>
          </div>
          <div className="flex items-center sm:hidden">
            {/* Add a mobile menu button here if needed */}
          </div>
        </div>
      </div>
    </nav>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="inline-flex items-center px-1 pt-1 text-sm font-medium text-primary hover:text-primary/80">
      {children}
    </Link>
  )
}

