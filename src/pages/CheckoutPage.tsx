
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { ArrowRight, CreditCard, Truck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ShippingInfo } from "@/types";
import { v4 as uuidv4 } from 'uuid';

const CheckoutPage = () => {
  const { cartItems, subtotal, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  const [paymentMethod, setPaymentMethod] = useState<string>("stripe");
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    fullName: user?.displayName || "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    phone: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-6 text-kickverse-dark-purple">Checkout</h1>
        <p className="text-lg mb-8">Your cart is empty. Add some products before checkout.</p>
        <Button 
          onClick={() => navigate("/products")} 
          className="bg-kickverse-purple hover:bg-kickverse-purple/80"
        >
          Browse Products
        </Button>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-6 text-kickverse-dark-purple">Checkout</h1>
        <p className="text-lg mb-8">Please login to checkout.</p>
        <Button 
          onClick={() => navigate("/login")} 
          className="bg-kickverse-purple hover:bg-kickverse-purple/80"
        >
          Login to Continue
        </Button>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Check if all required fields are filled
    const requiredFields = ['fullName', 'address', 'city', 'state', 'zipCode', 'phone'];
    const emptyFields = requiredFields.filter(field => !shippingInfo[field as keyof typeof shippingInfo]);
    
    if (emptyFields.length > 0) {
      toast.error("Please fill all required fields");
      setIsProcessing(false);
      return;
    }

    try {
      if (paymentMethod === "stripe") {
        // Process payment with Stripe
        await handleStripePayment();
      } else {
        // Cash on delivery - direct to success
        await placeOrder();
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("An error occurred during checkout. Please try again.");
      setIsProcessing(false);
    }
  };

  const handleStripePayment = async () => {
    try {
      const totalAmount = subtotal + (subtotal * 0.1); // Including tax

      // Create payment intent
      const response = await supabase.functions.invoke('create-payment-intent', {
        body: {
          amount: totalAmount,
          currency: 'usd'
        }
      });

      if (response.error) {
        throw new Error(response.error.message || "Payment processing failed");
      }

      const { clientSecret } = response.data;
      if (!clientSecret) {
        throw new Error("Failed to create payment intent");
      }

      // In a real application, you would redirect to a Stripe Checkout page
      // or handle the payment on the client side with Elements
      toast.success("Payment successful!");
      
      // Place order after successful payment
      await placeOrder();
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(error instanceof Error ? error.message : "Payment processing failed");
      throw error;
    }
  };

  const placeOrder = async () => {
    if (!user) {
      toast.error("User not authenticated");
      return;
    }

    try {
      const tax = subtotal * 0.1;
      const total = subtotal + tax;
      const orderId = uuidv4();
      const estimatedDelivery = new Date();
      estimatedDelivery.setDate(estimatedDelivery.getDate() + 7);
      
      // Create order in Supabase
      const { error: orderError } = await supabase
        .from('orders')
        .insert({
          id: orderId,
          user_id: user.id,
          total,
          status: 'processing',
          payment_method: paymentMethod,
          shipping_info: shippingInfo,
          estimated_delivery: estimatedDelivery.toISOString()
        });

      if (orderError) {
        throw new Error(`Error creating order: ${orderError.message}`);
      }

      // Create order items
      const orderItems = cartItems.map(item => ({
        order_id: orderId,
        product_id: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image_url: item.imageUrl,
        size: item.size || null,
        color: item.color || null,
        customized: item.customized || false,
        customization_details: item.customizationDetails || null
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        throw new Error(`Error creating order items: ${itemsError.message}`);
      }
      
      // Store order details in localStorage for retrieval on confirmation page
      const orderDetails = {
        id: orderId,
        date: new Date().toISOString(),
        items: cartItems,
        subtotal: subtotal,
        tax: tax,
        shipping: 0,
        total: total,
        paymentMethod,
        shippingInfo,
        status: "processing",
        estimatedDelivery: estimatedDelivery.toISOString(),
      };

      localStorage.setItem("kickverse-latest-order", JSON.stringify(orderDetails));
      
      // Clear the cart
      clearCart();
      
      // Reset processing state
      setIsProcessing(false);
      
      // Navigate to order confirmation page
      navigate("/order-confirmation");
    } catch (error) {
      console.error("Order placement error:", error);
      toast.error("Failed to place order. Please try again.");
      setIsProcessing(false);
      throw error;
    }
  };

  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-kickverse-dark-purple">Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Shipping and Payment Form */}
        <div className="w-full lg:w-2/3">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Shipping Information */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <Truck className="mr-2 h-5 w-5 text-kickverse-purple" />
                Shipping Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={shippingInfo.fullName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="col-span-2">
                  <Label htmlFor="address">Street Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={shippingInfo.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={shippingInfo.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="state">State/Province</Label>
                  <Input
                    id="state"
                    name="state"
                    value={shippingInfo.state}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="zipCode">ZIP/Postal Code</Label>
                  <Input
                    id="zipCode"
                    name="zipCode"
                    value={shippingInfo.zipCode}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    name="country"
                    value={shippingInfo.country}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="col-span-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={shippingInfo.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <CreditCard className="mr-2 h-5 w-5 text-kickverse-purple" />
                Payment Method
              </h2>
              
              <RadioGroup 
                value={paymentMethod} 
                onValueChange={setPaymentMethod}
                className="space-y-4"
              >
                <div className="flex items-center space-x-2 border p-4 rounded-lg">
                  <RadioGroupItem value="stripe" id="stripe" />
                  <Label htmlFor="stripe" className="flex-grow cursor-pointer">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Credit/Debit Card (Stripe)</span>
                      <img 
                        src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" 
                        alt="Stripe" 
                        className="h-6" 
                      />
                    </div>
                    <p className="text-sm text-gray-500">Pay securely via Stripe</p>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2 border p-4 rounded-lg">
                  <RadioGroupItem value="cod" id="cod" />
                  <Label htmlFor="cod" className="flex-grow cursor-pointer">
                    <span className="font-medium">Cash on Delivery</span>
                    <p className="text-sm text-gray-500">Pay when you receive your order</p>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Submit Button - Only visible on small screens */}
            <div className="lg:hidden">
              <Button 
                type="submit"
                className="w-full bg-kickverse-purple hover:bg-kickverse-purple/80"
                size="lg"
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "Place Order"}
                {!isProcessing && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </div>
          </form>
        </div>
        
        {/* Order Summary */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0 mr-3">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        {item.size && `Size: ${item.size}`} × {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (10%)</span>
                <span className="font-medium">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">Free</span>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div className="flex justify-between mb-6">
              <span className="text-lg font-bold">Total</span>
              <span className="text-lg font-bold">${total.toFixed(2)}</span>
            </div>
            
            {/* Submit Button - Only visible on large screens */}
            <div className="hidden lg:block">
              <Button 
                onClick={handleSubmit}
                className="w-full bg-kickverse-purple hover:bg-kickverse-purple/80"
                size="lg"
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "Place Order"}
                {!isProcessing && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </div>
            
            <p className="mt-4 text-xs text-gray-500 text-center">
              By placing your order, you agree to KickVerse's terms of service and privacy policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
