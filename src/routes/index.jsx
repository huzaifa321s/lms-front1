import { createFileRoute, Link, useNavigate } from "@tanstack/react-router"
import { useSelector } from "react-redux"
import { Button } from "@/components/ui/button"
import { Show } from "../shared/utils/Show"
import { ProfileDropdown } from "./_authenticated/student/features/tasks/-components/student-profile-dropdown"
import { BookOpen, Brain, GraduationCap, LogIn, UserPlus, LayoutDashboard, Menu, X, Clock } from "lucide-react"
import { useState } from "react"
import { NavbarRouteComponent } from "./-NavbarRouteComponent"
import { Footer } from "./student/Footer"



function LandingPage() {
  const isLoggedIn = useSelector((state) => state.studentAuth.token) ? true : false
    const navigate = useNavigate()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
    const toggleMobileMenu = () => {
      setIsMobileMenuOpen(!isMobileMenuOpen)
    }
  
  return (
    <>
<NavbarRouteComponent/>   
  <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="w-full max-w-2xl bg-white/90 border-2 border-slate-200 rounded-xl shadow-lg p-6 text-center backdrop-blur-sm">
        <h1 className="text-3xl font-bold text-slate-800 font-[Segoe UI, Tahoma, Geneva, Verdana, sans-serif]">
          Landing Page is Coming Soon
          <span className="ml-2 inline-block bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            <Clock className="w-4 h-4 inline mr-1" /> Stay Tuned!
          </span>
        </h1>
      </div>
    </main>
    <Footer/>
    </>
  )
}

export const Route = createFileRoute("/")({
  component: LandingPage,
})
