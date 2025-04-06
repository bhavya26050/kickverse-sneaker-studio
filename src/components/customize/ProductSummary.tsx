
import React from "react";
import { Button } from "@/components/ui/button";
import { HeartIcon, ShoppingCartIcon } from "lucide-react";
import { Product } from "@/types";
import { FallbackImage } from "@/components/ui/fallback-image";

interface ProductSummaryProps {
  baseProduct: Product | null;
  price: number;
  handleSaveToWishlist: () => void;
  handleAddToCart: () => void;
}

const ProductSummary: React.FC<ProductSummaryProps> = ({
  baseProduct,
  price,
  handleSaveToWishlist,
  handleAddToCart
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mt-4">
      <h2 className="text-xl font-semibold mb-4">Your Custom Sneaker</h2>
      
      {baseProduct && (
        <div className="flex items-center mb-4">
          <div className="w-16 h-16 mr-4 rounded overflow-hidden">
            <FallbackImage 
              src={baseProduct.imageUrl} 
              fallbackId={baseProduct.id}
              alt={baseProduct.name}
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-gray-600">
            Customizing {baseProduct.name} - Make it uniquely yours!
          </p>
        </div>
      )}
      
      {!baseProduct && (
        <p className="text-gray-600 mb-4">
          Design your perfect sneaker from scratch.
        </p>
      )}
      
      <div className="flex justify-between items-center">
        <div>
          <span className="text-sm text-gray-600">Custom Price:</span>
          <span className="ml-2 text-2xl font-bold text-kickverse-purple">${price.toFixed(2)}</span>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={handleSaveToWishlist}
            className="border-kickverse-purple text-kickverse-purple hover:bg-kickverse-purple/10"
          >
            <HeartIcon className="mr-2 h-4 w-4" />
            Save Design
          </Button>
          <Button
            onClick={handleAddToCart}
            className="bg-kickverse-purple hover:bg-kickverse-purple/80 text-white"
          >
            <ShoppingCartIcon className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductSummary;
