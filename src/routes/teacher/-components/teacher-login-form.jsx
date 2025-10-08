import { useCallback, useState } from 'react'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useSearch } from '@tanstack/react-router'
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
import { BookOpen, Shield, Zap } from 'lucide-react'
import { handleLogin } from '../../../shared/config/reducers/teacher/teacherAuthSlice'

export function LoginForm({ className, ...props }) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(false)
  const redirectTo = useSearch({
    from: '/teacher/login',
    select: (search) => search.redirectTo,
  })

  const handleTeacherLogin = useCallback(
    async (data) => {
      setIsLoading(true)
      try {
        let response = await axios.post('/teacher/login', data)
        response = response.data
        if (response.success) {
          const { token, credentials } = response.data
          dispatch(handleLogin({ token, credentials }))
          toast.success('Logged in successfully!')
          reset()

          if (redirectTo) {
            navigate({ to: redirectTo, replace: true })
          } else {
            navigate({ to: '/teacher', replace: true })
          }
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Something went wrong')
      } finally {
        setIsLoading(false)
      }
    },
    [dispatch, navigate, redirectTo, reset]
  )

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Section - Features */}
        <div className="hidden lg:block space-y-6">
          <div className="space-y-3">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-xl text-slate-600">
              Continue your journey of empowering students worldwide
            </p>
          </div>

          <div className="space-y-4 pt-6">
            <div className="flex items-start gap-4 p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-blue-100 hover:border-blue-300 transition-all duration-300 hover:shadow-md">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 mb-1">Your Courses</h3>
                <p className="text-sm text-slate-600">Access and manage all your courses in one place</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-blue-100 hover:border-blue-300 transition-all duration-300 hover:shadow-md">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 mb-1">Secure Access</h3>
                <p className="text-sm text-slate-600">Your data is protected with enterprise-grade security</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-blue-100 hover:border-blue-300 transition-all duration-300 hover:shadow-md">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 mb-1">Real-Time Updates</h3>
                <p className="text-sm text-slate-600">Get instant notifications about student engagement</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Login Form */}
        <Card className={cn(
          "border-0 shadow-2xl bg-white/80 backdrop-blur-sm",
          className
        )}>
          <CardHeader className="space-y-4 pb-6">
            <div className="flex items-center justify-center w-16 h-16 rounded-full  mx-auto shadow-lg">
              <img src="/images/main-logo.jpg"/>
            </div>
            
            <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Teacher Login
            </CardTitle>
            
            <CardDescription className="text-center text-base text-slate-600">
              Access your dashboard and continue teaching
            </CardDescription>
          </CardHeader>

          <CardContent className="px-6 pb-6">
            <form onSubmit={handleSubmit(handleTeacherLogin)} className="space-y-5">
              {/* Email Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className={cn(
                    'text-sm font-medium text-slate-700',
                    errors.email && 'text-red-500'
                  )}
                >
                  Email Address
                </Label>
                <Input
                  type="text"
                  id="email"
                  placeholder="you@example.com"
                  {...register('email', { required: true })}
                  className={cn(
                    "h-11 rounded-lg border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200",
                    errors.email && "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                  )}
                />
                {errors.email && (
                  <span className="text-red-500 text-xs flex items-center gap-1">
                    <span className="inline-block w-1 h-1 rounded-full bg-red-500"></span>
                    Email is required
                  </span>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="password"
                    className={cn(
                      'text-sm font-medium text-slate-700',
                      errors.password && 'text-red-500'
                    )}
                  >
                    Password
                  </Label>
                  <Link
                    to="/teacher/forgot-password"
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                  >
                    Forgot?
                  </Link>
                </div>
                <PasswordInput
                  id="password"
                  placeholder="••••••••"
                  {...register('password', { required: true })}
                  className={cn(
                    "h-11 rounded-lg border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200",
                    errors.password && "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                  )}
                />
                {errors.password && (
                  <span className="text-red-500 text-xs flex items-center gap-1">
                    <span className="inline-block w-1 h-1 rounded-full bg-red-500"></span>
                    Password is required
                  </span>
                )}
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Logging in...
                  </span>
                ) : (
                  'Login to Dashboard'
                )}
              </Button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-white text-slate-500">New to Bruce LMS?</span>
                </div>
              </div>

              {/* Sign Up Link */}
              <div className="text-center">
                <Link
                  to="/teacher/register"
                  className="text-sm text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200"
                >
                  Create a Teacher Account →
                </Link>
              </div>
            </form>
          </CardContent>

          {/* Mobile Features */}
          <div className="lg:hidden px-6 pb-4">
            <div className="grid grid-cols-1 gap-2">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 border border-blue-100">
                <BookOpen className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span className="text-xs text-slate-700">Manage your courses</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 border border-blue-100">
                <Shield className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span className="text-xs text-slate-700">Secure & encrypted</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 pb-6">
            <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-4" />
            <p className="text-center text-xs text-slate-500 leading-relaxed">
              By logging in, you agree to our{' '}
              <Link
                to="/terms"
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
              >
                Terms
              </Link>{' '}
              and{' '}
              <Link
                to="/privacy"
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
              >
                Privacy Policy
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}