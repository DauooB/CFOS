import { ShoppingCart, Home, User, LogOut } from 'lucide-react';
import clsx from 'clsx';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

interface HeaderProps {
  activeTab: 'Menu' | 'Profile';
  setActiveTab: (tab: 'Menu' | 'Profile') => void;
  cartItemsCount: number;
  onOpenCart: () => void;
}

export default function Header({ activeTab, setActiveTab, cartItemsCount, onOpenCart }: HeaderProps) {
  const { isAuthenticated, user, login, logout } = useAuth();

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const res = await axios.post(`${apiUrl}/auth/google-login`, {
        idToken: credentialResponse.credential
      });
      login(res.data.user, res.data.token);
    } catch (error: any) {
      console.error('Google Login Error:', error.response?.data || error.message);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">IIIT NR Canteen</h1>
            <p className="text-sm text-slate-500 mt-0.5">Order your food</p>
          </div>
          
          <div className="flex items-center space-x-4">
            {!isAuthenticated ? (
              <div className="scale-90 origin-right">
                <GoogleLogin 
                  onSuccess={handleGoogleSuccess}
                  onError={() => console.log('Login Failed')}
                  useOneTap
                  theme="filled_black"
                  shape="pill"
                />
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-slate-700 hidden sm:inline">
                  Hi, {user?.name?.split(' ')[0] || 'User'}
                </span>
                <button 
                  onClick={logout}
                  className="p-2 text-slate-500 hover:text-red-600 transition-colors"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            )}
            
            <button 
              onClick={onOpenCart}
              className="p-3.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors relative shadow-sm"
            >
              <ShoppingCart size={20} />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 flex justify-center items-center rounded-full border-2 border-white">
                  {cartItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>
        
        <div className="flex space-x-8 mt-2 relative border-b border-gray-100">
          <button
            onClick={() => setActiveTab('Menu')}
            className={clsx(
              "flex items-center pb-4 text-sm font-medium transition-colors relative",
              activeTab === 'Menu' ? "text-slate-900" : "text-slate-500 hover:text-slate-700"
            )}
          >
            <Home size={16} className="mr-2" />
            Menu
            {activeTab === 'Menu' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 rounded-t-full"></span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('Profile')}
            className={clsx(
              "flex items-center pb-4 text-sm font-medium transition-colors relative",
              activeTab === 'Profile' ? "text-slate-900" : "text-slate-500 hover:text-slate-700"
            )}
          >
            <User size={16} className="mr-2" />
            Profile
            {activeTab === 'Profile' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 rounded-t-full"></span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
