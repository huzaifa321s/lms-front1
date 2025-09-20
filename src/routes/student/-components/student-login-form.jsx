import { useCallback, useState } from 'react'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { Link, useNavigate,useSearch } from '@tanstack/react-router'
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
import image from '../../../../public/images/main-logo.jpg'

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
  const redirectTo = useSearch({from:'/student/login',select:(search) => search.redirect});
    const handleAdminLogin = useCallback(
      async (data) => {
        setIsLoading(true)
        try {
          let response = await axios.post('/student/login', data)
          response = response.data
          if (response.success) {
            const { token, credentials } = response.data
              console.log('creds students ===>',credentials)
            dispatch(handleLogin({ token, credentials ,subscription:credentials.subscription}));
            console.log('redirectTo ===>',redirectTo)
            if(redirectTo){
              navigate({to:redirectTo})
            }else{
              console.log('condition true')
              navigate({to:"/"})
            }
            toast.success('Logged in successfully')
            reset()
          }
        } catch (error) {
          console.log('error', error)
          toast.error(error.response.data.message)
        } finally {
          setIsLoading(false);
        }
      },
      [axios, toast, navigate,redirectTo]
    );

  return (
 <div className={cn('flex flex-col gap-6', className)} {...props} style={{ fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' }}>
  <Card className='border border-[#e2e8f0] shadow-[0_8px_25px_rgba(0,0,0,0.08)] rounded-[12px] bg-white overflow-hidden'>
    {/* Enhanced Header */}
    <CardHeader className='text-center bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] border-b border-[#e2e8f0] py-8'>
      {/* Logo Section */}
      <div className='mx-auto mb-4 w-fit'>
        <div className='relative'>
           <img src={image} loading='lazy' width={50} height={50} />
        </div>
      </div>

      <CardTitle className='text-2xl font-bold text-[#1e293b] mb-2'>
        Welcome Back
      </CardTitle>
      <CardDescription className='text-[#64748b] text-base'>
        Sign in to your student account to continue learning
      </CardDescription>
    </CardHeader>

    <CardContent className='p-8'>
      <form onSubmit={handleSubmit(handleAdminLogin)}>
        <div className='space-y-6'>
          {/* Email Field */}
          <div className='space-y-3'>
            <Label
              htmlFor='email'
              className={`text-sm font-semibold ${
                errors.email ? 'text-[#ef4444]' : 'text-[#1e293b]'
              }`}
            >
              Email Address
            </Label>
            <div className='relative'>
              <Input
                type='email'
                id='email'
                placeholder='Enter your email address'
                className={`w-full rounded-[8px] border-2 bg-white py-3 px-4 text-[#1e293b] placeholder-[#94a3b8] transition-all duration-300 hover:border-[#cbd5e1] focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 ${
                  errors.email
                    ? 'border-[#ef4444] focus:border-[#ef4444] focus:ring-[#ef4444]/20'
                    : 'border-[#e2e8f0]'
                }`}
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Please enter a valid email address'
                  }
                })}
              />
              {/* Email Icon */}
              <div className='absolute right-3 top-1/2 -translate-y-1/2'>
                <svg className={`h-5 w-5 ${errors.email ? 'text-[#ef4444]' : 'text-[#64748b]'}`} fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207' />
                </svg>
              </div>
            </div>
            {errors.email && (
              <div className='flex items-center gap-2 text-[#ef4444] text-sm font-medium'>
                <svg className='h-4 w-4' fill='currentColor' viewBox='0 0 20 20'>
                  <path fillRule='evenodd' d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z' clipRule='evenodd' />
                </svg>
                {errors.email.message}
              </div>
            )}
          </div>

          {/* Password Field */}
          <div className='space-y-3'>
            <div className='flex items-center justify-between'>
              <Label
                htmlFor='password'
                className={`text-sm font-semibold ${
                  errors.password ? 'text-[#ef4444]' : 'text-[#1e293b]'
                }`}
              >
                Password
              </Label>
              <Link
                to='/student/forgot-password'
                className='text-sm font-medium text-[#2563eb] hover:text-[#1d4ed8] hover:underline transition-colors duration-200'
              >
                Forgot password?
              </Link>
            </div>
            <div className='relative'>
              <PasswordInput
                id='password'
                placeholder='Enter your password'
                className={`w-full rounded-[8px] border-2 bg-white py-3 px-4 pr-12 text-[#1e293b] placeholder-[#94a3b8] transition-all duration-300 hover:border-[#cbd5e1] focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 ${
                  errors.password
                    ? 'border-[#ef4444] focus:border-[#ef4444] focus:ring-[#ef4444]/20'
                    : 'border-[#e2e8f0]'
                }`}
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                })}
              />
            </div>
            {errors.password && (
              <div className='flex items-center gap-2 text-[#ef4444] text-sm font-medium'>
                <svg className='h-4 w-4' fill='currentColor' viewBox='0 0 20 20'>
                  <path fillRule='evenodd' d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z' clipRule='evenodd' />
                </svg>
                {errors.password.message}
              </div>
            )}
          </div>

          {/* Enhanced Submit Button - Student Theme */}
          <Button
            type='submit'
            disabled={isLoading}
            loading={isLoading}
            className='w-full bg-gradient-to-r from-[#f59e0b] to-[#d97706] hover:from-[#d97706] hover:to-[#b45309] text-white font-semibold py-3 px-6 rounded-[8px] shadow-sm transition-all duration-300 hover:shadow-[0_4px_12px_rgba(245,158,11,0.25)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0'
          >
            {isLoading ? (
              <div className='flex items-center gap-2'>
           
                Signing In...
              </div>
            ) : (
              <div className='flex items-center justify-center gap-2'>
                <svg className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1' />
                </svg>
                Sign In
              </div>
            )}
          </Button>

          

        </div>
      </form>
    </CardContent>

    {/* Enhanced Footer */}
    <div className='border-t border-[#e2e8f0] bg-[#f8fafc] px-8 py-6'>
      <p className='text-center text-[#64748b] text-sm'>
        Don't have an account yet?{' '}
        <Link
          to='/student/register'
          className='font-semibold text-[#2563eb] hover:text-[#1d4ed8] hover:underline transition-colors duration-200'
        >
          Create Account
        </Link>
      </p>
    </div>
  </Card>
</div>
  )
}
