import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Login from "./components/pages/login";
import Signup from "./components/pages/signup";
import Dashboard from './app/dashboard/businessDashboard'
import Home from "./components/pages/home";
import Referrer from "./components/pages/referrer";
import RoleSelection from "./components/pages/roleSelection";
import BusinessSetup from "./components/pages/businessSetup";
import ReferrerSetup from "./components/pages/referrerSetup";
import AuthLayout from "./modules/authLayout";
import PrivateRoute from "./modules/privateRoute";
import BusinessDashboard from "./app/dashboard/businessDashboard";
import ReferrerDashboard from "./app/dashboard/referrerDashboard";


export const appRoutes = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {   
                path: '/',
                element: <AuthLayout/>,
                children: [
                    {
                        path: 'login',
                        element: <Login/>
                    },
                    {
                        path: 'signup',
                        element: <Signup />
                    }
                ]
            },
            {
                path: '/b/dashboard',
                element: <PrivateRoute allowedRoles={['owner']} />,
                children: [
                    {
                        path: '',
                        element: <BusinessDashboard />, // Dashboard for owners
                    },
                ],
            },
            {
                path: '/r/dashboard',
                element: <PrivateRoute allowedRoles={['referrer']} />,
                children: [
                    {
                        path: '',
                        element: <ReferrerDashboard />, // Dashboard for referrers
                    },
                ],
            },
        ]
    },
    {
        path: 'select-role',
        element: <RoleSelection />
    },
    {
        path: 'business-setup',
        element: <BusinessSetup />
    },
    {
        path: 'referrer-setup',
        element: <ReferrerSetup />
    }
]);