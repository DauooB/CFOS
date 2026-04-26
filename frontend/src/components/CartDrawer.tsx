import { X, ShoppingCart, Minus, Plus } from 'lucide-react';
import type { CartItem } from '../types';
import clsx from 'clsx';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onRemove: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onCheckout: () => void;
}

export default function CartDrawer({ isOpen, onClose, cart, onRemove, onUpdateQuantity, onCheckout }: CartDrawerProps) {
  const totalAmount = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  return (
    <div 
      className={clsx(
        "fixed inset-y-0 right-0 w-full sm:w-[400px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 flex flex-col",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}
    >
      <div className="flex items-center justify-between p-6 border-b border-gray-100 shrink-0">
        <h2 className="text-base font-bold text-slate-900">Your Order</h2>
        <button 
          onClick={onClose}
          className="p-2 -mr-2 text-slate-400 hover:text-slate-600 transition-colors rounded-full hover:bg-slate-50"
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
        {cart.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400">
            <ShoppingCart size={40} className="mb-4 text-slate-400" />
            <p className="text-sm">Your cart is empty</p>
          </div>
        ) : (
          <div className="space-y-6">
            {cart.map((item) => (
              <div key={item.product.id} className="flex gap-4">
                <div className="h-16 w-16 rounded-lg overflow-hidden bg-gray-100 shrink-0 shadow-sm border border-gray-100/50">
                  <img src={item.product.image} alt={item.product.name} className="h-full w-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between py-0.5">
                  <div className="flex justify-between items-start">
                    <h4 className="text-sm font-semibold text-slate-900 pr-2 leading-tight">{item.product.name}</h4>
                    <button 
                      onClick={() => onRemove(item.product.id)}
                      className="text-[11px] text-slate-400 hover:text-red-500 font-medium transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-gray-200 rounded-md bg-white shadow-sm">
                        <button 
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 text-slate-500 hover:text-slate-900 transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="text-[13px] font-semibold w-5 text-center text-slate-900">{item.quantity}</span>
                        <button 
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 text-slate-500 hover:text-slate-900 transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <span className="text-sm font-medium text-slate-500">₹{item.product.price}</span>
                    </div>
                    <p className="text-[15px] font-bold text-slate-900">
                      ₹{item.product.price * item.quantity}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {cart.length > 0 && (
        <div className="p-6 border-t border-gray-100 bg-white mt-auto shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between mb-5">
            <span className="text-sm font-medium text-slate-500">Total Amount</span>
            <span className="text-xl font-bold text-slate-900 tracking-tight">₹{totalAmount}</span>
          </div>
          <button 
            onClick={onCheckout}
            className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors shadow-md shadow-slate-900/10 text-sm"
          >
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
}
