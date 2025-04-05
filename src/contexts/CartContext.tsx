
import React, { createContext, useContext, useEffect, useState } from "react";
import { CartItem } from "@/types";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, "id">) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { user } = useAuth();

  // Load cart from localStorage when component mounts or user changes
  useEffect(() => {
    const loadCart = () => {
      const storageKey = user ? `kickverse-cart-${user.id}` : "kickverse-cart-guest";
      const savedCart = localStorage.getItem(storageKey);
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    };

    loadCart();
  }, [user]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    const storageKey = user ? `kickverse-cart-${user.id}` : "kickverse-cart-guest";
    localStorage.setItem(storageKey, JSON.stringify(cartItems));
  }, [cartItems, user]);

  const addToCart = (item: Omit<CartItem, "id">) => {
    const existingItem = cartItems.find(
      (cartItem) => 
        cartItem.productId === item.productId && 
        cartItem.color === item.color && 
        cartItem.size === item.size
    );

    if (existingItem) {
      updateQuantity(existingItem.id, existingItem.quantity + item.quantity);
      toast.success(`Updated ${item.name} quantity in cart`);
    } else {
      const newItem = { ...item, id: `cart-item-${Date.now()}-${Math.random().toString(36).substring(2, 9)}` };
      setCartItems((prev) => [...prev, newItem]);
      toast.success(`Added ${item.name} to cart`);
    }
  };

  const removeFromCart = (id: string) => {
    const itemToRemove = cartItems.find(item => item.id === id);
    setCartItems((prev) => prev.filter((item) => item.id !== id));
    if (itemToRemove) {
      toast.success(`Removed ${itemToRemove.name} from cart`);
    }
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
