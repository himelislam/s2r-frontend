import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Dashboard from '../src/app/dashboard/dashboard'
import Home from './components/pages/home'
import Referrer from './components/pages/referrer'
import Login from './components/pages/login'
import Signup from './components/pages/signup'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import RoleSelection from './components/pages/roleSelection'
import * as path from 'path'
import BusinessSetup from './components/pages/businessSetup'
import ReferrerSetup from './components/pages/referrerSetup'

const queryClient = new QueryClient()

import { appRoutes } from './Routes'

createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <StrictMode>
      <RouterProvider router={appRoutes} />
    </StrictMode>
  </QueryClientProvider>,
)
