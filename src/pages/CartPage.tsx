
import React from "react";
import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/cart/CartContext";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, subtotal, clearCart } = useCart();
  const { isAuthenticated } = useAuth();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error("Please login to checkout");
      return;
    }

    // Navigate to checkout page will happen through the link
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-kickverse-dark-purple">Your Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-medium mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added any sneakers to your cart yet.
          </p>
          <Button asChild className="bg-kickverse-purple hover:bg-kickverse-purple/80">
            <Link to="/products">Start Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="w-full lg:w-2/3">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Cart Header - Desktop */}
              <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-gray-50 text-sm font-medium text-gray-600">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-center">Total</div>
              </div>
              
              {/* Cart Items */}
              <div className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <div key={item.id} className="p-4 md:grid md:grid-cols-12 md:gap-4 flex flex-col">
                    {/* Product */}
                    <div className="col-span-6 flex">
                      <div className="w-24 h-24 rounded-md overflow-hidden flex-shrink-0">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="ml-4 flex flex-col">
                        <h3 className="font-medium text-gray-900">{item.name}</h3>
                        {item.size && (
                          <p className="text-sm text-gray-600 mt-1">Size: {item.size}</p>
                        )}
                        {item.color && (
                          <div className="flex items-center mt-1">
                            <span className="text-sm text-gray-600 mr-2">Color:</span>
                            <span
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: item.color }}
                            ></span>
                          </div>
                        )}
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 text-sm flex items-center mt-2 md:hidden"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Remove
                        </button>
                      </div>
                    </div>
                    
                    {/* Price - Mobile & Desktop */}
                    <div className="col-span-2 flex md:justify-center items-center mt-4 md:mt-0">
                      <span className="md:hidden text-gray-600 mr-2">Price:</span>
                      <span className="font-medium">${item.price}</span>
                    </div>
                    
                    {/* Quantity - Mobile & Desktop */}
                    <div className="col-span-2 flex md:justify-center items-center mt-4 md:mt-0">
                      <span className="md:hidden text-gray-600 mr-2">Quantity:</span>
                      <div className="flex items-center">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="mx-3 w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Total - Mobile & Desktop */}
                    <div className="col-span-2 flex md:justify-center items-center mt-4 md:mt-0">
                      <span className="md:hidden text-gray-600 mr-2">Total:</span>
                      <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="ml-4 text-gray-500 hover:text-red-500 hidden md:block"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Cart Actions */}
              <div className="p-4 bg-gray-50 flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => clearCart()}
                  className="text-gray-600"
                >
                  Clear Cart
                </Button>
                <Button asChild className="bg-kickverse-purple hover:bg-kickverse-purple/80">
                  <Link to="/products">Continue Shopping</Link>
                </Button>
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">${(subtotal * 0.1).toFixed(2)}</span>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="flex justify-between mb-6">
                <span className="text-lg font-bold">Total</span>
                <span className="text-lg font-bold">${(subtotal + subtotal * 0.1).toFixed(2)}</span>
              </div>
              
              <Button
                asChild
                className="w-full bg-kickverse-purple hover:bg-kickverse-purple/80"
                size="lg"
                onClick={handleCheckout}
                disabled={!isAuthenticated}
              >
                <Link to={isAuthenticated ? "/checkout" : "/login"}>
                  Proceed to Checkout
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              
              {!isAuthenticated && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-sm text-yellow-800">
                    Please{" "}
                    <Link to="/login" className="text-kickverse-purple font-medium">
                      login
                    </Link>{" "}
                    to complete your purchase.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
