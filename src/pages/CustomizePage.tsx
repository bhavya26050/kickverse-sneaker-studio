
import React from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import CustomizeView from "@/components/CustomizeView";
import CustomizationPanel from "@/components/customize/CustomizationPanel";
import ProductSummary from "@/components/customize/ProductSummary";
import { useCustomization } from "@/hooks/useCustomization";
import { FallbackImage } from "@/components/ui/fallback-image";

const CustomizePage = () => {
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("product");
  
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();
  
  const {
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
    customizationColors,
    sizes,
    angles
  } = useCustomization(productId);

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }

    if (!baseProduct) {
      toast.error("Error loading product details");
      return;
    }

    if (baseProduct.quantity && baseProduct.quantity <= 0) {
      toast.error("This product is out of stock");
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
      imageUrl: baseProduct?.imageUrl || "/placeholder.svg", 
      size: selectedSize,
      customized: true,
      customizationDetails: JSON.stringify(customization),
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
      imageUrl: baseProduct?.imageUrl || "/placeholder.svg",
      size: selectedSize,
      customized: true,
      customizationDetails: JSON.stringify(customization),
    });

    toast.success("Saved custom design to wishlist!");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-kickverse-dark-purple">
        Customize Your Sneakers
      </h1>

      <div className="bg-white shadow-lg rounded-xl p-6 mb-10">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Preview */}
          <div className="w-full lg:w-1/2 mb-8 lg:mb-0">
            <div className="bg-gray-50 rounded-xl overflow-hidden shadow-sm">
              <CustomizeView 
                colors={customization} 
                onRotate={handleRotate} 
                activeAngle={activeAngle} 
                angles={angles}
              />
            </div>

            <div className="mt-8">
              <ProductSummary 
                baseProduct={baseProduct}
                price={price}
                handleSaveToWishlist={handleSaveToWishlist}
                handleAddToCart={handleAddToCart}
              />
            </div>
          </div>

          {/* Customization Panel */}
          <div className="w-full lg:w-1/2">
            <CustomizationPanel
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              shoeParts={shoeParts}
              customization={customization}
              handleColorChange={handleColorChange}
              selectedSize={selectedSize}
              setSelectedSize={setSelectedSize}
              customizationColors={customizationColors}
              sizes={sizes}
            />
          </div>
        </div>
      </div>
      
      {/* Inspiration Gallery */}
      <div className="mt-12 mb-16">
        <h2 className="text-2xl font-bold mb-6">Inspiration Gallery</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <FallbackImage
              src="https://static.nike.com/a/images/t_PDP_864_v1/f_auto,b_rgb:f5f5f5/7fbc5e94-9eb9-49bc-a4c4-29d1ad5f6c48/custom-nike-dunk-high-by-you.png"
              alt="Custom design inspiration"
              className="w-full h-64 object-cover rounded-md"
              fallbackId="inspiration-1"
            />
            <h3 className="font-medium mt-3">Urban Street Style</h3>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <FallbackImage
              src="https://static.nike.com/a/images/t_PDP_864_v1/f_auto,b_rgb:f5f5f5/c5efd4ae-21f9-48e0-9c61-0cd925e3a3d7/custom-nike-blazer-mid-77-by-you.png"
              alt="Custom design inspiration"
              className="w-full h-64 object-cover rounded-md"
              fallbackId="inspiration-2"
            />
            <h3 className="font-medium mt-3">Retro Classics</h3>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <FallbackImage
              src="https://static.nike.com/a/images/t_PDP_864_v1/f_auto,b_rgb:f5f5f5/dd40b594-4ef5-437d-8ea7-dd83a18e2a9c/custom-nike-dunk-high-by-you-shoes.png"
              alt="Custom design inspiration"
              className="w-full h-64 object-cover rounded-md"
              fallbackId="inspiration-3"
            />
            <h3 className="font-medium mt-3">Bold & Colorful</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomizePage;
