import {
  AudioWaveform,
  BookOpen,
  Command,
  GalleryVerticalEnd,
  LayoutDashboard,
  Lock,
  Puzzle,
  Settings,
  UserCircle,
  Wallet,
} from 'lucide-react'

import { getCookie } from '../../../shared/utils/helperFunction'

export function getSubscription() {
   let subsc = getCookie('studentSubscription') 
   return subsc 
  }

  export function getCredentials() {
   let subsc = getCookie('studentSubscription') 
   return subsc 
  }

export function getSidebarData() {
  const subscription = getSubscription()
  const credentials = getCredentials()
  const isSubscribed =
    subscription?.status === 'active' && subscription?.subscriptionId
      ? true
      : false

  return {
    user: {
      name: 'satnaing',
      email: 'satnaingdev@gmail.com',
      avatar: '/avatars/shadcn.jpg',
    },
    teams: [
      {
        name: 'Shadcn Admin',
        logo: Command,
        plan: 'Vite + ShadcnUI',
      },
      {
        name: 'Acme Inc',
        logo: GalleryVerticalEnd,
        plan: 'Enterprise',
      },
      {
        name: 'Acme Corp.',
        logo: AudioWaveform,
        plan: 'Startup',
      },
    ],
    navGroups: [
      {
        title: 'General',
        items: [
          {
            title: 'Dashboard',
            url: '/student',
            icon: LayoutDashboard,
          },
          {
            title: 'Settings',
            icon:Settings,
            items: [
              {
                title: 'Profile',
                url: '/student/settings',
                icon: UserCircle,
              },
              {
                title: 'Billing',
                url: '/student/settings/billing',
                icon: Wallet,
              },
            ],
          },
          !isSubscribed
            ? {
                title: `Locked – ${subscription?.status === 'pending' ? "Activate Subscription" :  "Subscribe"}  to Unlock`,
                url: '',
                icon: Lock,
                className: 'bg-yellow-600 text-white ',
                items: [
                  {
                    title: 'Enrolled Courses',
                    url: '/student/enrolledcourses',
                    icon: Lock,
                  },
                  {
                    title: 'Training Wheel Game',
                    url: '/student/trainingwheelgame',
                    icon:Lock,
                  },
                ],
              }
            : null,
          ...(isSubscribed
            ? [
                {
                  title: 'Enrolled Courses',
                  url: '/student/enrolledcourses',
                  icon: BookOpen,
                },
                {
                  title: 'Training Wheel Game',
                  url: '/student/trainingwheelgame',
                  icon: Puzzle,
                },
              ]
            : []),
        ].filter(Boolean),
      },
    ],
  }
}
