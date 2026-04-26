import { useState } from 'react';
import { categories, products } from '../data/mockData';
import type { Product } from '../data/mockData';
import ProductCard from './ProductCard';
import clsx from 'clsx';

interface MenuProps {
  onAddToCart: (product: Product) => void;
}

export default function Menu({ onAddToCart }: MenuProps) {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  return (
    <div>
      {/* Categories */}
      <div className="flex space-x-8 mb-8 border-b border-gray-200 overflow-x-auto scrollbar-hide py-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={clsx(
              "whitespace-nowrap pb-3 text-sm font-medium transition-colors relative",
              activeCategory === category 
                ? "text-slate-900" 
                : "text-slate-500 hover:text-slate-800"
            )}
          >
            {category}
            {activeCategory === category && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 rounded-t-full"></span>
            )}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
        ))}
      </div>
    </div>
  );
}
