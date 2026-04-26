import { Plus } from 'lucide-react';
import type { Product } from '../data/mockData';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <div className="group flex flex-col">
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 mb-3 shadow-sm">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="flex items-start justify-between flex-1">
        <div>
          <h3 className="font-semibold text-slate-900 text-[15px]">{product.name}</h3>
          <p className="text-[13px] text-slate-500 line-clamp-1 mt-0.5 pr-2">{product.description}</p>
          <p className="font-medium text-slate-900 mt-1.5 text-sm">₹{product.price}</p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product);
          }}
          className="p-2 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-colors shadow-sm ml-2 shrink-0 flex items-center justify-center h-8 w-8"
          aria-label="Add to cart"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
}
