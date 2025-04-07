
import { Product } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { getFallbackImage } from "@/utils/imageUtils";

// Fallback products in case the API call fails
const fallbackProducts: Product[] = [
  {
    id: "1",
    name: "Air Force 1 Low",
    price: 120,
    description: "The radiance lives on in the Nike Air Force 1 '07, the b-ball OG that puts a fresh spin on what you know best: durably stitched overlays, clean finishes and the perfect amount of flash to make you shine.",
    imageUrl: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/b7d9211c-26e7-431a-ac24-b0540fb3c00f/air-force-1-07-mens-shoes-5QFp5Z.png",
    category: "lifestyle",
    isCustomizable: true,
    colors: ["#FFFFFF", "#000000", "#FF0000", "#0000FF"],
    sizes: ["US 7", "US 8", "US 9", "US 10", "US 11", "US 12"],
    rating: 4.8,
    reviewCount: 450,
    inStock: true,
    quantity: 75
  },
  {
    id: "2",
    name: "Air Jordan 1 Retro High",
    price: 180,
    description: "The Air Jordan 1 High is the shoe that started it all. Michael Jordan's first signature model was designed by Peter Moore in 1985 and has since become an icon in sneaker culture.",
    imageUrl: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/9259e44c-93d3-4e88-99a3-2292c8d91dda/air-jordan-1-mid-mens-shoes-b3js2D.png",
    category: "basketball",
    isCustomizable: true,
    colors: ["#FF0000", "#000000", "#FFFFFF", "#0000FF"],
    sizes: ["US 7", "US 8", "US 9", "US 10", "US 11", "US 12"],
    rating: 4.9,
    reviewCount: 820,
    inStock: true,
    quantity: 45
  },
  {
    id: "3",
    name: "Air Max 270",
    price: 150,
    description: "Nike's first lifestyle Air Max brings you style, comfort and big attitude in the Nike Air Max 270. The design draws inspiration from Air Max icons, showcasing Nike's greatest innovation with its large window and fresh array of colors.",
    imageUrl: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/skwgyqrbfzhu6uyeh0gg/air-max-270-mens-shoes-KkLcGR.png",
    category: "lifestyle",
    isCustomizable: true,
    colors: ["#000000", "#FFFFFF", "#FF0000", "#0000FF"],
    sizes: ["US 7", "US 8", "US 9", "US 10", "US 11", "US 12"],
    rating: 4.7,
    reviewCount: 670,
    inStock: true,
    quantity: 30
  },
  {
    id: "4",
    name: "React Infinity Run Flyknit",
    price: 160,
    originalPrice: 180,
    description: "The Nike React Infinity Run Flyknit is designed to help reduce injury and keep you on the run. More foam and improved upper details provide a secure and cushioned feel.",
    imageUrl: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/i1-665455a5-45de-40fb-945f-c1852b82400d/react-infinity-run-flyknit-mens-running-shoe-zX42Nc.png",
    category: "running",
    isCustomizable: false,
    colors: ["#000000", "#FFFFFF", "#FF0000"],
    sizes: ["US 7", "US 8", "US 9", "US 10", "US 11", "US 12"],
    rating: 4.5,
    reviewCount: 320,
    inStock: true,
    quantity: 15
  },
  {
    id: "5",
    name: "Blazer Mid '77 Vintage",
    price: 100,
    description: "The Nike Blazer Mid '77 Vintage harnesses the old-school look of Nike basketball with a vintage midsole finish. The upper features crisp leather and soft suede details for texture and durability.",
    imageUrl: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/fb7eda3c-5ac8-4d05-a18f-1c2c5e82e36e/blazer-mid-77-vintage-mens-shoes-nw30B2.png",
    category: "lifestyle",
    isCustomizable: true,
    colors: ["#FFFFFF", "#000000", "#FF0000", "#0000FF"],
    sizes: ["US 7", "US 8", "US 9", "US 10", "US 11", "US 12"],
    rating: 4.6,
    reviewCount: 280,
    inStock: true,
    quantity: 25
  },
  {
    id: "6",
    name: "Dunk Low",
    price: 110,
    description: "Created for the hardwood but taken to the streets, the Nike Dunk Low is a basketball icon. The low-cut silhouette features classic design lines and heritage hoops style.",
    imageUrl: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/9259e44c-93d3-4e88-99a3-2292c8d91dda/dunk-low-retro-mens-shoes-87q0hf.png",
    category: "lifestyle",
    isCustomizable: true,
    colors: ["#FFFFFF", "#000000", "#FF0000", "#0000FF"],
    sizes: ["US 7", "US 8", "US 9", "US 10", "US 11", "US 12"],
    rating: 4.8,
    reviewCount: 560,
    inStock: true,
    quantity: 35
  },
  {
    id: "7",
    name: "Kyrie 7",
    price: 130,
    description: "The Kyrie 7 has a lightweight, cushioned design to help you move quickly and easily in any direction. It provides control and response when moving at high speeds on the court.",
    imageUrl: "https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=600&auto=format&fit=crop",
    category: "basketball",
    isCustomizable: false,
    colors: ["#FF0000", "#000000", "#0000FF"],
    sizes: ["US 7", "US 8", "US 9", "US 10", "US 11", "US 12"],
    rating: 4.5,
    reviewCount: 215,
    inStock: true,
    quantity: 20
  },
  {
    id: "8",
    name: "Pegasus 38",
    price: 120,
    description: "The Nike Pegasus 38 continues to put a spring in your step, using responsive foam to help you stay crisp and fresh throughout your run.",
    imageUrl: "https://images.unsplash.com/photo-1608667508764-33cf0726b13a?w=600&auto=format&fit=crop",
    category: "running",
    isCustomizable: false,
    colors: ["#FFFFFF", "#000000", "#FF0000"],
    sizes: ["US 7", "US 8", "US 9", "US 10", "US 11", "US 12"],
    rating: 4.7,
    reviewCount: 310,
    inStock: true,
    quantity: 25
  },
  {
    id: "9",
    name: "SB Dunk High",
    price: 120,
    description: "The Nike SB Dunk High delivers classic style and premium materials to help you push your limits every time you grind through a session.",
    imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&auto=format&fit=crop",
    category: "skateboarding",
    isCustomizable: true,
    colors: ["#000000", "#FFFFFF", "#FF0000", "#0000FF"],
    sizes: ["US 7", "US 8", "US 9", "US 10", "US 11", "US 12"],
    rating: 4.6,
    reviewCount: 185,
    inStock: true,
    quantity: 15
  },
  {
    id: "10",
    name: "LeBron 18",
    price: 200,
    description: "The LeBron 18 harnesses LeBron's supernatural speed and power with specialized cushioning and details designed to help you become an unstoppable force.",
    imageUrl: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=600&auto=format&fit=crop",
    category: "basketball",
    isCustomizable: false,
    colors: ["#000000", "#FF0000", "#0000FF"],
    sizes: ["US 7", "US 8", "US 9", "US 10", "US 11", "US 12"],
    rating: 4.8,
    reviewCount: 260,
    inStock: true,
    quantity: 18
  },
  {
    id: "11",
    name: "Zoom Freak 3",
    price: 120,
    description: "The Zoom Freak 3 helps Giannis create space with his massive strides and euro step. The multidirectional traction helps you stay in control.",
    imageUrl: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&auto=format&fit=crop",
    category: "basketball",
    isCustomizable: false,
    colors: ["#000000", "#FFFFFF", "#FF0000"],
    sizes: ["US 7", "US 8", "US 9", "US 10", "US 11", "US 12"],
    rating: 4.5,
    reviewCount: 190,
    inStock: true,
    quantity: 22
  },
  {
    id: "12",
    name: "ZoomX Vaporfly NEXT",
    price: 250,
    description: "The Nike ZoomX Vaporfly NEXT% clears your path to record-breaking speed with a lighter design and faster feel than before.",
    imageUrl: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop",
    category: "running",
    isCustomizable: false,
    colors: ["#FF0000", "#0000FF", "#00FF00"],
    sizes: ["US 7", "US 8", "US 9", "US 10", "US 11", "US 12"],
    rating: 4.9,
    reviewCount: 320,
    inStock: true,
    quantity: 10
  }
];

