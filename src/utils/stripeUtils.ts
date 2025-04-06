
import { loadStripe } from '@stripe/stripe-js';
import { supabase } from '@/integrations/supabase/client';

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
