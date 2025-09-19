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
                <svg
                  width={36}
                  height={38}
                  fill="currentColor"
                  className="mr-3 text-primary transition-all duration-300 group-hover:scale-110 group-hover:text-accent"
                >
                  <path d="M29.24 22.68c-.16-.39-.31-.8-.47-1.15l-.74-1.67-.03-.03c-2.2-4.8-4.55-9.68-7.04-14.48l-.1-.2c-.25-.47-.5-.99-.76-1.47-.32-.57-.63-1.18-1.14-1.76a5.3 5.3 0 00-8.2 0c-.47.58-.82 1.19-1.14 1.76-.25.52-.5 1.03-.76 1.5l-.1.2c-2.45 4.8-4.84 9.68-7.04 14.48l-.06.06c-.22.52-.48 1.06-.73 1.64-.16.35-.32.73-.48 1.15a6.8 6.8 0 007.2 9.23 8.38 8.38 0 003.18-1.1c1.3-.73 2.55-1.79 3.95-3.32 1.4 1.53 2.68 2.59 3.95 3.33A8.38 8.38 0 0022.75 32a6.79 6.79 0 006.75-5.83 5.94 5.94 0 00-.26-3.5zm-14.36 1.66c-1.72-2.2-2.84-4.22-3.22-5.95a5.2 5.2 0 01-.1-1.96c.07-.51.26-.96.52-1.34.6-.87 1.65-1.41 2.8-1.41a3.3 3.3 0 012.8 1.4c.26.4.45.84.51 1.35.1.58.06 1.25-.1 1.96-.38 1.7-1.5 3.74-3.21 5.95zm12.74 1.48a4.76 4.76 0 01-2.9 3.75c-.76.32-1.6.41-2.42.32-.8-.1-1.6-.36-2.42-.84a15.64 15.64 0 01-3.63-3.1c2.1-2.6 3.37-4.97 3.85-7.08.23-1 .26-1.9.16-2.73a5.53 5.53 0 00-.86-2.2 5.36 5.36 0 00-4.49-2.28c-1.85 0-3.5.86-4.5 2.27a5.18 5.18 0 00-.85 2.21c-.13.84-.1 1.77.16 2.73.48 2.11 1.78 4.51 3.85 7.1a14.33 14.33 0 01-3.63 3.12c-.83.48-1.62.73-2.42.83a4.76 4.76 0 01-5.32-4.07c-.1-.8-.03-1.6.29-2.5.1-.32.25-.64.41-1.02.22-.52.48-1.06.73-1.6l.04-.07c2.16-4.77 4.52-9.64 6.97-14.41l.1-.2c.25-.48.5-.99.76-1.47.26-.51.54-1 .9-1.4a3.32 3.32 0 015.09 0c.35.4.64.89.9 1.4.25.48.5 1 .76 1.47l.1.2c2.44 4.77 4.8 9.64 7 14.41l.03.03c.26.52.48 1.1.73 1.6.16.39.32.7.42 1.03.19.9.29 1.7.19 2.5z" />
                </svg>
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
