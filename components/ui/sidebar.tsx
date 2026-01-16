import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { VariantProps, cva } from 'class-variance-authority'
import { PanelLeftIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useIsMobile } from '@/hooks/use-mobile'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

// --- Constants ---
const SIDEBAR_COOKIE_NAME = 'sidebar_state'
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEBAR_WIDTH = '16rem'
const SIDEBAR_WIDTH_MOBILE = '12rem'
const SIDEBAR_WIDTH_ICON = '3rem'
const SIDEBAR_KEYBOARD_SHORTCUT = 'b'

// --- Context and Hooks ---

type SidebarContextProps = {
  state: 'expanded' | 'collapsed'
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}

const SidebarContext = React.createContext<SidebarContextProps | null>(null)

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider.')
  }
  return context
}

// Helper function to read the initial state from cookie
function getInitialSidebarState(defaultOpen: boolean) {
  if (typeof window === 'undefined') return defaultOpen

  const cookies = document.cookie.split('; ')
  const stateCookie = cookies.find((row) => row.startsWith(SIDEBAR_COOKIE_NAME))
  if (stateCookie) {
    return stateCookie.split('=')[1] === 'true'
  }
  return defaultOpen
}

function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  className,
  style,
  children,
  ...props
}: React.ComponentProps<'div'> & {
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const initialOpenState = getInitialSidebarState(defaultOpen)
  const isMobile = useIsMobile()
  const [openMobile, setOpenMobile] = React.useState(false)

  const [_open, _setOpen] = React.useState(initialOpenState)
  const open = openProp ?? _open
  const setOpen = React.useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === 'function' ? value(open) : value
      if (setOpenProp) {
        setOpenProp(openState)
      } else {
        _setOpen(openState)
      }

      // Set cookie to persist state
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
    },
    [setOpenProp, open]
  )

  const toggleSidebar = React.useCallback(() => {
    return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open)
  }, [isMobile, setOpen, setOpenMobile])

  // Keyboard shortcut effect (Ctrl/Meta + B)
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
        (event.metaKey || event.ctrlKey) &&
        !event.altKey &&
        !event.shiftKey
      ) {
        // Prevent default browser action (e.g., bookmark in some browsers)
        event.preventDefault()
        toggleSidebar()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [toggleSidebar])

  const state = open ? 'expanded' : 'collapsed'

  const contextValue = React.useMemo<SidebarContextProps>(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
    }),
    [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
  )

  return (
    <SidebarContext.Provider value={contextValue}>
      <TooltipProvider delayDuration={0}>
        <div
          data-slot='sidebar-wrapper'
          style={
            {
              '--sidebar-width': SIDEBAR_WIDTH,
              '--sidebar-width-icon': SIDEBAR_WIDTH_ICON,
              '--sidebar-width-mobile': SIDEBAR_WIDTH_MOBILE,
              ...style,
            } as React.CSSProperties
          }
          className={cn(
            // Dark background for inset variant wrapper
            'group/sidebar-wrapper has-data-[variant=inset]:bg-gradient-to-b has-data-[variant=inset]:from-[#1e293b] has-data-[variant=inset]:to-[#0f172a] flex min-h-svh w-full',
            className
          )}
          {...props}
        >
          {children}
        </div>
      </TooltipProvider>
    </SidebarContext.Provider>
  )
}
SidebarProvider.displayName = 'SidebarProvider'

// --- Sidebar Component (The Layout) ---

