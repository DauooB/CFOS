import { User, ShoppingCart } from 'lucide-react';

export default function Profile() {
  return (
    <div className="max-w-4xl mx-auto pt-6 px-4">
      {/* Profile Card */}
      <div className="bg-[#f0f2f5] rounded-xl p-6 flex items-center mb-12 shadow-sm">
        <div className="h-12 w-12 bg-slate-900 rounded-full flex items-center justify-center text-white shrink-0 mr-4 shadow-md">
          <User size={20} />
        </div>
        <div>
          <h2 className="text-[15px] font-semibold text-slate-900">My Profile</h2>
          <p className="text-[13px] text-slate-500 mt-0.5">student@iiitnr.edu</p>
        </div>
      </div>

      {/* Order History */}
      <div>
        <h3 className="text-[15px] font-semibold text-slate-900 mb-10">Order History</h3>
        
        <div className="flex flex-col items-center justify-center py-10 text-slate-500">
          <ShoppingCart size={40} className="mb-4 text-gray-400" />
          <p className="text-[13px] mb-3">No orders yet</p>
          <button className="text-[13px] font-semibold text-slate-900 hover:text-slate-700 transition-colors">
            Browse Menu
          </button>
        </div>
      </div>
    </div>
  );
}
