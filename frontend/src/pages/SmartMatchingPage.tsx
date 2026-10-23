import React, { useEffect, useState } from 'react';
import { Sparkles, SlidersHorizontal, MapPin, CheckCircle2, ArrowRight, Info, Search } from 'lucide-react';
import { MatchRecommendation } from '../types';
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

export const SmartMatchingPage: React.FC = () => {
  const [recommendations, setRecommendations] = useState<MatchRecommendation[]>([]);
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const data = await api.getRecommendations({
        category: category !== 'All' ? category : undefined,
        query: query.trim() || undefined,
        user_lat: 42.3601, // Default campus coordinate
        user_lon: -71.0942,
      });
      setRecommendations(data);
    } catch (err) {
      console.error('Failed to load matching recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, [category]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMatches();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-forest-950 via-forest-900 to-forest-800 rounded-3xl p-8 sm:p-10 text-cream-50 shadow-xl border border-forest-800 relative overflow-hidden">
        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-leaf-500/20 text-leaf-300 border border-leaf-400/30 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Transparent Rule-Based Circular Matching</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-sans">
            Smart Matching Engine
          </h1>
          <p className="text-xs sm:text-sm text-sage-200/90 leading-relaxed">
            Every match is ranked with explainable factors: category affinity, intended purpose, condition suitability, and walking/transit radius for low-carbon pickup.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-sage-200 shadow-card flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Category Selector */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto scrollbar-none">
          {CATEGORIES.slice(0, 5).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                category === cat
                  ? 'bg-forest-900 text-cream-50'
                  : 'bg-cream-100 text-charcoal-700 hover:bg-cream-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearch} className="flex items-center gap-2 w-full sm:w-72">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-charcoal-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter matches..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-sage-300 focus:outline-none focus:ring-1 focus:ring-forest-800 bg-cream-50"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-1.5 bg-forest-900 text-white rounded-xl text-xs font-bold hover:bg-forest-800 transition-colors"
          >
            Find
          </button>
        </form>
      </div>

      {/* Recommendations Feed with Explainable Factors */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : recommendations.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-sage-200 max-w-md mx-auto space-y-3">
          <Sparkles className="w-10 h-10 text-charcoal-400 mx-auto" />
          <h3 className="font-bold text-base text-forest-900">No active matches found</h3>
          <p className="text-xs text-charcoal-500">
            Try choosing a different category or clearing search terms to explore all available items.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map(({ listing, match_explanation }) => (
            <div
              key={listing.id}
              className="bg-white rounded-3xl border border-sage-200 shadow-card hover:shadow-card-hover hover:border-leaf-400 transition-all overflow-hidden flex flex-col justify-between"
            >
              <div>
                <ItemCard item={listing} showMatchScore={match_explanation.score} />

                {/* Match Factor Breakdown Card */}
                <div className="p-4 bg-cream-50 border-t border-sage-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-forest-900 uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-leaf-600" />
                      <span>{match_explanation.level} Match Rationale</span>
                    </span>
                    <span className="text-xs font-extrabold text-leaf-700">
                      {match_explanation.score}%
                    </span>
                  </div>

                  <p className="text-xs text-charcoal-700 italic">
                    "{match_explanation.summary}"
                  </p>

                  <div className="space-y-1 pt-1">
                    {match_explanation.factors.map((factor, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-[11px] text-charcoal-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{factor}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
