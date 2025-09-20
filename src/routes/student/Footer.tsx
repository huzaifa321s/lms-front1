import type React from "react"
import { Link } from "@tanstack/react-router"
import { cn } from "@/lib/utils"
import {
  BookOpen,
  Mail,
  Phone,
  Info,
  Users,
  FileText,
  LogOut,
  Github,
  Twitter,
  Linkedin,
  GraduationCap,
} from "lucide-react"

interface FooterProps extends React.HTMLAttributes<HTMLElement> {
  className?: string
}
import image from '../../../public/images/main-logo.jpg'

export function Footer({ className, ...props }: FooterProps) {
  return (
    <footer
      className={cn(
        "relative bg-gradient-to-br from-background via-muted/30 to-background border-t border-border/50 shadow-lg py-12 px-8 font-sans overflow-hidden",
        className,
      )}
      {...props}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.05),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.03),transparent_50%)] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Logo and Description */}
          <div className="flex flex-col items-start lg:col-span-1">
            <div className="flex items-center mb-6 group">
              <div className="relative">
               <img src={image} loading='lazy' width={50} height={50} />
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div>
                <span className="text-foreground text-2xl font-bold tracking-tight">Bruce LMS</span>
                <div className="flex items-center gap-1 mt-1">
                  <GraduationCap size={14} className="text-primary" />
                  <span className="text-xs text-muted-foreground font-medium">Learning Platform</span>
                </div>
              </div>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              Empowering students with cutting-edge learning tools and resources for academic excellence.
            </p>

            <div className="flex items-center gap-3 mt-6">
              <a
                href="#"
                className="p-2 rounded-lg bg-muted/50 text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-200 hover:scale-110"
              >
                <Twitter size={16} />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg bg-muted/50 text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-200 hover:scale-110"
              >
                <Linkedin size={16} />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg bg-muted/50 text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-200 hover:scale-110"
              >
                <Github size={16} />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-foreground text-lg font-bold mb-6 flex items-center gap-2">
              <div className="w-1 h-6 bg-primary rounded-full" />
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/student/courses"
                  className="group flex items-center gap-3 text-muted-foreground text-sm transition-all duration-200 hover:text-primary p-2 rounded-lg hover:bg-primary/5"
                >
                  <div className="p-1.5 rounded-md bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-200">
                    <BookOpen size={14} />
                  </div>
                  <span className="font-medium">Courses</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/student/quiz"
                  className="group flex items-center gap-3 text-muted-foreground text-sm transition-all duration-200 hover:text-primary p-2 rounded-lg hover:bg-primary/5"
                >
                  <div className="p-1.5 rounded-md bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-200">
                    <FileText size={14} />
                  </div>
                  <span className="font-medium">Quizzes</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/student/settings"
                  className="group flex items-center gap-3 text-muted-foreground text-sm transition-all duration-200 hover:text-primary p-2 rounded-lg hover:bg-primary/5"
                >
                  <div className="p-1.5 rounded-md bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-200">
                    <Users size={14} />
                  </div>
                  <span className="font-medium">Profile</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-foreground text-lg font-bold mb-6 flex items-center gap-2">
              <div className="w-1 h-6 bg-primary rounded-full" />
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="mailto:support@brucelms.com"
                  className="group flex items-center gap-3 text-muted-foreground text-sm transition-all duration-200 hover:text-primary p-2 rounded-lg hover:bg-primary/5"
                >
                  <div className="p-1.5 rounded-md bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-200">
                    <Mail size={14} />
                  </div>
                  <div>
                    <span className="font-medium block">Email Support</span>
                    <span className="text-xs opacity-75">support@brucelms.com</span>
                  </div>
                </a>
              </li>
              <li>
                <a
                  href="tel:+1234567890"
                  className="group flex items-center gap-3 text-muted-foreground text-sm transition-all duration-200 hover:text-primary p-2 rounded-lg hover:bg-primary/5"
                >
                  <div className="p-1.5 rounded-md bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-200">
                    <Phone size={14} />
                  </div>
                  <div>
                    <span className="font-medium block">Phone Support</span>
                    <span className="text-xs opacity-75">+1 (234) 567-890</span>
                  </div>
                </a>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="text-foreground text-lg font-bold mb-6 flex items-center gap-2">
              <div className="w-1 h-6 bg-primary rounded-full" />
              About
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/about"
                  className="group flex items-center gap-3 text-muted-foreground text-sm transition-all duration-200 hover:text-primary p-2 rounded-lg hover:bg-primary/5"
                >
                  <div className="p-1.5 rounded-md bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-200">
                    <Info size={14} />
                  </div>
                  <span className="font-medium">About Us</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="group flex items-center gap-3 text-muted-foreground text-sm transition-all duration-200 hover:text-primary p-2 rounded-lg hover:bg-primary/5"
                >
                  <div className="p-1.5 rounded-md bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-200">
                    <FileText size={14} />
                  </div>
                  <span className="font-medium">Terms of Service</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/student/login"
                  className="group flex items-center gap-3 text-muted-foreground text-sm transition-all duration-200 hover:text-destructive p-2 rounded-lg hover:bg-destructive/5"
                >
                  <div className="p-1.5 rounded-md bg-destructive/10 text-destructive group-hover:bg-destructive group-hover:text-destructive-foreground transition-all duration-200">
                    <LogOut size={14} />
                  </div>
                  <span className="font-medium">Log Out</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-muted-foreground text-sm text-center md:text-left">
              &copy; {new Date().getFullYear()} Bruce LMS. All rights reserved. Built with ❤️ for education.
            </p>
            <div className="flex items-center gap-6 text-xs text-muted-foreground">
              <Link to="/privacy" className="hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link to="/cookies" className="hover:text-primary transition-colors">
                Cookie Policy
              </Link>
              <Link to="/accessibility" className="hover:text-primary transition-colors">
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
