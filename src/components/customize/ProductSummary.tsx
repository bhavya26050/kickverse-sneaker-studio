
import React from "react";
import { Button } from "@/components/ui/button";
import { HeartIcon, ShoppingCartIcon } from "lucide-react";

interface ProductSummaryProps {
  baseProduct: any;
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
  );
};

export default ProductSummary;
