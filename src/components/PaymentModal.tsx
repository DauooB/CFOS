import { X, CreditCard, Banknote, Smartphone } from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
  onSuccess: () => void;
}

type PaymentMethod = 'UPI' | 'Card' | 'Cash';

export default function PaymentModal({ isOpen, onClose, totalAmount, onSuccess }: PaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handlePayment = () => {
    if (!selectedMethod) return;
    setIsProcessing(true);
    // Mock processing delay
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess();
    }, 1500);
  };

  const methods = [
    { id: 'UPI', label: 'UPI / QR Code', icon: Smartphone },
    { id: 'Card', label: 'Credit / Debit Card', icon: CreditCard },
    { id: 'Cash', label: 'Cash at Counter', icon: Banknote },
  ] as const;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
        onClick={!isProcessing ? onClose : undefined} 
      />
      
      {/* Modal */}
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-slate-900">Checkout</h2>
          <button 
            onClick={onClose}
            disabled={isProcessing}
            className="p-2 -mr-2 text-slate-400 hover:text-slate-600 transition-colors rounded-full hover:bg-slate-50 disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <div className="mb-8 text-center">
            <p className="text-sm text-slate-500 mb-1">Total Amount to Pay</p>
            <p className="text-4xl font-bold text-slate-900 tracking-tight">₹{totalAmount}</p>
          </div>

          <h3 className="text-sm font-semibold text-slate-900 mb-4">Select Payment Method</h3>
          <div className="space-y-3">
            {methods.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setSelectedMethod(id as PaymentMethod)}
                disabled={isProcessing}
                className={clsx(
                  "w-full flex items-center p-4 rounded-xl border-2 text-left transition-all",
                  selectedMethod === id 
                    ? "border-slate-900 bg-slate-50" 
                    : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                )}
              >
                <div className={clsx(
                  "h-10 w-10 shrink-0 rounded-full flex items-center justify-center mr-4 transition-colors",
                  selectedMethod === id ? "bg-slate-900 text-white" : "bg-gray-100 text-slate-600"
                )}>
                  <Icon size={20} />
                </div>
                <span className="font-medium text-slate-900">{label}</span>
                
                {selectedMethod === id && (
                  <div className="ml-auto h-4 w-4 shrink-0 rounded-full border-4 border-slate-900 bg-white" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-100 mt-auto">
          <button
            onClick={handlePayment}
            disabled={!selectedMethod || isProcessing}
            className="w-full py-4 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-slate-900/10 flex items-center justify-center"
          >
            {isProcessing ? (
              <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              `Pay ₹${totalAmount}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
