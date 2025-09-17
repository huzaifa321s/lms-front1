import { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LogoutModal } from '../../../../../../shared/components/LogoutModal'
import { handleLogout } from '../../../../../../shared/config/reducers/student/studentAuthSlice'
import {
  User,
  Settings,
  CreditCard,
  Receipt,
  LogOut,
  Home,
  ChevronDown,
} from 'lucide-react'

export function ProfileDropdown() {
  const credentials = useSelector((state) => state.studentAuth?.credentials)
  const navigate = useNavigate()
  const [logoutModalCondition, setLogoutModalCondition] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch()
  const role = 'student'
  const roleColor = '#f59e0b'

  const logout = () => {
    setIsLoading(true)
    dispatch(handleLogout())
    setIsLoading(false)
    toast.success('You have been logged out successfully.')
    navigate({ to: '/' })
  }

  return (
    <>
      {isLoading && (
        <>
          <style>
            {`
              @keyframes hexagonPulse {
                0%, 100% { 
                  transform: scale(1) rotate(0deg);
                  border-color: #2563eb;
                }
                50% { 
                  transform: scale(1.05) rotate(5deg);
                  border-color: #1d4ed8;
                  filter: drop-shadow(0 0 20px rgba(37, 99, 235, 0.3));
                }
              }

              @keyframes rotateClockwise {
                0% { transform: translate(-50%, -50%) rotate(0deg); }
                100% { transform: translate(-50%, -50%) rotate(360deg); }
              }

              @keyframes rotateCounterClockwise {
                0% { transform: translate(-50%, -50%) rotate(360deg); }
                100% { transform: translate(-50%, -50%) rotate(0deg); }
              }

              @keyframes dashRotate {
                0% { transform: translate(-50%, -50%) rotate(0deg); }
                100% { transform: translate(-50%, -50%) rotate(360deg); }
              }

              @keyframes innerPulse {
                0% { 
                  opacity: 0.6;
                  border-width: 2px;
                }
                100% { 
                  opacity: 1;
                  border-width: 3px;
                }
              }

              @keyframes starGlow {
                0% { 
                  transform: translate(-50%, -50%) scale(1);
                  filter: drop-shadow(0 0 5px rgba(37, 99, 235, 0.5));
                }
                100% { 
                  transform: translate(-50%, -50%) scale(1.2);
                  filter: drop-shadow(0 0 15px rgba(37, 99, 235, 0.8));
                }
              }

              @keyframes float1 {
                0%, 100% { 
                  transform: translate(0, 0) scale(1) rotate(0deg);
                  opacity: 0.6;
                }
                50% { 
                  transform: translate(30px, -20px) scale(1.5) rotate(180deg);
                  opacity: 1;
                }
              }

              @keyframes float2 {
                0%, 100% { 
                  transform: translate(0, 0) scale(1) rotate(0deg);
                  opacity: 0.6;
                }
                50% { 
                  transform: translate(-25px, -15px) scale(1.2) rotate(120deg);
                  opacity: 1;
                }
              }

              @keyframes float3 {
                0%, 100% { 
                  transform: translate(0, 0) scale(1) rotate(0deg);
                  opacity: 0.6;
                }
                50% { 
                  transform: translate(20px, 25px) scale(1.8) rotate(240deg);
                  opacity: 1;
                }
              }

              .loader-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 999999;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
                box-sizing: border-box;
                background: #f8fafc;
              }

              .loader-card {
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                background: #ffffff;
                max-width: 380px;
                width: 100%;
                text-align: center;
                border: 1px solid #e2e8f0;
                border-radius: 12px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.05);
              }

              .logo-container {
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 120px;
                height: 120px;
              }

              .hexagon {
                width: 120px;
                height: 120px;
                background: #ffffff;
                border: 4px solid #2563eb;
                clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
                position: relative;
                animation: hexagonPulse 2s ease-in-out infinite;
              }

              .circle-outer {
                width: 80px;
                height: 80px;
                border: 4px solid transparent;
                border-top: 4px solid #10b981;
                border-right: 4px solid #10b981;
                clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                animation: rotateClockwise 3s linear infinite;
              }

              .circle-middle {
                width: 60px;
                height: 60px;
                border: 3px solid #ef4444;
                clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                animation: rotateCounterClockwise 2.5s linear infinite;
              }

              .circle-inner {
                width: 40px;
                height: 40px;
                border: 2px dashed #f59e0b;
                clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                animation: dashRotate 4s linear infinite, innerPulse 2s ease-in-out infinite alternate;
              }

              .star {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 20px;
                height: 20px;
                font-size: 20px;
                color: #2563eb;
                animation: starGlow 1.5s ease-in-out infinite alternate;
              }

              .particle {
                position: absolute;
                width: 8px;
                height: 8px;
                opacity: 0.6;
                clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
              }

              .particle:nth-child(1) {
                top: 20%;
                left: 80%;
                background: #10b981;
                animation: float1 4s ease-in-out infinite;
              }

              .particle:nth-child(2) {
                top: 70%;
                left: 10%;
                background: #ef4444;
                animation: float2 3s ease-in-out infinite 1s;
              }

              .particle:nth-child(3) {
                top: 30%;
                right: 15%;
                background: #f59e0b;
                animation: float3 5s ease-in-out infinite 2s;
              }

              @media (max-width: 768px) {
                .logo-container {
                  width: 100px;
                  height: 100px;
                }

                .hexagon {
                  width: 100px;
                  height: 100px;
                }

                .circle-outer {
                  width: 66px;
                  height: 66px;
                }

                .circle-middle {
                  width: 50px;
                  height: 50px;
                }

                .circle-inner {
                  width: 34px;
                  height: 34px;
                }

                .star {
                  font-size: 16px;
                }
              }

              @media (max-width: 480px) {
                .loader-card {
                  padding: 16px;
                }

                .logo-container {
                  width: 80px;
                  height: 80px;
                }

                .hexagon {
                  width: 80px;
                  height: 80px;
                }

                .circle-outer {
                  width: 52px;
                  height: 52px;
                }

                .circle-middle {
                  width: 40px;
                  height: 40px;
                }

                .circle-inner {
                  width: 26px;
                  height: 26px;
                }

                .star {
                  font-size: 14px;
                }

                .particle {
                  width: 6px;
                  height: 6px;
                }
              }
            `}
          </style>
          <div className="loader-overlay">
            <div className="loader-card">
              <div className="logo-container">
                <div className="hexagon">
                  <div className="circle-outer"></div>
                  <div className="circle-middle"></div>
                  <div className="circle-inner"></div>
                  <div className="star">★</div>
                  <div className="particle"></div>
                  <div className="particle"></div>
                  <div className="particle"></div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <LogoutModal
        modalCondition={logoutModalCondition}
        handleModalClose={setLogoutModalCondition}
        isLoading={isLoading}
        logout={logout}
      />

      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative h-10 px-4 rounded-[8px] bg-[#ffffff] border border-[#e2e8f0] shadow-[0_4px_6px_rgba(0,0,0,0.05)] transition-all duration-300 hover:bg-[#f1f5f9] hover:border-[#cbd5e1] hover:scale-[1.02] hover:shadow-[0_6px_12px_rgba(0,0,0,0.1)]"
            size="sm"
          >
            <Avatar className="h-8 w-8 rounded-full ring-2 ring-[#e2e8f0]">
              <AvatarImage src="/avatars/01.png" alt="profile" />
              <AvatarFallback className="rounded-full bg-[#f1f5f9] text-[#1e293b]">
                {console.log('crdentials -->', credentials)}
                {`${credentials?.firstName?.charAt(0).toUpperCase() ?? ''}${credentials?.lastName?.charAt(0).toUpperCase() ?? ''}`}
              </AvatarFallback>
            </Avatar>
            <ChevronDown size={20} className="ml-2 text-[#64748b]" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-56 rounded-[8px] bg-[#ffffff] border border-[#e2e8f0] shadow-[0_4px_6px_rgba(0,0,0,0.05)] p-2 mt-2 font-['Segoe_UI',_Tahoma,_Geneva,_Verdana,_sans-serif]"
          align="end"
          forceMount
        >
          <DropdownMenuLabel className="font-normal px-4 py-2 text-[#1e293b]">
            <div className="flex flex-col space-y-1">
              <p className="text-sm leading-none font-bold">
                {credentials?.firstName} {credentials?.lastName}
              </p>
              <p className="text-sm leading-none text-[#64748b]">
                {credentials?.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-[#e2e8f0] my-2" />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild className="rounded-[8px] transition-all duration-200 hover:bg-[#2563eb]/10 hover:text-[#1d4ed8] focus:bg-[#2563eb]/10 focus:text-[#1d4ed8]">
              <Link to="/" className="flex items-center gap-2">
                <Home size={16} className="text-[#2563eb]" />
                Home
                <DropdownMenuShortcut className="text-[#64748b]">⇧⌘H</DropdownMenuShortcut>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="rounded-[8px] transition-all duration-200 hover:bg-[#2563eb]/10 hover:text-[#1d4ed8] focus:bg-[#2563eb]/10 focus:text-[#1d4ed8]">
              <Link to="/student/settings" className="flex items-center gap-2">
                <User size={16} className="text-[#2563eb]" />
                Profile
                <DropdownMenuShortcut className="text-[#64748b]">⇧⌘P</DropdownMenuShortcut>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="rounded-[8px] transition-all duration-200 hover:bg-[#2563eb]/10 hover:text-[#1d4ed8] focus:bg-[#2563eb]/10 focus:text-[#1d4ed8]">
              <Link to="/student/setting/billing" className="flex items-center gap-2">
                <CreditCard size={16} className="text-[#2563eb]" />
                Billing
                <DropdownMenuShortcut className="text-[#64748b]">⌘B</DropdownMenuShortcut>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="rounded-[8px] transition-all duration-200 hover:bg-[#2563eb]/10 hover:text-[#1d4ed8] focus:bg-[#2563eb]/10 focus:text-[#1d4ed8]">
              <Link to="/student/setting/invoices" className="flex items-center gap-2">
                <Receipt size={16} className="text-[#2563eb]" />
                Invoices
                <DropdownMenuShortcut className="text-[#64748b]">⌘I</DropdownMenuShortcut>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator className="bg-[#e2e8f0] my-2" />
          <DropdownMenuItem
            onClick={() => setLogoutModalCondition(true)}
            className="rounded-[8px] transition-all duration-200 hover:bg-[#ef4444]/10 hover:text-[#dc2626] focus:bg-[#ef4444]/10 focus:text-[#dc2626]"
          >
            <LogOut size={16} className="mr-2 text-[#dc2626]" />
            Log out
            <DropdownMenuShortcut className="text-[#64748b]">⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