function Sidebar({
  side = 'left',
  variant = 'sidebar',
  collapsible = 'offcanvas',
  className,
  children,
  ...props
}: React.ComponentProps<'div'> & {
  side?: 'left' | 'right'
  variant?: 'sidebar' | 'floating' | 'inset'
  collapsible?: 'offcanvas' | 'icon' | 'none'
}) {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar()

  // 1. Non-Collapsible Sidebar (Always expanded, no mobile handling)
  if (collapsible === 'none') {
    return (
      <div
        data-slot='sidebar'
        data-variant={variant}
        data-collapsible='none'
        className={cn(
          // Base styles for non-collapsible, dark theme
          'bg-gradient-to-b from-[#1e293b] to-[#0f172a] text-[#e2e8f0] border-r border-[#475569] shadow-[0_4px_12px_rgba(0,0,0,0.2)]',
          'flex h-full w-[var(--sidebar-width)] flex-col',
          // Variant-specific styles
          variant === 'floating' &&
            'rounded-[12px] m-2 shadow-[0_6px_16px_rgba(0,0,0,0.2)]',
          variant === 'inset' && 'm-2 rounded-[12px] border', // Added border for inset non-collapsible
          'hover:shadow-[0_8px_20px_rgba(0,0,0,0.3)] transition-shadow duration-300',
          className
        )}
        style={
          {
            '--sidebar-width': SIDEBAR_WIDTH,
          } as React.CSSProperties
        }
        {...props}
      >
        <div className='flex flex-col h-full'>{children}</div>
      </div>
    )
  }

  // 2. Mobile Sidebar (Sheet)
  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
        <SheetContent
          data-sidebar='sidebar'
          data-slot='sidebar'
          data-mobile='true'
          // Sheet content takes full height but is hidden on desktop by isMobile check
          className={cn(
            'bg-gradient-to-b from-[#1e293b] to-[#0f172a] text-[#e2e8f0] w-[var(--sidebar-width)] p-0 [&>button]:hidden',
            'border border-[#475569] shadow-[0_4px_12px_rgba(0,0,0,0.2)] rounded-t-[12px]', // Enhanced styling
            className
          )}
          style={
            {
              '--sidebar-width': SIDEBAR_WIDTH_MOBILE,
            } as React.CSSProperties
          }
          side={side}
        >
          <SheetHeader className='sr-only'>
            <SheetTitle>Sidebar</SheetTitle>
            <SheetDescription>Displays the mobile sidebar.</SheetDescription>
          </SheetHeader>
          <div className='flex flex-col h-full'>{children}</div>
        </SheetContent>
      </Sheet>
    )
  }

  // 3. Desktop Collapsible Sidebar (The main wrapper)
  return (
    <div
      className='group peer text-[#e2e8f0] hidden md:block'
      data-state={state}
      data-collapsible={state === 'collapsed' ? collapsible : ''}
      data-variant={variant}
      data-side={side}
      data-slot='sidebar'
    >
      {/* Sidebar Gap (Pusher for the main content) */}
      <div
        data-slot='sidebar-gap'
        className={cn(
          'relative bg-transparent transition-[width] duration-200 ease-linear',
          'w-[var(--sidebar-width)]',
          // Collapse logic
          'group-data-[collapsible=offcanvas]:w-0',
          variant === 'floating' || variant === 'inset'
            ? 'group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+2rem)]' // Padding + width
            : 'group-data-[collapsible=icon]:w-[var(--sidebar-width-icon)]',
          // Side handling (for gap animation direction - not strictly necessary but good for completeness)
          'group-data-[side=right]:rotate-180'
        )}
        style={
          {
            '--sidebar-width': SIDEBAR_WIDTH,
            '--sidebar-width-icon': SIDEBAR_WIDTH_ICON,
          } as React.CSSProperties
        }
      />

      {/* Sidebar Container (The actual fixed sidebar) */}
      <div
        data-slot='sidebar-container'
        className={cn(
          'fixed inset-y-0 z-10 hidden h-svh transition-[left,right,width] duration-200 ease-linear md:flex',
          'w-[var(--sidebar-width)]',
          // Side position and offcanvas transition
          side === 'left'
            ? 'left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]'
            : 'right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]',
          // Icon collapse width + padding for floating/inset
          variant === 'floating' || variant === 'inset'
            ? 'p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+2rem+2px)]' // 2px for border
            : 'group-data-[collapsible=icon]:w-[var(--sidebar-width-icon)]',
          // Base styling
          'border-[#475569] bg-gradient-to-b from-[#1e293b] to-[#0f172a] shadow-[0_4px_12px_rgba(0,0,0,0.2)]',
          'hover:shadow-[0_8px_20px_rgba(0,0,0,0.3)] transition-shadow duration-300',
          className
        )}
        style={
          {
            '--sidebar-width': SIDEBAR_WIDTH,
            '--sidebar-width-icon': SIDEBAR_WIDTH_ICON,
          } as React.CSSProperties
        }
        {...props}
      >
        <div
          data-sidebar='sidebar'
          data-slot='sidebar-inner'
          className={cn(
            'flex h-full w-full flex-col',
            // Variant-specific inner container styles
            'group-data-[variant=floating]:rounded-[12px] group-data-[variant=floating]:border group-data-[variant=floating]:border-[#475569] group-data-[variant=floating]:shadow-[0_4px_12px_rgba(0,0,0,0.2)]',
            'group-data-[variant=inset]:bg-transparent'
          )}
        >
          <div className='flex flex-col h-full'>{children}</div>
        </div>
      </div>
    </div>
  )
}
Sidebar.displayName = 'Sidebar'

