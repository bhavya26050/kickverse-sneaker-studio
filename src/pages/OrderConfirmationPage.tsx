
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Package, Truck, Calendar, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistance } from "date-fns";

interface OrderItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  size?: string;
  color?: string;
  customized?: boolean;
}

interface ShippingInfo {
  fullName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

interface OrderDetails {
  id: string;
  date: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  paymentMethod: string;
  shippingInfo: ShippingInfo;
  status: string;
  estimatedDelivery: string;
}

const OrderConfirmationPage = () => {
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Get order details from localStorage
    const orderData = localStorage.getItem("kickverse-latest-order");
    
    if (orderData) {
      const parsedOrder = JSON.parse(orderData);
      setOrder(parsedOrder);
    }
    
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <div className="animate-pulse space-y-6 w-full max-w-3xl">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-6 text-kickverse-dark-purple">No Order Found</h1>
        <p className="text-lg mb-8">We couldn't find any recent order information.</p>
        <Button 
          onClick={() => navigate("/products")} 
          className="bg-kickverse-purple hover:bg-kickverse-purple/80"
        >
          Continue Shopping
        </Button>
      </div>
    );
  }

  const formattedDate = new Date(order.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const deliveryDate = new Date(order.estimatedDelivery).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const timeUntilDelivery = formatDistance(
    new Date(order.estimatedDelivery),
    new Date(),
    { addSuffix: true }
  );

  const getStatusStep = (status: string) => {
    switch(status.toLowerCase()) {
      case 'processing':
        return 1;
      case 'shipped':
        return 2;
      case 'delivered':
        return 3;
      default:
        return 1;
    }
  };

  const currentStep = getStatusStep(order.status);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-center text-center">
        <div className="bg-green-50 p-8 rounded-full">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
      </div>
      
      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center text-kickverse-dark-purple">
        Thank You for Your Order!
      </h1>
      
      <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
        Your order has been confirmed and is being processed. We've sent a confirmation
        email to the address associated with your account. You can track your order status below.
      </p>

      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Order Status Header */}
        <div className="bg-kickverse-purple text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Order #{order.id}</h2>
              <p className="text-kickverse-soft-grey">Placed on {formattedDate}</p>
            </div>
            <Badge variant="outline" className="bg-white text-kickverse-purple">
              {order.status.toUpperCase()}
            </Badge>
          </div>
        </div>

        {/* Order Tracking */}
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold mb-4">Track Your Order</h3>
          
          <div className="relative">
            {/* Track Line */}
            <div className="absolute top-6 left-6 w-[calc(100%-48px)] h-1 bg-gray-200 z-0">
              <div 
                className="h-full bg-kickverse-purple transition-all duration-500" 
                style={{ width: `${(currentStep - 1) * 50}%` }}
              />
            </div>
            
            {/* Track Steps */}
            <div className="relative z-10 flex justify-between">
              <div className="flex flex-col items-center">
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center mb-2",
                  currentStep >= 1 ? "bg-kickverse-purple text-white" : "bg-gray-200 text-gray-500"
                )}>
                  <Package className="h-6 w-6" />
                </div>
                <span className="text-sm font-medium">Processing</span>
              </div>
              
              <div className="flex flex-col items-center">
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center mb-2",
                  currentStep >= 2 ? "bg-kickverse-purple text-white" : "bg-gray-200 text-gray-500"
                )}>
                  <Truck className="h-6 w-6" />
                </div>
                <span className="text-sm font-medium">Shipped</span>
              </div>
              
              <div className="flex flex-col items-center">
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center mb-2",
                  currentStep >= 3 ? "bg-kickverse-purple text-white" : "bg-gray-200 text-gray-500"
                )}>
                  <CheckCircle className="h-6 w-6" />
                </div>
                <span className="text-sm font-medium">Delivered</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex items-center justify-center bg-kickverse-soft-grey p-4 rounded-md">
            <Calendar className="h-5 w-5 text-kickverse-purple mr-2" />
            <span className="text-sm">
              Estimated delivery: <strong>{deliveryDate}</strong> ({timeUntilDelivery})
            </span>
          </div>
        </div>

        {/* Order Items */}
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold mb-4">Order Items</h3>
          
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center">
                <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="ml-4 flex-grow">
                  <p className="font-medium">{item.name}</p>
                  <div className="flex text-sm text-gray-500">
                    {item.size && <span className="mr-2">Size: {item.size}</span>}
                    <span>Qty: {item.quantity}</span>
                  </div>
                </div>
                <div className="font-medium">${(item.price * item.quantity).toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping & Payment */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Shipping Address</h3>
            <div className="text-gray-600">
              <p>{order.shippingInfo.fullName}</p>
              <p>{order.shippingInfo.address}</p>
              <p>{order.shippingInfo.city}, {order.shippingInfo.state} {order.shippingInfo.zipCode}</p>
              <p>{order.shippingInfo.country}</p>
              <p>Phone: {order.shippingInfo.phone}</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Payment Information</h3>
            <div className="text-gray-600">
              <p>Payment Method: {order.paymentMethod === 'stripe' ? 'Credit/Debit Card (Stripe)' : 'Cash on Delivery'}</p>
              <p>Payment Status: Completed</p>
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>${order.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between font-bold pt-2">
                <span>Total:</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="bg-gray-50 p-6 flex flex-wrap gap-4 justify-between">
          <Button variant="outline" asChild>
            <Link to="/">Return to Home</Link>
          </Button>
          
          <Button className="bg-kickverse-purple hover:bg-kickverse-purple/80" asChild>
            <Link to="/products">
              Continue Shopping <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
