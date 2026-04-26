import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Header from './components/Header';
import Menu from './components/Menu';
import Profile from './components/Profile';
import CartDrawer from './components/CartDrawer';
import PaymentModal from './components/PaymentModal';
import KitchenDashboard from './components/KitchenDashboard';
import AdminDashboard from './components/AdminDashboard';
import { useAuth } from './context/AuthContext';
import type { Product } from './data/mockData';
import type { CartItem } from './types';

function App() {
  const [activeTab, setActiveTab] = useState<'Menu' | 'Profile' | 'Kitchen' | 'Admin'>('Menu');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const { token, isAuthenticated } = useAuth();
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;

  // Sync with backend
  const fetchCart = useCallback(async () => {
    if (!isAuthenticated || !token) {
      setCart([]);
      return;
    }
    try {
      const res = await axios.get(`${apiUrl}/cart`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart(res.data);
    } catch (error) {
      console.error('Fetch Cart Error:', error);
    }
  }, [isAuthenticated, token, apiUrl]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (product: Product) => {
    if (!isAuthenticated) {
      // Fallback for non-logged in users (optional, but good for UX)
      setCart(prev => {
        const existing = prev.find(item => item.product.id === product.id);
        if (existing) {
          return prev.map(item =>
            item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          );
        }
        return [...prev, { product, quantity: 1 }];
      });
      return;
    }

    try {
      const res = await axios.post(`${apiUrl}/cart`, 
        { item_id: Number(product.id), quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart(res.data);
    } catch (error) {
      console.error('Add to Cart Error:', error);
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!isAuthenticated) {
      setCart(prev => prev.filter(item => item.product.id !== productId));
      return;
    }

    try {
      const res = await axios.delete(`${apiUrl}/cart/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart(res.data);
    } catch (error) {
      console.error('Remove from Cart Error:', error);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!isAuthenticated) {
      if (quantity <= 0) {
        setCart(prev => prev.filter(item => item.product.id !== productId));
      } else {
        setCart(prev => prev.map(item => 
          item.product.id === productId ? { ...item, quantity } : item
        ));
      }
      return;
    }

    try {
      const res = await axios.put(`${apiUrl}/cart/${productId}`, 
        { quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart(res.data);
    } catch (error) {
      console.error('Update Quantity Error:', error);
    }
  };

  const clearCart = async () => {
    if (isAuthenticated) {
      await axios.delete(`${apiUrl}/cart`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    }
    setCart([]);
  };

  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50 text-slate-800 font-sans relative overflow-hidden">
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        cartItemsCount={cartItemsCount}
        onOpenCart={() => setIsCartOpen(true)}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'Menu' && <Menu onAddToCart={addToCart} />}
        {activeTab === 'Profile' && <Profile setActiveTab={setActiveTab} />}
        {activeTab === 'Kitchen' && <KitchenDashboard />}
        {activeTab === 'Admin' && <AdminDashboard />}
      </main>

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cart={cart}
        onRemove={removeFromCart}
        onUpdateQuantity={updateQuantity}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsPaymentOpen(true);
        }}
      />

      <PaymentModal 
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        totalAmount={cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0)}
        cartItems={cart}
        onSuccess={() => {
          clearCart();
          setIsPaymentOpen(false);
          setActiveTab('Profile');
        }}
      />
      
      {isCartOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 transition-opacity"
          onClick={() => setIsCartOpen(false)}
        />
      )}
    </div>
  );
}

export default App;
