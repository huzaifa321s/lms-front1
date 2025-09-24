import { useActionState, useEffect, useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import {
  BadgeCheck,
  Bell,
  BookIcon,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Settings,
} from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuShortcut,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { getAdminCreds } from '../-utils/helpeFuntions'
import { LogoutModal } from '../../../../shared/components/LogoutModal'
import { handleLogout } from '../../../../shared/config/reducers/admin/adminAuthSlice'

export function NavUser({ user }) {
  const navigate = useNavigate()
  const { isMobile } = useSidebar()
  const [credentials, setCredentials] = useState(null)
  const [logoutModalCondition, setLogoutModalCondition] = useState(false)
  const dispatch = useDispatch()
  const [state, submitAction, isPending] = useActionState(() => {
    dispatch(handleLogout())
    toast.success('You have been logged out successfully.')
    return { success: true }
  })

  if (state?.success) {
    navigate({ to: '/admin/login' })
  }

  useEffect(() => {
    async function fetchCredentials() {
      try {
        const data = await getAdminCreds()
        setCredentials(data)
      } catch (err) {
        console.log('err', err)
      }
    }
    fetchCredentials()
  }, [])

  return (
    <>
      <LogoutModal
        modalCondition={logoutModalCondition}
        handleModalClose={setLogoutModalCondition}
        isLoading={isPending}
        logout={submitAction}
      />
    <SidebarMenu>
  <SidebarMenuItem>
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          size="lg"
          className="w-full rounded-[12px]   bg-[#ffffff] border border-[#e2e8f0] shadow-[0_4px_6px_rgba(0,0,0,0.05)] transition-all duration-300 hover:bg-[#f1f5f9] hover:border-[#cbd5e1] hover:scale-[1.02] hover:shadow-[0_6px_12px_rgba(0,0,0,0.1)] flex items-center"
        >
          <Avatar className="h-9 w-9 rounded-full">
            {/* <AvatarImage
              src={user?.avatar}
              alt={`${credentials?.firstName} ${credentials?.lastName}`}
            /> */}
            <AvatarFallback className="rounded-full bg-gradient-to-r from-[#2563eb]/20 to-[#1d4ed8]/20 font-semibold text-[#1e293b]">
              {credentials?.firstName?.charAt(0)?.toUpperCase()}
              {credentials?.lastName?.charAt(0)?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="ml-3 grid flex-1 text-left text-sm leading-tight text-[#1e293b]">
            <span className="truncate font-semibold">
              {credentials?.firstName} {credentials?.lastName}
            </span>
            <span className="truncate text-xs text-[#64748b]">
              {credentials?.email}
            </span>
          </div>
          <ChevronsUpDown className="ml-auto size-4 text-[#475569] transition-transform duration-200 group-hover:rotate-180" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="mt-2 min-w-56 rounded-[12px] border border-[#e2e8f0] bg-white/95 p-2 shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
        side={isMobile ? "bottom" : "right"}
        align="end"
        sideOffset={4}
      >
        {/* User Info */}
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-3 py-2 text-left">
            <Avatar className="h-9 w-9 rounded-full">
              {/* <AvatarImage
                src={user?.avatar}
                alt={credentials?.firstName}
              /> */}
              <AvatarFallback className="rounded-full bg-gradient-to-r from-[#2563eb]/20 to-[#1d4ed8]/20 font-semibold text-[#1e293b]">
                {credentials?.firstName?.charAt(0)?.toUpperCase()}
                {credentials?.lastName?.charAt(0)?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold text-[#1e293b]">
                {credentials?.firstName}
              </span>
              <span className="truncate text-xs text-[#64748b]">
                {credentials?.lastName}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="my-1 bg-[#e2e8f0]" />

        {/* Menu Items */}
        <DropdownMenuGroup>
          <DropdownMenuItem
            asChild
            className="rounded-[8px] font-medium text-[#1e293b] transition-all duration-200 hover:bg-[#2563eb]/10 hover:text-[#2563eb]"
          >
            <Link
              to="/admin/settings/profile"
              className="flex items-center gap-2 px-3 py-2"
            >
              <Settings size={16} className="text-[#2563eb]" />
              Profile
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem
            asChild
            className="rounded-[8px] font-medium text-[#1e293b] transition-all duration-200 hover:bg-[#2563eb]/10 hover:text-[#2563eb]"
          >
            <Link
              to="/admin/courses"
              className="flex items-center gap-2 px-3 py-2"
            >
              <BookIcon size={16} className="text-[#2563eb]" />
              Courses
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem
            asChild
            disabled
            className="cursor-not-allowed rounded-[8px] font-medium text-[#1e293b] opacity-50"
          >
            <Link
              to="/settings/notifications"
              className="flex items-center gap-2 px-3 py-2"
            >
              <Bell size={16} className="text-[#2563eb]" />
              Notifications
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="my-1 bg-[#e2e8f0]" />

        {/* Logout */}
        <DropdownMenuItem
          onClick={() => setLogoutModalCondition(true)}
          className="rounded-[8px] font-medium text-[#1e293b] transition-all duration-200 hover:bg-[#ef4444]/10 hover:text-[#ef4444]"
        >
          <LogOut size={16} className="mr-2 text-[#ef4444]" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </SidebarMenuItem>
</SidebarMenu>

    </>
  )
}
