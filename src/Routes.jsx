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
import ReferrerReferees from "./components/pages/referrer/referrer-referees";
import Payouts from "./components/pages/business/payouts";
import CampaignPortal from "./components/pages/business/campaign/campaign-portal";
import InviteReferrer from "./components/pages/business/invite-referrer";
import BusinessAccountSettings from "./components/pages/business/business-account-settings";
import Errorpage from "./components/pages/errorpage";
import ForgetPassword from "./components/pages/forget-password";
import ResetPassword from "./components/pages/reset-password";
import Rewards from "./components/pages/referrer/rewards";
import Campaigns from "./components/pages/referrer/campaigns";
import ReferrerAccountSettings from "./components/pages/referrer/referrer-account-settings";
import BusinessQrCodes from "./components/pages/business/business-qr-codes";
import RefereeForm from "./components/pages/referee/referee-form";
import BusinessReferees from "./components/pages/business/business-referees";
import ReferrerSignup from "./components/pages/referrer/referrer-signup";
import { ReferrerInvitationSetup } from "./components/pages/referrer/referrer-invitation-setup";
import CampaignBuilder from "./components/pages/business/campaign/campaign-builder";
import BusinessCampaigns from "./components/pages/business/business-campaigns";
import AddReferrer from "./components/pages/business/add-referrer";
import RefereeList from "./components/pages/referee-list";
import ReferrerSetupPass from "./components/pages/referrer-setup-pass";
import EmailBuilder from "./components/pages/business/campaign/email/email-builder";
import CampaignIntegration from "./components/pages/business/campaign/integration/campaign-integration";
import CampaignSettings from "./components/pages/business/campaign/settings/campaign-settings";
import CampaignReward from "./components/pages/business/campaign/reward/campaign-reward";
import CampaignPromotes from "./components/pages/business/campaign/promotes/campaign-promotes";




export const appRoutes = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        errorElement: <Errorpage/>, // Error page
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
                                path: 'referees',
                                element: <BusinessReferees/>
                            },
                            {
                                path: 'payouts',
                                element: <Payouts/>
                            },
                            {
                                path: 'qr-codes',
                                element: <BusinessQrCodes/>
                            },
                            {
                                path: 'campaign-portal',
                                element: <BusinessCampaigns/>,
                                children:[
                                    {
                                        index: true,
                                        element: <CampaignPortal/>
                                    },
                                    {
                                        path: 'builder/:campaignId',
                                        element: <CampaignBuilder/>
                                    },
                                    {
                                        path: 'reward/:campaignId',
                                        element: <CampaignReward/>
                                    },
                                    {
                                        path: 'settings/:campaignId',
                                        element: <CampaignSettings/>
                                    },
                                    {
                                        path: 'email-builder/:campaignId',
                                        element: <EmailBuilder/>
                                    },
                                    {
                                        path: 'integration/:campaignId',
                                        element: <CampaignIntegration/>
                                    },
                                    {
                                        path: 'promotes/:campaignId',
                                        element: <CampaignPromotes/>
                                    }
                                ]
                            },
                            {
                                path: 'invite-referrer',
                                element: <InviteReferrer/>
                            },
                            {
                                path: 'add-referrer',
                                element: <AddReferrer/>
                            },
                            {
                                path: 'account-settings',
                                element: <BusinessAccountSettings/>
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
                                path: 'referees',
                                element: <ReferrerReferees/>
                            },
                            {
                                path: 'rewards',
                                element: <Rewards/>
                            },
                            {
                                path: 'campaigns',
                                element: <Campaigns/>
                            },
                            {
                                path: 'account-settings',
                                element: <ReferrerAccountSettings/>
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
    },
    {
        path: 'qr/:businessId/:campaignId/:qrId',
        element: <RefereeForm/>
    },
    {
        path: 'referrer-signup/:businessId/:campaignId/:email?/:name?',
        element: <ReferrerSignup/>
    },
    {
        path: 'referrer-invitation-setup/:businessId/:campaignId/:email/:name',
        element: <ReferrerInvitationSetup/>
    },
    {
        path: 'referee-list/:refereerId',
        element: <RefereeList/>
    },
    {
        path: 'referrer-setup-pass/:businessId/:referrerId/:email',
        element: <ReferrerSetupPass/>
    }
]);