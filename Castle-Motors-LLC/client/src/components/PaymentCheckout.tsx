import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { CreditCard, Shield, CheckCircle } from "lucide-react";

// Initialize Stripe - will show error if keys not configured
let stripePromise: Promise<any> | null = null;

try {
  const publishableKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
  if (publishableKey) {
    stripePromise = loadStripe(publishableKey);
  }
} catch (error) {
  console.warn("Stripe public key not configured");
}

interface PaymentFormProps {
  onSuccess: () => void;
  onError: (error: string) => void;
  clientSecret: string;
}

function PaymentForm({ onSuccess, onError, clientSecret }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      onError("Payment system not ready. Please try again.");
      return;
    }

    setIsProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/broker?payment=success`,
        },
        redirect: "if_required"
      });

      if (error) {
        onError(error.message || "Payment failed. Please try again.");
      } else {
        onSuccess();
      }
    } catch (err: any) {
      onError("An unexpected error occurred. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="h-4 w-4 text-green-600" />
          <span className="text-sm font-medium">Secure Payment</span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Your payment information is encrypted and secure. We use industry-standard security measures to protect your data.
        </p>
      </div>
      
      <PaymentElement 
        options={{
          layout: "tabs"
        }}
      />
      
      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full"
        size="lg"
        data-testid="button-submit-payment"
      >
        {isProcessing ? (
          <div className="flex items-center gap-2">
            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
            Processing Payment...
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Pay $500 Deposit
          </div>
        )}
      </Button>
    </form>
  );
}

interface PaymentCheckoutProps {
  onSuccess: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function PaymentCheckout({ onSuccess, isOpen, onClose }: PaymentCheckoutProps) {
  const [clientSecret, setClientSecret] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && !clientSecret) {
      createPaymentIntent();
    }
  }, [isOpen]);

  const createPaymentIntent = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await apiRequest("POST", "/api/create-payment-intent", { 
        amount: 500 // $500 deposit
      });
      const data = await response.json();
      
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
      } else {
        throw new Error(data.error || "Failed to initialize payment");
      }
    } catch (err: any) {
      const errorMessage = err.message || "Failed to initialize payment. Please try again.";
      setError(errorMessage);
      toast({
        title: "Payment Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccess = () => {
    toast({
      title: "Payment Successful!",
      description: "Your $500 deposit has been processed. We'll begin searching for your vehicle right away.",
    });
    onSuccess();
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    toast({
      title: "Payment Failed",
      description: errorMessage,
      variant: "destructive",
    });
  };

  if (!isOpen) return null;

  // Show configuration error if Stripe keys aren't set
  if (!stripePromise) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-600">Payment Not Available</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p>Payment processing is currently being configured. Please contact us directly to arrange your broker service deposit.</p>
            <div className="space-y-2">
              <Button onClick={onClose} variant="outline" className="w-full">
                Close
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Broker Service Payment
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
              <p>Initializing secure payment...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8 space-y-4">
              <div className="text-red-600 mb-4">{error}</div>
              <div className="space-y-2">
                <Button onClick={createPaymentIntent} className="w-full">
                  Try Again
                </Button>
                <Button onClick={onClose} variant="outline" className="w-full">
                  Cancel
                </Button>
              </div>
            </div>
          ) : clientSecret && stripePromise ? (
            <div className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Auto Broker Service - $500 Deposit</h3>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• Professional vehicle search at auctions</li>
                  <li>• Expert negotiation and bidding</li>
                  <li>• Vehicle inspection and documentation</li>
                  <li>• Full-service delivery coordination</li>
                </ul>
              </div>

              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <PaymentForm
                  onSuccess={handleSuccess}
                  onError={handleError}
                  clientSecret={clientSecret}
                />
              </Elements>

              <Button onClick={onClose} variant="outline" className="w-full">
                Cancel Payment
              </Button>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}