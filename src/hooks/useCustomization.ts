
import { useState, useEffect } from "react";
import { Product } from "@/types";
import { products } from "@/data/products";

// Constant definitions moved from page component
export const CUSTOMIZATION_COLORS = [
  { name: "White", value: "#FFFFFF", textColor: "text-gray-900" },
  { name: "Black", value: "#000000", textColor: "text-white" },
  { name: "Red", value: "#FF0000", textColor: "text-white" },
  { name: "Blue", value: "#0000FF", textColor: "text-white" },
  { name: "Green", value: "#008000", textColor: "text-white" },
  { name: "Yellow", value: "#FFFF00", textColor: "text-gray-900" },
  { name: "Orange", value: "#FFA500", textColor: "text-white" },
  { name: "Purple", value: "#800080", textColor: "text-white" },
  { name: "Pink", value: "#FFC0CB", textColor: "text-gray-900" },
  { name: "Gray", value: "#808080", textColor: "text-white" },
];

export const SHOE_PARTS_BASE_DUNK = [
  { id: "base", name: "Base", defaultColor: "#FFFFFF" },
  { id: "swoosh", name: "Swoosh", defaultColor: "#000000" },
  { id: "laces", name: "Laces", defaultColor: "#FFFFFF" },
  { id: "sole", name: "Sole", defaultColor: "#FFFFFF" },
  { id: "toebox", name: "Toe Box", defaultColor: "#FFFFFF" },
  { id: "heel", name: "Heel", defaultColor: "#FFFFFF" },
];

export const SIZES = ["US 7", "US 8", "US 9", "US 10", "US 11", "US 12"];
export const ANGLES = [0, 45, 90, 180, 270];

interface CustomizationState {
  [key: string]: string;
}

export const useCustomization = (productId: string | null) => {
  const [baseProduct, setBaseProduct] = useState<Product | null>(null);
  const [shoeParts, setShoeParts] = useState(SHOE_PARTS_BASE_DUNK);
  const [customization, setCustomization] = useState<CustomizationState>({});
  const [selectedSize, setSelectedSize] = useState<string>(SIZES[2]); // Default to US 9
  const [price, setPrice] = useState(150); // Default price for customization
  const [activeTab, setActiveTab] = useState("design");
  const [activeAngle, setActiveAngle] = useState(ANGLES[0]);

  // Initialize the customization state
  useEffect(() => {
    const initialCustomization: CustomizationState = {};
    shoeParts.forEach(part => {
      initialCustomization[part.id] = part.defaultColor;
    });
    setCustomization(initialCustomization);

    // If product ID is provided, load that product
    if (productId) {
      const product = products.find(p => p.id === productId);
      if (product && product.isCustomizable) {
        setBaseProduct(product);
        setPrice(product.price + 50); // Customization costs extra
      }
    }
  }, [productId, shoeParts]);

  const handleColorChange = (partId: string, color: string) => {
    setCustomization(prev => ({
      ...prev,
      [partId]: color
    }));
  };

  const handleRotate = (angle = undefined) => {
    if (angle !== undefined) {
      setActiveAngle(angle);
    } else {
      // Cycle through angles if no specific angle is provided
      const currentIndex = ANGLES.indexOf(activeAngle);
      const nextIndex = (currentIndex + 1) % ANGLES.length;
      setActiveAngle(ANGLES[nextIndex]);
    }
  };

  return {
    baseProduct,
    shoeParts,
    customization,
    selectedSize,
    setSelectedSize,
    price,
    activeTab,
    setActiveTab,
    activeAngle,
    handleColorChange,
    handleRotate,
    customizationColors: CUSTOMIZATION_COLORS,
    sizes: SIZES,
    angles: ANGLES
  };
};
