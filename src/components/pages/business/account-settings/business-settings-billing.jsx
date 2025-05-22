// import { Button } from '@/components/ui/button'
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
// import { Label } from '@/components/ui/label'
// import { Separator } from '@/components/ui/separator'
// import { CreditCard } from 'lucide-react'
// import React from 'react'

// export default function BusinessSettingsBilling() {
//     return (
//         <>
//             <Card>
//                 <CardHeader>
//                     <CardTitle>Billing and Plans</CardTitle>
//                     <CardDescription>
//                         Manage your billing information and subscription plan.
//                     </CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                     <div className="rounded-lg border p-4">
//                         <div className="flex items-center justify-between">
//                             <div>
//                                 <p className="font-medium">Free Plan</p>
//                                 <p className="text-sm text-muted-foreground">
//                                     Basic features with limited access
//                                 </p>
//                             </div>
//                             <Button variant="outline">Upgrade</Button>
//                         </div>
//                     </div>
//                     <Separator />
//                     <div className="space-y-2">
//                         <Label>Payment method</Label>
//                         <div className="rounded-lg border p-4">
//                             <div className="flex items-center space-x-4">
//                                 <CreditCard className="h-6 w-6" />
//                                 <div>
//                                     <p className="font-medium">No payment method added</p>
//                                     <p className="text-sm text-muted-foreground">
//                                         Add a payment method to upgrade your plan
//                                     </p>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </CardContent>
//             </Card>
//         </>
//     )
// }



// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/router';
// import { loadStripe } from '@stripe/stripe-js';
// import { 
//   Button,
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
//   Label,
//   Separator,
//   Badge,
//   Progress,
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
//   DialogFooter,
//   useToast,
// } from '@/components/ui';
// import { CreditCard, Loader2, Check, ArrowUpRight } from 'lucide-react';
// import { useAuth } from '@/contexts/AuthContext';
// import businessApi from '@/api/businessApi';
// import { useQuery, useMutation } from '@tanstack/react-query';
// import Spinner from '@/components/Spinner';

// export default function BusinessSettingsBilling() {
//   const { business } = useAuth();
//   const router = useRouter();
//   const toast = useToast();
//   const [plans, setPlans] = useState([]);
//   const [subscription, setSubscription] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isUpgrading, setIsUpgrading] = useState(false);
//   const [isCanceling, setIsCanceling] = useState(false);
//   const [showCancelDialog, setShowCancelDialog] = useState(false);
//   const [selectedPlan, setSelectedPlan] = useState(null);
//   const [usage, setUsage] = useState({
//     qrCodes: 0,
//     referrers: 0,
//     campaigns: 0,
//     payouts: 0,
//   });

//   // Fetch plans, subscription, and usage data
//   const { refetch: refetchSubscription } = useQuery({
//     queryKey: ['subscription'],
//     queryFn: async () => {
//       const response = await businessApi.getBusinessSubscription();
//       if (response) setSubscription(response);
//       return response;
//     },
//     enabled: false,
//   });

//   const { refetch: refetchPlans } = useQuery({
//     queryKey: ['plans'],
//     queryFn: async () => {
//       const response = await businessApi.getPlans();
//       if (response) setPlans(response);
//       return response;
//     },
//     enabled: false,
//   });

//   const { refetch: refetchUsage } = useQuery({
//     queryKey: ['usage'],
//     queryFn: async () => {
//       const response = await businessApi.getUsage();
//       if (response) setUsage(response);
//       return response;
//     },
//     enabled: false,
//   });

//   // Load all data on component mount
//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         await Promise.all([
//           refetchPlans(),
//           refetchSubscription(),
//           refetchUsage(),
//         ]);
//       } catch (error) {
//         console.error('Failed to fetch billing data:', error);
//         toast({
//           title: 'Error',
//           description: 'Failed to load billing information',
//           variant: 'destructive',
//         });
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     loadData();
//   }, []);

//   // Handle successful payment redirect
//   useEffect(() => {
//     if (router.query.session_id) {
//       const handlePaymentSuccess = async () => {
//         try {
//           const response = await businessApi.handlePaymentSuccess(router.query.session_id);
//           if (response) {
//             setSubscription(response.subscription);
//             toast({
//               title: 'Success',
//               description: 'Your subscription has been activated!',
//             });
//             // Clean up URL
//             router.replace('/dashboard/settings/billing', undefined, { shallow: true });
//           }
//         } catch (error) {
//           console.error('Payment confirmation failed:', error);
//         }
//       };