// --- Accessory Components ---

const SidebarTrigger = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentProps<typeof Button>
>(({ className, onClick, ...props }, ref) => {
  const { toggleSidebar } = useSidebar()

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          ref={ref}
          data-sidebar='trigger'
          data-slot='sidebar-trigger'
          variant='ghost'
          size='icon'
          className={cn(
            'size-7 text-[#e2e8f0] hover:bg-[#2563eb]/20 hover:text-[#bfdbfe] rounded-[8px]',
            className
          )}
          onClick={(event) => {
            onClick?.(event)
            toggleSidebar()
          }}
          {...props}
        >
          <PanelLeftIcon className='size-4' /> {/* Set size explicitly */}
          <span className='sr-only'>Toggle Sidebar</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent
        className='bg-[#2d3748] text-[#e2e8f0] border-[#475569] shadow-[0_4px_12px_rgba(0,0,0,0.2)]'
        side='bottom'
        align='center'
      >
        Toggle Sidebar (<kbd>Cmd</kbd>+<kbd>B</kbd>)
      </TooltipContent>
    </Tooltip>
  )
})
SidebarTrigger.displayName = 'SidebarTrigger'

const SidebarRail = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<'button'>
>(({ className, ...props }, ref) => {
  const { toggleSidebar } = useSidebar()

  return (
    <button
      ref={ref}
      data-sidebar='rail'
      data-slot='sidebar-rail'
      aria-label='Toggle Sidebar'
      tabIndex={-1}
      onClick={toggleSidebar}
      title='Toggle Sidebar (Cmd+B)'
      className={cn(
        // Base styles for the invisible rail area
        'absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear sm:flex',
        // Cursor changes based on side and state
        'group-data-[side=left]:-right-4 group-data-[side=right]:left-0',
        'group-data-[state=expanded]:group-data-[side=left]:cursor-w-resize group-data-[state=expanded]:group-data-[side=right]:cursor-e-resize',
        'group-data-[state=collapsed]:group-data-[side=left]:cursor-e-resize group-data-[state=collapsed]:group-data-[side=right]:cursor-w-resize',
        // Visible line/rail styling
        'after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] after:transition-colors',
        'hover:after:bg-[#475569]',
        // Offcanvas-specific adjustments
        'group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full',
        'group-data-[collapsible=offcanvas]:hover:bg-[#1e293b]/20',
        // Rail position for offcanvas mode
        '[[data-side=left][data-collapsible=offcanvas]_&]:-right-2',
        '[[data-side=right][data-collapsible=offcanvas]_&]:-left-1',
        className
      )}
      {...props}
    />
  )
})
SidebarRail.displayName = 'SidebarRail'

const SidebarInset = React.forwardRef<
  HTMLElement,
  React.ComponentProps<'main'>
>(({ className, ...props }, ref) => {
  return (
    <main
      ref={ref}
      data-slot='sidebar-inset'
      className={cn(
        'bg-gradient-to-b from-[#1e293b] to-[#0f172a] relative flex w-full flex-1 flex-col overflow-auto',
        // Responsive/Peer styles based on Sidebar state and variant
        'md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-[12px] md:peer-data-[variant=inset]:shadow-[0_4px_12px_rgba(0,0,0,0.2)] md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2',
        className
      )}
      {...props}
    />
  )
})
SidebarInset.displayName = 'SidebarInset'

const SidebarInput = React.forwardRef<
  React.ElementRef<typeof Input>,
  React.ComponentProps<typeof Input>
