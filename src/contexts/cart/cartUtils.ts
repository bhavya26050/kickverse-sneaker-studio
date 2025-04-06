
import { CartItem } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';

export const calculateTotalItems = (cartItems: CartItem[]): number => {
  return cartItems.reduce((total, item) => total + item.quantity, 0);
};

export const calculateSubtotal = (cartItems: CartItem[]): number => {
  return cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
};

export const addToCartFallback = (
  item: Omit<CartItem, "id">, 
  cartItems: CartItem[], 
  updateQuantity: (id: string, quantity: number) => void,
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>
): void => {
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

export const saveCartToSupabase = async (userId: string, cartItems: CartItem[]) => {
  try {
    await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId);
    
    if (cartItems.length > 0) {
      const supabaseItems = cartItems.map(item => ({
        id: item.id,
        user_id: userId,
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
    console.error("Error in saveCartToSupabase:", err);
  }
};

export const loadCartFromSupabase = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', userId);
    
    if (error) {
      console.error("Error loading cart from Supabase:", error);
      return null;
    }
    
    return data.map(item => ({
      id: item.id,
      productId: item.product_id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      imageUrl: item.image_url,
      size: item.size || undefined,
      color: item.color || undefined,
      customized: item.customized || false,
      customizationDetails: item.customization_details || undefined
    }));
  } catch (err) {
    console.error("Error in loadCartFromSupabase:", err);
    return null;
  }
};

export const checkProductAvailability = async (productId: string, requestedQuantity: number) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('quantity, in_stock')
      .eq('id', productId)
      .single();
    
    if (error) {
      console.error("Error checking product availability:", error);
      return { available: true, product: null, error };
    }
    
    if (!data.in_stock) {
      return { available: false, product: data, error: null };
    }
    
    if (data.quantity !== null && requestedQuantity > data.quantity) {
      return { available: false, product: data, error: null, maxQuantity: data.quantity };
    }
    
    return { available: true, product: data, error: null };
  } catch (err) {
    console.error("Error in checkProductAvailability:", err);
    return { available: true, product: null, error: err };
  }
};

export const updateProductQuantity = async (productId: string, quantity: number) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('quantity')
      .eq('id', productId)
      .single();
    
    if (error || !data) {
      console.error("Error getting product quantity:", error);
      return;
    }
    
    const newQuantity = data.quantity !== null ? data.quantity - quantity : null;
    const inStock = newQuantity === null || newQuantity > 0;
    
    await supabase
      .from('products')
      .update({
        quantity: newQuantity,
        in_stock: inStock
      })
      .eq('id', productId);
  } catch (err) {
    console.error("Error in updateProductQuantity:", err);
  }
};
