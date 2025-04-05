
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { products } from "@/data/products";
import { Product } from "@/types";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { cn } from "@/lib/utils";
import { HeartIcon, ShoppingCartIcon } from "lucide-react";

const CUSTOMIZATION_COLORS = [
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

const shoePartsBaseDunk = [
  { id: "base", name: "Base", defaultColor: "#FFFFFF" },
  { id: "swoosh", name: "Swoosh", defaultColor: "#000000" },
  { id: "laces", name: "Laces", defaultColor: "#FFFFFF" },
  { id: "sole", name: "Sole", defaultColor: "#FFFFFF" },
  { id: "toebox", name: "Toe Box", defaultColor: "#FFFFFF" },
  { id: "heel", name: "Heel", defaultColor: "#FFFFFF" },
];

const SIZES = ["US 7", "US 8", "US 9", "US 10", "US 11", "US 12"];

interface CustomizationState {
  [key: string]: string;
}

const CustomizePage = () => {
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("product");
  
  const [baseProduct, setBaseProduct] = useState<Product | null>(null);
  const [shoeParts, setShoeParts] = useState(shoePartsBaseDunk);
  const [customization, setCustomization] = useState<CustomizationState>({});
  const [selectedSize, setSelectedSize] = useState<string>(SIZES[2]); // Default to US 9
  const [price, setPrice] = useState(150); // Default price for customization
  const [activeTab, setActiveTab] = useState("design");

  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

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

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }

    const customizedName = baseProduct 
      ? `Custom ${baseProduct.name}` 
      : "Custom Sneaker Design";

    addToCart({
      productId: "custom-" + Date.now(),
      name: customizedName,
      price,
      quantity: 1,
      imageUrl: baseProduct?.imageUrl || "https://static.nike.com/a/images/t_PDP_864_v1/f_auto,b_rgb:f5f5f5/dd40b594-4ef5-437d-8ea7-dd83a18e2a9c/custom-nike-dunk-high-by-you-shoes.png", 
      size: selectedSize,
      customized: true,
    });

    toast.success("Added custom design to cart!");
  };

  const handleSaveToWishlist = () => {
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }

    const customizedName = baseProduct 
      ? `Custom ${baseProduct.name}` 
      : "Custom Sneaker Design";

    addToWishlist({
      productId: "custom-" + Date.now(),
      name: customizedName,
      price,
      imageUrl: baseProduct?.imageUrl || "https://static.nike.com/a/images/t_PDP_864_v1/f_auto,b_rgb:f5f5f5/dd40b594-4ef5-437d-8ea7-dd83a18e2a9c/custom-nike-dunk-high-by-you-shoes.png",
      size: selectedSize,
      customized: true,
    });

    toast.success("Saved custom design to wishlist!");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-kickverse-dark-purple">
        Customize Your Sneakers
      </h1>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Preview */}
        <div className="w-full lg:w-1/2 mb-8 lg:mb-0">
          <div className="bg-gray-50 rounded-lg h-[500px] flex items-center justify-center p-8 mb-4 relative overflow-hidden">
            {/* This would be replaced with an actual interactive 3D model in a real app */}
            <img
              src={baseProduct?.imageUrl || "https://static.nike.com/a/images/t_PDP_864_v1/f_auto,b_rgb:f5f5f5/dd40b594-4ef5-437d-8ea7-dd83a18e2a9c/custom-nike-dunk-high-by-you-shoes.png"}
              alt="Customizable Sneaker"
              className="w-full h-full object-contain transform hover:scale-105 transition-transform duration-300"
            />
            
            {/* Color Indicators - just for visual representation */}
            <div className="absolute bottom-4 left-4 flex space-x-2">
              {Object.entries(customization).map(([partId, color]) => (
                <div
                  key={partId}
                  className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: color }}
                  title={`${shoeParts.find(p => p.id === partId)?.name}: ${color}`}
                />
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Your Custom Sneaker</h2>
            {baseProduct ? (
              <p className="text-gray-600 mb-4">
                Customizing {baseProduct.name} - Make it uniquely yours!
              </p>
            ) : (
              <p className="text-gray-600 mb-4">
                Design your perfect sneaker from scratch.
              </p>
            )}
            <div className="flex justify-between items-center">
              <div>
                <span className="text-sm text-gray-600">Custom Price:</span>
                <span className="ml-2 text-2xl font-bold text-kickverse-purple">${price}</span>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={handleSaveToWishlist}
                  className="border-kickverse-purple text-kickverse-purple"
                >
                  <HeartIcon className="mr-2 h-4 w-4" />
                  Save Design
                </Button>
                <Button
                  onClick={handleAddToCart}
                  className="bg-kickverse-purple hover:bg-kickverse-purple/80"
                >
                  <ShoppingCartIcon className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Customization Panel */}
        <div className="w-full lg:w-1/2">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b">
              <button
                className={cn(
                  "flex-1 py-4 px-6 text-center font-medium",
                  activeTab === "design"
                    ? "border-b-2 border-kickverse-purple text-kickverse-purple"
                    : "text-gray-500 hover:text-kickverse-purple"
                )}
                onClick={() => setActiveTab("design")}
              >
                Design
              </button>
              <button
                className={cn(
                  "flex-1 py-4 px-6 text-center font-medium",
                  activeTab === "sizing"
                    ? "border-b-2 border-kickverse-purple text-kickverse-purple"
                    : "text-gray-500 hover:text-kickverse-purple"
                )}
                onClick={() => setActiveTab("sizing")}
              >
                Sizing
              </button>
            </div>

            {/* Design Tab */}
            {activeTab === "design" && (
              <div className="p-6">
                <h2 className="text-lg font-medium mb-6">Choose Colors</h2>
                
                {shoeParts.map(part => (
                  <div key={part.id} className="mb-6">
                    <Label className="block text-sm font-medium text-gray-700 mb-2">
                      {part.name}
                    </Label>
                    <div className="grid grid-cols-5 gap-3">
                      {CUSTOMIZATION_COLORS.map(color => (
                        <button
                          key={`${part.id}-${color.value}`}
                          className={cn(
                            "color-swatch flex items-center justify-center",
                            customization[part.id] === color.value && "active",
                            color.textColor
                          )}
                          style={{ backgroundColor: color.value }}
                          onClick={() => handleColorChange(part.id, color.value)}
                          aria-label={`${part.name} ${color.name}`}
                        >
                          {customization[part.id] === color.value && "✓"}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Sizing Tab */}
            {activeTab === "sizing" && (
              <div className="p-6">
                <h2 className="text-lg font-medium mb-6">Select Your Size</h2>
                
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {SIZES.map(size => (
                    <Button
                      key={size}
                      variant="outline"
                      className={cn(
                        "border-gray-300",
                        selectedSize === size && "border-kickverse-purple bg-kickverse-soft-grey"
                      )}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
                
                <div className="bg-kickverse-soft-grey p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Size Guide</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Not sure of your size? Use our size guide to find the perfect fit.
                  </p>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">US Size</th>
                        <th className="text-left py-2">EU Size</th>
                        <th className="text-left py-2">Foot Length (cm)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2">US 7</td>
                        <td className="py-2">EU 40</td>
                        <td className="py-2">25 cm</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">US 8</td>
                        <td className="py-2">EU 41</td>
                        <td className="py-2">26 cm</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">US 9</td>
                        <td className="py-2">EU 42</td>
                        <td className="py-2">27 cm</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">US 10</td>
                        <td className="py-2">EU 43</td>
                        <td className="py-2">28 cm</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">US 11</td>
                        <td className="py-2">EU 44</td>
                        <td className="py-2">29 cm</td>
                      </tr>
                      <tr>
                        <td className="py-2">US 12</td>
                        <td className="py-2">EU 45</td>
                        <td className="py-2">30 cm</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomizePage;