>(({ className, ...props }, ref) => {
  return (
    <Input
      ref={ref}
      data-slot='sidebar-input'
      data-sidebar='input'
      className={cn(
        'bg-[#2d3748] h-8 w-full shadow-none border-[#475569] rounded-[8px] text-[#e2e8f0] focus:ring-[#2563eb] focus:ring-2 placeholder:text-[#94a3b8]',
        className
      )}
      {...props}
    />
  )
})
SidebarInput.displayName = 'SidebarInput'

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-slot='sidebar-header'
      data-sidebar='header'
      className={cn('flex flex-col gap-2 p-2', className)}
      {...props}
    />
  )
})
SidebarHeader.displayName = 'SidebarHeader'

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-slot='sidebar-footer'
      data-sidebar='footer'
      className={cn(
        'flex flex-col gap-2 p-2 border-t border-[#475569]/50',
        className
      )}
      {...props}
    />
  )
})
SidebarFooter.displayName = 'SidebarFooter'

const SidebarSeparator = React.forwardRef<
  React.ElementRef<typeof Separator>,
  React.ComponentProps<typeof Separator>
>(({ className, ...props }, ref) => {
  return (
    <Separator
      ref={ref}
      data-slot='sidebar-separator'
      data-sidebar='separator'
      className={cn('bg-[#475569] mx-2 w-auto', className)}
      {...props}
    />
  )
})
SidebarSeparator.displayName = 'SidebarSeparator'

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-slot='sidebar-content'
      data-sidebar='content'
      className={cn(
        // Allow scrolling, but hide overflow when collapsed to icon (to prevent content bleed)
        'flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto overflow-x-hidden group-data-[collapsible=icon]:overflow-hidden',
        className
      )}
      {...props}
    />
  )
})
SidebarContent.displayName = 'SidebarContent'

// --- Grouping Components ---

const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-slot='sidebar-group'
      data-sidebar='group'
      className={cn('relative flex w-full min-w-0 flex-col p-2', className)}
      {...props}
    />
  )
})
SidebarGroup.displayName = 'SidebarGroup'

const SidebarGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'div'

  return (
    <Comp
      ref={ref}
      data-slot='sidebar-group-label'
      data-sidebar='group-label'
      className={cn(
        'text-[#e2e8f0] ring-[#2563eb] flex h-8 shrink-0 items-center rounded-[8px] px-2 text-xs font-medium outline-hidden transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0',
        // Transition for icon mode collapse
        'group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0',
        className
      )}
      {...props}
    />
  )
})
SidebarGroupLabel.displayName = 'SidebarGroupLabel'

const SidebarGroupAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<'button'> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      ref={ref}
      data-slot='sidebar-group-action'
      data-sidebar='group-action'
      className={cn(
        'text-[#e2e8f0] ring-[#2563eb] hover:bg-[#2563eb]/20 hover:text-[#bfdbfe] absolute top-3.5 right-3 flex aspect-square w-5 items-center justify-center rounded-[8px] p-0 outline-hidden transition-transform focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0',
        'after:absolute after:-inset-2 md:after:hidden', // Increased hit area
        'group-data-[collapsible=icon]:hidden', // Hide when collapsed to icon
        className
      )}
      {...props}
    />
  )
})
SidebarGroupAction.displayName = 'SidebarGroupAction'

const SidebarGroupContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-slot='sidebar-group-content'
      data-sidebar='group-content'
      className={cn('w-full text-sm text-[#e2e8f0]', className)}
      {...props}
    />
  )
})
SidebarGroupContent.displayName = 'SidebarGroupContent'

// --- Menu Components ---

const SidebarMenu = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<'ul'>
>(({ className, ...props }, ref) => {
  return (
    <ul
      ref={ref}
      data-slot='sidebar-menu'
      data-sidebar='menu'
      className={cn('flex w-full min-w-0 flex-col gap-1', className)}
      {...props}
    />
  )
})
SidebarMenu.displayName = 'SidebarMenu'

const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<'li'>
>(({ className, ...props }, ref) => {
  return (
    <li
      ref={ref}
      data-slot='sidebar-menu-item'
      data-sidebar='menu-item'
      className={cn('group/menu-item relative', className)}
      {...props}
    />
  )
})
SidebarMenuItem.displayName = 'SidebarMenuItem'

