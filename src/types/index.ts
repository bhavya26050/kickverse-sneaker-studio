
export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  imageUrl: string;
  category: string;
  isCustomizable?: boolean;
  colors?: string[];
  sizes?: string[];
  rating?: number;
  reviewCount?: number;
  inStock?: boolean;
  quantity?: number;
}

export interface CartItem {
  id?: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  color?: string;
  size?: string;
  customized?: boolean;
  customizationDetails?: string;
}

export interface WishlistItem {
  id?: string;
  productId: string;
  name: string;
  price: number;
  imageUrl: string;
  color?: string;
  size?: string;
  customized?: boolean;
  customizationDetails?: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  displayName?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered";
  createdAt: Date;
  paymentMethod: string;
  shippingInfo: ShippingInfo;
  estimatedDelivery?: Date;
}

export interface ShippingInfo {
  fullName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

// Add Supabase Database type extensions for tables
export type Tables = {
  products: {
    Row: {
      id: string;
      name: string;
      price: number;
      original_price: number | null;
      description: string;
      image_url: string;
      category: string;
      is_customizable: boolean | null;
      colors: string[] | null;
      sizes: string[] | null;
      rating: number | null;
      review_count: number | null;
      in_stock: boolean | null;
      quantity: number | null;
      created_at: string | null;
    };
    Insert: {
      id?: string;
      name: string;
      price: number;
      original_price?: number | null;
      description: string;
      image_url: string;
      category: string;
      is_customizable?: boolean | null;
      colors?: string[] | null;
      sizes?: string[] | null;
      rating?: number | null;
      review_count?: number | null;
      in_stock?: boolean | null;
      quantity?: number | null;
      created_at?: string | null;
    };
    Update: {
      id?: string;
      name?: string;
      price?: number;
      original_price?: number | null;
      description?: string;
      image_url?: string;
      category?: string;
      is_customizable?: boolean | null;
      colors?: string[] | null;
      sizes?: string[] | null;
      rating?: number | null;
      review_count?: number | null;
      in_stock?: boolean | null;
      quantity?: number | null;
      created_at?: string | null;
    };
  };
  cart_items: {
    Row: {
      id: string;
      user_id: string;
      product_id: string;
      name: string;
      price: number;
      quantity: number;
      image_url: string;
      size: string | null;
      color: string | null;
      customized: boolean | null;
      customization_details: string | null;
      created_at: string | null;
    };
    Insert: {
      id?: string;
      user_id: string;
      product_id: string;
      name: string;
      price: number;
      quantity?: number;
      image_url: string;
      size?: string | null;
      color?: string | null;
      customized?: boolean | null;
      customization_details?: string | null;
      created_at?: string | null;
    };
    Update: {
      id?: string;
      user_id?: string;
      product_id?: string;
      name?: string;
      price?: number;
      quantity?: number;
      image_url?: string;
      size?: string | null;
      color?: string | null;
      customized?: boolean | null;
      customization_details?: string | null;
      created_at?: string | null;
    };
  };
  wishlist_items: {
    Row: {
      id: string;
      user_id: string;
      product_id: string;
      name: string;
      price: number;
      image_url: string;
      size: string | null;
      color: string | null;
      customized: boolean | null;
      customization_details: string | null;
      created_at: string | null;
    };
    Insert: {
      id?: string;
      user_id: string;
      product_id: string;
      name: string;
      price: number;
      image_url: string;
      size?: string | null;
      color?: string | null;
      customized?: boolean | null;
      customization_details?: string | null;
      created_at?: string | null;
    };
    Update: {
      id?: string;
      user_id?: string;
      product_id?: string;
      name?: string;
      price?: number;
      image_url?: string;
      size?: string | null;
      color?: string | null;
      customized?: boolean | null;
      customization_details?: string | null;
      created_at?: string | null;
    };
  };
  orders: {
    Row: {
      id: string;
      user_id: string;
      total: number;
      status: string;
      payment_method: string;
      shipping_info: ShippingInfo;
      created_at: string | null;
      estimated_delivery: string | null;
    };
    Insert: {
      id?: string;
      user_id: string;
      total: number;
      status?: string;
      payment_method: string;
      shipping_info: ShippingInfo;
      created_at?: string | null;
      estimated_delivery?: string | null;
    };
    Update: {
      id?: string;
      user_id?: string;
      total?: number;
      status?: string;
      payment_method?: string;
      shipping_info?: ShippingInfo;
      created_at?: string | null;
      estimated_delivery?: string | null;
    };
  };
  order_items: {
    Row: {
      id: string;
      order_id: string;
      product_id: string;
      name: string;
      price: number;
      quantity: number;
      image_url: string;
      size: string | null;
      color: string | null;
      customized: boolean | null;
      customization_details: string | null;
    };
    Insert: {
      id?: string;
      order_id: string;
      product_id: string;
      name: string;
      price: number;
      quantity: number;
      image_url: string;
      size?: string | null;
      color?: string | null;
      customized?: boolean | null;
      customization_details?: string | null;
    };
    Update: {
      id?: string;
      order_id?: string;
      product_id?: string;
      name?: string;
      price?: number;
      quantity?: number;
      image_url?: string;
      size?: string | null;
      color?: string | null;
      customized?: boolean | null;
      customization_details?: string | null;
    };
  };
};

// Add this to the Database type in the client
export interface Database {
  public: {
    Tables: Tables;
  };
}
