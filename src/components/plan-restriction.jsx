import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Lock, ArrowUpRight, Zap } from 'lucide-react';
import { usePlan } from '@/context/planContext';
import { useNavigate } from 'react-router-dom';

const PlanRestriction = ({ 
  feature, 
  children, 
  showUsage = true, 
  upgradeMessage,
  className = "" 
}) => {
  const { 
    canUseFeature, 
    needsUpgrade, 
    getRemainingUsage, 
    getUsagePercentage,
    getCurrentLimits,
    usage,
    subscription
  } = usePlan();
  
  const navigate = useNavigate();
  
  const limits = getCurrentLimits();
  const currentUsage = usage[feature] || 0;
  const remaining = getRemainingUsage(feature);
  const percentage = getUsagePercentage(feature);
  const isUnlimited = limits[feature] === -1;

  // If user can use the feature, render children
  if (canUseFeature(feature)) {
    return (
      <div className={className}>
        {showUsage && (
          <div className="mb-4 p-3 bg-muted/50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium capitalize">
                {feature.replace(/([A-Z])/g, ' $1').replace('qr Codes', 'QR Codes')} Usage
              </span>
              <span className="text-sm text-muted-foreground">
                {currentUsage}/{isUnlimited ? '∞' : limits[feature]}
              </span>
            </div>
            {!isUnlimited && (
              <Progress value={percentage} className="h-2" />
            )}
            {!isUnlimited && percentage > 80 && (
              <p className="text-xs text-amber-600 mt-1">
                You're approaching your limit. Consider upgrading.
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    );
  }

  // If user needs to upgrade, show restriction card
  return (
    <Card className={`border-dashed ${className}`}>
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
          <Lock className="h-6 w-6 text-muted-foreground" />
        </div>
        <CardTitle className="flex items-center justify-center gap-2">
          Feature Locked
          <Badge variant="outline">
            {subscription?.plan?.name || 'Free'} Plan
          </Badge>
        </CardTitle>
        <CardDescription>
          {upgradeMessage || `You've reached your ${feature} limit. Upgrade to continue using this feature.`}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="text-2xl font-bold text-muted-foreground">
            {currentUsage}/{isUnlimited ? '∞' : limits[feature]}
          </div>
          <div className="text-sm text-muted-foreground capitalize">
            {feature.replace(/([A-Z])/g, ' $1').replace('qr Codes', 'QR Codes')} Used
          </div>
        </div>
        
        <div className="space-y-2">
          <Button 
            onClick={() => navigate('/b/dashboard/account-settings?tab=billing')}
            className="w-full"
          >
            <Zap className="h-4 w-4 mr-2" />
            Upgrade Plan
            <ArrowUpRight className="h-4 w-4 ml-2" />
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate('/b/dashboard/account-settings?tab=billing')}
            className="w-full"
          >
            View Plans
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlanRestriction;