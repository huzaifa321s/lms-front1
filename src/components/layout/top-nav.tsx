import { Link } from '@tanstack/react-router'
import { Menu } from 'lucide-react'
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
      {/* Mobile Menu */}
      <div className='md:hidden'>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button
              size='icon'
              variant='outline'
              className='border-[#475569] bg-[#0f172a] text-[#e2e8f0] shadow-none transition-all duration-300 hover:scale-[1.05] hover:border-[#2563eb] hover:bg-[#2563eb]/20 hover:text-[#bfdbfe]'
            >
              <Menu />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            side='bottom'
            align='start'
            className='w-56 rounded-[12px] border border-[#475569] bg-[#0f172a] p-2 shadow-lg'
          >
            {links.map(({ title, href, icon, isActive, disabled }, i) => {
              const Icon = icon

              return (
                <div key={`${title}-${href}`}>
                  <DropdownMenuItem
                    asChild
                    className={cn(
                      'cursor-pointer rounded-[8px] px-2 py-1 transition-all duration-200',
                      isActive
                        ? 'bg-[#2563eb]/30 text-[#bfdbfe]'
                        : 'text-[#e2e8f0] hover:bg-[#2563eb]/20 hover:text-[#bfdbfe]',
                      disabled && 'cursor-not-allowed opacity-50'
                    )}
                  >
                    <Link to={href} disabled={disabled} className="flex items-center">
                      <Icon className='h-5 w-5 text-white' /> {title}
                    </Link>
                  </DropdownMenuItem>
                </div>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Desktop Menu */}
      <nav
        className={cn(
          'hidden items-center space-x-4 md:flex lg:space-x-6',
          className
        )}
        {...props}
      >
        {links.map(({ title, href, icon, isActive, disabled }, i) => {
          const Icon = icon
          return (
            <div key={`${title}-${href}`}>
           <Link
  to={href}
  disabled={disabled}
  className={cn(
    'relative rounded-[8px] px-3 py-1.5 text-sm font-medium transition-all duration-300 flex items-center gap-2',
    'text-[#e2e8f0] hover:text-[#bfdbfe]',
    disabled && 'cursor-not-allowed opacity-50'
  )}
>
  {/* Icon with background highlight */}
  <span
    className={cn(
      'flex items-center justify-center rounded-md p-1 transition-colors duration-300',
      isActive
        ? 'bg-blue-600 text-white shadow-md'
        : 'hover:bg-blue-500/30 hover:text-[#bfdbfe]'
    )}
  >
    <Icon className="h-5 w-5" />
  </span>

  {/* Title */}
  <span className="z-10">{title}</span>

  {/* Active underline */}
  {isActive && (
    <span className="absolute bottom-0 left-0 h-[2px] w-full bg-blue-500" />
  )}
</Link>

            </div>
          )
        })}
      </nav>
    </>
  )
}
