import { Outlet } from '@tanstack/react-router'
import { Edit, Edit2, Edit3, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { TopNav } from '@/components/layout/top-nav'
import SidebarNav from './-components/_side-bar_nav'

export default function Settings() {
  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <TopNav links={topNav} />
        <div className='absolute right-0 flex items-center gap-1 px-5'>
          <Button
            size='sm'
            onClick={() => window.history.back()}
            variant='outline'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='h-6 w-6'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3'
              />
            </svg>
          </Button>
        </div>
      </Header>

      <Main fixed>
        <div className='space-y-0.5'>
          <h1 className='bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-2xl font-extrabold tracking-tight text-transparent md:text-3xl'>
            Settings
          </h1>
          <p className='text-muted-foreground'>
            Manage your account settings and set e-mail preferences.
          </p>
        </div>
        <Separator className='my-4 lg:my-6' />
        <div className='flex flex-1 flex-col space-y-2 overflow-hidden md:space-y-2 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <aside className='top-0 lg:sticky lg:w-1/5'>
            <h2 className='mt-4 bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text font-bold tracking-tight text-transparent'>
              -Content Settings
            </h2>
            <SidebarNav items={sidebarNavItems} />
             <aside className='top-0 lg:sticky lg:w-1/4'>
            <h2 className=' bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text font-bold tracking-tight text-transparent'>
              -Profile
            </h2>
            <SidebarNav items={sidebar2ndNavItems} />
          </aside>
          </aside>
          
          <div className='flex w-full overflow-y-hidden p-1'>
            <Outlet />
          </div>
        </div>
      </Main>
    </>
  )
}

const sidebarNavItems = [
  {
    title: 'Blog Category',
    icon: <Edit2 />,
    href: '/admin/settings',
  },
  {
    title: 'Course Category',
    icon: <Edit3 />,
    href: '/admin/settings/course-category',
  },
  {
    title: 'Game Category',
    icon: <Edit />,
    href: '/admin/settings/game-category',
  },
  
]


const sidebar2ndNavItems = [
  {
    title: 'Profile',
    icon: <User/>,
    href: '/admin/settings/profile',
  },
 
  
]

const topNav = [
  {
    title: 'Overview',
    href: '/admin',
    isActive: false,
    disabled: false,
  },
  {
    title: 'Students',
    href: '/admin/students',
    isActive: false,
    disabled: false,
  },
  {
    title: 'Teachers',
    href: '/admin/teachers',
    isActive: false,
    disabled: false,
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    isActive: true,
    disabled: false,
  },
]
