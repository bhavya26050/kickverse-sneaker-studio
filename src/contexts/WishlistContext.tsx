
import React, { createContext, useContext, useEffect, useState } from "react";
import { WishlistItem } from "@/types";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

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
  const { user } = useAuth();

  // Load wishlist from localStorage when component mounts or user changes
  useEffect(() => {
    const loadWishlist = () => {
      const storageKey = user ? `kickverse-wishlist-${user.id}` : "kickverse-wishlist-guest";
      const savedWishlist = localStorage.getItem(storageKey);
      if (savedWishlist) {
        setWishlistItems(JSON.parse(savedWishlist));
      }
    };

    loadWishlist();
  }, [user]);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    const storageKey = user ? `kickverse-wishlist-${user.id}` : "kickverse-wishlist-guest";
    localStorage.setItem(storageKey, JSON.stringify(wishlistItems));
  }, [wishlistItems, user]);

  const addToWishlist = (item: Omit<WishlistItem, "id">) => {
    try {
      const newItem = { ...item, id: `wishlist-item-${Date.now()}-${Math.random().toString(36).substring(2, 9)}` };
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
