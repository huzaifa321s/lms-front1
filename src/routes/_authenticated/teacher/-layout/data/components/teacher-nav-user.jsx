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
import { getTeacherCreds } from '../../../-utils/helperFunctions'
import LogoutModal from '../../../../../../shared/components/LogoutModal'
// Updated to match NavUser's chevron style
import { handleLogout } from '../../../../../../shared/config/reducers/admin/adminAuthSlice'

export function NavUser() {
  // const credentials = useSelector((state) => state.teacherAuth?.credentials)
  const [credentials, setCredentials] = useState(null)
  console.log('credentials 23===>', credentials)
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

  useEffect(() => {
    async function fetchCredentials() {
      try {
        const data = await getTeacherCreds()
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
        logout={logout}
        handleModalClose={setLogoutModalCondition}
        isLoading={isLoading}
      />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            className='flex w-full items-center rounded-[12px] border border-[#e2e8f0] bg-gradient-to-r from-[#2563eb]/10 to-[#1d4ed8]/10 px-4 py-3 shadow-md transition-all duration-300 hover:scale-105 hover:from-[#2563eb]/20 hover:to-[#1d4ed8]/20'
            size='lg'
          >
            <Avatar className='h-9 w-9 rounded-full'>
              <AvatarImage src='/avatars/01.png' alt='profile' />
              <AvatarFallback className='rounded-full bg-gradient-to-r from-[#2563eb]/20 to-[#1d4ed8]/20 font-semibold text-[#1e293b]'>
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
            <ChevronsUpDown className='ml-auto size-4 text-[#475569] transition-transform duration-200 group-hover:rotate-180' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className='mt-2 min-w-56 rounded-[12px] border border-[#e2e8f0] bg-white/95 p-2 shadow-[0_4px_12px_rgba(0,0,0,0.1)]'
          align='end'
          forceMount
        >
          <DropdownMenuLabel className='p-0 font-normal'>
            <div className='flex items-center gap-2 px-3 py-2 text-left'>
              <Avatar className='h-9 w-9 rounded-full'>
                <AvatarImage src='/avatars/01.png' alt='profile' />
                <AvatarFallback className='rounded-full bg-gradient-to-r from-[#2563eb]/20 to-[#1d4ed8]/20 font-semibold text-[#1e293b]'>
                  {credentials?.firstName?.charAt(0)?.toUpperCase()}
                  {credentials?.lastName?.charAt(0)?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-semibold text-[#1e293b]'>
                  {credentials?.firstName}
                </span>
                <span className='truncate text-xs text-[#64748b]'>
                  {credentials?.lastName}
                </span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className='my-1 bg-[#e2e8f0]' />
          <DropdownMenuGroup>
            <DropdownMenuItem
              asChild
              className='rounded-[8px] font-medium text-[#1e293b] transition-all duration-200 hover:bg-[#2563eb]/10 hover:text-[#2563eb] focus:bg-[#2563eb]/10 focus:text-[#2563eb]'
            >
              <Link
                to='/teacher/settings'
                className='flex items-center gap-2 px-3 py-2'
              >
                Profile
                <DropdownMenuShortcut className='text-xs text-[#64748b]'>
                  ⇧⌘T
                </DropdownMenuShortcut>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              asChild
              className='rounded-[8px] font-medium text-[#1e293b] transition-all duration-200 hover:bg-[#2563eb]/10 hover:text-[#2563eb] focus:bg-[#2563eb]/10 focus:text-[#2563eb]'
            >
              <Link
                to='/teacher/courses'
                className='flex items-center gap-2 px-3 py-2'
              >
                Courses
                <DropdownMenuShortcut className='text-xs text-[#64748b]'>
                  ⌘C
                </DropdownMenuShortcut>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              asChild
              className='rounded-[8px] font-medium text-[#1e293b] transition-all duration-200 hover:bg-[#2563eb]/10 hover:text-[#2563eb] focus:bg-[#2563eb]/10 focus:text-[#2563eb]'
            >
              <Link
                to='/teacher/settings'
                className='flex items-center gap-2 px-3 py-2'
              >
                Settings
                <DropdownMenuShortcut className='text-xs text-[#64748b]'>
                  ⌘S
                </DropdownMenuShortcut>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator className='my-1 bg-[#e2e8f0]' />
          <DropdownMenuItem
            onClick={() => setLogoutModalCondition(true)}
            className='rounded-[8px] font-medium text-[#1e293b] transition-all duration-200 hover:bg-[#ef4444]/10 hover:text-[#ef4444] focus:bg-[#ef4444]/10 focus:text-[#ef4444]'
          >
            <LogOut size={16} className='mr-2 text-[#ef4444]' />
            Log out
            <DropdownMenuShortcut className='text-xs text-[#64748b]'>
              ⇧⌘Q
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
