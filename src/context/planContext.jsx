import React, { createContext, useContext, useState, useEffect } from 'react';
import paymentApi from '@/api/paymentApi';
import { useUser } from './usercontext';
import { toast } from 'react-toastify';

const PlanContext = createContext();

export const usePlan = () => {
  const context = useContext(PlanContext);
  if (!context) {
    throw new Error('usePlan must be used within a PlanProvider');
  }
  return context;
};

export const PlanProvider = ({ children }) => {
  const [subscription, setSubscription] = useState(null);
  const [usage, setUsage] = useState({
    qrCodes: 0,
    referrers: 0,
    campaigns: 0,
    payouts: 0,
  });
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  // Get current plan limits
  const getCurrentLimits = () => {
    if (!subscription) return { qrCodes: 5, referrers: 1, campaigns: 1, payouts: 3 };
    
    if (subscription.status === 'trialing') {
      return { qrCodes: 10, referrers: 3, campaigns: 1, payouts: 5 };
    }
    
    if (subscription.plan?.limits) {
      return subscription.plan.limits;
    }
    
    return { qrCodes: 5, referrers: 1, campaigns: 1, payouts: 3 };
  };

  // Check if feature is available
  const canUseFeature = (feature) => {
    const limits = getCurrentLimits();
    const currentUsage = usage[feature] || 0;
    
    // -1 means unlimited
    if (limits[feature] === -1) return true;
    
    return currentUsage < limits[feature];
  };

  // Get remaining usage for a feature
  const getRemainingUsage = (feature) => {
    const limits = getCurrentLimits();
    const currentUsage = usage[feature] || 0;
    
    if (limits[feature] === -1) return 'Unlimited';
    
    return Math.max(0, limits[feature] - currentUsage);
  };

  // Get usage percentage
  const getUsagePercentage = (feature) => {
    const limits = getCurrentLimits();
    const currentUsage = usage[feature] || 0;
    
    if (limits[feature] === -1) return 0;
    
    return Math.min(100, (currentUsage / limits[feature]) * 100);
  };

  // Check if user needs to upgrade
  const needsUpgrade = (feature) => {
    return !canUseFeature(feature);
  };

  // Get plan status
  const getPlanStatus = () => {
    if (!subscription) return { label: 'Free', variant: 'secondary' };
    
    switch (subscription.status) {
      case 'active':
        return { label: 'Active', variant: 'default' };
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

  // Fetch subscription data
  const fetchSubscription = async () => {
    if (!user?.userId) return;
    
    try {
      const response = await paymentApi.getBusinessSubscription({ businessId: user.userId });
      setSubscription(response.data?.subscription || null);
    } catch (error) {
      console.error('Failed to fetch subscription:', error);
      toast.error('Failed to load subscription data');
    }
  };

  // Fetch usage data
  const fetchUsage = async () => {
    if (!user?.userId) return;
    
    try {
      const response = await paymentApi.getUsage();
      setUsage(response.data || {
        qrCodes: 0,
        referrers: 0,
        campaigns: 0,
        payouts: 0,
      });
    } catch (error) {
      console.error('Failed to fetch usage:', error);
    }
  };

  // Fetch plans
  const fetchPlans = async () => {
    try {
      const response = await paymentApi.getPlans();
      setPlans(response.data || []);
    } catch (error) {
      console.error('Failed to fetch plans:', error);
    }
  };

  // Refresh all data
  const refreshData = async () => {
    setLoading(true);
    await Promise.all([
      fetchSubscription(),
      fetchUsage(),
      fetchPlans()
    ]);
    setLoading(false);
  };

  useEffect(() => {
    if (user?.userId) {
      refreshData();
    }
  }, [user?.userId]);

  const value = {
    subscription,
    usage,
    plans,
    loading,
    getCurrentLimits,
    canUseFeature,
    getRemainingUsage,
    getUsagePercentage,
    needsUpgrade,
    getPlanStatus,
    refreshData,
    fetchSubscription,
    fetchUsage,
    fetchPlans
  };

  return (
    <PlanContext.Provider value={value}>
      {children}
    </PlanContext.Provider>
  );
};