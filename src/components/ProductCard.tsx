
import React from "react";
import { Link } from "react-router-dom";
import { Product } from "@/types";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/cart/CartContext";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, className }) => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const inWishlist = isInWishlist(product.id);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (inWishlist) {
      removeFromWishlist(product.id);
      toast.success(`${product.name} removed from wishlist`);
    } else {
      addToWishlist({
        productId: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
      });
      toast.success(`${product.name} added to wishlist`);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!product.inStock || (product.quantity !== undefined && product.quantity <= 0)) {
      toast.error(`Sorry, ${product.name} is out of stock`);
      return;
    }
    
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      quantity: 1,
    });
    
    toast.success(`${product.name} added to cart`);
  };

  const isOutOfStock = !product.inStock || (product.quantity !== undefined && product.quantity <= 0);

  return (
    <div className={cn("product-card group bg-white rounded-lg shadow-md overflow-hidden", className)}>
      <Link to={`/products/${product.id}`} className="block">
        <div className="relative pb-[100%] overflow-hidden">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&auto=format&fit=crop";
            }}
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full"
            onClick={handleWishlistToggle}
          >
            <Heart
              className={cn("h-5 w-5", inWishlist ? "fill-red-500 text-red-500" : "text-gray-600")}
            />
          </Button>
          
          {product.originalPrice && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
              Sale
            </div>
          )}
          
          {isOutOfStock && (
            <div className="absolute bottom-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
              Out of Stock
            </div>
          )}
        </div>
        
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium text-gray-900 text-lg">{product.name}</h3>
          </div>
          
          <div className="flex items-baseline mb-2">
            <span className="text-gray-900 font-bold">${product.price}</span>
            {product.originalPrice && (
              <span className="ml-2 text-sm text-gray-500 line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>
          
          <div className="flex items-center justify-between mt-4">
            {product.isCustomizable ? (
              <div className="text-xs text-kickverse-purple font-medium">Customizable</div>
            ) : (
              <div className="w-4"></div>
            )}
            
            <div className="flex items-center">
              <div className="flex mr-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={`text-xs ${i < (product.rating || 0) ? "text-yellow-400" : "text-gray-300"}`}>
                    ★
                  </span>
                ))}
              </div>
              <span className="text-xs text-gray-500">({product.reviewCount})</span>
            </div>
          </div>
          
          <Button 
            onClick={handleAddToCart}
            className="w-full mt-4 bg-kickverse-purple hover:bg-kickverse-purple/80"
            disabled={isOutOfStock}
          >
            {isOutOfStock ? "Out of Stock" : "Add to Cart"}
          </Button>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
