import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Login from "./components/pages/login";
import Signup from "./components/pages/signup";
import BusinessOverview from "./components/pages/business/businessOverview";
import Referrers from "./components/pages/business/referrers";
import RoleSelection from "./components/pages/roleSelection";
import BusinessSetup from "./components/pages/business/businessSetup";
import ReferrerSetup from "./components/pages/referrer/referrerSetup";
import AuthLayout from "./modules/authLayout";
import PrivateRoute from "./modules/privateRoute";
import BusinessDashboard from "./app/dashboard/businessDashboard";
import ReferrerDashboard from "./app/dashboard/referrerDashboard";
import ReferrerOverview from "./components/pages/referrer/referrerOverview";
import Referee from "./components/pages/referrer/referee";
import Payouts from "./components/pages/business/payouts";
import CampaignPortal from "./components/pages/business/campaign-portal";
import InviteReferrer from "./components/pages/business/invite-referrer";
import AccountSettings from "./components/pages/business/account-settings";
import Errorpage from "./components/pages/errorpage";
import ForgetPassword from "./components/pages/forget-password";
import ResetPassword from "./components/pages/reset-password";



export const appRoutes = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        errorElement: <Errorpage/>,
        children: [
            {   
                path: '/',
                element: <AuthLayout/>,
                errorElement: <Errorpage/>,
                children: [
                    {
                        path: 'login',
                        element: <Login/>
                    },
                    {
                        path: 'signup',
                        element: <Signup />
                    },
                    {
                        path: 'forget-password',
                        element: <ForgetPassword/>
                    }
                ]
            },
            {
                path: 'reset-password/:token',
                element: <ResetPassword/>
            },
            {
                path: '/b/dashboard',
                element: <PrivateRoute allowedRoles={['owner']} />,
                errorElement: <Errorpage/>,
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
                                path: 'referrers',
                                element: <Referrers/>
                            },
                            {
                                path: 'payouts',
                                element: <Payouts/>
                            },
                            {
                                path: 'campaign-portal',
                                element: <CampaignPortal/>
                            },
                            {
                                path: 'invite-referrer',
                                element: <InviteReferrer/>
                            },
                            {
                                path: 'account-settings',
                                element: <AccountSettings/>
                            }
                        ]
                    },
                ],
            },
            {
                path: '/r/dashboard',
                element: <PrivateRoute allowedRoles={['referrer']} />,
                errorElement: <Errorpage/>,
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