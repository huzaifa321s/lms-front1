import { useCallback, useState } from 'react'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { useQueryClient } from '@tanstack/react-query'
import {
  Link,
  useRouter,
  useSearch,
} from '@tanstack/react-router'
import { BookOpen, Trophy, Users, Sparkles } from 'lucide-react'
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
import image from '/images/main-logo.jpg'
import { useAppUtils } from '../../../hooks/useAppUtils'
import { handleLogin } from '../../../shared/config/reducers/student/studentAuthSlice'
import { courseQueryOptions } from '../courses/$courseID'

export default function LoginForm({ className, ...props }) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm()
  const { navigate, dispatch } = useAppUtils()
  const [isLoading, setIsLoading] = useState(false)
  const redirectTo = useSearch({
    from: '/student/login',
  })
  console.log('redirectTo', redirectTo)
  const queryClient = useQueryClient()
  const router = useRouter()
  const handleStudentLogin = useCallback(
    async (data) => {
      setIsLoading(true)
      try {
        let response = await axios.post('/student/login', data)
        response = response.data
        if (response.success) {
          const { token, credentials } = response.data
          console.log('creds students ===>', credentials)
          dispatch(
            handleLogin({
              token,
              credentials,
              subscription: credentials.subscription,
            })
          )
          console.log('redirectTo ===>', redirectTo)
          if (redirectTo?.redirect) {
            if (redirectTo?.courseID) {
              queryClient.invalidateQueries(
                courseQueryOptions({
                  courseID: redirectTo?.courseID,
                  userID: credentials?._id,
                })
              )
              await router.invalidate({
                routeId: '/student/courses/$courseID',
                params: { courseID: redirectTo?.courseID },
                search: { userID: credentials?._id },
              })
            }
            navigate({ to: redirectTo?.redirect })
          } else {
            console.log('condition true')
            navigate({ to: '/' })
          }
          toast.success('Logged in successfully')
          reset()
        }
      } catch (error) {
        console.log('error', error)
        toast.error(error.response.data.message)
      } finally {
        setIsLoading(false)
      }
    },
    [axios, toast, navigate, redirectTo]
  )

  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4'>
      <div className='grid w-full max-w-6xl items-center gap-8 lg:grid-cols-2'>
        {/* Left Section - Student Features */}
        <div className='hidden space-y-6 lg:block'>
          <div className='space-y-3'>
            <div className='inline-block'>
              <img
                src={image}
                alt='Bruce LMS'
                className='h-16 w-16 rounded-xl shadow-lg'
              />
            </div>
            <h1 className='bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-5xl font-bold text-transparent'>
              Welcome Back, Student!
            </h1>
            <p className='text-xl text-slate-600'>
              Continue your learning journey and unlock your potential
            </p>
          </div>

          <div className='space-y-4 pt-6'>
            <div className='flex items-start gap-4 rounded-xl border border-blue-100 bg-white/60 p-4 backdrop-blur-sm transition-all duration-300 hover:border-blue-300 hover:shadow-md'>
              <div className='flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600'>
                <BookOpen className='h-6 w-6 text-white' />
              </div>
              <div>
                <h3 className='mb-1 font-semibold text-slate-800'>
                  Your Courses
                </h3>
                <p className='text-sm text-slate-600'>
                  Access all your enrolled courses and track progress
                </p>
              </div>
            </div>

            <div className='flex items-start gap-4 rounded-xl border border-blue-100 bg-white/60 p-4 backdrop-blur-sm transition-all duration-300 hover:border-blue-300 hover:shadow-md'>
              <div className='flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600'>
                <Trophy className='h-6 w-6 text-white' />
              </div>
              <div>
                <h3 className='mb-1 font-semibold text-slate-800'>
                  Achievements
                </h3>
                <p className='text-sm text-slate-600'>
                  Earn certificates and badges as you complete courses
                </p>
              </div>
            </div>

            <div className='flex items-start gap-4 rounded-xl border border-blue-100 bg-white/60 p-4 backdrop-blur-sm transition-all duration-300 hover:border-blue-300 hover:shadow-md'>
              <div className='flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600'>
                <Users className='h-6 w-6 text-white' />
              </div>
              <div>
                <h3 className='mb-1 font-semibold text-slate-800'>Community</h3>
                <p className='text-sm text-slate-600'>
                  Connect with fellow learners and instructors
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Login Form */}
        <Card
          className={cn(
            'border-0 bg-white/80 shadow-2xl backdrop-blur-sm',
            className
          )}
        >
          <CardHeader className='space-y-4 pb-6'>
            <div className='mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg'>
              <Sparkles className='h-8 w-8 text-white' />
            </div>

            <CardTitle className='bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-center text-3xl font-bold text-transparent'>
              Student Login
            </CardTitle>

            <CardDescription className='text-center text-base text-slate-600'>
              Sign in to continue your learning journey
            </CardDescription>
          </CardHeader>

          <CardContent className='px-6 pb-6'>
            <form
              onSubmit={handleSubmit(handleStudentLogin)}
              className='space-y-5'
            >
              {/* Email Field */}
              <div className='space-y-2'>
                <Label
                  htmlFor='email'
                  className={cn(
                    'text-sm font-medium text-slate-700',
                    errors.email && 'text-red-500'
                  )}
                >
                  Email Address
                </Label>
                <Input
                  type='email'
                  id='email'
                  placeholder='you@example.com'
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Please enter a valid email address',
                    },
                  })}
                  className={cn(
                    'h-11 rounded-lg border-slate-200 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20',
                    errors.email &&
                      'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                  )}
                />
                {errors.email && (
                  <span className='flex items-center gap-1 text-xs text-red-500'>
                    <span className='inline-block h-1 w-1 rounded-full bg-red-500'></span>
                    {errors.email.message}
                  </span>
                )}
              </div>

              {/* Password Field */}
              <div className='space-y-2'>
                <div className='flex items-center justify-between'>
                  <Label
                    htmlFor='password'
                    className={cn(
                      'text-sm font-medium text-slate-700',
                      errors.password && 'text-red-500'
                    )}
                  >
                    Password
                  </Label>
                  <Link
                    to='/student/forgot-password'
                    className='text-xs font-medium text-blue-600 transition-colors duration-200 hover:text-blue-700'
                  >
                    Forgot?
                  </Link>
                </div>
                <PasswordInput
                  id='password'
                  placeholder='••••••••'
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                  className={cn(
                    'h-11 rounded-lg border-slate-200 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20',
                    errors.password &&
                      'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                  )}
                />
                {errors.password && (
                  <span className='flex items-center gap-1 text-xs text-red-500'>
                    <span className='inline-block h-1 w-1 rounded-full bg-red-500'></span>
                    {errors.password.message}
                  </span>
                )}
              </div>

              {/* Login Button - Student Theme */}
              <Button
                type='submit'
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <span className='flex items-center gap-2'>
                    <span className='h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white'></span>
                    Signing In...
                  </span>
                ) : (
                  'Sign In to Learn'
                )}
              </Button>

              {/* Divider */}
              <div className='relative my-6'>
                <div className='absolute inset-0 flex items-center'>
                  <div className='w-full border-t border-slate-200'></div>
                </div>
                <div className='relative flex justify-center text-xs'>
                  <span className='bg-white px-2 text-slate-500'>
                    New to Bruce LMS?
                  </span>
                </div>
              </div>

              {/* Sign Up Link */}
              <div className='text-center'>
                <Link
                  to='/student/register'
                  className='text-sm font-semibold text-blue-600 transition-colors duration-200 hover:text-blue-700'
                >
                  Create Student Account →
                </Link>
              </div>
            </form>
          </CardContent>

          {/* Mobile Features */}
          <div className='px-6 pb-4 lg:hidden'>
            <div className='grid grid-cols-1 gap-2'>
              <div className='flex items-center gap-3 rounded-lg border border-blue-100 bg-blue-50 p-3'>
                <BookOpen className='h-4 w-4 flex-shrink-0 text-blue-600' />
                <span className='text-xs text-slate-700'>
                  Access your courses
                </span>
              </div>
              <div className='flex items-center gap-3 rounded-lg border border-blue-100 bg-blue-50 p-3'>
                <Trophy className='h-4 w-4 flex-shrink-0 text-blue-600' />
                <span className='text-xs text-slate-700'>
                  Earn certificates
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className='px-6 pb-6'>
            <div className='mb-4 h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent' />
            <p className='text-center text-xs leading-relaxed text-slate-500'>
              Protected by enterprise-grade security
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