const sidebarMenuButtonVariants = cva(
  'peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-[8px] p-2 text-left text-sm outline-hidden ring-[#2563eb] transition-[width,height,padding] focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'hover:bg-[#2563eb]/20 hover:text-[#bfdbfe] active:bg-[#2563eb]/30 active:text-[#bfdbfe]',
        outline:
          'bg-[#2d3748] shadow-[0_0_0_1px_#475569] hover:bg-[#2563eb]/20 hover:text-[#bfdbfe] hover:shadow-[0_0_0_1px_#2563eb] active:bg-[#2563eb]/30 active:text-[#bfdbfe]',
      },
      size: {
        default: 'h-8 text-sm',
        sm: 'h-7 text-xs',
        lg: 'h-10 text-base group-data-[collapsible=icon]:p-0!',
      },
      isActive: {
        true: 'bg-[#2563eb]/20 font-medium text-[#bfdbfe]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      isActive: false,
    },
  }
)

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<'button'> & {
    asChild?: boolean
    isActive?: boolean
    tooltip?: string | React.ComponentProps<typeof TooltipContent>
  } & VariantProps<typeof sidebarMenuButtonVariants>
>(
  (
    {
      asChild = false,
      isActive = false,
      variant = 'default',
      size = 'default',
      tooltip,
      className,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button'
    const { isMobile, state } = useSidebar()

    const button = (
      <Comp
        ref={ref}
        data-slot='sidebar-menu-button'
        data-sidebar='menu-button'
        data-size={size}
        data-active={isActive}
        // Apply conditional active style via className if not handled by cva
        className={cn(
          sidebarMenuButtonVariants({ variant, size, isActive }),
          'text-[#e2e8f0] group-has-data-[sidebar=menu-action]/menu-item:pr-8', // Adjust padding if action exists
          'group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2!', // Icon mode styling
          className
        )}
        {...props}
      />
    )

    // Use Tooltip only if a tooltip prop is provided and is applicable
    const shouldShowTooltip = !!tooltip && state === 'collapsed' && !isMobile

    if (!shouldShowTooltip) {
      return button
    }

    let tooltipProps: React.ComponentProps<typeof TooltipContent> = {
      children: typeof tooltip === 'string' ? tooltip : undefined,
      ...(typeof tooltip === 'object' ? tooltip : {}),
    }

    return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent
          side='right'
          align='center'
          // Styling for the dark tooltip
          className='bg-[#2d3748] text-[#e2e8f0] border-[#475569] shadow-[0_4px_12px_rgba(0,0,0,0.2)]'
          {...tooltipProps}
        />
      </Tooltip>
    )
  }
)
SidebarMenuButton.displayName = 'SidebarMenuButton'

const SidebarMenuAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<'button'> & {
    asChild?: boolean
    showOnHover?: boolean
  }
>(({ className, asChild = false, showOnHover = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      ref={ref}
      data-slot='sidebar-menu-action'
      data-sidebar='menu-action'
      className={cn(
        'text-[#e2e8f0] ring-[#2563eb] hover:bg-[#2563eb]/20 hover:text-[#bfdbfe] peer-hover/menu-button:text-[#bfdbfe] absolute right-1 flex aspect-square w-5 items-center justify-center rounded-[8px] p-0 outline-hidden transition-transform focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0',
        'after:absolute after:-inset-2 md:after:hidden', // Increased hit area
        // Vertical positioning based on size of peer button
        'peer-data-[size=sm]/menu-button:top-1',
        'peer-data-[size=default]/menu-button:top-1.5',
        'peer-data-[size=lg]/menu-button:top-2.5',
        'group-data-[collapsible=icon]:hidden',
        // Hover/Active visibility control
        showOnHover &&
          'peer-data-[active=true]/menu-button:text-[#bfdbfe] group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 md:opacity-0',
        className
      )}
      {...props}
    />
  )
})
SidebarMenuAction.displayName = 'SidebarMenuAction'

