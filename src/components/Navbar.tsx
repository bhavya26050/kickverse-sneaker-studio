
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/cart/CartContext";
import { 
  ShoppingCart, 
  Heart, 
  User, 
  Search, 
  Menu, 
  X,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { totalItems } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b shadow-sm">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <h1 className="text-2xl font-bold text-kickverse-purple">KickVerse</h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-gray-700 hover:text-kickverse-purple transition-colors">
            Home
          </Link>
          <Link to="/products" className="text-gray-700 hover:text-kickverse-purple transition-colors">
            Shop
          </Link>
          <Link to="/customize" className="text-gray-700 hover:text-kickverse-purple transition-colors">
            Customize
          </Link>
        </nav>

        {/* Search Bar - Desktop */}
        <div className="hidden md:flex max-w-md flex-1 mx-6">
          <form onSubmit={handleSearch} className="w-full relative">
            <Input
              type="search"
              placeholder="Search for sneakers..."
              className="w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button 
              type="submit" 
              variant="ghost" 
              size="icon"
              className="absolute right-0 top-0 h-full"
            >
              <Search className="h-4 w-4" />
            </Button>
          </form>
        </div>

        {/* Icons - Desktop */}
        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="icon" 
                asChild
              >
                <Link to="/wishlist">
                  <Heart className="h-5 w-5" />
                </Link>
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                asChild
              >
                <Link to="/cart" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-kickverse-purple text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </Link>
              </Button>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <div className="flex flex-col h-full">
                    <div className="flex-1 py-4">
                      <h3 className="font-semibold text-lg mb-4">Welcome, {user?.name || user?.email}</h3>
                      <div className="space-y-2">
                        <Button asChild variant="ghost" className="w-full justify-start">
                          <Link to="/profile">Profile</Link>
                        </Button>
                        <Button asChild variant="ghost" className="w-full justify-start">
                          <Link to="/orders">Orders</Link>
                        </Button>
                      </div>
                    </div>
                    <Button 
                      onClick={logout} 
                      variant="outline" 
                      className="w-full"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild className="bg-kickverse-purple hover:bg-kickverse-purple/80">
                <Link to="/signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/cart" className="relative mr-2">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-kickverse-purple text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t p-4">
          <div className="flex flex-col space-y-4">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-kickverse-purple transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/products" 
              className="text-gray-700 hover:text-kickverse-purple transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Shop
            </Link>
            <Link 
              to="/customize" 
              className="text-gray-700 hover:text-kickverse-purple transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Customize
            </Link>
            <Link 
              to="/wishlist" 
              className="text-gray-700 hover:text-kickverse-purple transition-colors flex items-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Heart className="h-4 w-4 mr-2" />
              Wishlist
            </Link>
            {isAuthenticated ? (
              <>
                <Link 
                  to="/profile" 
                  className="text-gray-700 hover:text-kickverse-purple transition-colors flex items-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Link>
                <Button 
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  variant="outline" 
                  className="justify-start"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <div className="pt-2 flex flex-col space-y-2">
                <Button 
                  variant="outline" 
                  asChild
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Link to="/login">Login</Link>
                </Button>
                <Button 
                  className="bg-kickverse-purple hover:bg-kickverse-purple/80"
                  asChild
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Search Bar - Mobile */}
          <div className="mt-4">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="search"
                placeholder="Search for sneakers..."
                className="w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button 
                type="submit" 
                variant="ghost" 
                size="icon"
                className="absolute right-0 top-0 h-full"
              >
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