//       handlePaymentSuccess();
//     }
//   }, [router.query.session_id]);

//   const handleUpgrade = async () => {
//     if (!selectedPlan) return;

//     setIsUpgrading(true);
//     try {
//       const response = await businessApi.createCheckoutSession(selectedPlan);
//       if (response && response.sessionId) {
//         const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);
//         await stripe.redirectToCheckout({ sessionId: response.sessionId });
//       }
//     } catch (error) {
//       console.error('Upgrade failed:', error);
//       toast({
//         title: 'Error',
//         description: 'Failed to initiate payment',
//         variant: 'destructive',
//       });
//     } finally {
//       setIsUpgrading(false);
//     }
//   };

//   const handleCancelSubscription = async () => {
//     setIsCanceling(true);
//     try {
//       const response = await businessApi.cancelSubscription();
//       if (response) {
//         setSubscription(response.subscription);
//         toast({
//           title: 'Success',
//           description: 'Your subscription has been canceled',
//         });
//         setShowCancelDialog(false);
//       }
//     } catch (error) {
//       console.error('Cancel failed:', error);
//       toast({
//         title: 'Error',
//         description: 'Failed to cancel subscription',
//         variant: 'destructive',
//       });
//     } finally {
//       setIsCanceling(false);
//     }
//   };

//   const formatPrice = (price) => {
//     return new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: 'USD',
//     }).format(price / 100);
//   };

//   const getPlanStatus = () => {
//     if (!subscription) {
//       if (new Date(business.trialEnd) > new Date()) {
//         return { label: 'Trial', variant: 'default' };
//       }
//       return { label: 'Free', variant: 'secondary' };
//     }

//     switch (subscription.status) {
//       case 'active':
//         return { label: 'Active', variant: 'success' };
//       case 'trialing':
//         return { label: 'Trial', variant: 'default' };
//       case 'past_due':
//         return { label: 'Past Due', variant: 'destructive' };
//       case 'canceled':
//         return { label: 'Canceled', variant: 'destructive' };
//       default:
//         return { label: 'Inactive', variant: 'secondary' };
//     }
//   };

//   const status = getPlanStatus();

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <Spinner />
//       </div>
//     );
//   }

//   return (
//     <>
//       <Card>
//         <CardHeader>
//           <CardTitle>Billing and Plans</CardTitle>
//           <CardDescription>
//             Manage your billing information and subscription plan.
//           </CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-6">
//           {/* Current Plan Section */}
//           <div className="space-y-4">
//             <Label>Current Plan</Label>
//             <div className="rounded-lg border p-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <div className="flex items-center space-x-2">
//                     <p className="font-medium">
//                       {subscription?.plan?.name
//                         ? `${subscription.plan.name.charAt(0).toUpperCase() + subscription.plan.name.slice(1)} Plan`
//                         : status.label === 'Trial'
//                         ? 'Trial Plan'
//                         : 'Free Plan'}
//                     </p>
//                     <Badge variant={status.variant}>{status.label}</Badge>
//                   </div>
//                   <p className="text-sm text-muted-foreground">
//                     {subscription?.plan
//                       ? `${formatPrice(subscription.plan.price)}/${
//                           subscription.plan.type === 'lifetime'
//                             ? 'one-time'
//                             : subscription.plan.type
//                         }`
//                       : status.label === 'Trial'
//                       ? `Trial ends ${new Date(business.trialEnd).toLocaleDateString()}`
//                       : 'Basic features with limited access'}
//                   </p>
//                 </div>
//                 {subscription?.status === 'active' && (
//                   <Button
//                     variant="outline"
//                     onClick={() => setShowCancelDialog(true)}
//                     disabled={isCanceling}
//                   >
//                     {isCanceling ? (
//                       <Loader2 className="h-4 w-4 animate-spin" />
//                     ) : (
//                       'Cancel Subscription'
//                     )}
//                   </Button>
//                 )}
//               </div>

//               {subscription?.currentPeriodEnd && (
//                 <p className="mt-2 text-sm text-muted-foreground">
//                   {subscription.cancelAtPeriodEnd
//                     ? `Will cancel on ${new Date(subscription.currentPeriodEnd).toLocaleDateString()}`
//                     : `Renews on ${new Date(subscription.currentPeriodEnd).toLocaleDateString()}`}
//                 </p>
//               )}
//             </div>
//           </div>

