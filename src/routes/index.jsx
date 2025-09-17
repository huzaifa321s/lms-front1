import { createFileRoute, Link, useNavigate } from "@tanstack/react-router"
import { useSelector } from "react-redux"
import { Button } from "@/components/ui/button"
import { Show } from "../shared/utils/Show"
import { ProfileDropdown } from "./_authenticated/student/features/tasks/-components/student-profile-dropdown"
import { BookOpen, Brain, GraduationCap, LogIn, UserPlus, LayoutDashboard, Menu, X } from "lucide-react"
import { useState } from "react"
import { NavbarRouteComponent } from "./-NavbarRouteComponent"



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
      <main className="min-h-screen flex items-center justify-center">
        <h1 className="text-3xl font-bold">Welcome to Bruce LMS</h1>
      </main>
    </>
  )
}

export const Route = createFileRoute("/")({
  component: LandingPage,
})
