import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, RefreshCw, X, Sparkles } from 'lucide-react';
import { ItemListing } from '../types';
import { api } from '../services/api';
import { ItemCard } from '../components/ItemCard';
import { SkeletonCard } from '../components/SkeletonCard';

const CATEGORIES = [
  'All',
  'Electronics',
  'Books and educational materials',
  'Furniture',
  'Clothing and accessories',
  'Home appliances',
  'Household items',
  'Sports and recreation',
  'Other',
];

const CONDITIONS = ['All', 'New', 'Like New', 'Good', 'Fair', 'Needs Repair'];

const PURPOSES = [
  'All',
  'Give away',
  'Sell for reuse',
  'Request repair',
  'Donate',
  'Responsible recycling',
];

export const MarketplacePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [condition, setCondition] = useState(searchParams.get('condition') || 'All');
  const [purpose, setPurpose] = useState(searchParams.get('purpose') || 'All');
  const [sortBy, setSortBy] = useState(searchParams.get('sort_by') || 'newest');

  const [listings, setListings] = useState<ItemListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getListings({
        search: search || undefined,
        category: category !== 'All' ? category : undefined,
        condition: condition !== 'All' ? condition : undefined,
        purpose: purpose !== 'All' ? purpose : undefined,
        sort_by: sortBy,
      });
      setListings(data);
    } catch (err) {
      console.error('Error fetching listings:', err);
    } finally {
      setLoading(false);
    }
  }, [search, category, condition, purpose, sortBy]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchListings();
  };

  const handleResetFilters = () => {
    setSearch('');
    setCategory('All');
    setCondition('All');
    setPurpose('All');
    setSortBy('newest');
    setSearchParams({});
  };

  const hasActiveFilters =
    search !== '' || category !== 'All' || condition !== 'All' || purpose !== 'All' || sortBy !== 'newest';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner / Headline */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-forest-950 font-sans">
            Circular Marketplace
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-600 mt-1">
            Discover verified items for direct reuse, repair, donation, or local recycling.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative max-w-md w-full">
          <Search className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search laptops, books, furniture..."
            className="w-full pl-10 pr-20 py-2.5 rounded-xl border border-sage-300 text-sm focus:outline-none focus:ring-2 focus:ring-forest-800 bg-white shadow-xs"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1.5 px-3 py-1 bg-forest-900 text-white rounded-lg text-xs font-semibold hover:bg-forest-800 transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {/* Horizontal Category Pill Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              category === cat
                ? 'bg-forest-900 text-cream-50 shadow-xs'
                : 'bg-white text-charcoal-700 border border-sage-300 hover:border-forest-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Filter and Sorting Control Strip */}
      <div className="bg-white rounded-2xl p-4 border border-sage-200 shadow-card flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          {/* Purpose Filter */}
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-charcoal-500 uppercase tracking-wider text-[10px]">
              Purpose:
            </span>
            <select
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="py-1 px-2.5 rounded-lg border border-sage-300 bg-cream-50 text-charcoal-800 font-medium focus:outline-none"
            >
              {PURPOSES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Condition Filter */}
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-charcoal-500 uppercase tracking-wider text-[10px]">
              Condition:
            </span>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="py-1 px-2.5 rounded-lg border border-sage-300 bg-cream-50 text-charcoal-800 font-medium focus:outline-none"
            >
              {CONDITIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-charcoal-500 uppercase tracking-wider text-[10px]">
              Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="py-1 px-2.5 rounded-lg border border-sage-300 bg-cream-50 text-charcoal-800 font-medium focus:outline-none"
            >
              <option value="newest">Newest First</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 font-semibold flex items-center gap-1 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        <div className="text-charcoal-500 font-medium">
          Showing <strong>{listings.length}</strong> circular items
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : listings.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-sage-200 shadow-card max-w-lg mx-auto space-y-4 my-10">
          <div className="w-14 h-14 rounded-2xl bg-sage-100 text-leaf-600 flex items-center justify-center mx-auto">
            <Search className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-lg text-forest-950">No matching circular items found</h3>
          <p className="text-xs text-charcoal-600 leading-relaxed">
            Try adjusting your search terms or filters to see available laptops, books, furniture, and appliances.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 rounded-xl bg-forest-900 text-white text-xs font-bold"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {listings.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};
