import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Dashboard from '../src/app/dashboard/dashboard'
import Home from './components/home'
import Referrer from './components/referrer'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App/>
  },
  {
    path: '/dashboard',
    element: <Dashboard/>,
    children: [
      {
        index: true,
        element: <Home/>
      },
      {
        path: 'referrer',
        element: <Referrer/>
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
