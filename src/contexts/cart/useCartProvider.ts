
import { useState, useEffect } from "react";
import { CartItem } from "@/types";
import { useAuth } from "../AuthContext";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';
import { 
  calculateTotalItems, 
  calculateSubtotal, 
  addToCartFallback, 
  saveCartToSupabase, 
  loadCartFromSupabase,
  checkProductAvailability,
  updateProductQuantity
} from "./cartUtils";

export const useCartProvider = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const loadCart = async () => {
      setIsLoading(true);
      try {
        if (isAuthenticated && user) {
          const cartData = await loadCartFromSupabase(user.id);
          
          if (cartData) {
            setCartItems(cartData);
          } else {
            const storageKey = `kickverse-cart-${user.id}`;
            const savedCart = localStorage.getItem(storageKey);
            if (savedCart) {
              setCartItems(JSON.parse(savedCart));
            }
          }
        } else {
          const storageKey = "kickverse-cart-guest";
          const savedCart = localStorage.getItem(storageKey);
          if (savedCart) {
            setCartItems(JSON.parse(savedCart));
          }
        }
      } catch (err) {
        console.error("Error in loadCart:", err);
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

  useEffect(() => {
    if (isLoading) return;

    const saveCart = async () => {
      const storageKey = user ? `kickverse-cart-${user.id}` : "kickverse-cart-guest";
      
      localStorage.setItem(storageKey, JSON.stringify(cartItems));
      
      if (isAuthenticated && user) {
        await saveCartToSupabase(user.id, cartItems);
      }
    };

    saveCart();
  }, [cartItems, user, isAuthenticated, isLoading]);

  const addToCart = async (item: Omit<CartItem, "id">) => {
    if (!item.customized) {
      try {
        const availability = await checkProductAvailability(
          item.productId, 
          item.quantity
        );
        
        if (!availability.available) {
          if (!availability.product?.in_stock) {
            toast.error(`Sorry, ${item.name} is out of stock`);
            return;
          }
          
          if (availability.maxQuantity !== undefined) {
            toast.error(`Sorry, only ${availability.maxQuantity} units available`);
            return;
          }
        }
        
        const existingItem = cartItems.find(
          (cartItem) => 
            cartItem.productId === item.productId && 
            cartItem.color === item.color && 
            cartItem.size === item.size
        );
        
        const currentQuantity = existingItem ? existingItem.quantity : 0;
        const requestedQuantity = currentQuantity + item.quantity;
        
        if (availability.product?.quantity !== null && requestedQuantity > availability.product.quantity) {
          toast.error(`Sorry, only ${availability.product.quantity} units available`);
          return;
        }
        
        if (existingItem) {
          updateQuantity(existingItem.id, requestedQuantity);
          toast.success(`Updated ${item.name} quantity in cart`);
        } else {
          const newItem = { ...item, id: uuidv4() };
          setCartItems((prev) => [...prev, newItem]);
          toast.success(`Added ${item.name} to cart`);
        }
        
        await updateProductQuantity(item.productId, item.quantity);
      } catch (err) {
        console.error("Error in addToCart:", err);
        addToCartFallback(item, cartItems, updateQuantity, setCartItems);
      }
    } else {
      addToCartFallback(item, cartItems, updateQuantity, setCartItems);
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

  const totalItems = calculateTotalItems(cartItems);
  const subtotal = calculateSubtotal(cartItems);

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    subtotal,
  };
};
