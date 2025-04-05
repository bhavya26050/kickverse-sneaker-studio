
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
