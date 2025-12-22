import { Blocks, BookUser, Bug, CircleOff, CreditCard, Edit2, Edit3, EditIcon, Gamepad, LayoutDashboard, List, Lock, LockKeyholeOpen, ServerOff, Settings, User, UserMinus, Users2Icon, UsersIcon } from 'lucide-react'
import { getCookie } from '@/shared/utils/helperFunction';


const credentials = getCookie('adminCredentials');

export const adminSideBarData = {
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
          url: '/admin',
          icon: LayoutDashboard,
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
          icon: Gamepad
        },
        {
          title: 'Settings',
          icon: Settings,
          items: [

            {
              title: 'Blog Category',
              url: '/admin/settings',
              icon: Edit3
            },
            {
              title: 'Course Category',
              url: '/admin/settings/course-category',
              icon: Edit2
            },
            {
              title: 'Game Category',
              url: '/admin/settings/game-category',
              icon: EditIcon
            },
            {
              title: 'Profile',
              url: '/admin/settings/profile',
              icon: User
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
          icon: LockKeyholeOpen,
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
          icon: Bug,
          items: [
            {
              title: 'Unauthorized',
              url: '/admin/sample-pages/errors/unauthorized',
              icon: Lock,
            },
            {
              title: 'Forbidden',
              url: '/admin/sample-pages/errors/forbidden',
              icon: UserMinus,
            },
            {
              title: 'Not Found',
              url: '/admin/sample-pages/errors/not-found',
              icon: CircleOff,
            },
            {
              title: 'Internal Server Error',
              url: '/admin/sample-pages/errors/server-error',
              icon: ServerOff,
            },
            {
              title: 'Maintenance Error',
              url: '/admin/sample-pages/errors/maintenance-error',
              icon: Blocks,
            },
          ],
        },
        {
          title: 'Subscriptions',
          icon: CreditCard,
          items: [
            { title: 'Plans', url: '/admin/sample-pages/subscriptions/plans' },

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
