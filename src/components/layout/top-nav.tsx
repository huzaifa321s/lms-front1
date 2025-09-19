
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
              className="rounded-[8px] border-[#e2e8f0] bg-[#ffffff] text-[#64748b] shadow-[0_4px_6px_rgba(0,0,0,0.05)] transition-all duration-300 hover:bg-[#f1f5f9] hover:border-[#cbd5e1] hover:scale-[1.02] hover:shadow-[0_6px_12px_rgba(0,0,0,0.1)]"
            >
              <IconMenu />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side='bottom'
            align='start'
            className="w-56 rounded-[8px] bg-[#ffffff] border border-[#e2e8f0] shadow-[0_4px_6px_rgba(0,0,0,0.05)] p-2 font-['Segoe_UI',_Tahoma,_Geneva,_Verdana,_sans-serif]"
          >
            {links.map(({ title, href, isActive, disabled }) => (
              <DropdownMenuItem
                key={`${title}-${href}`}
                asChild
                className={cn(
                  'rounded-[8px] transition-all duration-200',
                  isActive
                    ? 'text-[#1d4ed8] bg-[#2563eb]/10'
                    : 'text-[#64748b] hover:bg-[#2563eb]/10 hover:text-[#1d4ed8]',
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
              'text-sm font-medium transition-all duration-200 rounded-[8px] px-3 py-2',
              isActive
                ? 'text-[#1d4ed8] bg-[#2563eb]/10'
                : 'text-[#64748b] hover:bg-[#2563eb]/10 hover:text-[#1d4ed8]',
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
