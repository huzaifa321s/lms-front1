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
import { useEffect, useState } from 'react'
import { handleLogout } from '../../../shared/config/reducers/teacher/teacherAuthSlice'
import { LogoutModal } from '../../../shared/components/LogoutModal'
import { toast } from 'sonner'
import { Book, ChevronDown, LogOut, Settings, User } from 'lucide-react' // Added for consistency with the second example
import { getTeacherCreds } from '../../_authenticated/teacher/-utils/helperFunctions'
import { useQuery } from '@tanstack/react-query'

export function ProfileDropdown() {
  const navigate = useNavigate()
  const [logoutModalCondition, setLogoutModalCondition] = useState(false)
  const dispatch = useDispatch();
  
  const logout = () => {
    dispatch(handleLogout())
    toast.success('You have been logged out successfully.')
    navigate({ to: '/teacher/login' })
  }

   
  const {
    data: credentials,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['teacher-creds'],
    queryFn: getTeacherCreds,
    staleTime: 1000 * 60 * 5, 
    cacheTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    retry: 1, 
  })
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
      className="relative h-8 rounded-[8px] border border-[#e2e8f0] bg-[#ffffff] px-4 shadow-[0_4px_6px_rgba(0,0,0,0.05)] transition-all duration-300 hover:scale-[1.02] hover:border-[#cbd5e1] hover:bg-[#f1f5f9] hover:shadow-[0_6px_12px_rgba(0,0,0,0.1)]"
      size="sm"
    >
      <Avatar className="h-8 w-8 rounded-full ring-2 ring-[#e2e8f0]">
        <AvatarImage src="/avatars/01.png" alt="profile" />
        <AvatarFallback className="rounded-full bg-[#f1f5f9] text-[#1e293b]">
          {`${credentials?.firstName?.charAt(0).toUpperCase() ?? ''}${credentials?.lastName?.charAt(0).toUpperCase() ?? ''}`}
        </AvatarFallback>
      </Avatar>
      <ChevronDown size={20} className="ml-2 text-[#64748b]" />
    </Button>
  </DropdownMenuTrigger>

  <DropdownMenuContent
    className="mt-2 w-56 rounded-[8px] border border-[#e2e8f0] bg-[#ffffff] p-2 shadow-[0_4px_6px_rgba(0,0,0,0.05)]"
    align="end"
    forceMount
  >
    <DropdownMenuLabel className="px-4 py-2 font-normal text-[#1e293b]">
      <div className="flex flex-col space-y-1">
        <p className="text-sm leading-none font-bold">
          {credentials?.firstName} {credentials?.lastName}
        </p>
        <p className="text-sm leading-none text-[#64748b]">
          {credentials?.email}
        </p>
      </div>
    </DropdownMenuLabel>

    <DropdownMenuSeparator className="my-2 bg-[#e2e8f0]" />

    <DropdownMenuGroup>
      <DropdownMenuItem
        asChild
        className="rounded-[8px] transition-all duration-200 hover:bg-[#2563eb]/10 hover:text-[#1d4ed8] focus:bg-[#2563eb]/10 focus:text-[#1d4ed8]"
      >
        <Link to="/teacher/settings" className="flex items-center gap-2">
          <User size={16} className="text-[#2563eb]" />
          Profile
          <DropdownMenuShortcut className="text-[#64748b]">⇧⌘P</DropdownMenuShortcut>
        </Link>
      </DropdownMenuItem>

      <DropdownMenuItem
        asChild
        className="rounded-[8px] transition-all duration-200 hover:bg-[#2563eb]/10 hover:text-[#1d4ed8] focus:bg-[#2563eb]/10 focus:text-[#1d4ed8]"
      >
        <Link to="/teacher/courses" className="flex items-center gap-2">
          <Book size={16} className="text-[#2563eb]" />
          Courses
          <DropdownMenuShortcut className="text-[#64748b]">⌘C</DropdownMenuShortcut>
        </Link>
      </DropdownMenuItem>

      <DropdownMenuItem
        asChild
        className="rounded-[8px] transition-all duration-200 hover:bg-[#2563eb]/10 hover:text-[#1d4ed8] focus:bg-[#2563eb]/10 focus:text-[#1d4ed8]"
      >
        <Link to="/teacher/settings" className="flex items-center gap-2">
          <Settings size={16} className="text-[#2563eb]" />
          Settings
          <DropdownMenuShortcut className="text-[#64748b]">⌘S</DropdownMenuShortcut>
        </Link>
      </DropdownMenuItem>
    </DropdownMenuGroup>

    <DropdownMenuSeparator className="my-2 bg-[#e2e8f0]" />

    <DropdownMenuItem
      onClick={() => setLogoutModalCondition(true)}
      className="rounded-[8px] transition-all duration-200 hover:bg-[#ef4444]/10 hover:text-[#dc2626] focus:bg-[#ef4444]/10 focus:text-[#dc2626]"
    >
      <LogOut size={16} className="mr-2 text-[#dc2626]" />
      Log out
      <DropdownMenuShortcut className="text-[#64748b]">⇧⌘Q</DropdownMenuShortcut>
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>

    </>
  )
}