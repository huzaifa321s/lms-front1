import { Link } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { SignUpForm } from './components/sign-up-form'
import { GraduationCap, Globe, TrendingUp, BarChart3 } from 'lucide-react'

export default function SignUp() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Section - Benefits */}
        <div className="hidden lg:block space-y-6">
          <div className="space-y-3">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent">
              Transform Lives
            </h1>
            <p className="text-xl text-slate-600">
              Share your expertise with thousands of eager learners worldwide
            </p>
          </div>

          <div className="space-y-4 pt-6">
            <div className="flex items-start gap-4 p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-blue-100 hover:border-blue-300 transition-all duration-300 hover:shadow-md">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 mb-1">Global Reach</h3>
                <p className="text-sm text-slate-600">Connect with students from every corner of the world</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-blue-100 hover:border-blue-300 transition-all duration-300 hover:shadow-md">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 mb-1">Flexible Income</h3>
                <p className="text-sm text-slate-600">Earn revenue from your courses on your own schedule</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-blue-100 hover:border-blue-300 transition-all duration-300 hover:shadow-md">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 mb-1">Advanced Analytics</h3>
                <p className="text-sm text-slate-600">Track progress and engagement with powerful insights</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Sign Up Form */}
        <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-4 pb-6">
            <div className="flex items-center justify-center w-16 h-16 rounded-full  mx-auto shadow-lg">
              <img src="/images/main-logo.jpg"/>
            </div>
            
            <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Create Your Account
            </CardTitle>
            
            <CardDescription className="text-center text-base text-slate-600">
              Join Bruce LMS and start your teaching journey
            </CardDescription>

            <div className="pt-2 text-center">
              <span className="text-sm text-slate-600">Already have an account? </span>
              <Link
                to="/teacher/login"
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors duration-200"
              >
                Sign In →
              </Link>
            </div>
          </CardHeader>

          <CardContent className="px-6 pb-6">
            <SignUpForm />
          </CardContent>

          {/* Mobile Benefits */}
          <div className="lg:hidden px-6 pb-4">
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 border border-blue-100">
                <Globe className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <span className="text-sm text-slate-700">Reach global students</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 border border-blue-100">
                <TrendingUp className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <span className="text-sm text-slate-700">Earn on your schedule</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 border border-blue-100">
                <BarChart3 className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <span className="text-sm text-slate-700">Track student progress</span>
              </div>
            </div>
          </div>

          <CardFooter className="flex-col space-y-4 px-6 pb-6">
            <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
            <p className="text-center text-xs text-slate-500 leading-relaxed">
              By creating an account, you agree to our{' '}
              <a
                href="/terms"
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
              >
                Terms of Service
              </a>{' '}
              and{' '}
              <a
                href="/privacy"
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
              >
                Privacy Policy
              </a>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}