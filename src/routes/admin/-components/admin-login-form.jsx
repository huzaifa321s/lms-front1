import { useCallback, useState } from 'react'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { Link } from '@tanstack/react-router'
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
import { Shield, Lock, Database, Settings } from 'lucide-react'

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

  const handleAdminLogin = useCallback(
    async (data) => {
      if(props.disabled) return
      setIsLoading(true)
      try {
        let response = await axios.post('/admin/login', data)
        response = response.data
        if (response.success) {
          navigate({ to: '/admin' })
          toast.success('Logged in successfully')
          const { token, credentials } = response.data
          document.cookie = `adminToken=${token}; path=/`
          document.cookie = `adminCredentials=${JSON.stringify(credentials)}; path=/`
          dispatch(handleLogin({ token, credentials }))
          reset()
        }
      } catch (error) {
        console.log('error', error)
        toast.error(error.response ? error.response.data.message : "Internal server error")
      } finally {
        setIsLoading(false)
      }
    },
    [axios, toast, navigate, props.disabled]
  )

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Section - Admin Features */}
        <div className="hidden lg:block space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-400/20 backdrop-blur-sm">
              <Shield className="w-5 h-5 text-blue-400" />
              <span className="text-sm font-medium text-blue-300">Admin Portal</span>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-blue-300 to-blue-500 bg-clip-text text-transparent">
              System Access
            </h1>
            <p className="text-xl text-slate-300">
              Secure administrative control panel
            </p>
          </div>

          <div className="space-y-4 pt-6">
            <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-blue-400/50 transition-all duration-300 hover:bg-white/10">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                <Database className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Full System Control</h3>
                <p className="text-sm text-slate-400">Manage users, courses, and platform settings</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-blue-400/50 transition-all duration-300 hover:bg-white/10">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Advanced Security</h3>
                <p className="text-sm text-slate-400">Multi-layer authentication and access control</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-blue-400/50 transition-all duration-300 hover:bg-white/10">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">System Configuration</h3>
                <p className="text-sm text-slate-400">Configure platform-wide settings and permissions</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Login Form */}
        <Card className={cn(
          "border-0 shadow-2xl bg-slate-800/50 backdrop-blur-xl border border-white/10",
          className
        )}>
          <CardHeader className="space-y-4 pb-6">
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 mx-auto shadow-lg shadow-blue-500/50">
              <Shield className="w-8 h-8 text-white" />
            </div>
            
            <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">
              Admin Login
            </CardTitle>
            
            <CardDescription className="text-center text-base text-slate-400">
              Enter your credentials to access the control panel
            </CardDescription>
          </CardHeader>

          <CardContent className="px-6 pb-6">
            <form onSubmit={handleSubmit(handleAdminLogin)} className="space-y-5">
              {/* Email Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className={cn(
                    'text-sm font-medium text-slate-300',
                    errors.email && 'text-red-400'
                  )}
                >
                  Admin Email
                </Label>
                <Input
                  type="text"
                  id="email"
                  placeholder="admin@example.com"
                  {...register('email', { required: true })}
                  className={cn(
                    "h-11 rounded-lg bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200",
                    errors.email && "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                  )}
                />
                {errors.email && (
                  <span className="text-red-400 text-xs flex items-center gap-1">
                    <span className="inline-block w-1 h-1 rounded-full bg-red-400"></span>
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
                      'text-sm font-medium text-slate-300',
                      errors.password && 'text-red-400'
                    )}
                  >
                    Password
                  </Label>
                  <Link
                    to="/admin/forgot-password"
                    className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200"
                  >
                    Forgot?
                  </Link>
                </div>
                <PasswordInput
                  id="password"
                  placeholder="••••••••"
                  {...register('password', { required: true })}
                  className={cn(
                    "h-11 rounded-lg bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200",
                    errors.password && "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                  )}
                />
                {errors.password && (
                  <span className="text-red-400 text-xs flex items-center gap-1">
                    <span className="inline-block w-1 h-1 rounded-full bg-red-400"></span>
                    Password is required
                  </span>
                )}
              </div>

              {/* Login Button - Admin Theme */}
              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Authenticating...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Access Dashboard
                  </span>
                )}
              </Button>

              {/* Security Notice */}
              <div className="mt-6 p-3 rounded-lg bg-blue-500/10 border border-blue-400/20">
                <div className="flex items-start gap-2">
                  <Shield className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-400 leading-relaxed">
                    This is a secure admin area. All login attempts are monitored and logged.
                  </p>
                </div>
              </div>
            </form>
          </CardContent>

          {/* Mobile Features */}
          <div className="lg:hidden px-6 pb-4">
            <div className="grid grid-cols-1 gap-2">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                <Database className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span className="text-xs text-slate-400">Full system control</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                <Lock className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span className="text-xs text-slate-400">Advanced security</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 pb-6">
            <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent mb-4" />
            <p className="text-center text-xs text-slate-500 leading-relaxed">
              Protected by enterprise-grade encryption
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}