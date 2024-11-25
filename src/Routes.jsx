import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Login from "./components/pages/login";
import Signup from "./components/pages/signup";
import BusinessOverview from "./components/pages/business/businessOverview";
import Referrer from "./components/pages/business/referrer";
import RoleSelection from "./components/pages/roleSelection";
import BusinessSetup from "./components/pages/business/businessSetup";
import ReferrerSetup from "./components/pages/referrer/referrerSetup";
import AuthLayout from "./modules/authLayout";
import PrivateRoute from "./modules/privateRoute";
import BusinessDashboard from "./app/dashboard/businessDashboard";
import ReferrerDashboard from "./app/dashboard/referrerDashboard";
import ReferrerOverview from "./components/pages/referrer/referrerOverview";
import Referee from "./components/pages/referrer/referee";


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
                        children: [
                            {
                                index: true,
                                element: <BusinessOverview/>
                            },
                            {
                                path: 'referrer',
                                element: <Referrer/>
                            }
                        ]
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
                        children : [
                            {
                                index: true,
                                element: <ReferrerOverview/>
                            },
                            {
                                path: 'referee',
                                element: <Referee/>
                            }
                        ]
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



// export const appRoutes = createBrowserRouter([
//     {
//       path: '/',
//       element: <App />
//     },
//     {
//       path: 'login',
//       element: <Login />
//     },
//     {
//       path: 'signup',
//       element: <Signup />
//     },
//     {
//       path: 'dashboard',
//       element: <Dashboard />,
//       children: [
//         {
//           index: true,
//           element: <Home />
//         },
//         {
//           path: 'referrer',
//           element: <Referrer />
//         }
//       ]
//     },
//     {
//       path: 'select-role',
//       element: <RoleSelection/>,
//     },
//     {
//       path: 'business-setup',
//       element: <BusinessSetup/>
//     },
//     {
//       path: 'referrer-setup',
//       element: <ReferrerSetup/>
//     }
//   ])