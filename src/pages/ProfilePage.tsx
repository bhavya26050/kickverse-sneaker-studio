
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Extend the User type to include the additional properties we need
interface ExtendedUser {
  id: string;
  email: string;
  avatarUrl?: string;
  fullName?: string;
  phoneNumber?: string;
  shippingAddress?: string;
}

const ProfilePage = () => {
  const { user: authUser, isAuthenticated } = useAuth();
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form states
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingAddress, setEditingAddress] = useState(false);
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (isAuthenticated && authUser) {
        setIsLoading(true);
        try {
          // Try to fetch extended profile from your database
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authUser.id)
            .single();
          
          if (error) {
            console.error("Error fetching user profile:", error);
            // If profile doesn't exist yet, just use the auth user data
            setUser({
              id: authUser.id,
              email: authUser.email || '',
              fullName: '',
              avatarUrl: '',
              phoneNumber: '',
              shippingAddress: ''
            });
          } else if (data) {
            // Map database profile to our user state
            setUser({
              id: authUser.id,
              email: authUser.email || '',
              fullName: data.full_name || '',
              avatarUrl: data.avatar_url || '',
              phoneNumber: data.phone_number || '',
              shippingAddress: data.shipping_address || ''
            });
          }
        } catch (err) {
          console.error("Error in fetchUserProfile:", err);
          toast.error("Failed to load profile data");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchUserProfile();
  }, [authUser, isAuthenticated]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: user.fullName,
          avatar_url: user.avatarUrl,
          phone_number: user.phoneNumber,
          updated_at: new Date()
        });
        
      if (error) throw error;
      
      toast.success("Profile updated successfully");
      setEditingProfile(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          shipping_address: user.shippingAddress,
          updated_at: new Date()
        });
        
      if (error) throw error;
      
      toast.success("Address updated successfully");
      setEditingAddress(false);
    } catch (error) {
      console.error("Error updating address:", error);
      toast.error("Failed to update address");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mt-10">
          <h1 className="text-2xl font-bold">Please login to view your profile</h1>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-kickverse-purple"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-kickverse-dark-purple">Your Profile</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/3">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user?.avatarUrl} alt={user?.fullName || 'User'} />
                  <AvatarFallback>{user?.fullName?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>{user?.fullName || 'User'}</CardTitle>
                  <CardDescription>{user?.email}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-2">Member since {new Date(authUser?.created_at || '').toLocaleDateString()}</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="w-full md:w-2/3">
          <Tabs defaultValue="personal">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="address">Shipping Address</TabsTrigger>
            </TabsList>
            
            <TabsContent value="personal" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your personal details here</CardDescription>
                </CardHeader>
                <form onSubmit={handleProfileSubmit}>
                  <CardContent className="space-y-4">
                    {!editingProfile ? (
                      <>
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium">Full Name</p>
                            <p>{user?.fullName || 'Not set'}</p>
                          </div>
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setEditingProfile(true)}
                          >
                            Edit
                          </Button>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium">Email</p>
                          <p>{user?.email}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium">Phone Number</p>
                          <p>{user?.phoneNumber || 'Not set'}</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <label htmlFor="fullName" className="text-sm font-medium">Full Name</label>
                          <Input 
                            id="fullName" 
                            value={user?.fullName || ''} 
                            onChange={(e) => setUser(prev => prev ? {...prev, fullName: e.target.value} : null)} 
                            placeholder="Your full name"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="avatarUrl" className="text-sm font-medium">Avatar URL</label>
                          <Input 
                            id="avatarUrl" 
                            value={user?.avatarUrl || ''} 
                            onChange={(e) => setUser(prev => prev ? {...prev, avatarUrl: e.target.value} : null)} 
                            placeholder="URL to your avatar image"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="email" className="text-sm font-medium">Email</label>
                          <Input id="email" value={user?.email} disabled />
                          <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                        </div>
                        
                        <div>
                          <label htmlFor="phoneNumber" className="text-sm font-medium">Phone Number</label>
                          <Input 
                            id="phoneNumber" 
                            value={user?.phoneNumber || ''} 
                            onChange={(e) => setUser(prev => prev ? {...prev, phoneNumber: e.target.value} : null)} 
                            placeholder="Your phone number"
                          />
                        </div>
                      </>
                    )}
                  </CardContent>
                  
                  {editingProfile && (
                    <CardFooter className="flex justify-between">
                      <Button type="button" variant="outline" onClick={() => setEditingProfile(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </CardFooter>
                  )}
                </form>
              </Card>
            </TabsContent>
            
            <TabsContent value="address" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Address</CardTitle>
                  <CardDescription>Update your shipping address</CardDescription>
                </CardHeader>
                <form onSubmit={handleAddressSubmit}>
                  <CardContent className="space-y-4">
                    {!editingAddress ? (
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium">Shipping Address</p>
                          <p className="whitespace-pre-line">{user?.shippingAddress || 'No address set'}</p>
                        </div>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setEditingAddress(true)}
                        >
                          Edit
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <label htmlFor="shippingAddress" className="text-sm font-medium">Shipping Address</label>
                        <Textarea 
                          id="shippingAddress" 
                          value={user?.shippingAddress || ''} 
                          onChange={(e) => setUser(prev => prev ? {...prev, shippingAddress: e.target.value} : null)} 
                          placeholder="Enter your complete shipping address"
                          rows={5}
                        />
                      </div>
                    )}
                  </CardContent>
                  
                  {editingAddress && (
                    <CardFooter className="flex justify-between">
                      <Button type="button" variant="outline" onClick={() => setEditingAddress(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? 'Saving...' : 'Save Address'}
                      </Button>
                    </CardFooter>
                  )}
                </form>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
