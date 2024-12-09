import Image from 'next/image'
import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
}

export function Logo({ className }: LogoProps) {
  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <Image
        src="/images/horus.png"
        alt="Resume Analyzer Logo"
        width={40}
        height={40}
        className="rounded-md"
      />
      <span className="font-bold text-xl">Resume Analyzer</span>
    </div>
  )
}

