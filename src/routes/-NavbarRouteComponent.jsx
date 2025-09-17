import {  Link, useNavigate } from "@tanstack/react-router"
import { useSelector } from "react-redux"
import { Button } from "@/components/ui/button"
import { Show } from "../shared/utils/Show"
import { ProfileDropdown } from "./_authenticated/student/features/tasks/-components/student-profile-dropdown"
import { BookOpen, Brain, GraduationCap, LogIn, UserPlus, LayoutDashboard, Menu, X } from "lucide-react"
import { useState } from "react"

export const NavbarRouteComponent = () => {
  const isLoggedIn = useSelector((state) => state.studentAuth.token) ? true : false
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <>
    <nav className="relative z-40 mx-auto flex h-16 w-full items-center justify-between px-6 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.1)] border-b border-[#e2e8f0]" style={{ fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' }}>
  {/* Logo Section */}
  <div className="flex items-center">
    <Link to="/" className="flex items-center space-x-3 group">
      {/* Hexagonal Logo with Primary Blue */}
      <div className="relative">
        <div className="w-10 h-10 bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-[#2563eb]/25 transition-all duration-300 border-2 border-[#2563eb]">
          <GraduationCap className="w-6 h-6 text-white" />
        </div>
        {/* Success Green Dot Indicator */}
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#10b981] rounded-full animate-pulse border border-white"></div>
      </div>
      <div className="hidden md:block">
        <div className="text-[#1e293b] text-xl font-bold tracking-tight">Bruce LMS</div>
        <div className="text-[#64748b] text-xs font-medium -mt-1">Learning Management System</div>
      </div>
    </Link>
  </div>

  {/* Desktop Navigation */}
  <div className="hidden md:flex items-center space-x-1">
    <Show>
      <Show.When isTrue={isLoggedIn}>
        <div className="flex items-center space-x-1">
          {/* Navigation Links */}
          <Link
            to="/student/quiz"
            className="flex items-center space-x-2 px-4 py-2 rounded-[8px] text-[#64748b] hover:text-[#2563eb] hover:bg-rgba(37,99,235,0.05) transition-all duration-200 group"
          >
            <Brain className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
            <span className="font-medium">Quiz</span>
            <div className="w-1.5 h-1.5 rounded-full bg-[#10b981] opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
          </Link>

          <Link
            to="/student/courses"
            className="flex items-center space-x-2 px-4 py-2 rounded-[8px] text-[#64748b] hover:text-[#2563eb] hover:bg-rgba(37,99,235,0.05) transition-all duration-200 group"
          >
            <BookOpen className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
            <span className="font-medium">Courses</span>
            <div className="w-1.5 h-1.5 rounded-full bg-[#10b981] opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
          </Link>

          {/* Primary Dashboard Button - Student Theme */}
          <Button
            size="sm"
            onClick={() => navigate({ to: "/student/" })}
            className="flex items-center space-x-2 ml-4 px-4 py-2 bg-gradient-to-r from-[#f59e0b] to-[#d97706] hover:from-[#d97706] hover:to-[#b45309] text-white rounded-[8px] shadow-sm hover:shadow-[0_4px_12px_rgba(245,158,11,0.25)] transition-all duration-300 hover:-translate-y-0.5 font-medium"
            style={{ fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' }}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </Button>

          <div className="ml-2">
            <ProfileDropdown />
          </div>
        </div>
      </Show.When>

      <Show.Else>
        <div className="flex items-center space-x-1">
          {/* Guest Navigation Links */}
          <Link
            to="/student/quiz"
            className="flex items-center space-x-2 px-4 py-2 rounded-[8px] text-[#64748b] hover:text-[#2563eb] hover:bg-rgba(37,99,235,0.05) transition-all duration-200 group"
          >
            <Brain className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
            <span className="font-medium">Quiz</span>
            <div className="w-1.5 h-1.5 rounded-full bg-[#10b981] opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
          </Link>

          <Link
            to="/student/courses"
            className="flex items-center space-x-2 px-4 py-2 rounded-[8px] text-[#64748b] hover:text-[#2563eb] hover:bg-rgba(37,99,235,0.05) transition-all duration-200 group"
          >
            <BookOpen className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
            <span className="font-medium">Courses</span>
            <div className="w-1.5 h-1.5 rounded-full bg-[#10b981] opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
          </Link>

          {/* Secondary Login Button */}
          <Link
            to="/student/login"
            className="flex items-center space-x-2 px-4 py-2 rounded-[8px] bg-[#f1f5f9] text-[#475569] hover:bg-[#e2e8f0] border border-[#e2e8f0] transition-all duration-200 group ml-4 font-medium"
          >
            <LogIn className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
            <span>Login</span>
          </Link>

          {/* Primary Register Button */}
          <Link
            to="/student/register"
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] hover:from-[#1d4ed8] hover:to-[#1e40af] text-white rounded-[8px] shadow-sm hover:shadow-[0_4px_12px_rgba(37,99,235,0.25)] transition-all duration-300 hover:-translate-y-0.5 font-medium"
          >
            <UserPlus className="w-4 h-4" />
            <span>Register</span>
          </Link>
        </div>
      </Show.Else>
    </Show>
  </div>

  {/* Mobile Menu Button */}
  <div className="md:hidden">
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleMobileMenu}
      className="p-2 text-[#64748b] hover:text-[#2563eb] hover:bg-rgba(37,99,235,0.05) rounded-[8px]"
    >
      {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
    </Button>
  </div>
</nav>

{/* Mobile Menu */}
{isMobileMenuOpen && (
  <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-[0_8px_25px_rgba(0,0,0,0.15)] border-b border-[#e2e8f0] z-50" style={{ fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' }}>
    <div className="px-6 py-4 space-y-2">
      <Show>
        <Show.When isTrue={isLoggedIn}>
          {/* Mobile Navigation - Authenticated */}
          <Link
            to="/student/quiz"
            className="flex items-center space-x-3 px-4 py-3 rounded-[8px] text-[#64748b] hover:text-[#2563eb] hover:bg-rgba(37,99,235,0.05) transition-all duration-200 group"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div className="flex items-center space-x-3 flex-1">
              <Brain className="w-5 h-5" />
              <span className="font-medium">Quiz</span>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-[#10b981] opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
          </Link>

          <Link
            to="/student/courses"
            className="flex items-center space-x-3 px-4 py-3 rounded-[8px] text-[#64748b] hover:text-[#2563eb] hover:bg-rgba(37,99,235,0.05) transition-all duration-200 group"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div className="flex items-center space-x-3 flex-1">
              <BookOpen className="w-5 h-5" />
              <span className="font-medium">Courses</span>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-[#10b981] opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
          </Link>

          {/* Mobile Dashboard Button - Student Theme */}
          <Button
            onClick={() => {
              navigate({ to: "/student/" })
              setIsMobileMenuOpen(false)
            }}
            className="flex items-center space-x-3 w-full justify-start px-4 py-3 bg-gradient-to-r from-[#f59e0b] to-[#d97706] hover:from-[#d97706] hover:to-[#b45309] text-white rounded-[8px] shadow-sm font-medium"
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </Button>
        </Show.When>

        <Show.Else>
          {/* Mobile Navigation - Guest */}
          <Link
            to="/student/quiz"
            className="flex items-center space-x-3 px-4 py-3 rounded-[8px] text-[#64748b] hover:text-[#2563eb] hover:bg-rgba(37,99,235,0.05) transition-all duration-200 group"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div className="flex items-center space-x-3 flex-1">
              <Brain className="w-5 h-5" />
              <span className="font-medium">Quiz</span>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-[#10b981] opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
          </Link>

          <Link
            to="/student/courses"
            className="flex items-center space-x-3 px-4 py-3 rounded-[8px] text-[#64748b] hover:text-[#2563eb] hover:bg-rgba(37,99,235,0.05) transition-all duration-200 group"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div className="flex items-center space-x-3 flex-1">
              <BookOpen className="w-5 h-5" />
              <span className="font-medium">Courses</span>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-[#10b981] opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
          </Link>

          {/* Mobile Login Button - Secondary */}
          <Link
            to="/student/login"
            className="flex items-center space-x-3 px-4 py-3 rounded-[8px] bg-[#f1f5f9] text-[#475569] hover:bg-[#e2e8f0] border border-[#e2e8f0] transition-all duration-200 font-medium"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <LogIn className="w-5 h-5" />
            <span>Login</span>
          </Link>

          {/* Mobile Register Button - Primary */}
          <Link
            to="/student/register"
            className="flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] hover:from-[#1d4ed8] hover:to-[#1e40af] text-white rounded-[8px] shadow-sm font-medium"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <UserPlus className="w-5 h-5" />
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