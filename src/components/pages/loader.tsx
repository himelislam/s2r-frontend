import { Loader2 } from 'lucide-react'

interface LoaderProps {
  size?: number
  className?: string
}

export function Loader({ size = 24, className = "" }: LoaderProps) {
  return (
    <div className="w-full h-screen bg-background flex items-center justify-center">
    <Loader2 
      className={`animate-spin text-primary ${className}`}
      size={size}
      aria-label="Loading"
    />
    </div>
  )
}

