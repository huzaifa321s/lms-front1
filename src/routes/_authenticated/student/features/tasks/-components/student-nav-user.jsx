
import { Link } from '@tanstack/react-router'
import {
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Settings
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { openModal } from '@/shared/config/reducers/student/studentDialogSlice'


export function NavUser({ user }) {
  const { isMobile } = useSidebar()
  const credentials = useSelector((state) => state.studentAuth.credentials, shallowEqual)
  const dispatch = useDispatch()

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="w-full px-4 py-3 rounded-[8px] bg-[#ffffff] border border-[#e2e8f0] shadow-[0_4px_6px_rgba(0,0,0,0.05)] transition-all duration-300 hover:bg-[#f1f5f9] hover:border-[#cbd5e1] hover:scale-[1.02] hover:shadow-[0_6px_12px_rgba(0,0,0,0.1)] flex items-center"
              >
                <Avatar className="h-9 w-9 rounded-full ring-2 ring-[#e2e8f0]">
                  <AvatarImage src={user?.avatar} alt={credentials?.firstName + " " + credentials?.lastName} />
                  <AvatarFallback className="rounded-full bg-[#f1f5f9] text-[#1e293b]">
                    {credentials?.firstName?.charAt(0)?.toUpperCase()}
                    {credentials?.lastName?.charAt(0)?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight ml-3 text-[#1e293b]">
                  <span className="truncate font-semibold">{credentials?.firstName + ' ' + credentials?.lastName}</span>
                  <span className="truncate text-xs text-[#64748b]">{credentials?.email}</span>
                </div>
                <ChevronsUpDown className="ml-auto size-4 text-[#64748b]" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="min-w-56 rounded-[8px] p-2 mt-2 bg-[#ffffff] border border-[#e2e8f0] shadow-[0_4px_6px_rgba(0,0,0,0.05)]"
              side={isMobile ? 'bottom' : 'right'}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-3 py-2 text-left">
                  <Avatar className="h-9 w-9 rounded-full ring-2 ring-[#e2e8f0]">
                    <AvatarImage src={user?.avatar} alt={credentials?.firstName} />
                    <AvatarFallback className="rounded-full bg-[#f1f5f9] text-[#1e293b]">
                      {credentials?.firstName?.charAt(0)?.toUpperCase()}
                      {credentials?.lastName?.charAt(0)?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-bold text-[#1e293b]">{credentials?.firstName}</span>
                    <span className="truncate text-xs text-[#64748b]">{credentials?.lastName}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-[#e2e8f0] my-2" />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild className="rounded-[8px] transition-all duration-200 hover:bg-[#2563eb]/10 hover:text-[#1d4ed8] focus:bg-[#2563eb]/10 focus:text-[#1d4ed8]">
                  <Link to="/student/settings/" className="flex items-center gap-2">
                    <Settings size={16} className="text-[#2563eb]" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="rounded-[8px] transition-all duration-200 hover:bg-[#2563eb]/10 hover:text-[#1d4ed8] focus:bg-[#2563eb]/10 focus:text-[#1d4ed8]">
                  <Link to="/student/settings/billing" className="flex items-center gap-2">
                    <CreditCard size={16} className="text-[#2563eb]" />
                    Billing
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild disabled className="rounded-[8px] opacity-50 cursor-not-allowed">
                  <Link to="/settings/notifications" className="flex items-center gap-2">
                    <Bell size={16} className="text-[#64748b]" />
                    Notifications
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator className="bg-[#e2e8f0] my-2" />
              <DropdownMenuItem
                onClick={() =>
                  dispatch(
                    openModal({
                      type: 'logout-modal',
                      props: { userType: 'student' },
                    })
                  )
                }
                className="rounded-[8px] transition-all duration-200 hover:bg-[#ef4444]/10 hover:text-[#dc2626] focus:bg-[#ef4444]/10 focus:text-[#dc2626]"
              >
                <LogOut size={16} className="mr-2 text-[#dc2626]" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </>
  )
}
