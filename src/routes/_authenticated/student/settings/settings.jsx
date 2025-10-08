import { Outlet } from '@tanstack/react-router'
import {
  ArrowLeft,
  Bell,
  BookOpen,
  CreditCard,
  LayoutDashboard,
  Puzzle,
  Settings2,
  SettingsIcon,
  User,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { TopNav } from '@/components/layout/top-nav'
import SidebarNav from './-components/_side-bar-nav'

export default function Settings() {
  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <TopNav links={topNav} />
        <div className='absolute right-0 flex items-center gap-1 px-5'>
          <Button
            size='sm'
            variant='outline'
            onClick={() => window.history.back()}
          >
            <ArrowLeft />
          </Button>
        </div>
      </Header>
      <Main fixed>
        {/* Header Section */}
        <div className='space-y-0.5'>
          <h1 className='mb-4 bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-4xl font-bold text-transparent'>
            Settings
          </h1>
          <p className='text-muted-foreground'>
            Manage your account settings and set e-mail preferences.
          </p>
        </div>

        <Separator className='my-4 lg:my-6' />

        {/* Content Layout */}
        <div className='flex flex-1 flex-col space-y-2 overflow-hidden md:space-y-2 lg:flex-row lg:space-y-0 lg:space-x-10'>
          {/* Sidebar Navigation */}
          <aside className='lg:sticky lg:top-0 lg:w-1/5'>
            <SidebarNav items={sidebarNavItems} />
          </aside>

          {/* Main Content Outlet */}
          <section className='flex w-full overflow-y-hidden py-1'>
            <Outlet />
          </section>
        </div>
      </Main>
    </>
  )
}

const sidebarNavItems = [
  {
    title: 'Profile',
    icon: <User size={18} />,
    href: '/student/settings',
  },
  {
    title: 'Billing',
    icon: <CreditCard size={18} />,
    href: '/student/settings/billing',
  },

  {
    title: 'Display (dummy)',
    icon: <Bell size={18} />,
    href: '/student/settings/display',
  },
]
const topNav = [
  {
    title: 'Overview',
    href: '/student',
    isActive: false,
    disabled: false,
    icon: LayoutDashboard,
  },
  {
    title: 'Courses',
    href: '/student/enrolledcourses',
    isActive: false,
    disabled: false,
    icon: BookOpen,
  },
  {
    title: 'Quizzes (Dummy)',
    href: 'dashboard/products',
    isActive: false,
    disabled: true,
    icon: Puzzle,
  },
  {
    title: 'Settings',
    href: '/student/settings',
    isActive: true,
    disabled: false,
    icon: SettingsIcon,
  },
]
