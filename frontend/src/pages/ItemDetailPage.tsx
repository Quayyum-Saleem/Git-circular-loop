import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin, Heart, Share2, Sparkles, Send, ShieldCheck,
  Leaf, ArrowLeft, User as UserIcon, Calendar, CheckCircle2, Package
} from 'lucide-react';
import { ItemListing } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ItemRequestModal } from '../components/ItemRequestModal';
import { ItemCard } from '../components/ItemCard';

export const ItemDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { success, error, info } = useToast();

  const [item, setItem] = useState<ItemListing | null>(null);
  const [similarItems, setSimilarItems] = useState<ItemListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    async function fetchItemDetails() {
      if (!id) return;
      setLoading(true);
      try {
        const itemData = await api.getListing(parseInt(id, 10));
        setItem(itemData);
        setIsFav(itemData.is_favourited || false);

        // Fetch similar items in the same category
        const similar = await api.getListings({ category: itemData.category });
        setSimilarItems(similar.filter((s) => s.id !== itemData.id).slice(0, 3));
      } catch (err: any) {
        error(err.message || 'Failed to load item details');
      } finally {
        setLoading(false);
      }
    }
    fetchItemDetails();
  }, [id]);

  const handleToggleFav = async () => {
    if (!isAuthenticated) {
      info('Please sign in to save items to favourites.');
      return;
    }
    if (!item) return;
    try {
      const res = await api.toggleFavourite(item.id);
      setIsFav(res.favourited);
      success(res.message);
    } catch {
      error('Failed to update favourite.');
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    success('Item link copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center text-xs text-charcoal-500">
        Loading circular item details...
      </div>
    );
  }

  if (!item) {
    return (
      <div className="max-w-md mx-auto my-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-forest-950">Item Not Found</h2>
        <p className="text-xs text-charcoal-600">This listing may have been completed or removed.</p>
        <Link to="/marketplace" className="inline-block px-4 py-2 bg-forest-900 text-white rounded-xl text-xs font-bold">
          Back to Marketplace
        </Link>
      </div>
    );
  }

  const isOwner = user?.id === item.owner_id;
  const isAvailable = item.status === 'Available';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-charcoal-600 hover:text-forest-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to listings</span>
      </button>

      {/* Main Item Hero Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Product Image */}
        <div className="lg:col-span-7 space-y-4">
          <div className="aspect-[4/3] w-full rounded-3xl overflow-hidden bg-cream-200 border border-sage-200 shadow-card relative">
            <img
              src={item.image_url?.startsWith('/uploads') ? `http://localhost:8000${item.image_url}` : item.image_url}
              alt={item.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm ${
                item.status === 'Available'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-charcoal-900/80 text-white'
              }`}>
                {item.status}
              </span>
            </div>
          </div>

          {/* Environmental Impact Estimation Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-sage-100 border border-emerald-200/90 text-xs text-charcoal-800 flex items-center gap-3 shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-emerald-950 text-xs">
                Estimated Circular Economy Benefit:
              </p>
              <p className="text-[11px] text-emerald-900/80 mt-0.5">
                Choosing this secondhand item diverts ~<strong>2.5 kg</strong> of solid waste and prevents ~<strong>18.4 kg CO2e</strong> in manufacturing emissions.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Item Metadata & Actions */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            {/* Category & Condition tags */}
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sage-100 text-forest-900 border border-sage-200">
                {item.category}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-cream-200 text-charcoal-700">
                Condition: {item.condition}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 tracking-tight font-sans">
              {item.title}
            </h1>

            {/* Price / Free badge */}
            <div className="mt-3">
              {item.price > 0 ? (
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-forest-900">${item.price.toFixed(2)}</span>
                  <span className="text-xs text-charcoal-500 font-medium">Offered for circular resale</span>
                </div>
              ) : (
                <span className="inline-block px-3 py-1 rounded-xl bg-emerald-100 text-emerald-900 font-extrabold text-sm border border-emerald-200">
                  Free Circular Transfer
                </span>
              )}
            </div>
          </div>

          {/* Location & Exchange Details */}
          <div className="p-4 rounded-2xl bg-cream-100 border border-sage-200 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-charcoal-700">
              <MapPin className="w-4 h-4 text-leaf-600 shrink-0" />
              <span>
                <strong>General Location:</strong> {item.location_name} (Approximate area)
              </span>
            </div>
            {item.pickup_notes && (
              <div className="pt-2 border-t border-sage-200/80 text-charcoal-600">
                <span className="font-bold text-forest-900 block mb-0.5">Pickup Preferences:</span>
                <p>{item.pickup_notes}</p>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-charcoal-500 uppercase tracking-wider">
              Item Description
            </h3>
            <p className="text-xs sm:text-sm text-charcoal-700 leading-relaxed whitespace-pre-line bg-white p-4 rounded-2xl border border-sage-200">
              {item.description}
            </p>
          </div>

          {/* Owner Card */}
          <div className="p-4 rounded-2xl bg-white border border-sage-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={item.owner.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80'}
                alt={item.owner.full_name}
                className="w-11 h-11 rounded-full object-cover border border-sage-300"
              />
              <div>
                <p className="font-bold text-sm text-forest-900">{item.owner.full_name}</p>
                <p className="text-[11px] text-charcoal-500">{item.owner.location || 'Campus Member'}</p>
              </div>
            </div>
            <div className="text-right text-[11px] text-leaf-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Verified Owner</span>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            {isOwner ? (
              <div className="flex-1 p-3 rounded-xl bg-sage-100 text-forest-900 font-semibold text-xs text-center border border-sage-300">
                This is your listing. Manage requests from your Dashboard.
              </div>
            ) : isAvailable ? (
              <button
                onClick={() => {
                  if (!isAuthenticated) {
                    info('Please sign in to request this circular item.');
                    navigate('/auth');
                    return;
                  }
                  setIsModalOpen(true);
                }}
                className="flex-1 py-3.5 px-6 rounded-xl bg-forest-900 text-cream-50 font-bold text-sm hover:bg-forest-800 transition-colors shadow-md flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4 text-leaf-300" />
                <span>Request This Item</span>
              </button>
            ) : (
              <button
                disabled
                className="flex-1 py-3.5 px-6 rounded-xl bg-charcoal-300 text-charcoal-700 font-bold text-sm cursor-not-allowed"
              >
                Item {item.status}
              </button>
            )}

            <button
              onClick={handleToggleFav}
              className={`p-3.5 rounded-xl border transition-colors ${
                isFav
                  ? 'bg-rose-50 border-rose-200 text-rose-600'
                  : 'bg-white border-sage-300 text-charcoal-600 hover:text-rose-600 hover:bg-cream-100'
              }`}
              title={isFav ? 'Remove from saved items' : 'Save to favourites'}
            >
              <Heart className={`w-5 h-5 ${isFav ? 'fill-rose-600' : ''}`} />
            </button>

            <button
              onClick={handleShare}
              className="p-3.5 rounded-xl border border-sage-300 bg-white text-charcoal-600 hover:bg-cream-100 transition-colors"
              title="Share item link"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Similar Recommended Listings */}
      {similarItems.length > 0 && (
        <div className="pt-8 border-t border-sage-200 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg text-forest-950">
              Similar Circular Items in {item.category}
            </h3>
            <Link to="/marketplace" className="text-xs font-bold text-forest-900 hover:text-leaf-600">
              Explore All
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {similarItems.map((similar) => (
              <ItemCard key={similar.id} item={similar} />
            ))}
          </div>
        </div>
      )}

      {/* Request Modal Dialog */}
      <ItemRequestModal
        item={item}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRequestSubmitted={() => {
          setItem((prev) => (prev ? { ...prev, status: 'Requested' } : null));
        }}
      />
    </div>
  );
};
