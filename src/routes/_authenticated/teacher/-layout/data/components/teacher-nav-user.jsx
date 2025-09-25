import { useEffect, useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { ChevronsUpDown, LogOut } from 'lucide-react'
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
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { getTeacherCreds } from '../../../-utils/helperFunctions'
import LogoutModal from '../../../../../../shared/components/LogoutModal'
// Updated to match NavUser's chevron style
import { handleLogout } from '../../../../../../shared/config/reducers/admin/adminAuthSlice'
import { useQuery } from '@tanstack/react-query'

export function NavUser() {
  const navigate = useNavigate()
  const [logoutModalCondition, setLogoutModalCondition] = useState(false)

  const dispatch = useDispatch()
  const logout = () => {
    dispatch(handleLogout())

    toast.success('You have been logged out successfully.')
    navigate({ to: '/teacher/login' }) // Should be /admin/login for admin context
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
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size='lg'
                className='flex w-full items-center rounded-[8px] border border-[#e2e8f0] bg-[#ffffff] px-4 py-3 shadow-[0_4px_6px_rgba(0,0,0,0.05)] transition-all duration-300 hover:scale-[1.02] hover:border-[#cbd5e1] hover:bg-[#f1f5f9] hover:shadow-[0_6px_12px_rgba(0,0,0,0.1)]'
              >
                <Avatar className='h-9 w-9 rounded-full ring-2 ring-[#e2e8f0]'>
                  {/* <AvatarImage
              src={user?.avatar}
              alt={credentials?.firstName + " " + credentials?.lastName}
            /> */}
                  <AvatarFallback className='rounded-full bg-[#f1f5f9] font-semibold text-[#1e293b]'>
                    {credentials?.firstName?.charAt(0)?.toUpperCase()}
                    {credentials?.lastName?.charAt(0)?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className='ml-3 grid flex-1 text-left text-sm leading-tight text-[#1e293b]'>
                  <span className='truncate font-semibold'>
                    {credentials?.firstName} {credentials?.lastName}
                  </span>
                  <span className='truncate text-xs text-[#64748b]'>
                    {credentials?.email}
                  </span>
                </div>
                <ChevronsUpDown className='ml-auto size-4 text-[#64748b]' />
              </SidebarMenuButton>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className='mt-2 min-w-56 rounded-[8px] border border-[#e2e8f0] bg-[#ffffff] p-2 shadow-[0_4px_6px_rgba(0,0,0,0.05)]'
              align='end'
              forceMount
            >
              <DropdownMenuLabel className='p-0 font-normal'>
                <div className='flex items-center gap-2 px-3 py-2 text-left'>
                  <Avatar className='h-9 w-9 rounded-full ring-2 ring-[#e2e8f0]'>
                    {/* <AvatarImage
                src={user?.avatar}
                alt={credentials?.firstName}
              /> */}
                    <AvatarFallback className='rounded-full bg-[#f1f5f9] font-semibold text-[#1e293b]'>
                      {credentials?.firstName?.charAt(0)?.toUpperCase()}
                      {credentials?.lastName?.charAt(0)?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className='grid flex-1 text-left text-sm leading-tight'>
                    <span className='truncate font-bold text-[#1e293b]'>
                      {credentials?.firstName}
                    </span>
                    <span className='truncate text-xs text-[#64748b]'>
                      {credentials?.lastName}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator className='my-2 bg-[#e2e8f0]' />

              <DropdownMenuGroup>
                <DropdownMenuItem
                  asChild
                  className='rounded-[8px] font-medium text-[#1e293b] transition-all duration-200 hover:bg-[#2563eb]/10 hover:text-[#2563eb]'
                >
                  <Link
                    to='/teacher/settings'
                    className='flex items-center gap-2 px-3 py-2'
                  >
                    Profile
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem
                  asChild
                  className='rounded-[8px] font-medium text-[#1e293b] transition-all duration-200 hover:bg-[#2563eb]/10 hover:text-[#2563eb]'
                >
                  <Link
                    to='/teacher/courses'
                    className='flex items-center gap-2 px-3 py-2'
                  >
                    Courses
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem
                  asChild
                  className='rounded-[8px] font-medium text-[#1e293b] transition-all duration-200 hover:bg-[#2563eb]/10 hover:text-[#2563eb]'
                >
                  <Link
                    to='/teacher/settings'
                    className='flex items-center gap-2 px-3 py-2'
                  >
                    Settings
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator className='my-2 bg-[#e2e8f0]' />

              <DropdownMenuItem
                onClick={() => setLogoutModalCondition(true)}
                className='rounded-[8px] font-medium text-[#1e293b] transition-all duration-200 hover:bg-[#ef4444]/10 hover:text-[#ef4444]'
              >
                <LogOut size={16} className='mr-2 text-[#ef4444]' />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </>
  )
}
