
import React from "react";
import { Link } from "react-router-dom";
import { Trash2, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";

const WishlistPage = () => {
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (item: any) => {
    addToCart({
      productId: item.productId,
      name: item.name,
      price: item.price,
      quantity: 1,
      imageUrl: item.imageUrl,
      color: item.color,
      size: item.size,
      customized: item.customized,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-kickverse-dark-purple">Your Wishlist</h1>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-medium mb-4">Your wishlist is empty</h2>
          <p className="text-gray-600 mb-8">
            You haven't saved any sneakers to your wishlist yet.
          </p>
          <Button asChild className="bg-kickverse-purple hover:bg-kickverse-purple/80">
            <Link to="/products">Explore Products</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 bg-gray-50 flex justify-between items-center">
              <h2 className="font-medium">
                {wishlistItems.length} {wishlistItems.length === 1 ? "Item" : "Items"}
              </h2>
              <Button
                variant="outline"
                onClick={clearWishlist}
                className="text-gray-600"
              >
                Clear All
              </Button>
            </div>

            <div className="divide-y divide-gray-200">
              {wishlistItems.map((item) => (
                <div
                  key={item.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center"
                >
                  <div className="flex-shrink-0 w-full sm:w-24 h-24 mb-4 sm:mb-0">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  
                  <div className="sm:ml-6 flex-grow">
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    <div className="text-gray-600 text-sm mt-1">
                      ${item.price.toFixed(2)}
                    </div>
                    {item.customized && (
                      <span className="mt-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-kickverse-soft-grey text-kickverse-purple">
                        Custom Design
                      </span>
                    )}
                    <div className="mt-2 flex flex-wrap gap-2">
                      {item.size && (
                        <span className="text-sm text-gray-700">
                          Size: {item.size}
                        </span>
                      )}
                      {item.color && (
                        <div className="flex items-center">
                          <span className="text-sm text-gray-700 mr-1">Color:</span>
                          <span
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: item.color }}
                          ></span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex sm:flex-col items-center justify-between sm:items-end gap-4 mt-4 sm:mt-0">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-500 border-red-500 hover:bg-red-50"
                      onClick={() => removeFromWishlist(item.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                    <Button
                      size="sm"
                      className="bg-kickverse-purple hover:bg-kickverse-purple/80"
                      onClick={() => handleAddToCart(item)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-center">
            <Button asChild className="bg-kickverse-purple hover:bg-kickverse-purple/80">
              <Link to="/products">
                Continue Shopping
              </Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
