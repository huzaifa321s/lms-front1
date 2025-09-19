import { StrictMode, Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import axios, { AxiosError } from 'axios'
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { Provider, useSelector } from 'react-redux'
import { toast } from 'sonner'
import { handleServerError } from '@/utils/handle-server-error'
import { FontProvider } from './context/font-context'
import { ThemeProvider } from './context/theme-context'
import UseAuth from './hooks/use-auth'
import './index.css'
// Generated Routes
import { routeTree } from './routeTree.gen'
import store from './shared/config/store/store'
import { getCookie } from './shared/utils/helperFunction'
import { LoaderThree } from '@/components/ui/loader'

// ✅ Create QueryClient with defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (import.meta.env.DEV) console.log({ failureCount, error })

        if (failureCount >= 0 && import.meta.env.DEV) return false
        if (failureCount > 3 && import.meta.env.PROD) return false

        return !(
          error instanceof AxiosError &&
          [401, 403].includes(error.response?.status ?? 0)
        )
      },
      refetchOnWindowFocus: import.meta.env.PROD,
      staleTime: 10 * 1000, // 10s
    },
    mutations: {
      onError: (error) => {
        handleServerError(error)
        if (error instanceof AxiosError) {
          if (error.response?.status === 304) {
            toast.error('Content not modified!')
          }
        }
      },
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          toast.error('Session expired!')
          const redirect = `${router.history.location.href}`
          router.navigate({ to: `${redirect}/login`,  })
        }
        if (error.response?.status === 500) {
          toast.error('Internal Server Error!')
          router.navigate({ to: '/500' })
        }
        if (error.response?.status === 403) {
          // router.navigate("/forbidden", { replace: true });
        }
      }
    },
  }),
})

// ✅ Create router (empty context type, we’ll provide later)
const router = createRouter({
  routeTree,
  context: { queryClient,authentication:'' },
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
})

// Stripe
const stripePromise = loadStripe(
  'pk_test_51P5zAtEdtHnRsYCMJUdZJ5Q6m6KA1LQfPxXsnKweKFvWiSsYMpEG4yRmG5jmzaBo0VBUeQSS5DTSBDDfnzLsiWGu00U3zAzcBU'
)

const App = () => {
  const authentication = UseAuth()

  // ✅ Axios setup
  axios.defaults.baseURL = import.meta.env.VITE_REACT_APP_API_BASE_URL
  console.log('axios.defaults.baseURL --->',axios.defaults.baseURL)
  const TOKEN = getCookie('studentToken')
  const credentials = useSelector((state) => state.studentAuth.credentials)
console.log('Token ====>',TOKEN);
console.log('credentials 34 ==>',credentials)

  if (TOKEN && credentials) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${TOKEN}`
  }

  console.log('authentication ===>', authentication)

  return (
    <RouterProvider
      router={router}
      context={{ queryClient, authentication }}
    />
  )
}

// ✅ Mount app
const rootElement = document.getElementById('root')
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <Suspense fallback={<LoaderThree />}>
      <Provider store={store}>
        <StrictMode>
          <QueryClientProvider client={queryClient}>
           
              <FontProvider>
                <Elements stripe={stripePromise}>
                  <App />
                </Elements>
              </FontProvider>
           
          </QueryClientProvider>
        </StrictMode>
      </Provider>
    </Suspense>
  )
}
