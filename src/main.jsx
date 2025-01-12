import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { appRoutes } from './Routes'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { UserProvider } from './context/usercontext'
import { BusinessProvider } from './context/business/BusinessContext'
import { ReferrerProvider } from './context/referrer/ReferrerContext'


const queryClient = new QueryClient()


createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <StrictMode>
      <UserProvider>
        <BusinessProvider>
          <ReferrerProvider>
            <RouterProvider router={appRoutes} />
            <ToastContainer />
          </ReferrerProvider>
        </BusinessProvider>
      </UserProvider>
    </StrictMode>
  </QueryClientProvider>,
)