// Load products from Supabase
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*');
    
    if (error) {
      console.error("Error fetching products:", error);
      return ensureProductImages(fallbackProducts);
    }
    
    if (!data || data.length === 0) {
      return ensureProductImages(fallbackProducts);
    }
    
    // Transform database products to match our Product interface
    const products = data.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      originalPrice: item.original_price,
      description: item.description,
      imageUrl: item.image_url,
      category: item.category,
      isCustomizable: item.is_customizable,
      colors: item.colors ? (item.colors as string[]) : [],
      sizes: item.sizes ? (item.sizes as string[]) : [],
      rating: item.rating,
      reviewCount: item.review_count,
      inStock: item.in_stock,
      quantity: item.quantity
    }));
    
    return ensureProductImages(products);
  } catch (error) {
    console.error("Error in fetchProducts:", error);
    return ensureProductImages(fallbackProducts);
  }
};

// Ensure all products have valid image URLs
const ensureProductImages = (products: Product[]): Product[] => {
  return products.map(product => ({
    ...product,
    imageUrl: product.imageUrl || getFallbackImage(product.id)
  }));
};

// For immediate use (will be replaced when fetchProducts resolves)
export const products = fallbackProducts.map(product => ({
  ...product,
  imageUrl: product.imageUrl || getFallbackImage(product.id)
}));
