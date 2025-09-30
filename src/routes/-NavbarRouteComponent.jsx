import { useState } from "react"
import { Link, useNavigate } from "@tanstack/react-router"
import { useSelector } from "react-redux"
import {
  BookOpen,
  Brain,
  LayoutDashboard,
  LogIn,
  UserPlus,
  Menu,
} from "lucide-react"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ProfileDropdown } from "./_authenticated/student/features/tasks/-components/student-profile-dropdown"

export const NavbarRouteComponent = () => {
  const isLoggedIn = useSelector((state) => state.studentAuth.token) ? true : false
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md dark:bg-slate-900">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img
            src="/images/main-logo.jpg"
            alt="Bruce LMS"
            width={40}
            height={40}
            className="rounded-full shadow"
          />
          <span className="hidden text-lg font-bold text-slate-900 dark:text-white md:block">
            Bruce LMS
          </span>
        </Link>

        {/* Desktop Menu */}
    {/* Desktop Menu */}
<div className="hidden md:flex md:items-center md:space-x-4">
  <NavigationMenu>
    <NavigationMenuList>
      <NavigationMenuItem>
        <NavigationMenuTrigger>Learn</NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px]">
            <li>
              <NavigationMenuLink asChild>
                <Link
                  to="/student/quiz"
                  className="block select-none space-y-1 rounded-md p-3 hover:bg-accent hover:text-accent-foreground"
                >
                  <div className="text-sm font-medium leading-none">Quiz</div>
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    Practice quizzes and test your knowledge.
                  </p>
                </Link>
              </NavigationMenuLink>
            </li>
            <li>
              <NavigationMenuLink asChild>
                <Link
                  to="/student/courses"
                  className="block select-none space-y-1 rounded-md p-3 hover:bg-accent hover:text-accent-foreground"
                >
                  <div className="text-sm font-medium leading-none">Courses</div>
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    Explore different subjects and skill levels.
                  </p>
                </Link>
              </NavigationMenuLink>
            </li>
           
            <li>
              <NavigationMenuLink asChild>
                <Link
                  to="/student/blogs"
                  className="block select-none space-y-1 rounded-md p-3 hover:bg-accent hover:text-accent-foreground"
                >
                  <div className="text-sm font-medium leading-none">Blogs</div>
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    Read latest articles and updates.
                  </p>
                </Link>
              </NavigationMenuLink>
            </li>
             <li>
              <NavigationMenuLink asChild>
                <Link
                  to="/student/instructors"
                  className="block select-none space-y-1 rounded-md p-3 hover:bg-accent hover:text-accent-foreground"
                >
                  <div className="text-sm font-medium leading-none">Instructors</div>
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    Meet our expert instructors.
                  </p>
                </Link>
              </NavigationMenuLink>
            </li>
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
    </NavigationMenuList>
  </NavigationMenu>

  {isLoggedIn ? (
    <>
      <Button
        size="sm"
        onClick={() => navigate({ to: "/student/" })}
        className="rounded-md bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow hover:from-amber-600 hover:to-amber-700"
      >
        <LayoutDashboard className="mr-2 h-4 w-4" />
        Dashboard
      </Button>
      <ProfileDropdown />
    </>
  ) : (
    <>
      <Link
        to="/teacher/register"
        className="flex items-center rounded-md border px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50"
      >
        Become Instructor
      </Link>
      <Link
        to="/student/login"
        className="flex items-center rounded-md border px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
      >
        <LogIn className="mr-2 h-4 w-4" /> Login
      </Link>
      <Link
        to="/student/register"
        className="flex items-center rounded-md bg-gradient-to-r from-blue-600 to-blue-700 px-3 py-1.5 text-sm font-medium text-white shadow hover:from-blue-700 hover:to-blue-800"
      >
        <UserPlus className="mr-2 h-4 w-4" /> Register
      </Link>
    </>
  )}
</div>

{/* Mobile Menu */}
<div className="md:hidden">
  <Sheet open={open} onOpenChange={setOpen}>
    <SheetTrigger asChild>
      <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100">
        <Menu className="h-6 w-6" />
      </Button>
    </SheetTrigger>

    <SheetContent side="right" className="w-[85%] max-w-sm p-6 flex flex-col bg-white dark:bg-slate-900">
      {/* Header */}
      <div className="mb-6 flex items-center space-x-3">
        <img src="/images/main-logo.jpg" alt="Bruce LMS" width={36} height={36} className="rounded-full shadow" />
        <span className="text-lg font-bold text-slate-900 dark:text-white">Bruce LMS</span>
      </div>

      {/* Links */}
      <div className="flex flex-col space-y-3">
        <Link to="/student/quiz" onClick={() => setOpen(false)} className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
          <Brain className="h-5 w-5" /> <span className="text-sm font-medium">Quiz</span>
        </Link>
        <Link to="/student/courses" onClick={() => setOpen(false)} className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
          <BookOpen className="h-5 w-5" /> <span className="text-sm font-medium">Courses</span>
        </Link>
 
        <Link to="/student/blogs" onClick={() => setOpen(false)} className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
          <BookOpen className="h-5 w-5" /> <span className="text-sm font-medium">Blogs</span>
        </Link>
               <Link to="/student/instructors" onClick={() => setOpen(false)} className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
          <UserPlus className="h-5 w-5" /> <span className="text-sm font-medium">Instructors</span>
        </Link>

        {/* Auth Buttons */}
        {isLoggedIn ? (
          <>
            <Button onClick={() => { navigate({ to: "/student/" }); setOpen(false); }} className="w-full flex items-center justify-start rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-3 py-2 text-white">
              <LayoutDashboard className="mr-2 h-5 w-5" /> Dashboard
            </Button>
            <ProfileDropdown />
          </>
        ) : (
          <>
            <Link to="/teacher/register" onClick={() => setOpen(false)} className="flex items-center space-x-3 px-3 py-2 rounded-lg border hover:bg-blue-50">
              <UserPlus className="h-5 w-5" /> <span>Become Instructor</span>
            </Link>
            <Link to="/student/login" onClick={() => setOpen(false)} className="flex items-center space-x-3 px-3 py-2 rounded-lg border hover:bg-slate-100">
              <LogIn className="h-5 w-5" /> <span>Login</span>
            </Link>
            <Link to="/student/register" onClick={() => setOpen(false)} className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white">
              <UserPlus className="h-5 w-5" /> <span>Register</span>
            </Link>
          </>
        )}
      </div>
    </SheetContent>
  </Sheet>
</div>

      </div>
    </nav>
  )
}
