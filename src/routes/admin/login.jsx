import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { LoginForm } from './-components/admin-login-form'
import { getCookie } from '../../shared/utils/helperFunction'


export const Route = createFileRoute('/admin/login')({
   beforeLoad: () => {
      const token = getCookie('adminToken')
      const credentials = getCookie('adminCredentials')
      if (token && credentials) {
        throw redirect({ to: '/admin' })
      } else {
        return <Outlet />
      }
    },
  component: LoginPage,
})


export default function LoginPage({disabled}) {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-lg">
        <LoginForm disabled={disabled}/>
      </div>
    </div>
  )
}
