
import React from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import CustomizeView from "@/components/CustomizeView";
import CustomizationPanel from "@/components/customize/CustomizationPanel";
import ProductSummary from "@/components/customize/ProductSummary";
import { useCustomization } from "@/hooks/useCustomization";

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
      imageUrl: baseProduct?.imageUrl || "https://static.nike.com/a/images/t_PDP_864_v1/f_auto,b_rgb:f5f5f5/dd40b594-4ef5-437d-8ea7-dd83a18e2a9c/custom-nike-dunk-high-by-you-shoes.png",
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

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Preview */}
        <div className="w-full lg:w-1/2 mb-8 lg:mb-0">
          <CustomizeView 
            colors={customization} 
            onRotate={handleRotate} 
            activeAngle={activeAngle} 
            angles={angles}
          />

          <ProductSummary 
            baseProduct={baseProduct}
            price={price}
            handleSaveToWishlist={handleSaveToWishlist}
            handleAddToCart={handleAddToCart}
          />
        </div>

        {/* Customization Panel */}
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
  );
};

export default CustomizePage;
