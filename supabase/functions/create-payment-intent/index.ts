
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@12.12.0?target=deno";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { amount, currency = "usd", payment_method_types = ["card"] } = await req.json();

    if (!amount) {
      return new Response(
        JSON.stringify({ error: "Missing required parameter: amount" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Check if we have a Stripe key
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    
    if (!stripeKey) {
      // Return a dummy client secret for demonstration purposes
      console.log("No Stripe key found, returning demo client secret");
      return new Response(
        JSON.stringify({
          clientSecret: "demo_secret_" + Math.random().toString(36).substring(2, 15),
          isDemoMode: true,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Create a real payment intent if we have a Stripe key
    const stripe = new Stripe(stripeKey, {
      apiVersion: "2022-11-15",
      httpClient: Stripe.createFetchHttpClient(),
    });

    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      payment_method_types,
      metadata: {
        source: "kickverse_ecommerce",
      },
    });

    // Return the client secret to the frontend
    return new Response(
      JSON.stringify({
        clientSecret: paymentIntent.client_secret,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error creating payment intent:", error);
    // Return a demo mode response for development
    return new Response(
      JSON.stringify({ 
        clientSecret: "demo_secret_" + Math.random().toString(36).substring(2, 15),
        isDemoMode: true,
        error: error.message || "Unknown error occurred" 
      }),
      {
        status: 200, // Use 200 to allow frontend to continue
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
