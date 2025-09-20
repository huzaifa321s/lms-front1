import { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import {
  BookOpen,
  Brain,
  GraduationCap,
  LogIn,
  UserPlus,
  LayoutDashboard,
  Menu,
  X,
} from 'lucide-react'
import { useSelector } from 'react-redux'
import { Button } from '@/components/ui/button'
import { Show } from '../shared/utils/Show'
import { ProfileDropdown } from './_authenticated/student/features/tasks/-components/student-profile-dropdown'

export const NavbarRouteComponent = () => {
  const isLoggedIn = useSelector((state) => state.studentAuth.token)
    ? true
    : false
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <>
      <nav
        className='relative z-40 mx-auto flex h-16 w-full items-center justify-between border-b border-[#e2e8f0] bg-white px-6 shadow-[0_2px_10px_rgba(0,0,0,0.1)]'
        style={{ fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' }}
      >
        {/* Logo Section */}
        <div className='flex items-center'>
          <Link to='/' className='group flex items-center space-x-3'>
            {/* Hexagonal Logo with Primary Blue */}
            <div className='relative'>
              <img
                src='/images/main-logo.jpg'
                alt='Bruce LMS'
                width='40'
                height='40'
                className='rounded-full shadow-md'
                loading='lazy'
              />
            </div>
            <div className='hidden md:block'>
              <div className='text-xl font-bold tracking-tight text-[#1e293b]'>
                Bruce LMS
              </div>
              <div className='-mt-1 text-xs font-medium text-[#64748b]'>
                Learning Management System
              </div>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className='hidden items-center space-x-1 md:flex'>
          <Show>
            <Show.When isTrue={isLoggedIn}>
              <div className='flex items-center space-x-1'>
                {/* Navigation Links */}
                <Link
                  to='/student/quiz'
                  className='hover:bg-rgba(37,99,235,0.05) group flex items-center space-x-2 rounded-[8px] px-4 py-2 text-[#64748b] transition-all duration-200 hover:text-[#2563eb]'
                >
                  <Brain className='h-4 w-4 transition-transform duration-200 group-hover:scale-110' />
                  <span className='font-medium'>Quiz</span>
                  <div className='h-1.5 w-1.5 rounded-full bg-[#10b981] opacity-0 transition-opacity duration-200 group-hover:opacity-100'></div>
                </Link>

                <Link
                  to='/student/courses'
                  className='hover:bg-rgba(37,99,235,0.05) group flex items-center space-x-2 rounded-[8px] px-4 py-2 text-[#64748b] transition-all duration-200 hover:text-[#2563eb]'
                >
                  <BookOpen className='h-4 w-4 transition-transform duration-200 group-hover:scale-110' />
                  <span className='font-medium'>Courses</span>
                  <div className='h-1.5 w-1.5 rounded-full bg-[#10b981] opacity-0 transition-opacity duration-200 group-hover:opacity-100'></div>
                </Link>

                {/* Primary Dashboard Button - Student Theme */}
                <Button
                  size='sm'
                  onClick={() => navigate({ to: '/student/' })}
                  className='ml-4 flex items-center space-x-2 rounded-[8px] bg-gradient-to-r from-[#f59e0b] to-[#d97706] px-4 py-2 font-medium text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:from-[#d97706] hover:to-[#b45309] hover:shadow-[0_4px_12px_rgba(245,158,11,0.25)]'
                  style={{
                    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
                  }}
                >
                  <LayoutDashboard className='h-4 w-4' />
                  <span>Dashboard</span>
                </Button>

                <div className='ml-2'>
                  <ProfileDropdown />
                </div>
              </div>
            </Show.When>

            <Show.Else>
              <div className='flex items-center space-x-1'>
                {/* Guest Navigation Links */}
                <Link
                  to='/student/quiz'
                  className='hover:bg-rgba(37,99,235,0.05) group flex items-center space-x-2 rounded-[8px] px-4 py-2 text-[#64748b] transition-all duration-200 hover:text-[#2563eb]'
                >
                  <Brain className='h-4 w-4 transition-transform duration-200 group-hover:scale-110' />
                  <span className='font-medium'>Quiz</span>
                  <div className='h-1.5 w-1.5 rounded-full bg-[#10b981] opacity-0 transition-opacity duration-200 group-hover:opacity-100'></div>
                </Link>

                <Link
                  to='/student/courses'
                  className='hover:bg-rgba(37,99,235,0.05) group flex items-center space-x-2 rounded-[8px] px-4 py-2 text-[#64748b] transition-all duration-200 hover:text-[#2563eb]'
                >
                  <BookOpen className='h-4 w-4 transition-transform duration-200 group-hover:scale-110' />
                  <span className='font-medium'>Courses</span>
                  <div className='h-1.5 w-1.5 rounded-full bg-[#10b981] opacity-0 transition-opacity duration-200 group-hover:opacity-100'></div>
                </Link>

                {/* Secondary Login Button */}
                <Link
                  to='/student/login'
                  className='group ml-4 flex items-center space-x-2 rounded-[8px] border border-[#e2e8f0] bg-[#f1f5f9] px-2 py-1 font-medium text-[#475569] transition-all duration-200 hover:bg-[#e2e8f0]'
                >
                  <LogIn className='h-4 w-4 transition-transform duration-200 group-hover:scale-110' />
                  <span>Login</span>
                </Link>

                {/* Primary Register Button */}
                <Link
                  to='/student/register'
                  className='flex items-center space-x-2 rounded-[8px] bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] px-2 py-1 font-medium text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:from-[#1d4ed8] hover:to-[#1e40af] hover:shadow-[0_4px_12px_rgba(37,99,235,0.25)]'
                >
                  <UserPlus className='h-4 w-4' />
                  <span>Register</span>
                </Link>
              </div>
            </Show.Else>
          </Show>
        </div>

        {/* Mobile Menu Button */}
        <div className='md:hidden'>
          <Button
            variant='ghost'
            size='sm'
            onClick={toggleMobileMenu}
            className='hover:bg-rgba(37,99,235,0.05) rounded-[8px] p-2 text-[#64748b] hover:text-[#2563eb]'
          >
            {isMobileMenuOpen ? (
              <X className='h-5 w-5' />
            ) : (
              <Menu className='h-5 w-5' />
            )}
          </Button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          className='absolute top-16 right-0 left-0 z-50 border-b border-[#e2e8f0] bg-white shadow-[0_8px_25px_rgba(0,0,0,0.15)] md:hidden'
          style={{
            fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
          }}
        >
          <div className='space-y-2 px-6 py-4'>
            <Show>
              <Show.When isTrue={isLoggedIn}>
                {/* Mobile Navigation - Authenticated */}
                <Link
                  to='/student/quiz'
                  className='hover:bg-rgba(37,99,235,0.05) group flex items-center space-x-3 rounded-[8px] px-4 py-3 text-[#64748b] transition-all duration-200 hover:text-[#2563eb]'
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className='flex flex-1 items-center space-x-3'>
                    <Brain className='h-5 w-5' />
                    <span className='font-medium'>Quiz</span>
                  </div>
                  <div className='h-1.5 w-1.5 rounded-full bg-[#10b981] opacity-0 transition-opacity duration-200 group-hover:opacity-100'></div>
                </Link>

                <Link
                  to='/student/courses'
                  className='hover:bg-rgba(37,99,235,0.05) group flex items-center space-x-3 rounded-[8px] px-4 py-3 text-[#64748b] transition-all duration-200 hover:text-[#2563eb]'
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className='flex flex-1 items-center space-x-3'>
                    <BookOpen className='h-5 w-5' />
                    <span className='font-medium'>Courses</span>
                  </div>
                  <div className='h-1.5 w-1.5 rounded-full bg-[#10b981] opacity-0 transition-opacity duration-200 group-hover:opacity-100'></div>
                </Link>

                {/* Mobile Dashboard Button - Student Theme */}
                <Button
                  onClick={() => {
                    navigate({ to: '/student/' })
                    setIsMobileMenuOpen(false)
                  }}
                  className='flex w-full items-center justify-start space-x-3 rounded-[8px] bg-gradient-to-r from-[#f59e0b] to-[#d97706] px-4 py-3 font-medium text-white shadow-sm hover:from-[#d97706] hover:to-[#b45309]'
                >
                  <LayoutDashboard className='h-5 w-5' />
                  <span>Dashboard</span>
                </Button>
              </Show.When>

              <Show.Else>
                {/* Mobile Navigation - Guest */}
                <Link
                  to='/student/quiz'
                  className='hover:bg-rgba(37,99,235,0.05) group flex items-center space-x-3 rounded-[8px] px-4 py-3 text-[#64748b] transition-all duration-200 hover:text-[#2563eb]'
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className='flex flex-1 items-center space-x-3'>
                    <Brain className='h-5 w-5' />
                    <span className='font-medium'>Quiz</span>
                  </div>
                  <div className='h-1.5 w-1.5 rounded-full bg-[#10b981] opacity-0 transition-opacity duration-200 group-hover:opacity-100'></div>
                </Link>

                <Link
                  to='/student/courses'
                  className='hover:bg-rgba(37,99,235,0.05) group flex items-center space-x-3 rounded-[8px] px-4 py-3 text-[#64748b] transition-all duration-200 hover:text-[#2563eb]'
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className='flex flex-1 items-center space-x-3'>
                    <BookOpen className='h-5 w-5' />
                    <span className='font-medium'>Courses</span>
                  </div>
                  <div className='h-1.5 w-1.5 rounded-full bg-[#10b981] opacity-0 transition-opacity duration-200 group-hover:opacity-100'></div>
                </Link>

                {/* Mobile Login Button - Secondary */}
                <Link
                  to='/student/login'
                  className='flex items-center space-x-3 rounded-[8px] border border-[#e2e8f0] bg-[#f1f5f9] px-4 py-3 font-medium text-[#475569] transition-all duration-200 hover:bg-[#e2e8f0]'
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <LogIn className='h-5 w-5' />
                  <span>Login</span>
                </Link>

                {/* Mobile Register Button - Primary */}
                <Link
                  to='/student/register'
                  className='flex items-center space-x-3 rounded-[8px] bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] px-4 py-3 font-medium text-white shadow-sm hover:from-[#1d4ed8] hover:to-[#1e40af]'
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <UserPlus className='h-5 w-5' />
                  <span>Register</span>
                </Link>
              </Show.Else>
            </Show>
          </div>
        </div>
      )}
    </>
  )
}
