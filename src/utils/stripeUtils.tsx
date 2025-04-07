
import { loadStripe } from '@stripe/stripe-js';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { toast } from 'sonner';
import React from 'react';

// Initialize Stripe with the publishable key
export const stripePromise = loadStripe('pk_test_51RAbsIP2kKINnwPimtzwMOfK5WQy2ij1S9H2wmdyCtbJgAkJZ8GYKLotmdTco6gO6yDHNlf78V5hloVMhMYZAXRZ00ylSUx3sz');

// Process payment with Stripe
export const processPayment = async (amount: number, currency: string = 'usd') => {
  try {
    // Call our Supabase Edge Function to create a payment intent
    const { data, error } = await supabase.functions.invoke('create-payment-intent', {
      body: {
        amount,
        currency
      }
    });

    if (error) {
      console.error('Error invoking payment intent function:', error);
      throw new Error(error.message || 'Failed to create payment intent');
    }

    if (data.isDemoMode) {
      console.log('Using demo mode for payment processing');
      return {
        success: true,
        isDemoMode: true,
        clientSecret: data.clientSecret
      };
    }

    return {
      success: true,
      clientSecret: data.clientSecret,
      isDemoMode: false
    };
  } catch (error) {
    console.error('Payment processing error:', error);
    return {
      success: false,
      isDemoMode: true,
      error: error.message || 'Payment processing failed'
    };
  }
};

// Stripe Checkout Form component
export const StripeCheckoutForm = ({ clientSecret, amount, onSuccess, onCancel }: { 
  clientSecret: string;
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const cardElement = elements.getElement(CardElement);
      
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      // If in demo mode, simulate success
      if (clientSecret.startsWith('demo_secret_')) {
        setTimeout(() => {
          setLoading(false);
          toast.success('Payment processed successfully (demo mode)');
          onSuccess();
        }, 1500);
        return;
      }

      const { error: paymentError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            // You can add billing details here if needed
          },
        },
      });

      if (paymentError) {
        setError(paymentError.message || 'Payment failed');
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        toast.success('Payment processed successfully');
        onSuccess();
      } else {
        setError('Payment status unknown. Please check your account.');
      }
    } catch (err) {
      console.error('Payment submission error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-500 mb-2">Enter your card details</p>
          <div className="p-3 border rounded-md">
            <CardElement 
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                  invalid: {
                    color: '#9e2146',
                  },
                },
              }}
            />
          </div>
        </div>
        
        <div className="text-right font-medium">
          Amount: ${(amount).toFixed(2)}
        </div>
        
        {error && (
          <div className="text-red-500 text-sm p-2 bg-red-50 rounded">
            {error}
          </div>
        )}
      </div>
      
      <div className="flex justify-end space-x-2">
        <button 
          type="button" 
          onClick={onCancel}
          className="px-4 py-2 border rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || loading}
          className="px-4 py-2 bg-kickverse-purple text-white rounded-md text-sm font-medium hover:bg-kickverse-purple/80 disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Pay Now'}
        </button>
      </div>
    </form>
  );
};

// Stripe Checkout Dialog component
export const StripeCheckoutDialog = ({ 
  open, 
  onOpenChange, 
  amount, 
  onSuccess 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void; 
  amount: number; 
  onSuccess: () => void; 
}) => {
  const [clientSecret, setClientSecret] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const getPaymentIntent = async () => {
      if (open) {
        setIsLoading(true);
        try {
          const result = await processPayment(amount);
          if (result.success && result.clientSecret) {
            setClientSecret(result.clientSecret);
          } else {
            toast.error('Failed to initiate payment');
            onOpenChange(false);
          }
        } catch (error) {
          console.error('Error creating payment intent:', error);
          toast.error('Payment initialization failed');
          onOpenChange(false);
        } finally {
          setIsLoading(false);
        }
      }
    };

    getPaymentIntent();
  }, [open, amount, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Secure Checkout</DialogTitle>
        </DialogHeader>
        
        {isLoading ? (
          <div className="py-8 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-kickverse-purple"></div>
          </div>
        ) : clientSecret ? (
          <Elements stripe={stripePromise}>
            <StripeCheckoutForm 
              clientSecret={clientSecret}
              amount={amount}
              onSuccess={() => {
                onSuccess();
                onOpenChange(false);
              }}
              onCancel={() => onOpenChange(false)}
            />
          </Elements>
        ) : (
          <div className="py-4 text-center text-red-500">
            Failed to initialize payment. Please try again.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
