import { useNavigate } from '@tanstack/react-router'
import { shallowEqual, useSelector } from 'react-redux'
import { Button } from '@/components/ui/button'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarGroup,
  SidebarSeparator,
  SidebarGroupContent,
} from '@/components/ui/sidebar'
import { NavGroup } from '@/components/layout/nav-group'
import { getSidebarData } from '../../../../components/layout/data/sidebar-data'
import { NavUser } from '../features/tasks/-components/student-nav-user'

export function AppSidebar({ ...props }) {
  const credentials = useSelector(
    (state) => state.studentAuth.credentials,
    shallowEqual
  )
  const subscription = useSelector(
    (state) => state.studentAuth.subscription,
    shallowEqual
  )

  const navigate = useNavigate()
  const sidebarData = getSidebarData()
  return (
    <Sidebar collapsible='icon' variant='floating' {...props}>
      {/* HEADER */}
      <SidebarHeader>
        <div
          onClick={() => navigate({ to: '/' })}
          className='flex cursor-pointer flex-col items-center justify-center'
        >
          <img
            src='/images/main-logo.jpg'
            alt='Bruce LMS'
            width='40'
            height='40'
            className='rounded-full border-[2px] border-blue-500 shadow-md'
            loading='lazy'
          />
          <h1 className='bg-clip-text text-lg font-extrabold tracking-tight drop-shadow-md'>
            Bruce LMS
          </h1>
        </div>
      </SidebarHeader>

      {/* STUDENT INFO */}
      <SidebarGroup className='px-4 pb-2'>
        <SidebarGroupContent>
          <div className='text-sm font-semibold text-[#e2e8f0]'>
            {credentials?.firstName && credentials?.lastName ? (
              <p className='truncate'>
                {credentials.firstName} {credentials.lastName}
              </p>
            ) : (
              <p className='text-gray-400 italic'>Guest User</p>
            )}

            {subscription?.status !== 'active' &&
              !subscription?.subscriptionId && (
                <Button
                  size='sm'
                  onClick={() => {
                    if (subscription?.status === 'past_due' ||  subscription?.status === 'unpaid' || subscription?.status === 'incomplete') {
                      navigate({ to: '/student/failed-subscription' })
                    } else if (!subscription) {
                      navigate({ to: '/student/subscription-plans' })
                    } else if (subscription.customerId && subscription.status === "canceled") {
                      navigate({ to: '/student/resubscription-plans' })
                    }
                  }}
                >
                  Subscribe
                </Button>
              )}
          </div>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarSeparator />

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
