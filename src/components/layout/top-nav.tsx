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
import { motion } from 'framer-motion'

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
      <div className="md:hidden">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <motion.div whileTap={{ scale: 0.95 }}>
              <Button
                size="icon"
                variant="outline"
                className="rounded-[8px] border-[#475569] bg-[#0f172a] text-[#e2e8f0] 
                  transition-all duration-300 hover:bg-[#2563eb]/20 hover:text-[#bfdbfe] 
                  hover:border-[#2563eb] hover:scale-[1.05] shadow-none"
              >
                <IconMenu />
              </Button>
            </motion.div>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            side="bottom"
            align="start"
            className="w-56 rounded-[12px] bg-[#0f172a] border border-[#475569] p-2 shadow-lg"
          >
            {links.map(({ title, href, isActive, disabled }, i) => (
              <motion.div
                key={`${title}-${href}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <DropdownMenuItem
                  asChild
                  className={cn(
                    'rounded-[8px] px-2 py-1 transition-all duration-200 cursor-pointer',
                    isActive
                      ? 'text-[#bfdbfe] bg-[#2563eb]/30'
                      : 'text-[#e2e8f0] hover:bg-[#2563eb]/20 hover:text-[#bfdbfe]',
                    disabled && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  <Link to={href} disabled={disabled}>
                    {title}
                  </Link>
                </DropdownMenuItem>
              </motion.div>
            ))}
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
        {links.map(({ title, href, isActive, disabled }, i) => (
          <motion.div
            key={`${title}-${href}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
          >
            <Link
              to={href}
              disabled={disabled}
              className={cn(
                'relative text-sm font-medium rounded-[8px] px-3 py-1.5 transition-all duration-300',
                isActive
                  ? 'text-white bg-blue-600 shadow-md'
                  : 'text-[#e2e8f0] hover:bg-blue-500/30 hover:text-[#bfdbfe]',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              {/* Magic UI style hover underline */}
              <span className="relative z-10">{title}</span>
              <motion.span
                layoutId="underline"
                className={cn(
                  'absolute left-0 bottom-0 h-[2px] w-full bg-blue-500',
                  !isActive && 'hidden'
                )}
              />
            </Link>
          </motion.div>
        ))}
      </nav>
    </>
  )
}
