
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Minus, Plus, Heart, Star, ShoppingCart, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchProducts } from "@/data/products";
import { useCart } from "@/contexts/cart/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { Product } from "@/types";
import { cn } from "@/lib/utils";
import ProductCard from "@/components/ProductCard";
import { toast } from "sonner";
import { setupImageFallback } from "@/utils/imageUtils";

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [maxAvailable, setMaxAvailable] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      try {
        const products = await fetchProducts();
        const currentProduct = products.find(p => p.id === id);
        
        if (currentProduct) {
          setProduct(currentProduct);
          setMaxAvailable(currentProduct.quantity || null);
          
          if (currentProduct.colors && currentProduct.colors.length > 0) {
            setSelectedColor(currentProduct.colors[0]);
          }
          
          if (currentProduct.sizes && currentProduct.sizes.length > 0) {
            setSelectedSize(currentProduct.sizes[0]);
          }

          const related = products
            .filter(p => p.category === currentProduct.category && p.id !== currentProduct.id)
            .slice(0, 3);
          
          setRelatedProducts(related);
        }
      } catch (error) {
        console.error("Error loading product:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProduct();
    }
  }, [id]);

  const inWishlist = product ? isInWishlist(product.id) : false;

  const handleIncreaseQuantity = () => {
    if (maxAvailable === null || quantity < maxAvailable) {
      setQuantity(prev => prev + 1);
    } else {
      toast.error(`Sorry, only ${maxAvailable} units available`);
    }
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast.error("Please select a size");
      return;
    }

    if (product.colors && product.colors.length > 0 && !selectedColor) {
      toast.error("Please select a color");
      return;
    }

    if (maxAvailable !== null && quantity > maxAvailable) {
      toast.error(`Sorry, only ${maxAvailable} units available`);
      return;
    }

    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      imageUrl: product.imageUrl,
      color: selectedColor,
      size: selectedSize,
    });
    
    toast.success(`${product.name} added to your cart`);
  };

  const handleToggleWishlist = () => {
    if (!product) return;
    
    if (inWishlist) {
      removeFromWishlist(product.id);
      toast.success(`${product.name} removed from wishlist`);
    } else {
      addToWishlist({
        productId: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        color: selectedColor || undefined,
        size: selectedSize || undefined,
      });
      toast.success(`${product.name} added to wishlist`);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-kickverse-purple"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-medium mb-4">Product not found</h2>
        <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link to="/products">Back to Products</Link>
        </Button>
      </div>
    );
  }

  const isOutOfStock = maxAvailable === 0 || (product.inStock === false);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center text-sm text-gray-500 mb-8">
        <Link to="/" className="hover:text-kickverse-purple transition-colors">Home</Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <Link to="/products" className="hover:text-kickverse-purple transition-colors">Products</Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <span className="text-gray-900">{product.name}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 mb-16">
        <div className="w-full lg:w-1/2">
          <div className="bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center h-[500px]">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-contain p-8"
              onError={setupImageFallback}
            />
          </div>
        </div>

        <div className="w-full lg:w-1/2">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
          
          <div className="flex items-center mb-4">
            <div className="flex mr-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-5 w-5", 
                    i < (product.rating || 0) 
                      ? "text-yellow-400 fill-yellow-400" 
                      : "text-gray-300"
                  )}
                />
              ))}
            </div>
            <span className="text-gray-600">
              {product.reviewCount} reviews
            </span>
          </div>

          <div className="flex items-baseline mb-6">
            <span className="text-2xl font-bold text-gray-900">${product.price}</span>
            {product.originalPrice && (
              <span className="ml-2 text-lg text-gray-500 line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>

          <p className="text-gray-600 mb-8">{product.description}</p>

          {product.colors && product.colors.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Color</h3>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    className={cn(
                      "w-8 h-8 rounded-full border-2", 
                      selectedColor === color 
                        ? "border-kickverse-purple" 
                        : "border-transparent"
                    )}
                    style={{ backgroundColor: color }}
                    onClick={() => setSelectedColor(color)}
                    aria-label={`Select color ${color}`}
                  />
                ))}
              </div>
            </div>
          )}

          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-8">
              <div className="flex justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-900">Size</h3>
                <Button variant="link" className="text-sm text-kickverse-purple p-0 h-auto">
                  Size Guide
                </Button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {product.sizes.map((size) => (
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
            </div>
          )}

          <div className="mb-4">
            <span className={cn(
              "font-medium text-sm",
              isOutOfStock ? "text-red-600" : "text-green-600"
            )}>
              {isOutOfStock 
                ? "Out of Stock" 
                : maxAvailable 
                  ? `In Stock (${maxAvailable} available)` 
                  : "In Stock"}
            </span>
          </div>

          <div className="mb-8">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Quantity</h3>
            <div className="flex items-center">
              <Button
                variant="outline"
                size="icon"
                onClick={handleDecreaseQuantity}
                disabled={quantity <= 1 || isOutOfStock}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="mx-4 w-8 text-center">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={handleIncreaseQuantity}
                disabled={isOutOfStock || (maxAvailable !== null && quantity >= maxAvailable)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Button 
              onClick={handleAddToCart}
              className="flex-1 bg-kickverse-purple hover:bg-kickverse-purple/80"
              size="lg"
              disabled={isOutOfStock}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              {isOutOfStock ? "Out of Stock" : "Add to Cart"}
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={handleToggleWishlist}
              className={cn(
                inWishlist && "border-red-500 text-red-500"
              )}
            >
              <Heart className={cn("h-5 w-5", inWishlist && "fill-red-500")} />
            </Button>
          </div>

          {product.isCustomizable && (
            <div className="mb-8 p-4 bg-kickverse-soft-grey rounded-lg">
              <h3 className="font-medium mb-2">Customization Available!</h3>
              <p className="text-gray-600 mb-4">
                This product can be customized to your preferences. Design it your way!
              </p>
              <Button asChild className="w-full bg-kickverse-purple hover:bg-kickverse-purple/80">
                <Link to={`/customize?product=${product.id}`}>
                  Customize This Sneaker
                </Link>
              </Button>
            </div>
          )}

          <div className="border-t border-gray-200 pt-4">
            <div className="flex">
              <span className="text-sm text-gray-500 w-24">Category:</span>
              <Link 
                to={`/products?category=${product.category}`}
                className="text-sm text-kickverse-purple capitalize"
              >
                {product.category}
              </Link>
            </div>
            <div className="flex mt-2">
              <span className="text-sm text-gray-500 w-24">Availability:</span>
              <span className={cn(
                "text-sm",
                isOutOfStock ? "text-red-600" : "text-green-600"
              )}>
                {isOutOfStock ? "Out of Stock" : "In Stock"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="border-t border-gray-200 pt-12">
          <h2 className="text-2xl font-bold mb-8">You May Also Like</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
