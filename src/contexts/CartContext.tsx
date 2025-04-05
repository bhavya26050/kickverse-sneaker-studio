
import React, { createContext, useContext, useEffect, useState } from "react";
import { CartItem } from "@/types";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';

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
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();

  // Load cart from Supabase or localStorage when component mounts or user changes
  useEffect(() => {
    const loadCart = async () => {
      setIsLoading(true);
      try {
        if (isAuthenticated && user) {
          // Try to load from Supabase if user is authenticated
          const { data, error } = await supabase
            .from('cart_items')
            .select('*')
            .eq('user_id', user.id);
          
          if (error) {
            console.error("Error loading cart from Supabase:", error);
            // Fallback to localStorage if Supabase fails
            const storageKey = `kickverse-cart-${user.id}`;
            const savedCart = localStorage.getItem(storageKey);
            if (savedCart) {
              setCartItems(JSON.parse(savedCart));
            }
          } else if (data) {
            // Transform Supabase data to CartItem format
            const transformedItems: CartItem[] = data.map(item => ({
              id: item.id,
              productId: item.product_id,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
              imageUrl: item.image_url,
              size: item.size,
              color: item.color,
              customized: item.customized,
              customizationDetails: item.customization_details
            }));
            setCartItems(transformedItems);
          }
        } else {
          // Load from localStorage if user is not authenticated
          const storageKey = "kickverse-cart-guest";
          const savedCart = localStorage.getItem(storageKey);
          if (savedCart) {
            setCartItems(JSON.parse(savedCart));
          }
        }
      } catch (err) {
        console.error("Error in loadCart:", err);
        // Fallback to localStorage
        const storageKey = user ? `kickverse-cart-${user.id}` : "kickverse-cart-guest";
        const savedCart = localStorage.getItem(storageKey);
        if (savedCart) {
          setCartItems(JSON.parse(savedCart));
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadCart();
  }, [user, isAuthenticated]);

  // Save cart to Supabase and localStorage whenever it changes
  useEffect(() => {
    if (isLoading) return; // Don't save during initial loading

    const saveCart = async () => {
      const storageKey = user ? `kickverse-cart-${user.id}` : "kickverse-cart-guest";
      
      // Always save to localStorage as a backup
      localStorage.setItem(storageKey, JSON.stringify(cartItems));
      
      // If user is logged in, also save to Supabase
      if (isAuthenticated && user) {
        try {
          // First, remove all existing items
          await supabase
            .from('cart_items')
            .delete()
            .eq('user_id', user.id);
          
          // Then insert all current items
          if (cartItems.length > 0) {
            const supabaseItems = cartItems.map(item => ({
              id: item.id,
              user_id: user.id,
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
            
            if (supabaseItems.length > 0) {
              const { error } = await supabase
                .from('cart_items')
                .insert(supabaseItems);
                
              if (error) {
                console.error("Error saving cart to Supabase:", error);
              }
            }
          }
        } catch (err) {
          console.error("Error in saveCart:", err);
        }
      }
    };

    saveCart();
  }, [cartItems, user, isAuthenticated, isLoading]);

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
      const newItem = { ...item, id: uuidv4() };
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
