import { Link, useLocation } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
  SidebarSeparator
} from '@/components/ui/sidebar'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { useDispatch } from 'react-redux'




export function NavGroup({ title, items }) {
  const { state, isMobile } = useSidebar()
  const href = useLocation({ select: (location) => location.href })
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const key = `${item.title}-${item.url}`
          if (!item.items)
            return <SidebarMenuLink key={key} item={item} href={href}/>

          if (state === 'collapsed' && !isMobile)
            return (
              <SidebarMenuCollapsedDropdown key={key} item={item} href={href} />
            )

          return <SidebarMenuCollapsible key={key} item={item} href={href} />
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}


// Enhanced Badge Component with subtle animations
const NavBadge = ({ children }) => (
  <span className="ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-r from-chart-1/20 to-chart-2/20 px-2 text-xs font-medium text-sidebar-foreground/80 transition-all duration-200 group-hover:from-chart-1/30 group-hover:to-chart-2/30 group-hover:scale-105">
    {children}
  </span>
)

// Background Chart Pattern Component
const BackgroundChart = ({ variant = "bars" }) => {
  const patterns = {
    bars: (
      <svg className="absolute inset-0 h-full w-full opacity-5" viewBox="0 0 100 20">
        <rect x="10" y="12" width="3" height="8" fill="currentColor" />
        <rect x="20" y="8" width="3" height="12" fill="currentColor" />
        <rect x="30" y="14" width="3" height="6" fill="currentColor" />
        <rect x="40" y="6" width="3" height="14" fill="currentColor" />
        <rect x="50" y="10" width="3" height="10" fill="currentColor" />
        <rect x="60" y="13" width="3" height="7" fill="currentColor" />
        <rect x="70" y="9" width="3" height="11" fill="currentColor" />
        <rect x="80" y="11" width="3" height="9" fill="currentColor" />
      </svg>
    ),
    lines: (
      <svg className="absolute inset-0 h-full w-full opacity-5" viewBox="0 0 100 20">
        <path d="M10,15 Q20,8 30,12 T50,10 T70,14 T90,9" stroke="currentColor" strokeWidth="1.5" fill="none" />
      </svg>
    ),
    dots: (
      <svg className="absolute inset-0 h-full w-full opacity-5" viewBox="0 0 100 20">
        <circle cx="15" cy="12" r="1" fill="currentColor" />
        <circle cx="25" cy="8" r="1.5" fill="currentColor" />
        <circle cx="35" cy="14" r="1" fill="currentColor" />
        <circle cx="45" cy="10" r="1.5" fill="currentColor" />
        <circle cx="55" cy="13" r="1" fill="currentColor" />
        <circle cx="65" cy="9" r="1.5" fill="currentColor" />
        <circle cx="75" cy="11" r="1" fill="currentColor" />
        <circle cx="85" cy="15" r="1.5" fill="currentColor" />
      </svg>
    ),
  }

  return patterns[variant]
}

