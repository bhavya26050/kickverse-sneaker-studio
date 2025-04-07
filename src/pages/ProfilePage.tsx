
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types";
import { Loader2, Package, ShoppingBag, Heart, Settings, LogOut } from "lucide-react";

const ProfilePage = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated) {
        navigate("/login");
      } else {
        await fetchUserData();
      }
    };
    
    checkAuth();
  }, [isAuthenticated, navigate]);

  const fetchUserData = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error("Error fetching user data:", error);
      } else if (data) {
        setUserData({
          ...user,
          fullName: data.full_name || user.email?.split('@')[0] || 'User',
          avatarUrl: data.avatar_url,
          phoneNumber: data.phone,
          shippingAddress: data.shipping_address
        });
      } else {
        setUserData({
          ...user,
          fullName: user.email?.split('@')[0] || 'User'
        });
      }
    } catch (error) {
      console.error("Fetch user data error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-kickverse-purple" />
      </div>
    );
  }

  if (!isAuthenticated || !userData) {
    return null; // Navigate will redirect to login
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-gray-500">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-kickverse-purple/10 flex items-center justify-center text-kickverse-purple">
                  {userData.avatarUrl ? (
                    <img
                      src={userData.avatarUrl}
                      alt={userData.fullName}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-xl font-bold">
                      {userData.fullName?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  )}
                </div>
                <div>
                  <h2 className="font-semibold text-lg">{userData.fullName}</h2>
                  <p className="text-gray-500 text-sm">{userData.email}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <nav className="space-y-2">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start" 
                  onClick={() => navigate("/orders")}
                >
                  <Package className="mr-2 h-4 w-4" />
                  My Orders
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start" 
                  onClick={() => navigate("/wishlist")}
                >
                  <Heart className="mr-2 h-4 w-4" />
                  Wishlist
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start"
                  onClick={() => navigate("/products")}
                >
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Shop
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-red-500"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="profile">
            <TabsList className="mb-6">
              <TabsTrigger value="profile">Profile Info</TabsTrigger>
              <TabsTrigger value="orders">Order History</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    View and manage your personal details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Full Name</h3>
                      <p className="font-medium">{userData.fullName || 'Not set'}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Email</h3>
                      <p className="font-medium">{userData.email}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Phone</h3>
                      <p className="font-medium">{userData.phoneNumber || 'Not set'}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Shipping Address</h3>
                    <p className="font-medium">
                      {userData.shippingAddress ? (
                        userData.shippingAddress
                      ) : (
                        'No shipping address on file'
                      )}
                    </p>
                  </div>
                  
                  <Button className="bg-kickverse-purple hover:bg-kickverse-purple/80">
                    <Settings className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>Order History</CardTitle>
                  <CardDescription>
                    View the status of your recent orders
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Package className="mx-auto h-12 w-12 text-gray-300" />
                    <h3 className="mt-4 text-lg font-medium">No orders yet</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      When you place an order, it will appear here
                    </p>
                    <Button 
                      className="mt-4 bg-kickverse-purple hover:bg-kickverse-purple/80"
                      onClick={() => navigate("/products")}
                    >
                      Browse Products
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>
                    Manage your account preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Communication Preferences</h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="marketing-emails"
                          className="h-4 w-4 text-kickverse-purple"
                          defaultChecked
                        />
                        <label htmlFor="marketing-emails" className="ml-2 text-sm">
                          Receive marketing emails about new products and promotions
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="order-updates"
                          className="h-4 w-4 text-kickverse-purple"
                          defaultChecked
                        />
                        <label htmlFor="order-updates" className="ml-2 text-sm">
                          Receive order status updates via email
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Account Management</h3>
                    <div className="space-y-4">
                      <Button variant="outline">Change Password</Button>
                      <Button variant="outline" className="text-red-500">
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
