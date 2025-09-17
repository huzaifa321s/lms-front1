import { Link, useNavigate } from '@tanstack/react-router'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import { toast } from 'sonner'
import { ChevronsUpDown, LogOut } from 'lucide-react' // Updated to match NavUser's chevron style
import { handleLogout } from '../../../../../../shared/config/reducers/admin/adminAuthSlice'
import LogoutModal from '../../../../../../shared/components/LogoutModal'

export function NavUser() {
  const credentials = useSelector((state) => state.teacherAuth?.credentials) // Note: Should be state.adminAuth?.credentials for admin context
  console.log('credentials ===>', credentials)
  const navigate = useNavigate()
  const [logoutModalCondition, setLogoutModalCondition] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch()
  const logout = () => {
    setIsLoading(true)
    dispatch(handleLogout())
    setIsLoading(false)
    toast.success('You have been logged out successfully.')
    navigate({ to: '/teacher/login' }) // Should be /admin/login for admin context
  }
  return (
    <>
      <LogoutModal
        modalCondition={logoutModalCondition}
        logout={logout}
        handleModalClose={setLogoutModalCondition}
        isLoading={isLoading}
      />
      <DropdownMenu modal={false}>
    <DropdownMenuTrigger asChild>
      <Button
        variant="ghost"
        className="w-full px-4 py-3 rounded-[12px] bg-gradient-to-r from-[#2563eb]/10 to-[#1d4ed8]/10 border border-[#e2e8f0] transition-all duration-300 hover:from-[#2563eb]/20 hover:to-[#1d4ed8]/20 hover:scale-105 shadow-md flex items-center"
        size="lg"
      >
        <Avatar className="h-9 w-9 rounded-full">
          <AvatarImage src="/avatars/01.png" alt="profile" />
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
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent
      className="min-w-56 bg-white/95 border border-[#e2e8f0] rounded-[12px] shadow-[0_4px_12px_rgba(0,0,0,0.1)] p-2 mt-2"
      align="end"
      forceMount
    >
      <DropdownMenuLabel className="p-0 font-normal">
        <div className="flex items-center gap-2 px-3 py-2 text-left">
          <Avatar className="h-9 w-9 rounded-full">
            <AvatarImage src="/avatars/01.png" alt="profile" />
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
          <Link to="/teacher/settings" className="flex items-center gap-2 px-3 py-2">
            Profile
            <DropdownMenuShortcut className="text-[#64748b] text-xs">⇧⌘T</DropdownMenuShortcut>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          asChild
          className="rounded-[8px] transition-all duration-200 hover:bg-[#2563eb]/10 hover:text-[#2563eb] focus:bg-[#2563eb]/10 focus:text-[#2563eb] text-[#1e293b] font-medium"
        >
          <Link to="/teacher/courses" className="flex items-center gap-2 px-3 py-2">
            Courses
            <DropdownMenuShortcut className="text-[#64748b] text-xs">⌘C</DropdownMenuShortcut>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          asChild
          className="rounded-[8px] transition-all duration-200 hover:bg-[#2563eb]/10 hover:text-[#2563eb] focus:bg-[#2563eb]/10 focus:text-[#2563eb] text-[#1e293b] font-medium"
        >
          <Link to="/teacher/settings" className="flex items-center gap-2 px-3 py-2">
            Settings
            <DropdownMenuShortcut className="text-[#64748b] text-xs">⌘S</DropdownMenuShortcut>
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
        <DropdownMenuShortcut className="text-[#64748b] text-xs">⇧⌘Q</DropdownMenuShortcut>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
    </>
  )
}