// Enhanced Link Component with reduced height
const SidebarMenuLink = ({ item, href }) => {
  const { setOpenMobile } = useSidebar()

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={checkIsActive(href, item)}
        tooltip={item.title}
        className="group relative h-10 overflow-hidden text-sm transition-all duration-300 hover:bg-gradient-to-r hover:from-sidebar-accent hover:to-sidebar-accent/80 hover:text-sidebar-accent-foreground hover:shadow-sm hover:scale-[1.02] active:scale-[0.98]"
      >
        <Link to={item.url} replace={true} onClick={() => setOpenMobile(false)}>
          <BackgroundChart variant="bars" />
          <div className="relative z-10 flex items-center gap-3">
            {item.icon && (
              <item.icon className="h-4 w-4 transition-all duration-200 group-hover:scale-110 group-hover:text-chart-1" />
            )}
            
            <span className="font-medium transition-all duration-200 group-hover:translate-x-0.5">{item.title}</span>
            {item.badge && <NavBadge>{item.badge}</NavBadge>}
          </div>
          
        </Link>
        
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

// Enhanced Collapsible Component with reduced height
const SidebarMenuCollapsible = ({ item, href }) => {
  const { setOpenMobile } = useSidebar()
  const dispatch = useDispatch()

  return (
    <>
       <SidebarSeparator className="bg-blue-500"/>
  
    <Collapsible asChild defaultOpen={checkIsActive(href, item, true)} className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            className={`${item.className || ""} group relative h-11 overflow-hidden text-sm transition-all duration-300 hover:bg-gradient-to-r hover:from-sidebar-accent hover:to-sidebar-accent/80 hover:text-sidebar-accent-foreground hover:shadow-sm hover:scale-[1.02] active:scale-[0.98]`}
            tooltip={item.title}
          >
            <BackgroundChart variant="lines" />
            <div className="relative z-10 flex items-center gap-3 w-full">
              {item.icon && (
                <item.icon className="h-4 w-4 transition-all duration-200 group-hover:scale-110 group-hover:text-chart-2" />
              )}
              <span className="font-medium transition-all duration-200 group-hover:translate-x-0.5">{item.title}</span>
              {item.badge && <NavBadge>{item.badge}</NavBadge>}
              <ChevronRight className="ml-auto h-4 w-4 transition-all duration-300 group-data-[state=open]/collapsible:rotate-90 group-hover:scale-110" />
            </div>
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent className="CollapsibleContent">
          <SidebarMenuSub>
            {item.items.map((subItem) => (
              <SidebarMenuSubItem key={subItem.title}>
                <SidebarMenuSubButton
                  asChild
                  isActive={checkIsActive(href, subItem)}
                  className="group relative h-8 overflow-hidden text-sm transition-all duration-300 hover:bg-gradient-to-r hover:from-sidebar-accent/50 hover:to-sidebar-accent/30 hover:text-sidebar-accent-foreground hover:translate-x-1 hover:shadow-sm"
                >
                  <Link to={subItem.url} onClick={() => setOpenMobile(false)}>
                    <BackgroundChart variant="dots" />
                    <div className="relative z-10 flex items-center gap-2">
                      {subItem.icon && (
                        <subItem.icon className="h-3.5 w-3.5 transition-all duration-200 group-hover:scale-110 group-hover:text-chart-3" />
                      )}
                      <span className="transition-all duration-200 group-hover:translate-x-0.5">{subItem.title}</span>
                      {subItem.badge && <NavBadge>{subItem.badge}</NavBadge>}
                    </div>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
      </>
  )
}

// Enhanced Dropdown Component with reduced height
const SidebarMenuCollapsedDropdown = ({ item, href }) => {
  return (
    <SidebarMenuItem>
      <DropdownMenu>
   
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            tooltip={item.title}
            isActive={checkIsActive(href, item)}
            className="group relative h-10 overflow-hidden text-sm transition-all duration-300 hover:bg-gradient-to-r hover:from-sidebar-accent hover:to-sidebar-accent/80 hover:text-sidebar-accent-foreground hover:shadow-sm hover:scale-[1.02] active:scale-[0.98]"
          >
            <BackgroundChart variant="bars" />
            <div className="relative z-10 flex items-center gap-3 w-full">
              {item.icon && (
                <item.icon className="h-4 w-4 transition-all duration-200 group-hover:scale-110 group-hover:text-chart-4" />
              )}
              <span className="font-medium transition-all duration-200 group-hover:translate-x-0.5">{item.title}</span>
              {item.badge && <NavBadge>{item.badge}</NavBadge>}
              <ChevronRight className="ml-auto h-4 w-4 transition-all duration-300 group-data-[state=open]/collapsible:rotate-90 group-hover:scale-110" />
            </div>
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="right"
          align="start"
          sideOffset={4}
          className="min-w-56 bg-gradient-to-br from-sidebar to-sidebar/95 backdrop-blur-sm border-sidebar-border/50 shadow-xl"
        >
          <DropdownMenuLabel className="text-sm font-semibold text-sidebar-foreground/90 px-3 py-2">
            {item.title} {item.badge ? `(${item.badge})` : ""}
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-sidebar-border/30" />
          {item.items.map((sub) => (
            <DropdownMenuItem
              key={`${sub.title}-${sub.url}`}
              asChild
              className="group relative overflow-hidden text-sm transition-all duration-300 hover:bg-gradient-to-r hover:from-sidebar-accent/50 hover:to-sidebar-accent/30 hover:text-sidebar-accent-foreground focus:bg-gradient-to-r focus:from-sidebar-accent/50 focus:to-sidebar-accent/30"
            >
              <Link
                to={sub.url}
                className={`${checkIsActive(href, sub) ? "bg-gradient-to-r from-sidebar-accent/30 to-sidebar-accent/20" : ""} flex items-center gap-3 px-3 py-2 transition-all duration-200 hover:translate-x-1`}
              >
                <BackgroundChart variant="dots" />
                <div className="relative z-10 flex items-center gap-2 w-full">
                  {sub.icon && (
                    <sub.icon className="h-3.5 w-3.5 transition-all duration-200 group-hover:scale-110 group-hover:text-chart-5" />
                  )}
                  <span className="max-w-48 text-wrap transition-all duration-200 group-hover:translate-x-0.5">
                    {sub.title}
                  </span>
                  {sub.badge && (
                    <span className="ml-auto text-xs bg-gradient-to-r from-chart-1/20 to-chart-2/20 px-2 py-0.5 rounded-full transition-all duration-200 group-hover:from-chart-1/30 group-hover:to-chart-2/30">
                      {sub.badge}
                    </span>
                  )}
                </div>
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  )
}



function checkIsActive(href, item, mainNav = false) {
  return (
    href === item.url || // /endpint?search=param
    href.split('?')[0] === item.url || // endpoint
    !!item?.items?.filter((i) => i.url === href).length || // if child nav is active
    (mainNav &&
      href.split('/')[1] !== '' &&
      href.split('/')[1] === item?.url?.split('/')[1])
  )
}
