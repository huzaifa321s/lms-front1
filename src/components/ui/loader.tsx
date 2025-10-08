import React from 'react'
import { Loader2 } from 'lucide-react'

// 🔁 Reusable LoaderWrapper
const LoaderWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/10'>
      {children}
    </div>
  )
}

export const LoaderOne = () => {
  const transition = (x: number) => {
    return {
      duration: 1,
      repeat: Infinity,
      repeatType: 'loop' as const,
      delay: x * 0.2,
      ease: 'easeInOut',
    }
  }
  return (
    <LoaderWrapper>
      <div className='flex items-center gap-2'>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className='h-4 w-4 rounded-full border border-neutral-300 bg-gradient-to-b from-neutral-400 to-neutral-300'
          />
        ))}
      </div>
    </LoaderWrapper>
  )
}

export const LoaderTwo = () => {
  const transition = (x: number) => {
    return {
      duration: 2,
      repeat: Infinity,
      repeatType: 'loop' as const,
      delay: x * 0.2,
      ease: 'easeInOut',
    }
  }
  return (
    <LoaderWrapper>
      <div className='flex items-center'>
        {[0, 0.4, 0.8].map((delay, i) => (
          <div
            key={i}
            className={`h-4 w-4 rounded-full bg-neutral-200 shadow-md ${
              i === 1 ? '-translate-x-2' : i === 2 ? '-translate-x-4' : ''
            }`}
          />
        ))}
      </div>
    </LoaderWrapper>
  )
}

export function SmallLoader() {
  return (
    <div className='flex items-center justify-center p-4'>
      <Loader2 className='text-muted-foreground h-4 w-4 animate-spin' />
    </div>
  )
}

export const LoaderThree = () => {
  return (
    <>
      {/* Embedded CSS for hexagonal animations and responsive behavior */}
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

          @keyframes textGlow {
            0%, 100% { text-shadow: 0 0 10px rgba(37, 99, 235, 0.3); }
            50% { text-shadow: 0 0 20px rgba(37, 99, 235, 0.6), 0 0 30px rgba(37, 99, 235, 0.4); }
          }

          @keyframes progressFill {
            0% { width: 0%; }
            100% { width: 85%; }
          }

          @keyframes backgroundShift {
            0% { background-position: 0% 0%; }
            100% { background-position: 200% 100%; }
          }

          @keyframes shimmer {
            0% { left: -100%; }
            100% { left: 100%; }
          }

          .loader-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 99999;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 20px;
            box-sizing: border-box;
            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            overflow: hidden;
          }

          /* Decorative background hexagons */
          .loader-overlay::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background-image: 
              radial-gradient(circle at 30% 70%, rgba(37, 99, 235, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 70% 30%, rgba(16, 185, 129, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 50% 50%, rgba(245, 158, 11, 0.1) 0%, transparent 50%);
            animation: float1 8s ease-in-out infinite;
            pointer-events: none;
            clip-path: polygon(20% 0%, 80% 0%, 100% 50%, 80% 100%, 20% 100%, 0% 50%);
          }

          .loader-card {
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 24px;
            padding: 48px 56px;
            background: #ffffff;
            border: 1px solid #e2e8f0;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
            /* Hexagon shape for card */
            clip-path: polygon(15% 0%, 85% 0%, 100% 25%, 100% 75%, 85% 100%, 15% 100%, 0% 75%, 0% 25%);
            max-width: 380px;
            width: 100%;
            text-align: center;
            transition: all 0.4s ease;
            overflow: hidden;
            border-radius: 12px;
          }

          .loader-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 30%;
            height: 30%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            animation: shimmer 3s ease-in-out infinite;
            clip-path: polygon(20% 0%, 80% 0%, 100% 50%, 80% 100%, 20% 100%, 0% 50%);
          }

          .loader-card:hover {
            transform: translateY(-8px) scale(1.02);
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
            border-color: #cbd5e1;
          }

          .logo-container {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 120px;
            height: 120px;
          }

          /* Main hexagonal container */
          .hexagon {
            width: 120px;
            height: 120px;
            background: transparent;
            border: 4px solid #2563eb;
            clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
            position: relative;
            animation: hexagonPulse 2s ease-in-out infinite;
          }

          /* Outer hexagon - Green (Admin) */
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

          /* Middle hexagon - Red (Teacher) */
          .circle-middle {
            width: 60px;
            height: 60px;
            border: 3px solid transparent;
            border-bottom: 3px solid #ef4444;
            border-left: 3px solid #ef4444;
            border-top: 3px solid #ef4444;
            border-right: 3px solid #ef4444;
            clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            animation: rotateCounterClockwise 2.5s linear infinite;
          }

          /* Inner dashed hexagon - Yellow (Student) */
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

          /* Central star */
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

          /* Floating hexagonal particles */
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

          .loader-text {
            font-size: 2rem;
            font-weight: 700;
            background: linear-gradient(135deg, #2563eb, #1d4ed8);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            letter-spacing: -0.5px;
            animation: textGlow 2s ease-in-out infinite;
            margin: 0;
            color: #1e293b;
          }

          .loader-subtitle {
            font-size: 1rem;
            color: #64748b;
            font-weight: 500;
            margin: -8px 0 0 0;
            letter-spacing: 0.5px;
          }

          /* Hexagonal progress container */
          .progress-container {
            width: 100%;
            height: 12px;
            background: #f1f5f9;
            overflow: hidden;
            position: relative;
            box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
            clip-path: polygon(8% 0%, 92% 0%, 100% 50%, 92% 100%, 8% 100%, 0% 50%);
            border-radius: 8px;
          }

          .progress-bar {
            height: 100%;
            background: linear-gradient(90deg, #2563eb, #1d4ed8);
            background-size: 200% 100%;
            animation: progressFill 3s ease-out infinite, backgroundShift 4s linear infinite;
            box-shadow: 
              0 0 10px rgba(37, 99, 235, 0.4),
              inset 0 1px 0 rgba(255, 255, 255, 0.2);
            position: relative;
            clip-path: polygon(8% 0%, 92% 0%, 100% 50%, 92% 100%, 8% 100%, 0% 50%);
          }

          .progress-bar::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 50%;
            background: rgba(255, 255, 255, 0.2);
          }

          .loading-dots {
            display: flex;
            gap: 8px;
            margin-top: 8px;
          }

          /* Hexagonal dots */
          .dot {
            width: 8px;
            height: 8px;
            animation: dotPulse 1.5s ease-in-out infinite;
            opacity: 0.6;
            clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
          }

          .dot:nth-child(1) { 
            background: #10b981;
            animation-delay: 0s; 
          }
          .dot:nth-child(2) { 
            background: #ef4444;
            animation-delay: 0.2s; 
          }
          .dot:nth-child(3) { 
            background: #f59e0b;
            animation-delay: 0.4s; 
          }

          @keyframes dotPulse {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.3); }
          }

          /* Responsive Design */
          @media (max-width: 768px) {
            .loader-card {
              padding: 36px 40px;
              gap: 24px;
            }

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

            .loader-text {
              font-size: 1.6rem;
            }

            .loader-subtitle {
              font-size: 0.9rem;
            }
          }

          @media (max-width: 480px) {
            .loader-card {
              padding: 28px 32px;
              gap: 20px;
              margin: 0 16px;
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

            .loader-text {
              font-size: 1.4rem;
            }

            .loader-subtitle {
              font-size: 0.8rem;
            }

            .particle {
              width: 6px;
              height: 6px;
            }
          }

          @media (max-width: 320px) {
            .loader-card {
              padding: 24px 24px;
              gap: 16px;
            }
          }
        `}
      </style>

      {/* Loader UI */}
      <div className='loader-overlay'>
        <div className='loader-card'>
          {/* Educational Logo Animation */}
          <div className='logo-container'>
            <div className='hexagon'>
              <div className='circle-outer'></div>
              <div className='circle-middle'></div>
              <div className='circle-inner'></div>
              <div className='star'>★</div>

              {/* Floating hexagonal particles */}
              <div className='particle'></div>
              <div className='particle'></div>
              <div className='particle'></div>
            </div>
          </div>

          {/* Loading Text */}
          <div>
            <h2 className='loader-text'>Loading...</h2>
            <p className='loader-subtitle'>Please wait a moment</p>
          </div>

          {/* Hexagonal Progress Bar */}
          <div className='progress-container'>
            <div className='progress-bar'></div>
          </div>

          {/* Hexagonal Loading Dots */}
          <div className='loading-dots'>
            <div className='dot'></div>
            <div className='dot'></div>
            <div className='dot'></div>
          </div>
        </div>
      </div>
    </>
  )
}

export const LoaderFour = ({ text = 'Loading...' }: { text?: string }) => {
  return (
    <LoaderWrapper>
      <div className='relative font-bold text-black [perspective:1000px]'>
        <span className='relative z-20 inline-block'>{text}</span>
        <span className='absolute inset-0 text-[#00e571]/50 blur-[0.5px]'>
          {text}
        </span>
        <span className='absolute inset-0 text-[#8b00ff]/50'>{text}</span>
      </div>
    </LoaderWrapper>
  )
}

export const LoaderFive = ({ text }: { text: string }) => {
  return (
    <LoaderWrapper>
      <div className='font-sans font-bold [--shadow-color:var(--color-neutral-500)]'>
        {text.split('').map((char, i) => (
          <span key={i} className='inline-block'>
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </div>
    </LoaderWrapper>
  )
}
