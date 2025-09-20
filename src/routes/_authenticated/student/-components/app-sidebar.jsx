import { useNavigate } from '@tanstack/react-router'
import { useSelector } from 'react-redux'
import { Button } from '@/components/ui/button'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { NavGroup } from '@/components/layout/nav-group'
import { getSidebarData } from '../../../../components/layout/data/sidebar-data'
import { NavUser } from '../features/tasks/-components/student-nav-user'

export function AppSidebar({ ...props }) {
  const credentials = useSelector((state) => state.studentAuth.credentials)
  const subscription = useSelector((state) => state.studentAuth.subscription)

  const navigate = useNavigate()
  const sidebarData = getSidebarData()
  return (
    <Sidebar collapsible='icon' variant='floating' {...props}>
      {/* HEADER */}
      <SidebarHeader className='flex items-center gap-2 px-3 py-4'>
        <div 
  onClick={() => navigate({ to: "/" })} 
  className="flex items-center flex-col justify-center cursor-pointer"
>
  <img
    src="/images/main-logo.jpg"
    alt="Bruce LMS"
    width="40"
    height="40"
    className="rounded-full shadow-md"
    loading="lazy"
  />
  <h1 className="bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-lg font-extrabold tracking-tight text-transparent drop-shadow-md">
    Bruce LMS
  </h1>
</div>

      </SidebarHeader>

      {/* STUDENT INFO */}
      <div className='px-3 pb-2 text-sm font-semibold text-gray-700 dark:text-gray-200'>
        {credentials?.firstName && credentials?.lastName ? (
          <p className='truncate'>
            {credentials.firstName} {credentials.lastName}
          </p>
        ) : (
          <p className='text-gray-400 italic'>Guest User</p>
        )}
        {subscription?.status !== 'active' && !subscription?.subscriptionId && (
          <Button
            size='xs'
            className='mt-2 w-full text-xs'
            onClick={() => {
              if (subscription?.status !== 'active') {
                navigate({ to: '/student/failed-subscription' })
              }
              if (!subscription) {
                navigate({ to: '/student/subscription-plans' })
              }
              if (credentials?.customerId && !subscription) {
                navigate({ to: '/student/resubscription-plans' })
              }
            }}
          >
            Subscribe
          </Button>
        )}
      </div>

      {/* NAVIGATION */}
      <SidebarContent>
        {sidebarData.navGroups.map((group) => (
          <NavGroup key={group.title} {...group} />
        ))}
      </SidebarContent>

      {/* FOOTER */}
      <SidebarFooter className='border-t'>
        <NavUser user={sidebarData.user} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
