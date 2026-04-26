import { User, ShoppingBag, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Order {
  id: number;
  total_amount: string;
  status: string;
  order_date: string;
}

interface ProfileProps {
  setActiveTab?: (tab: 'Menu' | 'Profile') => void;
}

export default function Profile({ setActiveTab }: ProfileProps) {
  const { user, token, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated || !token) {
        setIsLoading(false);
        return;
      }

      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const res = await axios.get(`${apiUrl}/orders/my-orders`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(res.data);
      } catch (error) {
        console.error('Fetch Orders Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, token]);

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto pt-20 px-4 text-center">
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100">
          <User size={64} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Please Sign In</h2>
          <p className="text-slate-500 mb-8">Login with Google to view your profile and order history</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pt-6 px-4">
      {/* Profile Card */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 flex items-center mb-12 shadow-sm">
        <div className="h-16 w-16 bg-slate-900 rounded-full flex items-center justify-center text-white shrink-0 mr-6 shadow-md shadow-slate-900/20">
          <User size={24} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">{user?.name}</h2>
          <p className="text-sm text-slate-500 mt-0.5">{user?.email}</p>
          <span className="inline-block px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider rounded mt-2">
            {user?.role}
          </span>
        </div>
      </div>

      {/* Order History */}
      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
          <ShoppingBag size={20} className="mr-2" />
          Order History
        </h3>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 border-4 border-slate-900/10 border-t-slate-900 rounded-full animate-spin"></div>
          </div>
        ) : orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-[12px] font-bold text-slate-400 uppercase tracking-tight">Order #{order.id}</p>
                    <div className="flex items-center text-slate-500 mt-1">
                      <Clock size={12} className="mr-1" />
                      <span className="text-[12px]">{new Date(order.order_date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide ${
                    order.status === 'Completed' ? 'bg-green-100 text-green-700' :
                    order.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                  <span className="text-sm text-slate-600">Total Amount</span>
                  <span className="text-lg font-bold text-slate-900">₹{order.total_amount}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white border border-dashed border-gray-200 rounded-2xl text-slate-400">
            <ShoppingBag size={48} className="mb-4 opacity-20" />
            <p className="text-sm mb-4">No orders yet</p>
            <button 
              onClick={() => setActiveTab?.('Menu')}
              className="text-sm font-bold text-slate-900 hover:underline decoration-2 underline-offset-4"
            >
              Browse Menu
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
