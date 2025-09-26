import { Link } from '@tanstack/react-router'
import { IconMenu } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface TopNavProps extends React.HTMLAttributes<HTMLElement> {
  links: {
    title: string
    href: string
    isActive: boolean
    disabled?: boolean
  }[]
}

export function TopNav({ className, links, ...props }: TopNavProps) {
  return (
    <>
      <div className='md:hidden'>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button
              size='icon'
              variant='outline'
              className="rounded-[8px] border-[#475569] bg-[#0f172a] text-[#e2e8f0] transition-all duration-300 hover:bg-[#2563eb]/20 hover:text-[#bfdbfe] hover:border-[#2563eb] hover:scale-[1.02] shadow-none"
            >
              <IconMenu />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side='bottom'
            align='start'
            className="w-56 rounded-[8px] bg-[#0f172a] border border-[#475569] p-2 shadow-none"
          >
            {links.map(({ title, href, isActive, disabled }) => (
              <DropdownMenuItem
                key={`${title}-${href}`}
                asChild
                className={cn(
                  'rounded-[8px] transition-all duration-200',
                  isActive
                    ? 'text-[#bfdbfe] bg-[#2563eb]/20'
                    : 'text-[#e2e8f0] hover:bg-[#2563eb]/20 hover:text-[#bfdbfe]',
                  disabled && 'opacity-50 cursor-not-allowed'
                )}
              >
                <Link to={href} disabled={disabled}>
                  {title}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <nav
        className={cn(
          'hidden items-center space-x-4 md:flex lg:space-x-6',
          className
        )}
        {...props}
      >
        {links.map(({ title, href, isActive, disabled }) => (
          <Link
            key={`${title}-${href}`}
            to={href}
            disabled={disabled}
            className={cn(
              'text-sm font-medium transition-all duration-200 rounded-[8px] px-2 py-1',
              isActive
                ? 'text-white bg-blue-500'
                : 'text-[#e2e8f0] hover:bg-blue-400 hover:text-[#bfdbfe]',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            {title}
          </Link>
        ))}
      </nav>
    </>
  )
}