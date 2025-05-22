import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
// import { useToast } from '@/components/ui/use-toast';
import Spinner from '@/components/Spinner';
import { toast } from 'react-toastify';
import paymentApi from '@/api/paymentApi';

export default function PaymentSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [subscription, setSubscription] = useState(null);

  // Extract session_id from URL
  const searchParams = new URLSearchParams(location.search);
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (!sessionId) {
      navigate('/dashboard/settings/billing');
      return;
    }

    const confirmPayment = async () => {
      try {
        setIsLoading(true);
        const response = await paymentApi.handlePaymentSuccess(sessionId);
        
        if (response && response.subscription) {
          setSubscription(response.subscription);
          toast({
            title: 'Payment Successful',
            description: 'Your subscription has been activated!',
          });
        }
      } catch (error) {
        console.error('Payment confirmation failed:', error);
        toast({
          title: 'Error',
          description: 'Failed to confirm payment. Please check your billing settings.',
          variant: 'destructive',
        });
        navigate('/b/dashboard/account-settings?tab=billing');
      } finally {
        setIsLoading(false);
      }
    };

    confirmPayment();
  }, [sessionId, navigate, toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
        <p className="ml-2">Processing your payment...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
          <CardTitle>Payment Successful!</CardTitle>
          <CardDescription>
            Thank you for your purchase
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {subscription && (
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Plan:</span>
                <span className="font-medium">
                  {subscription.plan.name.charAt(0).toUpperCase() + subscription.plan.name.slice(1)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Billing Cycle:</span>
                <span className="font-medium">
                  {subscription.plan.type === 'lifetime' ? 'One-time' : subscription.plan.type}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <span className="font-medium capitalize">{subscription.status}</span>
              </div>
              {subscription.currentPeriodEnd && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {subscription.cancelAtPeriodEnd ? 'Ends on' : 'Renews on'}:
                  </span>
                  <span className="font-medium">
                    {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          )}
          
          <Button 
            className="w-full mt-6"
            onClick={() => navigate('/dashboard/settings/billing')}
          >
            Go to Billing Settings
          </Button>
          
          <p className="text-sm text-muted-foreground text-center mt-4">
            A receipt has been sent to your email address
          </p>
        </CardContent>
      </Card>
    </div>
  );
}