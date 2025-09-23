import axios from 'axios'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { NavbarRouteComponent } from '../-NavbarRouteComponent'
import { Footer } from './Footer'

// Simple Loader with Lucide Spinner

export function showLoader() {
  // agar already loader exist hai to dobara na banao
  if (document.getElementById('custom-loader')) return

  const loader = document.createElement('div')
  loader.id = 'custom-loader'
  loader.innerHTML = `
    <style>
      .custom-loader-container {
        position: fixed;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        background: transparent; /* no blur, clean bg */
      }
      .custom-spinner {
        display: inline-block;
        animation: spin 1s linear infinite;
      }
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    </style>

    <div class="custom-loader-container">
      <div class="custom-spinner">
        <!-- Lucide Spinner Icon -->
        <svg xmlns="http://www.w3.org/2000/svg" 
             width="64" height="64" 
             viewBox="0 0 24 24" 
             fill="none" stroke="currentColor" 
             stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
             class="lucide lucide-loader-2">
          <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
        </svg>
      </div>
    </div>
  `

  document.body.appendChild(loader)
}

function hideLoader() {
  const loader = document.getElementById('custom-loader')
  if (loader) {
    loader.remove()
  }
}

export const Route = createFileRoute('/student')({

  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className='flex min-h-screen flex-col'>
      <NavbarRouteComponent />
      {/* outlet area expands to fill space */}
      <main className='flex-1'>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
