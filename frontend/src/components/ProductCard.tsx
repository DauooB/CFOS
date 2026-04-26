import { Plus } from 'lucide-react';
import clsx from 'clsx';
import type { Product } from '../data/mockData';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const isAvailable = product.is_available !== false;

  return (
    <div className={clsx("group flex flex-col", !isAvailable && "opacity-75")}>
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 mb-3 shadow-sm">
        <img
          src={product.image || '/images/placeholder.png'}
          alt={product.name}
          className={clsx(
            "w-full h-full object-cover transition-transform duration-300",
            isAvailable && "group-hover:scale-105",
            !isAvailable && "filter blur-[2px] grayscale-[50%]"
          )}
        />
        {!isAvailable && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/40">
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      <div className="flex items-start justify-between flex-1">
        <div>
          <h3 className="font-semibold text-slate-900 text-[15px]">{product.name}</h3>
          <p className="text-[13px] text-slate-500 line-clamp-1 mt-0.5 pr-2">{product.description}</p>
          <p className="font-medium text-slate-900 mt-1.5 text-sm">₹{product.price}</p>
        </div>
        <button
          disabled={!isAvailable}
          onClick={(e) => {
            e.stopPropagation();
            if (isAvailable) onAddToCart(product);
          }}
          className={clsx(
            "p-2 text-white rounded-full transition-colors shadow-sm ml-2 shrink-0 flex items-center justify-center h-8 w-8",
            isAvailable ? "bg-slate-900 hover:bg-slate-800" : "bg-gray-400 cursor-not-allowed"
          )}
          aria-label="Add to cart"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
}
