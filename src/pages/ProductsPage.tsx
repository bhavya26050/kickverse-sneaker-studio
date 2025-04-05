
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Filter, Search, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import ProductCard from "@/components/ProductCard";
import { fetchProducts } from "@/data/products";
import { Product } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [sortBy, setSortBy] = useState("featured");
  const [filters, setFilters] = useState({
    categories: new Set<string>(),
    priceRange: { min: 0, max: 300 },
    customizable: false,
  });

  // Load products from API
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const products = await fetchProducts();
        setAllProducts(products);
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Extract all available categories from products
  const categories = Array.from(
    new Set(allProducts.map((product) => product.category))
  );

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle search form submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update URL with search parameter
    const newSearchParams = new URLSearchParams(searchParams);
    if (searchQuery) {
      newSearchParams.set("search", searchQuery);
    } else {
      newSearchParams.delete("search");
    }
    setSearchParams(newSearchParams);
  };

  // Handle category filter toggle
  const handleCategoryToggle = (category: string) => {
    const newCategories = new Set(filters.categories);
    if (newCategories.has(category)) {
      newCategories.delete(category);
    } else {
      newCategories.add(category);
    }
    setFilters({ ...filters, categories: newCategories });
  };

  // Handle customizable filter toggle
  const handleCustomizableToggle = (checked: boolean) => {
    setFilters({ ...filters, customizable: checked });
  };

  // Handle sort change
  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  // Filter and sort products based on current filters and sort option
  useEffect(() => {
    const searchTerm = searchParams.get("search")?.toLowerCase() || "";
    const categoryFilter = searchParams.get("category") || "";
    
    // If there's a category in the URL, add it to filters
    if (categoryFilter && !filters.categories.has(categoryFilter)) {
      const updatedCategories = new Set(filters.categories);
      updatedCategories.add(categoryFilter);
      setFilters({ ...filters, categories: updatedCategories });
    }

    let filtered = [...allProducts];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm) ||
          product.category.toLowerCase().includes(searchTerm)
      );
    }

    // Apply category filter
    if (filters.categories.size > 0) {
      filtered = filtered.filter((product) =>
        filters.categories.has(product.category)
      );
    }

    // Apply price range filter
    filtered = filtered.filter(
      (product) =>
        product.price >= filters.priceRange.min &&
        product.price <= filters.priceRange.max
    );

    // Apply customizable filter
    if (filters.customizable) {
      filtered = filtered.filter((product) => product.isCustomizable);
    }

    // Apply sorting
    switch (sortBy) {
      case "price-low-high":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high-low":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        // In a real app, you would sort by date
        // Here we'll just keep the order as is (for demo purposes)
        break;
      case "rating":
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        // 'featured' - no specific sort
        break;
    }

    setFilteredProducts(filtered);
  }, [searchParams, filters, sortBy, allProducts]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-kickverse-dark-purple">All Sneakers</h1>

      {/* Search Bar */}
      <div className="mb-8">
        <form onSubmit={handleSearchSubmit} className="flex w-full max-w-lg">
          <div className="relative flex-grow">
            <Input
              type="search"
              placeholder="Search for sneakers..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pr-10"
            />
            <Button
              type="submit"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Mobile Filter Button */}
        <div className="lg:hidden w-full mb-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full flex justify-between">
                <span className="flex items-center">
                  <Filter className="mr-2 h-4 w-4" /> Filters
                </span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription>
                  Narrow down your product search
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                {/* Category Filter */}
                <div>
                  <h3 className="font-medium mb-3">Categories</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div key={category} className="flex items-center">
                        <Checkbox
                          id={`mobile-category-${category}`}
                          checked={filters.categories.has(category)}
                          onCheckedChange={() => handleCategoryToggle(category)}
                        />
                        <Label
                          htmlFor={`mobile-category-${category}`}
                          className="ml-2 capitalize"
                        >
                          {category}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Customizable Filter */}
                <div>
                  <h3 className="font-medium mb-3">Customization</h3>
                  <div className="flex items-center">
                    <Checkbox
                      id="mobile-customizable"
                      checked={filters.customizable}
                      onCheckedChange={(checked) =>
                        handleCustomizableToggle(checked === true)
                      }
                    />
                    <Label htmlFor="mobile-customizable" className="ml-2">
                      Customizable Only
                    </Label>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Filters */}
        <div className="hidden lg:block w-1/4 bg-white p-6 rounded-lg shadow-sm h-fit">
          <h2 className="text-xl font-semibold mb-6">Filters</h2>

          {/* Category Filter */}
          <div className="mb-6">
            <h3 className="font-medium mb-3">Categories</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category} className="flex items-center">
                  <Checkbox
                    id={`category-${category}`}
                    checked={filters.categories.has(category)}
                    onCheckedChange={() => handleCategoryToggle(category)}
                  />
                  <Label
                    htmlFor={`category-${category}`}
                    className="ml-2 capitalize"
                  >
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Customizable Filter */}
          <div>
            <h3 className="font-medium mb-3">Customization</h3>
            <div className="flex items-center">
              <Checkbox
                id="customizable"
                checked={filters.customizable}
                onCheckedChange={(checked) =>
                  handleCustomizableToggle(checked === true)
                }
              />
              <Label htmlFor="customizable" className="ml-2">
                Customizable Only
              </Label>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="w-full lg:w-3/4">
          {/* Sort Dropdown */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">
              {loading 
                ? "Loading products..." 
                : `Showing ${filteredProducts.length} results`}
            </p>
            <div className="flex items-center">
              <span className="mr-2 text-gray-600">Sort by:</span>
              <Select
                value={sortBy}
                onValueChange={handleSortChange}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Featured" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low-high">Price: Low to High</SelectItem>
                  <SelectItem value="price-high-low">Price: High to Low</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="rating">Top Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-kickverse-purple"></div>
            </div>
          )}

          {/* Products Grid */}
          {!loading && filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : !loading && (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-2">No products found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search or filters to find what you're looking for.
              </p>
              <Button
                onClick={() => {
                  setSearchParams({});
                  setSearchQuery("");
                  setFilters({
                    categories: new Set<string>(),
                    priceRange: { min: 0, max: 300 },
                    customizable: false,
                  });
                  setSortBy("featured");
                }}
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
