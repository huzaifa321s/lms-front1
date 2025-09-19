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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import {LogoutModal} from '../../../../shared/components/LogoutModal'
import { handleLogout } from '../../../../shared/config/reducers/admin/adminAuthSlice'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { getAdminCreds } from '../-utils/helpeFuntions'

export function NavUser({
  user,
}) {
  const navigate = useNavigate();
  const { isMobile } = useSidebar()
  const [credentials, setCredentials] = useState(null)
  const [logoutModalCondition,setLogoutModalCondition] = useState(false);
  const [isLoading,setIsLoading] = useState(false);
   const dispatch = useDispatch();
   const logout = () =>{
   setIsLoading(true);
   dispatch(handleLogout());
   setIsLoading(false);
   toast.success('You have been logged out successfully.');
   navigate({to:"/admin/login"})
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
    <LogoutModal modalCondition={logoutModalCondition} handleModalClose={setLogoutModalCondition} isLoading={isLoading} logout={logout}/>
     <SidebarMenu>
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            size="lg"
            className="w-full px-4 py-3 rounded-[12px] bg-gradient-to-r from-[#2563eb]/10 to-[#1d4ed8]/10 border border-[#e2e8f0] transition-all duration-300 hover:from-[#2563eb]/20 hover:to-[#1d4ed8]/20 hover:scale-105 shadow-md flex items-center"
          >
            <Avatar className="h-9 w-9 rounded-full">
              <AvatarImage src={user?.avatar} alt={`${credentials?.firstName} ${credentials?.lastName}`} />
              <AvatarFallback className="rounded-full bg-gradient-to-r from-[#2563eb]/20 to-[#1d4ed8]/20 text-[#1e293b] font-semibold">
                {credentials?.firstName?.charAt(0)?.toUpperCase()}
                {credentials?.lastName?.charAt(0)?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight ml-3 text-[#1e293b]">
              <span className="truncate font-semibold">{credentials?.firstName} {credentials?.lastName}</span>
              <span className="truncate text-xs text-[#64748b]">{credentials?.email}</span>
            </div>
            <ChevronsUpDown className="ml-auto size-4 text-[#475569] transition-transform duration-200 group-hover:rotate-180" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="min-w-56 bg-white/95 border border-[#e2e8f0] rounded-[12px] shadow-[0_4px_12px_rgba(0,0,0,0.1)] p-2 mt-2"
          side={isMobile ? "bottom" : "right"}
          align="end"
          sideOffset={4}
        >
          <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex items-center gap-2 px-3 py-2 text-left">
              <Avatar className="h-9 w-9 rounded-full">
                <AvatarImage src={user?.avatar} alt={credentials?.firstName} />
                <AvatarFallback className="rounded-full bg-gradient-to-r from-[#2563eb]/20 to-[#1d4ed8]/20 text-[#1e293b] font-semibold">
                  {credentials?.firstName?.charAt(0)?.toUpperCase()}
                  {credentials?.lastName?.charAt(0)?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold text-[#1e293b]">{credentials?.firstName}</span>
                <span className="truncate text-xs text-[#64748b]">{credentials?.lastName}</span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-[#e2e8f0] my-1" />
          <DropdownMenuGroup>
            <DropdownMenuItem
              asChild
              className="rounded-[8px] transition-all duration-200 hover:bg-[#2563eb]/10 hover:text-[#2563eb] focus:bg-[#2563eb]/10 focus:text-[#2563eb] text-[#1e293b] font-medium"
            >
              <Link to="/admin/settings/profile" className="flex items-center gap-2 px-3 py-2">
                <Settings size={16} className="text-[#2563eb]" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              asChild
              className="rounded-[8px] transition-all duration-200 hover:bg-[#2563eb]/10 hover:text-[#2563eb] focus:bg-[#2563eb]/10 focus:text-[#2563eb] text-[#1e293b] font-medium"
            >
              <Link to="/admin/courses" className="flex items-center gap-2 px-3 py-2">
                <BookIcon size={16} className="text-[#2563eb]" />
                Courses
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              asChild
              disabled
              className="rounded-[8px] transition-all duration-200 hover:bg-[#2563eb]/10 hover:text-[#2563eb] focus:bg-[#2563eb]/10 focus:text-[#2563eb] text-[#1e293b] font-medium opacity-50 cursor-not-allowed"
            >
              <Link to="/settings/notifications" className="flex items-center gap-2 px-3 py-2">
                <Bell size={16} className="text-[#2563eb]" />
                Notifications
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator className="bg-[#e2e8f0] my-1" />
          <DropdownMenuItem
            onClick={() => setLogoutModalCondition(true)}
            className="rounded-[8px] transition-all duration-200 hover:bg-[#ef4444]/10 hover:text-[#ef4444] focus:bg-[#ef4444]/10 focus:text-[#ef4444] text-[#1e293b] font-medium"
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