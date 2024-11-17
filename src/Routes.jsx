import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Login from "./components/pages/login";
import Signup from "./components/pages/signup";
import Dashboard from '../src/app/dashboard/dashboard'
import Home from "./components/pages/home";
import Referrer from "./components/pages/referrer";
import RoleSelection from "./components/pages/roleSelection";
import BusinessSetup from "./components/pages/businessSetup";
import ReferrerSetup from "./components/pages/referrerSetup";


export const appRoutes = createBrowserRouter([
    {
      path: '/',
      element: <App />
    },
    {
      path: 'login',
      element: <Login />
    },
    {
      path: 'signup',
      element: <Signup />
    },
    {
      path: 'dashboard',
      element: <Dashboard />,
      children: [
        {
          index: true,
          element: <Home />
        },
        {
          path: 'referrer',
          element: <Referrer />
        }
      ]
    },
    {
      path: 'select-role',
      element: <RoleSelection/>,
    },
    {
      path: 'business-setup',
      element: <BusinessSetup/>
    },
    {
      path: 'referrer-setup',
      element: <ReferrerSetup/>
    }
  ])