//           {/* Usage Section */}
//           <div className="space-y-4">
//             <Label>Usage</Label>
//             <div className="space-y-4">
//               {Object.entries(usage).map(([feature, count]) => {
//                 const limit =
//                   subscription?.plan?.limits[feature] ||
//                   (status.label === 'Trial'
//                     ? {
//                         qrCodes: 10,
//                         referrers: 3,
//                         campaigns: 1,
//                         payouts: 5,
//                       }[feature]
//                     : {
//                         qrCodes: 5,
//                         referrers: 1,
//                         campaigns: 1,
//                         payouts: 3,
//                       }[feature]);

//                 if (limit === -1) return null; // Unlimited

//                 return (
//                   <div key={feature} className="space-y-1">
//                     <div className="flex justify-between text-sm">
//                       <span className="capitalize">
//                         {feature.replace(/([A-Z])/g, ' $1').replace('qr Codes', 'QR Codes')}
//                       </span>
//                       <span>
//                         {count}/{limit === -1 ? '∞' : limit}
//                       </span>
//                     </div>
//                     <Progress value={(count / limit) * 100} className="h-2" />
//                   </div>
//                 );
//               })}
//             </div>
//           </div>

//           <Separator />

//           {/* Upgrade Section */}
//           <div className="space-y-4">
//             <Label>Upgrade Plan</Label>
//             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//               {plans.map((plan) => (
//                 <Card
//                   key={plan._id}
//                   className={`cursor-pointer transition-all ${
//                     selectedPlan === plan._id ? 'border-primary ring-2 ring-primary' : ''
//                   }`}
//                   onClick={() => setSelectedPlan(plan._id)}
//                 >
//                   <CardHeader>
//                     <CardTitle className="flex justify-between">
//                       {plan.name.charAt(0).toUpperCase() + plan.name.slice(1)}
//                       <span>{formatPrice(plan.price)}</span>
//                     </CardTitle>
//                     <CardDescription>
//                       {plan.type === 'lifetime'
//                         ? 'One-time payment'
//                         : `Billed ${plan.type}ly`}
//                     </CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     <ul className="space-y-2">
//                       {plan.features.map((feature) => (
//                         <li key={feature} className="flex items-center">
//                           <Check className="h-4 w-4 text-green-500 mr-2" />
//                           <span>{feature}</span>
//                         </li>
//                       ))}
//                     </ul>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>

//             <div className="flex justify-end">
//               <Button onClick={handleUpgrade} disabled={!selectedPlan || isUpgrading}>
//                 {isUpgrading ? (
//                   <Loader2 className="h-4 w-4 animate-spin" />
//                 ) : (
//                   'Upgrade Plan'
//                 )}
//               </Button>
//             </div>
//           </div>

//           <Separator />

//           {/* Payment Method Section */}
//           <div className="space-y-4">
//             <Label>Payment method</Label>
//             <div className="rounded-lg border p-4">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center space-x-4">
//                   <CreditCard className="h-6 w-6" />
//                   <div>
//                     <p className="font-medium">No payment method added</p>
//                     <p className="text-sm text-muted-foreground">
//                       Add a payment method to upgrade your plan
//                     </p>
//                   </div>
//                 </div>
//                 <Button variant="outline">Add Payment</Button>
//               </div>
//             </div>
//           </div>

//           {/* Billing History Section */}
//           <div className="space-y-4">
//             <Label>Billing history</Label>
//             <div className="rounded-lg border p-4">
//               <p className="text-sm text-muted-foreground">
//                 No billing history available
//               </p>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Cancel Subscription Dialog */}
//       <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Cancel Subscription</DialogTitle>
//             <DialogDescription>
//               Are you sure you want to cancel your subscription? You'll lose access to premium
//               features at the end of your billing period.
//             </DialogDescription>
//           </DialogHeader>
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
//               Go Back
//             </Button>
//             <Button variant="destructive" onClick={handleCancelSubscription}>
//               {isCanceling ? (
//                 <Loader2 className="h-4 w-4 animate-spin" />
//               ) : (
//                 'Cancel Subscription'
//               )}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// }


import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
// import { 
//   Button,
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
//   Label,
//   Separator,
//   Badge,
//   Progress,
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
//   DialogFooter,
//   useToast,
// } from '@/components/ui';
import { CreditCard, Loader2, Check, ArrowUpRight, Badge } from 'lucide-react';
// import { useAuth } from '@/contexts/AuthContext';
import paymentApi from '@/api/paymentApi';
import { useQuery, useMutation } from '@tanstack/react-query';
import Spinner from '@/components/Spinner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'react-toastify';
import { Progress } from '@/components/ui/progress';
import businessApi from '@/api/businessApi';

