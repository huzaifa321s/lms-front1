import { memo } from 'react'
import { Link } from '@tanstack/react-router'
import {
  MapPin,
  Phone,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  footerLink1,
  footerLink2,
} from '../-components/partenerData'

const FooterComp = () => {
  const year = new Date().getFullYear()

  return (
    <footer className="relative bg-slate-900 text-gray-300">
      <div className="container px-4 sm:px-6 md:px-8 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          {/* Logo + About */}
          <div className="md:col-span-12 lg:col-span-4">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold">
              <img src="/images/main-logo.jpg" alt="Logo" className="h-10" loading="lazy" decoding="async" width={40} height={40} />
              <span className="text-white">Bruce LMS</span>
            </Link>
            <p className="mt-6 leading-relaxed text-gray-400">
              Discover a world of knowledge and opportunities with our online
              education platform. Pursue a new career with confidence.
            </p>

            <div className="mt-6 flex items-start gap-3">
              <MapPin className="h-5 w-5 text-violet-500" />
              <p>C/54 Northwest Freeway, Houston, USA 485</p>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <Phone className="h-5 w-5 text-violet-500" />
              <a href="tel:+152534-468-854" className="transition-colors hover:text-violet-400">
                +152 534-468-854
              </a>
            </div>
          </div>

          {/* Useful Links */}
          <div className="md:col-span-3 lg:col-span-2">
            <h5 className="text-lg font-semibold text-white">Useful Links</h5>
            <ul className="mt-6 space-y-3">
              {footerLink1.map((item, index) => (
                <li key={index} className="flex items-center gap-2">
                  <ChevronRight className="h-4 w-4 text-gray-500" />
                  <a href="#" onClick={(e) => e.preventDefault()} className="transition-colors hover:text-violet-400">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Institute Links */}
          <div className="md:col-span-3 lg:col-span-2">
            <h5 className="text-lg font-semibold text-white">Our Institute</h5>
            <ul className="mt-6 space-y-3">
              {footerLink2.map((item, index) => (
                <li key={index} className="flex items-center gap-2">
                  <ChevronRight className="h-4 w-4 text-gray-500" />
                  <a href="#" onClick={(e) => e.preventDefault()} className="transition-colors hover:text-violet-400">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Get In Touch */}
          <div className="md:col-span-6 lg:col-span-4">
            <h5 className="text-lg font-semibold text-white">Get In Touch</h5>
            <div className="mt-6 flex gap-3">
              <Button
                variant="outline"
                size="lg"
              >
                App Store
              </Button>
              <Button
                variant="outline"
                size="lg"
              >
                Play Store
              </Button>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <Separator className="bg-gray-700" />
      <div className="container flex flex-col items-center justify-between gap-4 py-6 text-sm text-gray-400 md:flex-row">
        <p>
          © {year} BruceLMS. Made with ❤️ by{' '}
          <a
            href="https://shreethemes.in/"
            className="transition-colors hover:text-violet-400"
            target="_blank"
            rel="noopener noreferrer"
          >
            Shreethemes
          </a>
        </p>
        <ul className="flex gap-4">
          <li>
            <Link to="/terms" preload="intent" className="hover:text-violet-400">
              Terms
            </Link>
          </li>
          <li>
            <Link to="/privacy" preload="intent" className="hover:text-violet-400">
              Privacy
            </Link>
          </li>
          <li>
            <Link to="/student/login" preload="intent" className="hover:text-violet-400">
              Login
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  )
}

export const Footer = memo(FooterComp)
