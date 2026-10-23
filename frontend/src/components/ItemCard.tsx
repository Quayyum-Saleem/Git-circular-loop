import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Heart, ArrowUpRight, Sparkles, Wrench, Package, Gift, Recycle } from 'lucide-react';
import type { ItemListing } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

interface ItemCardProps {
  item: ItemListing;
  onFavouriteChange?: (itemId: number, isFav: boolean) => void;
  showMatchScore?: number;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, onFavouriteChange, showMatchScore }) => {
  const { isAuthenticated } = useAuth();
  const { info, error } = useToast();
  const [isFav, setIsFav] = useState(item.is_favourited || false);
  const [imgError, setImgError] = useState(false);

  const handleToggleFav = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      info('Please sign in to save items to favourites.');
      return;
    }
    try {
      const res = await api.toggleFavourite(item.id);
      setIsFav(res.favourited);
      if (onFavouriteChange) onFavouriteChange(item.id, res.favourited);
    } catch {
      error('Could not update favourites.');
    }
  };

  const getPurposeBadge = (purpose: string) => {
    switch (purpose.toLowerCase()) {
      case 'give away':
        return { label: 'Free Reuse', bg: 'bg-emerald-100 text-emerald-900 border-emerald-200', icon: Gift };
      case 'sell for reuse':
        return { label: 'Direct Sale', bg: 'bg-amber-100 text-amber-900 border-amber-200', icon: Package };
      case 'request repair':
        return { label: 'Repair Needed', bg: 'bg-orange-100 text-orange-900 border-orange-200', icon: Wrench };
      case 'donate':
        return { label: 'Charity Donation', bg: 'bg-purple-100 text-purple-900 border-purple-200', icon: Gift };
      case 'responsible recycling':
        return { label: 'Recycle', bg: 'bg-teal-100 text-teal-900 border-teal-200', icon: Recycle };
      default:
        return { label: purpose, bg: 'bg-sage-100 text-forest-900 border-sage-200', icon: Package };
    }
  };

  const badge = getPurposeBadge(item.purpose);
  const PurposeIcon = badge.icon;

  const fallbackImage = "https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=600&q=80";

  return (
    <div className="group relative bg-white rounded-2xl border border-sage-200/90 shadow-card hover:shadow-card-hover hover:border-leaf-400/60 transition-all duration-200 flex flex-col overflow-hidden">
      {/* Top Media Container */}
      <Link to={`/items/${item.id}`} className="relative aspect-[4/3] w-full overflow-hidden bg-cream-200 block">
        <img
          src={imgError ? fallbackImage : (item.image_url?.startsWith('/uploads') ? `http://localhost:8000${item.image_url}` : item.image_url || fallbackImage)}
          alt={item.title}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Status Pill */}
        {item.status !== 'Available' && (
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase shadow-sm bg-charcoal-800/80 text-white backdrop-blur-xs">
            {item.status}
          </div>
        )}

        {/* Match score badge overlay if passed */}
        {showMatchScore !== undefined && (
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold shadow-md bg-forest-900 text-cream-50 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-leaf-300" />
            <span>{showMatchScore}% Match</span>
          </div>
        )}

        {/* Favourite Button */}
        <button
          onClick={handleToggleFav}
          aria-label={isFav ? 'Remove from saved items' : 'Save item'}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md shadow-sm transition-transform active:scale-90 ${
            isFav
              ? 'bg-rose-50 text-rose-600 border border-rose-200'
              : 'bg-white/85 text-charcoal-500 hover:text-rose-600 hover:bg-white'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-600' : ''}`} />
        </button>

        {/* Purpose Badge at Bottom Left of Image */}
        <div className="absolute bottom-3 left-3">
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border shadow-xs ${badge.bg}`}>
            <PurposeIcon className="w-3.5 h-3.5" />
            <span>{badge.label}</span>
          </span>
        </div>
      </Link>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Condition tags */}
          <div className="flex items-center justify-between gap-2 mb-1.5 text-xs">
            <span className="text-leaf-600 font-semibold truncate">
              {item.category}
            </span>
            <span className="text-charcoal-500 bg-cream-200/70 px-2 py-0.5 rounded-md font-medium text-[11px]">
              {item.condition}
            </span>
          </div>

          {/* Title */}
          <Link to={`/items/${item.id}`} className="block group-hover:text-forest-900 transition-colors">
            <h3 className="font-bold text-base text-charcoal-900 line-clamp-1 leading-snug">
              {item.title}
            </h3>
          </Link>

          {/* Description snippet */}
          <p className="text-xs text-charcoal-600 line-clamp-2 mt-1 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Location & Price Footer */}
        <div className="pt-3 mt-3 border-t border-sage-100 flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-charcoal-500 truncate max-w-[60%]">
            <MapPin className="w-3.5 h-3.5 text-leaf-500 shrink-0" />
            <span className="truncate">{item.location_name}</span>
          </div>

          <div className="text-right">
            {item.price > 0 ? (
              <span className="font-bold text-sm text-forest-900">${item.price.toFixed(2)}</span>
            ) : (
              <span className="font-bold text-xs px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                Free
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