const SidebarMenuBadge = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-slot='sidebar-menu-badge'
      data-sidebar='menu-badge'
      className={cn(
        'text-[#e2e8f0] pointer-events-none absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-[8px] px-1 text-xs font-medium tabular-nums select-none bg-[#2d3748] border border-[#475569]',
        // Hover/Active styling
        'peer-hover/menu-button:text-[#bfdbfe] peer-data-[active=true]/menu-button:text-[#bfdbfe]',
        // Vertical positioning based on size of peer button
        'peer-data-[size=sm]/menu-button:top-1',
        'peer-data-[size=default]/menu-button:top-1.5',
        'peer-data-[size=lg]/menu-button:top-2.5',
        'group-data-[collapsible=icon]:hidden', // Hide when collapsed to icon
        className
      )}
      {...props}
    />
  )
})
SidebarMenuBadge.displayName = 'SidebarMenuBadge'

const SidebarMenuSkeleton = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & {
    showIcon?: boolean
  }
>(({ className, showIcon = false, ...props }, ref) => {
  const width = React.useMemo(() => {
    // Random width between 50% and 90%
    return `${Math.floor(Math.random() * 40) + 50}%`
  }, [])

  return (
    <div
      ref={ref}
      data-slot='sidebar-menu-skeleton'
      data-sidebar='menu-skeleton'
      className={cn(
        'flex h-8 items-center gap-2 rounded-[8px] px-2',
        className
      )}
      {...props}
    >
      {showIcon && (
        <Skeleton
          className='size-4 rounded-[4px] bg-[#475569]' // Adjusted rounded corner
          data-sidebar='menu-skeleton-icon'
        />
      )}
      <Skeleton
        className='h-4 max-w-[var(--skeleton-width)] flex-1 bg-[#475569] rounded-[4px]' // Adjusted rounded corner
        data-sidebar='menu-skeleton-text'
        style={
          {
            '--skeleton-width': width,
          } as React.CSSProperties
        }
      />
    </div>
  )
})
SidebarMenuSkeleton.displayName = 'SidebarMenuSkeleton'

// --- Sub-Menu Components ---

const SidebarMenuSub = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<'ul'>
>(({ className, ...props }, ref) => {
  return (
    <ul
      ref={ref}
      data-slot='sidebar-menu-sub'
      data-sidebar='menu-sub'
      className={cn(
        'border-[#475569] mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l px-2.5 py-0.5',
        'group-data-[collapsible=icon]:hidden', // Hide sub-menus entirely when collapsed
        className
      )}
      {...props}
    />
  )
})
SidebarMenuSub.displayName = 'SidebarMenuSub'

const SidebarMenuSubItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<'li'>
>(({ className, ...props }, ref) => {
  return (
    <li
      ref={ref}
      data-slot='sidebar-menu-sub-item'
      data-sidebar='menu-sub-item'
      className={cn('group/menu-sub-item relative', className)}
      {...props}
    />
  )
})
SidebarMenuSubItem.displayName = 'SidebarMenuSubItem'

const SidebarMenuSubButton = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentProps<'a'> & {
    asChild?: boolean
    size?: 'sm' | 'md'
    isActive?: boolean
  }
>(({ asChild = false, size = 'md', isActive = false, className, ...props }, ref) => {
  const Comp = asChild ? Slot : 'a'

  return (
    <Comp
      ref={ref}
      data-slot='sidebar-menu-sub-button'
      data-sidebar='menu-sub-button'
      data-size={size}
      data-active={isActive}
      className={cn(
        // Base styling
        'text-[#e2e8f0] ring-[#2563eb] active:bg-[#2563eb]/30 active:text-[#bfdbfe] [&>svg]:text-[#bfdbfe] flex min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-[8px] px-2 outline-hidden focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0',
        // Size variants
        size === 'sm' && 'h-6 text-xs',
        size === 'md' && 'h-7 text-sm',
        // Hover/Active states
        'hover:bg-[#2563eb]/20 hover:text-[#bfdbfe]',
        'data-[active=true]:bg-[#2563eb]/20 data-[active=true]:text-[#bfdbfe]',
        'group-data-[collapsible=icon]:hidden',
        className
      )}
      {...props}
    />
  )
})
SidebarMenuSubButton.displayName = 'SidebarMenuSubButton'

// --- Exports ---

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
}
