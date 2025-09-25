import { useCallback, useState } from 'react'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from '@tanstack/react-router'
import { useDispatch } from 'react-redux'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PasswordInput } from '@/components/password-input'
import { handleLogin } from '../../../shared/config/reducers/admin/adminAuthSlice'
import { useAppUtils } from '../../../hooks/useAppUtils'

export function LoginForm({ className, ...props }) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm()
  const {navigate,dispatch} = useAppUtils();
  const [isLoading,setIsLoading] = useState(false);
  const handleAdminLogin = useCallback(
    async (data) => {
      if(props.disabled) return
      setIsLoading(true);
      try {
        let response = await axios.post('/admin/login', data)
        response = response.data
        if (response.success) {
          navigate({ to: '/admin' });
          toast.success('Logged in successfully')
          const { token, credentials } = response.data
          document.cookie = `adminToken=${token}; path=/`
          document.cookie = `adminCredentials=${JSON.stringify(credentials)}; path=/`
          dispatch(handleLogin({ token, credentials }))
          reset();
        }
      } catch (error) {
        console.log('error', error)
        toast.error(error.response ? error.response.data.message : "Internal server error")
      }finally{
        setIsLoading(false);
      }
    },
    [axios, toast, navigate,props.disabled]
  )

  return (
  <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className="rounded-[12px] border border-[#e2e8f0] bg-white shadow-[0_4px_6px_rgba(0,0,0,0.05)] hover:shadow-lg hover:shadow-[#cbd5e1]/20 transition-all duration-300">
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-bold text-[#1e293b] bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-transparent">Welcome back</CardTitle>
          <CardDescription className="text-[#64748b]">Login to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleAdminLogin)}>
            <div className="grid gap-6">
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label
                    htmlFor="email"
                    className={cn('text-[#64748b] font-medium', errors.email && 'text-[#ef4444]')}
                  >
                    Email
                  </Label>
                  <Input
                    type="text"
                    placeholder="Enter your email"
                    className="rounded-[8px] border-[#e2e8f0] bg-white text-[#1e293b] placeholder:text-[#94a3b8] focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 transition-all duration-300"
                    {...register('email', {
                      required: true,
                    })}
                  />
                  {errors.email && (
                    <span className="text-[#ef4444] text-sm">Email is required</span>
                  )}
                </div>

                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label
                      htmlFor="password"
                      className={cn('text-[#64748b] font-medium', errors.password && 'text-[#ef4444]')}
                    >
                      Password
                    </Label>
                    <Link
                      to="/admin/forgot-password"
                      className="ml-auto text-sm text-[#2563eb] hover:text-[#1d4ed8] hover:underline transition-all duration-200"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                  <PasswordInput
                    id="password"
                    placeholder="Enter your password"
                    className="rounded-[8px] border-[#e2e8f0] bg-white text-[#1e293b] placeholder:text-[#94a3b8] focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 transition-all duration-300"
                    {...register('password', {
                      required: true,
                    })}
                  />
                  {errors.password && (
                    <span className="text-[#ef4444] text-sm">Password is required</span>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full rounded-[8px] bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] hover:from-[#1d4ed8] hover:to-[#1e40af] text-white font-semibold py-3 shadow-lg hover:shadow-[#cbd5e1]/50 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                  loading={isLoading}
                >
                  
                    {isLoading ? "Logging in..."  : "Login"}
                  
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
