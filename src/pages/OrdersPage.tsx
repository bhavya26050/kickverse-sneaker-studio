
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Clock, Package, Check, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";

interface OrderItemType {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image_url: string;
}

interface OrderType {
  id: string;
  created_at: string;
  total: number;
  status: string;
  estimated_delivery: string;
  items: OrderItemType[];
  itemCount: number;
}

const OrdersPage = () => {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const fetchOrders = async () => {
      setLoading(true);
      try {
        if (!user) return;

        // Fetch orders
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (ordersError) throw ordersError;

        // Fetch order items for each order
        const ordersWithItems = await Promise.all(
          ordersData.map(async (order) => {
            const { data: itemsData, error: itemsError } = await supabase
              .from('order_items')
              .select('*')
              .eq('order_id', order.id);

            if (itemsError) throw itemsError;

            return {
              ...order,
              items: itemsData,
              itemCount: itemsData.reduce((sum: number, item: any) => sum + item.quantity, 0)
            };
          })
        );

        setOrders(ordersWithItems);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, isAuthenticated, navigate]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "processing":
        return <Package className="h-5 w-5 text-blue-500" />;
      case "shipped":
        return <ShoppingBag className="h-5 w-5 text-purple-500" />;
      case "delivered":
        return <Check className="h-5 w-5 text-green-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "processing":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "shipped":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200";
      case "delivered":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-kickverse-dark-purple">Your Orders</h1>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-kickverse-purple"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-kickverse-dark-purple">Your Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-medium mb-4">No orders yet</h2>
          <p className="text-gray-600 mb-8">
            You haven't placed any orders yet. Start shopping to see your orders here.
          </p>
          <Button asChild className="bg-kickverse-purple hover:bg-kickverse-purple/80">
            <Link to="/products">Start Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6 border-b">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-semibold">Order #{order.id.slice(0, 8)}</h3>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-gray-500 text-sm mt-1">
                      Placed on {format(new Date(order.created_at), "MMMM d, yyyy")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${order.total.toFixed(2)}</p>
                    <p className="text-gray-500 text-sm">{order.itemCount} items</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center text-sm">
                  {getStatusIcon(order.status)}
                  <span className="ml-2">
                    {order.status === "delivered" 
                      ? "Delivered on " 
                      : "Estimated delivery by "}
                    {format(new Date(order.estimated_delivery), "MMMM d, yyyy")}
                  </span>
                </div>
              </div>

              <div className="p-4 flex flex-wrap items-center gap-3">
                {order.items.slice(0, 3).map((item) => (
                  <div key={item.id} className="w-16 h-16 rounded overflow-hidden">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
                {order.items.length > 3 && (
                  <div className="w-16 h-16 rounded bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-600 font-medium">+{order.items.length - 3}</span>
                  </div>
                )}
              </div>

              <div className="p-4 bg-gray-50 flex justify-between items-center">
                <div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-600"
                  >
                    Need Help?
                  </Button>
                </div>
                <Button 
                  size="sm"
                  asChild
                  className="bg-kickverse-purple hover:bg-kickverse-purple/80"
                >
                  <Link to={`/order-confirmation?id=${order.id}`}>
                    View Order Details
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
