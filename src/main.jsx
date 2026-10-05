import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import './index.css'
import App from './App.jsx'

import ErrorBoundary from './components/ErrorBoundary.jsx'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <App />
        <Toaster
          position="bottom-right"
          richColors
          closeButton
          duration={3000}
          toastOptions={{
            style: { fontFamily: "'Manrope', system-ui, sans-serif", borderRadius: '0.75rem' },
          }}
        />
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>,
)
