import { Outlet } from '@tanstack/react-router'
import {
  IconPalette,
  IconUser,
} from '@tabler/icons-react'
import { Separator } from '@/components/ui/separator'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Button } from '@/components/ui/button'
import SidebarNav from './-components/_side-bar_nav'
import { TopNav } from "@/components/layout/top-nav"
export default function Settings() {
  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <TopNav links={topNav} />
          <div className='absolute right-0 px-5 flex items-center gap-1'>
            <Button size='sm' onClick={() => window.history.back()} variant="outline">
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='black'
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
          <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
            Settings
          </h1>
          <p className='text-muted-foreground'>
            Manage your account settings and set e-mail preferences.
          </p>
        </div>
        <Separator className='my-4 lg:my-6' />
        <div className='flex flex-1 flex-col space-y-2 overflow-hidden md:space-y-2 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <aside className='top-0 lg:sticky lg:w-1/5'>
            <SidebarNav items={sidebarNavItems} />
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
    title: 'Profile',
    icon: <IconUser size={18} />,
    href: '/teacher/settings',
  },

]


const topNav = [
  {
    title: 'Overview',
    href: '/teacher/',
    isActive: false,
    disabled: false,
  },
  {
    title: 'Courses',
    href: '/teacher/courses',
    isActive: false,
    disabled: false,
  },
  {
    title: 'Games',
    href: '/teacher/trainingwheelgame',
    isActive: false,
    disabled: false,
  },
  {
    title: 'Settings',
    href: '/teacher/settings',
    isActive: true,
    disabled: false,
  },
]
