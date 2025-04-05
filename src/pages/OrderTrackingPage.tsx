
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { PackageSearch, CircleHelp } from "lucide-react";

const OrderTrackingPage = () => {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!orderId.trim() || !email.trim()) {
      toast.error("Please enter both order ID and email");
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      // Check if the order exists in localStorage
      const lastOrder = localStorage.getItem("kickverse-latest-order");
      
      if (lastOrder) {
        const orderDetails = JSON.parse(lastOrder);
        
        if (orderDetails.id === orderId) {
          navigate(`/order-confirmation`);
          return;
        }
      }
      
      // If we don't find the order
      toast.error("Order not found. Please check your order ID and email.");
      setIsSubmitting(false);
    }, 1500);
  };

  const handleFaqClick = (e: React.MouseEvent, question: string) => {
    e.preventDefault();
    
    switch(question) {
      case "find-order-id":
        toast.info("Your order ID can be found in your order confirmation email or in your account order history.");
        break;
      case "no-confirmation":
        toast.info("If you haven't received a confirmation email, please check your spam folder or contact our customer support.");
        break;
      default:
        toast.info("Please contact our customer support for assistance.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-kickverse-dark-purple text-center">
        Track Your Order
      </h1>

      <div className="max-w-2xl mx-auto">
        <div className="bg-white p-8 rounded-xl shadow-sm mb-8">
          <div className="flex justify-center mb-8">
            <div className="p-4 bg-kickverse-soft-grey rounded-full">
              <PackageSearch className="h-10 w-10 text-kickverse-purple" />
            </div>
          </div>
          
          <p className="text-center text-gray-600 mb-8">
            Enter your order details below to track the status of your order and find out when it will arrive.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="order-id" className="block text-sm font-medium mb-2">
                Order ID
              </label>
              <Input
                id="order-id"
                type="text"
                placeholder="e.g. KV-123456"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <Button
              type="submit"
              className="w-full bg-kickverse-purple hover:bg-kickverse-purple/80"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Searching..." : "Track Order"}
            </Button>
          </form>
        </div>
        
        <div className="bg-kickverse-soft-grey p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <CircleHelp className="mr-2 h-5 w-5 text-kickverse-purple" />
            Frequently Asked Questions
          </h2>
          
          <ul className="space-y-3 text-gray-700">
            <li>
              <a 
                href="#" 
                className="block hover:text-kickverse-purple" 
                onClick={(e) => handleFaqClick(e, "find-order-id")}
              >
                Where can I find my order ID?
              </a>
            </li>
            <li>
              <a 
                href="#" 
                className="block hover:text-kickverse-purple" 
                onClick={(e) => handleFaqClick(e, "no-confirmation")}
              >
                I haven't received an order confirmation email
              </a>
            </li>
            <li>
              <a 
                href="#" 
                className="block hover:text-kickverse-purple" 
                onClick={(e) => handleFaqClick(e, "delivery-time")}
              >
                How long will my delivery take?
              </a>
            </li>
            <li>
              <a 
                href="#" 
                className="block hover:text-kickverse-purple" 
                onClick={(e) => handleFaqClick(e, "change-address")}
              >
                Can I change my shipping address?
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingPage;
