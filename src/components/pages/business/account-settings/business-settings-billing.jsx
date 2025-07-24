import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { CreditCard, Loader2, Check, ArrowUpRight, Gift, Zap } from 'lucide-react';
import paymentApi from '@/api/paymentApi';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'react-toastify';
import { Progress } from '@/components/ui/progress';
import businessApi from '@/api/businessApi';
import { Badge } from '@/components/ui/badge';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import Spinner from '@/components/spinner';
import { usePlan } from '@/context/planContext';

export default function BusinessSettingsBilling() {
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [billingInterval, setBillingInterval] = useState('monthly');

  const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
  
  const { data: business = {} } = useQuery({
    queryKey: ['getBusinessById', user?.userId],
    queryFn: () => businessApi.getBusinessById(user?.userId),
    enabled: !!user?.userId
  });

  const {
    subscription,
    usage,
    plans,
    loading,
    getCurrentLimits,
    getUsagePercentage,
    getPlanStatus,
    refreshData
  } = usePlan();

  const handleUpgrade = async (planId) => {
    if (!planId || !business?._id) return;

    setIsUpgrading(true);
    try {
      const response = await paymentApi.createCheckoutSession({
        businessId: business._id,
        planId: planId
      });

      if (response?.data?.sessionId) {
        const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
        await stripe.redirectToCheckout({ sessionId: response.data.sessionId });
      }
    } catch (error) {
      console.error('Upgrade failed:', error);
      toast.error('Failed to initiate payment');
    } finally {
      setIsUpgrading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!subscription?.stripeSubscriptionId) return;

    setIsCanceling(true);
    try {
      const response = await paymentApi.cancelSubscription({
        businessId: business._id,
        cancelAtPeriodEnd: subscription.cancelAtPeriodEnd
      });

      if (response?.data?.subscription) {
        await refreshData();
        toast.success('Your subscription has been canceled');
        setShowCancelDialog(false);
      }
    } catch (error) {
      console.error('Cancel failed:', error);
      toast.error('Failed to cancel subscription');
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

  const status = getPlanStatus();
  const limits = getCurrentLimits();

  // Group plans by name and filter by billing interval
  const groupedPlans = plans.reduce((acc, plan) => {
    if (plan.type === billingInterval || (billingInterval === 'lifetime' && plan.type === 'lifetime')) {
      if (!acc[plan.name]) {
        acc[plan.name] = [];
      }
      acc[plan.name].push(plan);
    }
    return acc;
  }, {});

  if (loading) {
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
                        : 'Free Plan'}
                    </p>
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {subscription?.plan
                      ? `${formatPrice(subscription?.plan?.price)}/${subscription.plan.type === 'lifetime'
                        ? 'one-time'
                        : subscription.plan.type
                      }`
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
              {Object.entries(limits).map(([feature, limit]) => {
                const currentUsage = usage[feature] || 0;
                const percentage = getUsagePercentage(feature);
                
                return (
                  <div key={feature} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="capitalize">
                        {feature.replace(/([A-Z])/g, ' $1').replace('qr Codes', 'QR Codes')}
                      </span>
                      <span>
                        {currentUsage}/{limit === -1 ? '∞' : limit}
                      </span>
                    </div>
                    <Progress 
                      value={limit === -1 ? 0 : percentage} 
                      className="h-2" 
                    />
                    {percentage > 80 && limit !== -1 && (
                      <p className="text-xs text-amber-600">
                        You're approaching your limit
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Upgrade Section */}
          {plans.length > 0 && (
            <div className="space-y-6">
              <div className="flex flex-col space-y-2">
                <Label>Available Plans</Label>
                <ToggleGroup 
                  type="single" 
                  value={billingInterval} 
                  onValueChange={(value) => {
                    if (value) {
                      setBillingInterval(value);
                      const newPlan = plans.find(p => 
                        value === 'lifetime' ? p.type === 'lifetime' : p.type === value
                      );
                      if (newPlan) setSelectedPlan(newPlan._id);
                    }
                  }}
                  className="grid grid-cols-3"
                >
                  <ToggleGroupItem value="monthly" className="w-full">
                    Monthly
                  </ToggleGroupItem>
                  <ToggleGroupItem value="yearly" className="w-full">
                    Yearly
                  </ToggleGroupItem>
                  <ToggleGroupItem value="lifetime" className="w-full">
                    Lifetime
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {Object.entries(groupedPlans).map(([planName, planVariants]) => {
                  const plan = planVariants[0];
                  const isCurrentPlan = subscription?.plan?.name === planName && 
                                       (subscription.plan.type === billingInterval || 
                                        (billingInterval === 'lifetime' && subscription.plan.type === 'lifetime'));
                  
                  return (
                    <Card key={plan._id} className="relative">
                      {isCurrentPlan && (
                        <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-2 py-1 rounded-bl-lg rounded-tr-lg">
                          CURRENT PLAN
                        </div>
                      )}
                      <CardHeader>
                        <CardTitle className="flex justify-between items-start">
                          <div>
                            {plan.name.charAt(0).toUpperCase() + plan.name.slice(1)}
                            <span className="block text-sm font-normal text-muted-foreground mt-1">
                              {plan.type === 'lifetime'
                                ? 'One-time payment'
                                : `Billed ${plan.type}ly`}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-2xl font-bold">
                              {formatPrice(plan.price)}
                            </span>
                            {plan.type === 'yearly' && (
                              <span className="block text-xs text-green-500">
                                Save {Math.round((1 - (plan.price / (planVariants.find(p => p.type === 'monthly')?.price * 12))) * 100)}%
                              </span>
                            )}
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <ul className="space-y-2">
                          {plan.features?.map((feature) => (
                            <li key={feature} className="flex items-center">
                              <Check className="h-4 w-4 text-green-500 mr-2" />
                              <span className="text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>
                        
                        <div className="space-y-2">
                          <div className="text-xs text-muted-foreground">
                            <strong>Limits:</strong>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            {Object.entries(plan.limits).map(([feature, limit]) => (
                              <div key={feature} className="flex justify-between">
                                <span className="capitalize">{feature}:</span>
                                <span>{limit === -1 ? 'Unlimited' : limit}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <Button 
                          onClick={() => handleUpgrade(plan._id)} 
                          className="w-full"
                          disabled={isCurrentPlan || isUpgrading}
                        >
                          {isUpgrading && selectedPlan === plan._id ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          ) : isCurrentPlan ? (
                            'Current Plan'
                          ) : subscription?.plan?.name === 'premium' && planName === 'starter' ? (
                            'Downgrade'
                          ) : (
                            <>
                              <Zap className="h-4 w-4 mr-2" />
                              Upgrade
                            </>
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

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
        </CardContent>
      </Card>

      {/* Cancel Subscription Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Subscription</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel your subscription? You'll continue to have access until the end of your billing period.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
              Keep Subscription
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleCancelSubscription}
              disabled={isCanceling}
            >
              {isCanceling ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Cancel Subscription
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