export default function BusinessSettingsBilling() {
//   const { business } = useAuth();
//   const toast = useToast();
  const [plans, setPlans] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [usage, setUsage] = useState({
    qrCodes: 0,
    referrers: 0,
    campaigns: 0,
    payouts: 0,
  });

  const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
  const { data: business = [], } = useQuery({
    queryKey: ['getBusinessById', user?.userId],
    queryFn: () => businessApi.getBusinessById(user?.userId),
    enabled: !!user?.userId
  })


  // Get URL parameters for handling payment success
  const getUrlParams = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return {
      session_id: urlParams.get('session_id')
    };
  };

  // Update URL without page reload
  const updateUrl = (path) => {
    window.history.replaceState({}, '', path);
  };

  // Fetch plans, subscription, and usage data
  const { refetch: refetchSubscription } = useQuery({
    queryKey: ['subscription'],
    queryFn: async () => {
      const response = await paymentApi.getBusinessSubscription({businessId: business._id});
      if (response) setSubscription(response);
      return response;
    },
    enabled: false,
  });

  const { refetch: refetchPlans } = useQuery({
    queryKey: ['plans'],
    queryFn: async () => {
      const response = await paymentApi.getPlans();
      if (response) setPlans(response);
      return response;
    },
    enabled: false,
  });

  const { refetch: refetchUsage } = useQuery({
    queryKey: ['usage'],
    queryFn: async () => {
      const response = await paymentApi.getUsage();
      if (response) setUsage(response);
      return response;
    },
    enabled: false,
  });

  // Load all data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          refetchPlans(),
          refetchSubscription(),
          refetchUsage(),
        ]);
      } catch (error) {
        console.error('Failed to fetch billing data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load billing information',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Handle successful payment redirect
  useEffect(() => {
    const urlParams = getUrlParams();
    if (urlParams.session_id) {
      const handlePaymentSuccess = async () => {
        try {
          const response = await paymentApi.handlePaymentSuccess(urlParams.session_id);
          if (response) {
            setSubscription(response.subscription);
            toast({
              title: 'Success',
              description: 'Your subscription has been activated!',
            });
            // Clean up URL
            updateUrl(window.location.pathname);
          }
        } catch (error) {
          console.error('Payment confirmation failed:', error);
        }
      };

      handlePaymentSuccess();
    }
  }, []); // Run only once on mount

  const handleUpgrade = async () => {
    if (!selectedPlan) return;

    setIsUpgrading(true);
    try {
      const response = await paymentApi.createCheckoutSession({businessId: business._id, planId: selectedPlan});
      if (response && response.sessionId) {
        const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
        await stripe.redirectToCheckout({ sessionId: response.sessionId });
      }
    } catch (error) {
      console.error('Upgrade failed:', error);
      toast({
        title: 'Error',
        description: 'Failed to initiate payment',
        variant: 'destructive',
      });
    } finally {
      setIsUpgrading(false);
    }
  };

  const handleCancelSubscription = async () => {
    setIsCanceling(true);
    try {
      const response = await paymentApi.cancelSubscription();
      if (response) {
        setSubscription(response.subscription);
        toast({
          title: 'Success',
          description: 'Your subscription has been canceled',
        });
        setShowCancelDialog(false);
      }
    } catch (error) {
      console.error('Cancel failed:', error);
      toast({
        title: 'Error',
        description: 'Failed to cancel subscription',
        variant: 'destructive',
      });
    } finally {
      setIsCanceling(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price / 100);
  };

  const getPlanStatus = () => {
    if (!subscription) {
      if (new Date(business.trialEnd) > new Date()) {
        return { label: 'Trial', variant: 'default' };
      }
      return { label: 'Free', variant: 'secondary' };
    }

    switch (subscription.status) {
      case 'active':
        return { label: 'Active', variant: 'success' };
      case 'trialing':
        return { label: 'Trial', variant: 'default' };
      case 'past_due':
        return { label: 'Past Due', variant: 'destructive' };
      case 'canceled':
        return { label: 'Canceled', variant: 'destructive' };
      default:
        return { label: 'Inactive', variant: 'secondary' };
    }
  };

  const status = getPlanStatus();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Billing and Plans</CardTitle>
          <CardDescription>
            Manage your billing information and subscription plan.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Plan Section */}
          <div className="space-y-4">
            <Label>Current Plan</Label>
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <p className="font-medium">
                      {subscription?.plan?.name
                        ? `${subscription.plan.name.charAt(0).toUpperCase() + subscription.plan.name.slice(1)} Plan`
                        : status.label === 'Trial'
                        ? 'Trial Plan'
                        : 'Free Plan'}
                    </p>
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {subscription?.plan
                      ? `${formatPrice(subscription.plan.price)}/${
                          subscription.plan.type === 'lifetime'
                            ? 'one-time'
                            : subscription.plan.type
                        }`
                      : status.label === 'Trial'
                      ? `Trial ends ${new Date(business.trialEnd).toLocaleDateString()}`
                      : 'Basic features with limited access'}
                  </p>
                </div>
                {subscription?.status === 'active' && (
                  <Button
                    variant="outline"
                    onClick={() => setShowCancelDialog(true)}
                    disabled={isCanceling}
                  >
                    {isCanceling ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      'Cancel Subscription'
                    )}
                  </Button>
                )}
              </div>

              {subscription?.currentPeriodEnd && (
                <p className="mt-2 text-sm text-muted-foreground">
                  {subscription.cancelAtPeriodEnd
                    ? `Will cancel on ${new Date(subscription.currentPeriodEnd).toLocaleDateString()}`
                    : `Renews on ${new Date(subscription.currentPeriodEnd).toLocaleDateString()}`}
                </p>
              )}
            </div>
          </div>

          {/* Usage Section */}
          <div className="space-y-4">
            <Label>Usage</Label>
            <div className="space-y-4">
              {Object.entries(usage).map(([feature, count]) => {
                const limit =
                  subscription?.plan?.limits[feature] ||
                  (status.label === 'Trial'
                    ? {
                        qrCodes: 10,
                        referrers: 3,
                        campaigns: 1,
                        payouts: 5,
                      }[feature]
                    : {
                        qrCodes: 5,
                        referrers: 1,
                        campaigns: 1,
                        payouts: 3,
                      }[feature]);

                if (limit === -1) return null; // Unlimited

                return (
                  <div key={feature} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="capitalize">
                        {feature.replace(/([A-Z])/g, ' $1').replace('qr Codes', 'QR Codes')}
                      </span>
                      <span>
                        {count}/{limit === -1 ? '∞' : limit}
                      </span>
                    </div>
                    <Progress value={(count / limit) * 100} className="h-2" />
                  </div>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Upgrade Section */}
          <div className="space-y-4">
            <Label>Upgrade Plan</Label>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {plans.map((plan) => (
                <Card
                  key={plan._id}
                  className={`cursor-pointer transition-all ${
                    selectedPlan === plan._id ? 'border-primary ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedPlan(plan._id)}
                >
                  <CardHeader>
                    <CardTitle className="flex justify-between">
                      {plan.name.charAt(0).toUpperCase() + plan.name.slice(1)}
                      <span>{formatPrice(plan.price)}</span>
                    </CardTitle>
                    <CardDescription>
                      {plan.type === 'lifetime'
                        ? 'One-time payment'
                        : `Billed ${plan.type}ly`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center">
                          <Check className="h-4 w-4 text-green-500 mr-2" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-end">
              <Button onClick={handleUpgrade} disabled={!selectedPlan || isUpgrading}>
                {isUpgrading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Upgrade Plan'
                )}
              </Button>
            </div>
          </div>

          <Separator />

          {/* Payment Method Section */}
          <div className="space-y-4">
            <Label>Payment method</Label>
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <CreditCard className="h-6 w-6" />
                  <div>
                    <p className="font-medium">No payment method added</p>
                    <p className="text-sm text-muted-foreground">
                      Add a payment method to upgrade your plan
                    </p>
                  </div>
                </div>
                <Button variant="outline">Add Payment</Button>
              </div>
            </div>
          </div>

          {/* Billing History Section */}
          <div className="space-y-4">
            <Label>Billing history</Label>
            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">
                No billing history available
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cancel Subscription Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Subscription</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel your subscription? You'll lose access to premium
              features at the end of your billing period.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
              Go Back
            </Button>
            <Button variant="destructive" onClick={handleCancelSubscription}>
              {isCanceling ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Cancel Subscription'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}