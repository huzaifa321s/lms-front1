import { Gamepad, LayoutDashboard, List, Settings } from 'lucide-react'
import { getCookie } from '../../../shared/utils/helperFunction';

const credentials  = getCookie('teacherCredentials');
console.log('credentials ===>',credentials);

export const teacherSideBarData = {
    user: {
    name: credentials?.firstName + " " + credentials?.lastName,
    email: credentials?.email,
    avatar: '/avatars/shadcn.jpg',
  },

  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          url: '/teacher',
          icon: LayoutDashboard,
        },
        {
          title: 'My Courses',
          url: '/teacher/courses',
          icon: List,
        },
        {
          title: 'Training Wheel Game',
          url: '/teacher/trainingwheelgame',
          icon:Gamepad,
        },
        {
          title: 'Settings',
          icon: Settings,
          items: [
            {
              title: 'Profile',
              url: '/teacher/settings',
            },
            // {
            //   title: 'Billing',
            //   url: '/student/settings/billing',
            // },
            // {
            //   title: 'Invoices',
            //   url: '/student/settings/invoices',
            // },
          ],
        },
        // {
        //   title: 'Tasks',
        //   url: '/tasks',
        //   icon: IconChecklist,
        // },
        // {
        //   title: 'Apps',
        //   url: '/apps',
        //   icon: IconPackages,
        // },
        // {
        //   title: 'Chats',
        //   url: '/chats',
        //   badge: '3',
        //   icon: IconMessages,
        // },
        // {
        //   title: 'Users',
        //   url: '/users',
        //   icon: IconUsers,
        // },
        // {
        //   title: 'Secured by Clerk',
        //   icon: ClerkLogo,
        //   items: [
        //     {
        //       title: 'Sign In',
        //       url: '/clerk/sign-in',
        //     },
        //     {
        //       title: 'Sign Up',
        //       url: '/clerk/sign-up',
        //     },
        //     {
        //       title: 'User Management',
        //       url: '/clerk/user-management',
        //     },
        //   ],
        // },
      ],
    },
    // {
    //   title: 'Pages',
    //   items: [
    //     // {
    //     //   title: 'Auth',
    //     //   icon: IconLockAccess,
    //     //   items: [
    //     //     {
    //     //       title: 'Sign In',
    //     //       url: '/sign-in',
    //     //     },
    //     //     {
    //     //       title: 'Sign In (2 Col)',
    //     //       url: '/sign-in-2',
    //     //     },
    //     //     {
    //     //       title: 'Sign Up',
    //     //       url: '/sign-up',
    //     //     },
    //     //     {
    //     //       title: 'Forgot Password',
    //     //       url: '/forgot-password',
    //     //     },
    //     //     {
    //     //       title: 'OTP',
    //     //       url: '/otp',
    //     //     },
    //     //   ],
    //     // },
    //     // {
    //     //   title: 'Errors',
    //     //   icon: IconBug,
    //     //   items: [
    //     //     {
    //     //       title: 'Unauthorized',
    //     //       url: '/401',
    //     //       icon: IconLock,
    //     //     },
    //     //     {
    //     //       title: 'Forbidden',
    //     //       url: '/403',
    //     //       icon: IconUserOff,
    //     //     },
    //     //     {
    //     //       title: 'Not Found',
    //     //       url: '/404',
    //     //       icon: IconError404,
    //     //     },
    //     //     {
    //     //       title: 'Internal Server Error',
    //     //       url: '/500',
    //     //       icon: IconServerOff,
    //     //     },
    //     //     {
    //     //       title: 'Maintenance Error',
    //     //       url: '/503',
    //     //       icon: IconBarrierBlock,
    //     //     },
    //     //   ],
    //     // },
    //   ],
    // },
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
