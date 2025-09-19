import { createFileRoute } from '@tanstack/react-router'
import { LoginForm } from './-components/teacher-login-form'
import axios from 'axios'

export function showLoader() {
  // agar already loader exist hai to dobara na banao
  if (document.getElementById("custom-loader")) return

  const loader = document.createElement("div")
  loader.id = "custom-loader"
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


export const Route = createFileRoute('/teacher/login')({
  beforeLoad: () => {
    axios.interceptors.request.use(
      function (config) {
        //       document.body.classList.add('loading-indicator')
        showLoader()
        return config
      },
      function (error) {
        return Promise.reject(error)
      }
    )
    axios.interceptors.response.use(
      function (response) {
        //       document.body.classList.remove('loading-indicator')
        hideLoader()
        return response
      },
      function (error) {
        //       document.body.classList.remove('loading-indicator')
        hideLoader()
        return Promise.reject(error)
      }
    )
  },
  component: LoginPage,
})





export default function LoginPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-lg">
        <LoginForm />
      </div>
    </div>
  )
}
