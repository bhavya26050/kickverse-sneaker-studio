
import React, { createContext, useContext, useEffect, useState } from "react";
import { WishlistItem } from "@/types";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  addToWishlist: (item: Omit<WishlistItem, "id">) => void;
  removeFromWishlist: (id: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();

  // Load wishlist from Supabase or localStorage when component mounts or user changes
  useEffect(() => {
    const loadWishlist = async () => {
      setIsLoading(true);
      try {
        if (isAuthenticated && user) {
          // Try to load from Supabase if user is authenticated
          const { data, error } = await supabase
            .from('wishlist_items')
            .select('*')
            .eq('user_id', user.id);
          
          if (error) {
            console.error("Error loading wishlist from Supabase:", error);
            // Fallback to localStorage if Supabase fails
            const storageKey = `kickverse-wishlist-${user.id}`;
            const savedWishlist = localStorage.getItem(storageKey);
            if (savedWishlist) {
              setWishlistItems(JSON.parse(savedWishlist));
            }
          } else if (data) {
            // Transform Supabase data to WishlistItem format
            const transformedItems: WishlistItem[] = data.map(item => ({
              id: item.id,
              productId: item.product_id,
              name: item.name,
              price: item.price,
              imageUrl: item.image_url,
              size: item.size,
              color: item.color,
              customized: item.customized,
              customizationDetails: item.customization_details
            }));
            setWishlistItems(transformedItems);
          }
        } else {
          // Load from localStorage if user is not authenticated
          const storageKey = "kickverse-wishlist-guest";
          const savedWishlist = localStorage.getItem(storageKey);
          if (savedWishlist) {
            setWishlistItems(JSON.parse(savedWishlist));
          }
        }
      } catch (err) {
        console.error("Error in loadWishlist:", err);
        // Fallback to localStorage
        const storageKey = user ? `kickverse-wishlist-${user.id}` : "kickverse-wishlist-guest";
        const savedWishlist = localStorage.getItem(storageKey);
        if (savedWishlist) {
          setWishlistItems(JSON.parse(savedWishlist));
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadWishlist();
  }, [user, isAuthenticated]);

  // Save wishlist to Supabase and localStorage whenever it changes
  useEffect(() => {
    if (isLoading) return; // Don't save during initial loading

    const saveWishlist = async () => {
      const storageKey = user ? `kickverse-wishlist-${user.id}` : "kickverse-wishlist-guest";
      
      // Always save to localStorage as a backup
      localStorage.setItem(storageKey, JSON.stringify(wishlistItems));
      
      // If user is logged in, also save to Supabase
      if (isAuthenticated && user) {
        try {
          // First, remove all existing items
          await supabase
            .from('wishlist_items')
            .delete()
            .eq('user_id', user.id);
          
          // Then insert all current items
          if (wishlistItems.length > 0) {
            const supabaseItems = wishlistItems.map(item => ({
              id: item.id,
              user_id: user.id,
              product_id: item.productId,
              name: item.name,
              price: item.price,
              image_url: item.imageUrl,
              size: item.size || null,
              color: item.color || null,
              customized: item.customized || false,
              customization_details: item.customizationDetails || null
            }));
            
            const { error } = await supabase
              .from('wishlist_items')
              .insert(supabaseItems);
              
            if (error) {
              console.error("Error saving wishlist to Supabase:", error);
            }
          }
        } catch (err) {
          console.error("Error in saveWishlist:", err);
        }
      }
    };

    saveWishlist();
  }, [wishlistItems, user, isAuthenticated, isLoading]);

  const addToWishlist = (item: Omit<WishlistItem, "id">) => {
    try {
      const newItem = { ...item, id: uuidv4() };
      setWishlistItems((prev) => [...prev, newItem]);
      toast.success(`Added ${item.name} to wishlist`);
    } catch (error) {
      toast.error("Failed to add to wishlist");
      console.error("Add to wishlist error:", error);
    }
  };

  const removeFromWishlist = (id: string) => {
    const itemToRemove = wishlistItems.find(item => item.id === id);
    setWishlistItems((prev) => prev.filter((item) => item.id !== id));
    if (itemToRemove) {
      toast.success(`Removed ${itemToRemove.name} from wishlist`);
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlistItems.some((item) => item.productId === productId);
  };

  const clearWishlist = () => {
    setWishlistItems([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
