import { useCallback, useState } from 'react'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { Link, redirect, useNavigate,useSearch } from '@tanstack/react-router'
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
import { handleLogin } from '../../../shared/config/reducers/student/studentAuthSlice'


export function LoginForm({ className, ...props }) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm()
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading,setIsLoading] = useState(false);
  const redirectTo = useSearch({from:'/teacher/login',select:(search) => search.redirectTo});
    const handleTeacherLogin = useCallback(
      async (data) => {
        setIsLoading(true);
        try {
          let response = await axios.post("/teacher/login",data);
            response = response.data;
            if(response.success) {
                const {token, credentials } = response.data;
                document.cookie = `teacherToken=${token}; path=/`;
                document.cookie = `teacherCredentials=${JSON.stringify(credentials)}; path=/`;
                dispatch(handleLogin({token, credentials}))
                console.log('redirectTo ===>',redirectTo)
            if(redirectTo){
              navigate({to:redirectTo,replace: true})
            }else{
              console.log('condition true')
               navigate({to:"/teacher",replace: true})
            }
            toast.success('Logged in successfully')
            reset()
          }
        } catch (error) {
          console.log('error', error)
          toast.error(error.response?.data?.message || 'Something went wrong')
        } finally {
          setIsLoading(false);
        }
      },
      [axios, toast,redirectTo,navigate]
    );

  return (
   
   
    

      <Card className="relative bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] rounded-[8px] shadow-[0_4px_6px_rgba(0,0,0,0.05)] max-w-md mx-auto transition-all duration-300 hover:shadow-[0_6px_12px_rgba(0,0,0,0.1)]">
        <CardHeader className="text-center">
          <CardTitle className="bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-2xl font-bold text-transparent">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-[#64748b] text-lg">
            Login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleTeacherLogin)}>
            <div className="grid gap-6">
              <div className="grid gap-4">
                {/* Email Field */}
                <div className="grid gap-2">
                  <Label
                    htmlFor="email"
                    className={cn('text-lg font-medium text-[#1e293b]', errors.email && 'text-[#ef4444]')}
                  >
                    Email
                  </Label>
                  <Input
                    type="text"
                    placeholder="Email"
                    className="rounded-[8px] border-[#e2e8f0] focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 text-[#1e293b] transition-all duration-300 hover:shadow-[0_4px_6px_rgba(0,0,0,0.05)]"
                    {...register('email', {
                      required: true,
                    })}
                  />
                  {errors.email && (
                    <span className="text-[#ef4444] text-sm">Required</span>
                  )}
                </div>

                {/* Password Field */}
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label
                      htmlFor="password"
                      className={cn('text-lg font-medium text-[#1e293b]', errors.password && 'text-[#ef4444]')}
                    >
                      Password
                    </Label>
                    <Link
                      to="/teacher/forgot-password"
                      className="ml-auto text-sm text-[#2563eb] hover:text-[#1d4ed8] hover:underline transition-all duration-300"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                  <PasswordInput
                    id="password"
                    placeholder="Password"
                    className="rounded-[8px] border-[#e2e8f0] focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 text-[#1e293b] transition-all duration-300 hover:shadow-[0_4px_6px_rgba(0,0,0,0.05)]"
                    {...register('password', {
                      required: true,
                    })}
                  />
                  {errors.password && (
                    <span className="text-[#ef4444] text-sm">Required</span>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full rounded-[8px] bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] text-white font-medium transition-all duration-300 hover:shadow-[0_6px_12px_rgba(0,0,0,0.1)] hover:scale-[1.02] disabled:bg-[#e2e8f0] disabled:text-[#64748b]"
                  disabled={isLoading}
                  loading={isLoading}
                >
                  Login
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
        <div className="pb-6 text-center">
          <p className="text-[#64748b] text-sm">
            Don't have an account yet?{' '}
            <Link
              to="/teacher/register"
              className="text-[#2563eb] hover:text-[#1d4ed8] hover:underline transition-all duration-300"
            >
              Register
            </Link>
          </p>
        </div>
      </Card>
    
  )
}
