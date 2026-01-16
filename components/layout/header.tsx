import React from 'react'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'

interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  fixed?: boolean
  ref?: React.Ref<HTMLElement>
}

export const Header = ({
  className,
  fixed,
  children,
  ...props
}: HeaderProps) => {
  return (
    <header
      className={cn(
        'bg-[#0f172a] flex h-13 items-center gap-3 p-4 sm:gap-4 text-[#e2e8f0] w-full',
        fixed && 'header-fixed peer/header fixed z-50 rounded-md',
        'shadow-none transition-none',
        className
      )}
      {...props}
    >
      {/* Sidebar button trigger */}
      <SidebarTrigger
        variant="outline"
        className="scale-125 sm:scale-100 text-white border-blue-500 bg-blue-500"
      />

      {/* Vertical line separator */}
      <Separator orientation="vertical" className="h-6 bg-white" />

      {/* Children area (title, nav, etc.) */}
      {children}
    </header>
  )
}

Header.displayName = 'Header'
