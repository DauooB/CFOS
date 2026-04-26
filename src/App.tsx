import { useState } from 'react';
import Header from './components/Header';
import Menu from './components/Menu';
import Profile from './components/Profile';
import CartDrawer from './components/CartDrawer';
import PaymentModal from './components/PaymentModal';
import type { Product } from './data/mockData';

export interface CartItem {
  product: Product;
  quantity: number;
}

function App() {
  const [activeTab, setActiveTab] = useState<'Menu' | 'Profile'>('Menu');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
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
        {activeTab === 'Menu' ? (
          <Menu onAddToCart={addToCart} />
        ) : (
          <Profile />
        )}
      </main>

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cart={cart}
        onRemove={removeFromCart}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsPaymentOpen(true);
        }}
      />

      <PaymentModal 
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        totalAmount={cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0)}
        onSuccess={() => {
          setCart([]);
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
