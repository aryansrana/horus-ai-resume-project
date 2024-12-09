import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { removeTokenCookie } from '@/utils/auth'
import { Logo } from '@/components/Logo'

interface NavbarProps {
  email: string
}

export default function Navbar({ email }: NavbarProps) {
  const router = useRouter()

  const handleSignOut = async () => {
    await removeTokenCookie()
    router.push('/login')
  }

  return (
    <nav className="bg-primary text-primary-foreground p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Logo />
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <Link href="/dashboard" className="hover:underline">
            Dashboard
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <span>{email}</span>
          <Button variant="secondary" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>
      </div>
    </nav>
  )
}

