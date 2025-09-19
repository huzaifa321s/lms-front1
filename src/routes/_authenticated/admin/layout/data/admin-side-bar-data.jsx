import {
  IconBarrierBlock,
  IconBug,
  IconError404,
  IconGoGame,
  IconLayoutDashboard,
  IconLock,
  IconLockAccess,
  IconServerOff,
  IconSettings,
  IconUserOff,
} from '@tabler/icons-react'
import {  BookUser, Edit2, Edit3, EditIcon, List, Users2Icon, UsersIcon } from 'lucide-react'
import { getCookie } from '../../../../../shared/utils/helperFunction';


const credentials  = getCookie('adminCredentials');

export const adminSideBarData = {
  user: {
    name: credentials?.firstName + " " +credentials?.lastName,
    email: credentials?.email,
    avatar: '/avatars/shadcn.jpg',
  },

  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          url: '/admin',
          icon: IconLayoutDashboard,
        },
        {
          title: 'Courses',
          url: '/admin/courses',
          icon: List,
        },
        {
          title: 'Blogs',
          url: '/admin/blogs',
          icon: BookUser,
        },

        {
          title: 'Teachers',
          url: '/admin/teachers',
          icon: UsersIcon,
        },
        {
          title: "Students",
          url: '/admin/students',
          icon: Users2Icon
        },
        {
          title: "Training Wheel Game",
          url: '/admin/trainingwheelgame',
          icon:IconGoGame
        },
        {
          title: 'Settings',
          icon: IconSettings,
          items: [
            // {
            //   title: 'Profile',
            //   url: '/teacher/settings',
            //   icon:IconUser
            // },
            {
              title:'Blog Category',
              url:'/admin/settings',
              icon:Edit3
            },
            {
              title: 'Course Category',
              url: '/admin/settings/course-category',
              icon:Edit2
            },
            {
              title: 'Game Category',
              url: '/admin/settings/game-category',
              icon:EditIcon
            },
          ],
        },
   
      ],
    },
    {
      title: 'Pages',
      items: [
        {
          title: 'Auth',
          icon: IconLockAccess,
          items: [
            {
              title: 'Sign In',
              url: '/admin/sample-pages/auth/sign-in',
            },
     
            {
              title: 'Sign Up (Student)',
              url: '/admin/sample-pages/auth/student/sign-up',
            },
            
            {
              title: 'Sign Up (Teacher)',
              url: '/admin/sample-pages/auth/teacher/sign-up',
            },
            {
              title: 'Forgot Password',
              url: '/admin/sample-pages/auth/forgot-password',
            },
            {
              title: 'OTP',
              url: '/admin/sample-pages/auth/otp',
            },
          ],
        },
        {
          title: 'Errors',
          icon: IconBug,
          items: [
            {
              title: 'Unauthorized',
              url: '/admin/sample-pages/errors/unauthorized',
              icon: IconLock,
            },
            {
              title: 'Forbidden',
              url: '/admin/sample-pages/errors/forbidden',
              icon: IconUserOff,
            },
            {
              title: 'Not Found',
              url: '/admin/sample-pages/errors/not-found',
              icon: IconError404,
            },
            {
              title: 'Internal Server Error',
              url: '/admin/sample-pages/errors/server-error',
              icon: IconServerOff,
            },
            {
              title: 'Maintenance Error',
              url: '/admin/sample-pages/errors/maintenance-error',
              icon: IconBarrierBlock,
            },
          ],
        },
      ],
    },
    // {
    //   title: 'Other',
    //   items: [
    //     {
    //       title: 'Settings',
    //       icon: IconSettings,
    //       items: [
    //         {
    //           title: 'Profile',
    //           url: '/settings',
    //           icon: IconUserCog,
    //         },
    //         {
    //           title: 'Account',
    //           url: '/settings/account',
    //           icon: IconTool,
    //         },
    //         {
    //           title: 'Appearance',
    //           url: '/settings/appearance',
    //           icon: IconPalette,
    //         },
    //         {
    //           title: 'Notifications',
    //           url: '/settings/notifications',
    //           icon: IconNotification,
    //         },
    //         {
    //           title: 'Display',
    //           url: '/settings/display',
    //           icon: IconBrowserCheck,
    //         },
    //       ],
    //     },
    //     {
    //       title: 'Help Center',
    //       url: '/help-center',
    //       icon: IconHelp,
    //     },
    //   ],
    // },
  ],
}
