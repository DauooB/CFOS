import { useState } from 'react';
import { categories, products } from '../data/mockData';
import type { Product } from '../data/mockData';
import ProductCard from './ProductCard';
import clsx from 'clsx';
import { Search } from 'lucide-react';

interface MenuProps {
  onAddToCart: (product: Product) => void;
}

export default function Menu({ onAddToCart }: MenuProps) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = products.filter(p => {
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div>
      {/* Search and Filters Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        {/* Categories */}
        <div className="flex space-x-6 overflow-x-auto scrollbar-hide py-1 border-b md:border-b-0 border-gray-100 flex-1">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={clsx(
                "whitespace-nowrap pb-2 text-sm font-semibold transition-all relative",
                activeCategory === category 
                  ? "text-slate-900" 
                  : "text-slate-400 hover:text-slate-600"
              )}
            >
              {category}
              {activeCategory === category && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 rounded-full"></span>
              )}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72 group">
          <Search 
            size={18} 
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" 
          />
          <input
            type="text"
            placeholder="Search food..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/10 transition-all shadow-sm"
          />
        </div>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Search size={48} className="mb-4 opacity-20" />
          <p className="text-lg font-medium">No items found matching "{searchQuery}"</p>
          <button 
            onClick={() => {setSearchQuery(''); setActiveCategory('All');}}
            className="mt-2 text-sm font-bold text-slate-900 hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
