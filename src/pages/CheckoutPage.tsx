
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/cart/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { StripeCheckoutDialog } from "@/utils/stripeUtils";
import { ShoppingCart, ChevronRight, CreditCard } from "lucide-react";

type ShippingFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
};

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const [paymentOpen, setPaymentOpen] = useState(false);
  
  const { register, handleSubmit, formState: { errors, isValid } } = useForm<ShippingFormValues>({
    defaultValues: {
      firstName: user?.name?.split(' ')[0] || '',
      lastName: user?.name?.split(' ')[1] || '',
      email: user?.email || '',
      phoneNumber: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States',
    },
    mode: 'onBlur'
  });

  const TAX_RATE = 0.08;
  const SHIPPING_COST = subtotal > 100 ? 0 : 10;
  
  const taxAmount = subtotal * TAX_RATE;
  const total = subtotal + taxAmount + SHIPPING_COST;

  const handleOrderPlacement = (data: ShippingFormValues) => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    
    // Open the payment dialog
    setPaymentOpen(true);
  };

  const handlePaymentSuccess = () => {
    clearCart();
    navigate('/order-confirmation');
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="max-w-md mx-auto">
          <ShoppingCart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-medium mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some products to your cart to proceed with checkout.</p>
          <Button asChild className="bg-kickverse-purple hover:bg-kickverse-purple/80">
            <Link to="/products">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center text-sm text-gray-500 mb-8">
        <Link to="/" className="hover:text-kickverse-purple transition-colors">Home</Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <Link to="/cart" className="hover:text-kickverse-purple transition-colors">Cart</Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <span className="text-gray-900">Checkout</span>
      </div>

      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-medium mb-4">Shipping Information</h2>
            <form onSubmit={handleSubmit(handleOrderPlacement)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input 
                    id="firstName" 
                    {...register("firstName", { required: "First name is required" })} 
                  />
                  {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName.message}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input 
                    id="lastName" 
                    {...register("lastName", { required: "Last name is required" })} 
                  />
                  {errors.lastName && <p className="text-red-500 text-xs">{errors.lastName.message}</p>}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    {...register("email", { 
                      required: "Email is required",
                      pattern: {
                        value: /\S+@\S+\.\S+/,
                        message: "Please enter a valid email address"
                      }
                    })} 
                  />
                  {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input 
                    id="phoneNumber" 
                    {...register("phoneNumber", { required: "Phone number is required" })} 
                  />
                  {errors.phoneNumber && <p className="text-red-500 text-xs">{errors.phoneNumber.message}</p>}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input 
                  id="address" 
                  {...register("address", { required: "Address is required" })} 
                />
                {errors.address && <p className="text-red-500 text-xs">{errors.address.message}</p>}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input 
                    id="city" 
                    {...register("city", { required: "City is required" })} 
                  />
                  {errors.city && <p className="text-red-500 text-xs">{errors.city.message}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input 
                    id="state" 
                    {...register("state", { required: "State is required" })} 
                  />
                  {errors.state && <p className="text-red-500 text-xs">{errors.state.message}</p>}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input 
                    id="zipCode" 
                    {...register("zipCode", { required: "ZIP code is required" })} 
                  />
                  {errors.zipCode && <p className="text-red-500 text-xs">{errors.zipCode.message}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input 
                    id="country" 
                    {...register("country", { required: "Country is required" })} 
                  />
                  {errors.country && <p className="text-red-500 text-xs">{errors.country.message}</p>}
                </div>
              </div>
              
              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full bg-kickverse-purple hover:bg-kickverse-purple/80"
                  disabled={!isValid}
                >
                  <CreditCard className="mr-2 h-5 w-5" />
                  Proceed to Payment
                </Button>
              </div>
            </form>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 h-fit">
          <h2 className="text-xl font-medium mb-4">Order Summary</h2>
          
          <div className="space-y-4 mb-6">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="relative h-16 w-16 rounded overflow-hidden mr-4">
                    <img 
                      src={item.imageUrl} 
                      alt={item.name} 
                      className="absolute inset-0 w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&auto=format&fit=crop";
                      }}
                    />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-gray-500 text-sm">
                      {item.color && `Color: ${item.color}`}
                      {item.size && item.color && ' / '}
                      {item.size && `Size: ${item.size}`}
                    </p>
                    <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
                  </div>
                </div>
                <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          
          <Separator className="my-4" />
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax ({(TAX_RATE * 100).toFixed(0)}%)</span>
              <span>${taxAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span>{SHIPPING_COST === 0 ? 'Free' : `$${SHIPPING_COST.toFixed(2)}`}</span>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          
          <div className="mt-6 text-xs text-gray-500">
            <p>By proceeding, you agree to our Terms of Service and Privacy Policy.</p>
          </div>
        </div>
      </div>
      
      {/* Stripe Payment Dialog */}
      <StripeCheckoutDialog 
        open={paymentOpen} 
        onOpenChange={setPaymentOpen} 
        amount={total} 
        onSuccess={handlePaymentSuccess} 
      />
    </div>
  );
};

export default CheckoutPage;
