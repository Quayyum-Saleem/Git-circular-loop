import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Package, Inbox, ArrowUpRight, CheckCircle2, XCircle, Clock,
  Leaf, Award, PlusCircle, Wrench, Sparkles, Heart, Trash2, Edit3, MapPin
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ItemListing, ExchangeRequest } from '../types';
import { api } from '../services/api';
import { ItemCard } from '../components/ItemCard';
import { ConfirmationDialog } from '../components/ConfirmationDialog';

export const DashboardPage: React.FC = () => {
  const { user, isAuthenticated, refreshUser } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'listings' | 'incoming' | 'outgoing' | 'favourites'>('listings');
  const [myListings, setMyListings] = useState<ItemListing[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<ExchangeRequest[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<ExchangeRequest[]>([]);
  const [favourites, setFavourites] = useState<ItemListing[]>([]);
  const [loading, setLoading] = useState(true);

  // Confirmation dialog state
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel: string;
    isDestructive: boolean;
    action: () => Promise<void>;
  }>({
    isOpen: false,
    title: '',
    message: '',
    confirmLabel: 'Confirm',
    isDestructive: false,
    action: async () => {},
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    loadDashboardData();
  }, [isAuthenticated, navigate]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [listings, incoming, outgoing, favs] = await Promise.all([
        api.getMyListings(),
        api.getIncomingRequests(),
        api.getOutgoingRequests(),
        api.getMyFavourites(),
      ]);
      setMyListings(listings);
      setIncomingRequests(incoming);
      setOutgoingRequests(outgoing);
      setFavourites(favs);
    } catch (err: any) {
      error(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestStatus = async (requestId: number, newStatus: 'Accepted' | 'Rejected') => {
    try {
      await api.updateRequestStatus(requestId, newStatus);
      success(`Request marked as ${newStatus}`);
      await loadDashboardData();
    } catch (err: any) {
      error(err.message || 'Failed to update request');
    }
  };

  const handleCompleteExchange = (listingId: number, requestId?: number, exchangeType?: string) => {
    setDialogState({
      isOpen: true,
      title: 'Confirm Exchange Completion',
      message: 'Marking this circular exchange as complete will finalize the transfer, record diverted landfill waste and avoided carbon emissions, and award Circular Points to both parties.',
      confirmLabel: 'Complete Exchange',
      isDestructive: false,
      action: async () => {
        try {
          await api.completeExchange({
            listing_id: listingId,
            exchange_request_id: requestId,
            exchange_type: exchangeType || 'reuse',
          });
          success('Exchange successfully completed! Impact and rewards awarded.');
          await refreshUser();
          await loadDashboardData();
        } catch (err: any) {
          error(err.message || 'Failed to complete exchange');
        }
      },
    });
  };

  const handleDeleteListing = (listingId: number) => {
    setDialogState({
      isOpen: true,
      title: 'Delete Listing',
      message: 'Are you sure you want to remove this item listing? This action cannot be undone.',
      confirmLabel: 'Delete',
      isDestructive: true,
      action: async () => {
        try {
          await api.deleteListing(listingId);
          success('Listing deleted');
          await loadDashboardData();
        } catch (err: any) {
          error(err.message || 'Failed to delete listing');
        }
      },
    });
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-forest-900 to-forest-800 rounded-3xl p-6 sm:p-8 text-cream-50 shadow-xl border border-forest-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={user.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'}
            alt={user.full_name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-leaf-400 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                Hi, {user.full_name}!
              </h1>
              {user.is_demo && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-leaf-500/30 text-leaf-200 border border-leaf-400/40">
                  Demo Account
                </span>
              )}
            </div>
            <p className="text-xs text-sage-200 mt-0.5">
              {user.location || 'Campus Center'} • {user.bio || 'Zero-waste contributor'}
            </p>
          </div>
        </div>

        {/* User Quick Stats */}
        <div className="flex items-center gap-3">
          <Link
            to="/rewards"
            className="p-3.5 rounded-2xl bg-forest-950/60 border border-forest-700 hover:border-leaf-400 transition-colors flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-leaf-500/20 text-leaf-300 flex items-center justify-center font-bold">
              <Award className="w-5 h-5 text-leaf-300" />
            </div>
            <div className="text-left">
              <span className="text-[11px] font-medium text-sage-300 uppercase tracking-wider block">
                Circular Points
              </span>
              <span className="text-xl font-extrabold text-cream-50">{user.circular_points} pts</span>
            </div>
          </Link>

          <Link
            to="/create-listing"
            className="px-4 py-3.5 rounded-2xl bg-leaf-500 text-forest-950 hover:bg-leaf-400 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>List an Item</span>
          </Link>
        </div>
      </div>

      {/* Quick Action Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          to="/marketplace"
          className="p-4 rounded-2xl bg-white border border-sage-200 hover:border-leaf-400 transition-all shadow-card hover:shadow-card-hover flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-charcoal-900 group-hover:text-forest-900">
                Browse Marketplace
              </h4>
              <p className="text-[11px] text-charcoal-500">Discover reuse & donation goods</p>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-charcoal-400 group-hover:text-forest-900 group-hover:translate-x-0.5 transition-transform" />
        </Link>

        <Link
          to="/smart-matching"
          className="p-4 rounded-2xl bg-white border border-sage-200 hover:border-leaf-400 transition-all shadow-card hover:shadow-card-hover flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-charcoal-900 group-hover:text-forest-900">
                Smart Match Engine
              </h4>
              <p className="text-[11px] text-charcoal-500">Items tailored to your wishes</p>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-charcoal-400 group-hover:text-forest-900 group-hover:translate-x-0.5 transition-transform" />
        </Link>

        <Link
          to="/repair-assistant"
          className="p-4 rounded-2xl bg-white border border-sage-200 hover:border-leaf-400 transition-all shadow-card hover:shadow-card-hover flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-charcoal-900 group-hover:text-forest-900">
                Repair Assistant
              </h4>
              <p className="text-[11px] text-charcoal-500">Diagnose & fix damaged goods</p>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-charcoal-400 group-hover:text-forest-900 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Dashboard Tabs & Content */}
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-2 border-b border-sage-200 pb-2">
          <button
            onClick={() => setActiveTab('listings')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
              activeTab === 'listings'
                ? 'bg-forest-900 text-cream-50 shadow-sm'
                : 'text-charcoal-700 hover:bg-cream-200'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>My Listings ({myListings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('incoming')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
              activeTab === 'incoming'
                ? 'bg-forest-900 text-cream-50 shadow-sm'
                : 'text-charcoal-700 hover:bg-cream-200'
            }`}
          >
            <Inbox className="w-4 h-4" />
            <span>Incoming Requests ({incomingRequests.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('outgoing')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
              activeTab === 'outgoing'
                ? 'bg-forest-900 text-cream-50 shadow-sm'
                : 'text-charcoal-700 hover:bg-cream-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>My Sent Requests ({outgoingRequests.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('favourites')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
              activeTab === 'favourites'
                ? 'bg-forest-900 text-cream-50 shadow-sm'
                : 'text-charcoal-700 hover:bg-cream-200'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Saved Items ({favourites.length})</span>
          </button>
        </div>

        {/* Tab 1: My Listings */}
        {activeTab === 'listings' && (
          <div>
            {myListings.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 text-center border border-sage-200 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-sage-100 text-leaf-600 flex items-center justify-center mx-auto">
                  <Package className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-forest-900">No active listings yet</h3>
                <p className="text-xs text-charcoal-500 max-w-sm mx-auto">
                  Have an unused textbook, laptop, or chair? List it now to extend its life and earn points.
                </p>
                <Link
                  to="/create-listing"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-forest-900 text-white text-xs font-bold"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Create First Listing</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myListings.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border border-sage-200 shadow-card p-4 flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-3 bg-cream-200">
                        <img
                          src={item.image_url?.startsWith('/uploads') ? `http://localhost:8000${item.image_url}` : item.image_url}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-charcoal-900/80 text-white">
                          {item.status}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-charcoal-900 line-clamp-1">{item.title}</h4>
                      <p className="text-xs text-leaf-600 font-semibold mt-0.5">{item.category} • {item.purpose}</p>
                      <p className="text-xs text-charcoal-500 line-clamp-2 mt-1">{item.description}</p>
                    </div>

                    <div className="pt-3 mt-3 border-t border-sage-100 flex items-center justify-between">
                      {item.status !== 'Completed' && (
                        <button
                          onClick={() => handleCompleteExchange(item.id, undefined, item.purpose)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Mark Completed</span>
                        </button>
                      )}

                      <div className="flex items-center gap-2 ml-auto">
                        <button
                          onClick={() => handleDeleteListing(item.id)}
                          className="p-1.5 text-charcoal-400 hover:text-rose-600 rounded-lg transition-colors"
                          title="Delete Listing"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Incoming Requests */}
        {activeTab === 'incoming' && (
          <div className="space-y-4">
            {incomingRequests.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 text-center border border-sage-200 text-xs text-charcoal-500">
                No incoming requests yet. When someone wants your item, it will appear here.
              </div>
            ) : (
              incomingRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white rounded-2xl border border-sage-200 p-5 shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={req.listing.image_url?.startsWith('/uploads') ? `http://localhost:8000${req.listing.image_url}` : req.listing.image_url}
                      alt={req.listing.title}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 border border-sage-200"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-forest-900">{req.listing.title}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          req.status === 'Accepted'
                            ? 'bg-emerald-100 text-emerald-800'
                            : req.status === 'Rejected'
                            ? 'bg-rose-100 text-rose-800'
                            : req.status === 'Completed'
                            ? 'bg-leaf-100 text-leaf-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {req.status}
                        </span>
                      </div>
                      <p className="text-xs text-charcoal-700 mt-1">
                        <strong>From:</strong> {req.requester.full_name} ({req.requester.email})
                      </p>
                      <p className="text-xs text-charcoal-600 italic bg-cream-100 p-2 rounded-lg mt-1.5 border border-sage-200">
                        "{req.message}"
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {req.status === 'Pending' && (
                      <>
                        <button
                          onClick={() => handleRequestStatus(req.id, 'Accepted')}
                          className="px-3.5 py-1.5 rounded-xl bg-forest-900 text-white text-xs font-bold hover:bg-forest-800 transition-colors"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleRequestStatus(req.id, 'Rejected')}
                          className="px-3 py-1.5 rounded-xl border border-sage-300 text-xs font-semibold text-charcoal-700 hover:bg-rose-50 hover:text-rose-700 transition-colors"
                        >
                          Decline
                        </button>
                      </>
                    )}

                    {req.status === 'Accepted' && (
                      <button
                        onClick={() => handleCompleteExchange(req.listing_id, req.id, req.listing.purpose)}
                        className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Confirm Handoff Completed</span>
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 3: Outgoing Requests */}
        {activeTab === 'outgoing' && (
          <div className="space-y-4">
            {outgoingRequests.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 text-center border border-sage-200 text-xs text-charcoal-500">
                You haven't requested any items yet. Explore the marketplace to find reusable laptops, textbooks, and gear.
              </div>
            ) : (
              outgoingRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white rounded-2xl border border-sage-200 p-5 shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={req.listing.image_url?.startsWith('/uploads') ? `http://localhost:8000${req.listing.image_url}` : req.listing.image_url}
                      alt={req.listing.title}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 border border-sage-200"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <Link to={`/items/${req.listing.id}`} className="font-bold text-sm text-forest-900 hover:underline">
                          {req.listing.title}
                        </Link>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          req.status === 'Accepted'
                            ? 'bg-emerald-100 text-emerald-800'
                            : req.status === 'Rejected'
                            ? 'bg-rose-100 text-rose-800'
                            : req.status === 'Completed'
                            ? 'bg-leaf-100 text-leaf-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {req.status}
                        </span>
                      </div>
                      <p className="text-xs text-charcoal-600 mt-1">
                        <strong>Owner:</strong> {req.owner.full_name} ({req.owner.location})
                      </p>
                      <p className="text-xs text-charcoal-500 mt-0.5">
                        Your note: "{req.message}"
                      </p>
                    </div>
                  </div>

                  {req.status === 'Accepted' && (
                    <button
                      onClick={() => handleCompleteExchange(req.listing_id, req.id, req.listing.purpose)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Confirm Received</span>
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 4: Favourites */}
        {activeTab === 'favourites' && (
          <div>
            {favourites.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 text-center border border-sage-200 text-xs text-charcoal-500">
                You haven't saved any items yet. Click the heart icon on any card to bookmark items.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {favourites.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    onFavouriteChange={() => loadDashboardData()}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={dialogState.isOpen}
        title={dialogState.title}
        message={dialogState.message}
        confirmLabel={dialogState.confirmLabel}
        isDestructive={dialogState.isDestructive}
        onConfirm={async () => {
          setDialogState((prev) => ({ ...prev, isOpen: false }));
          await dialogState.action();
        }}
        onCancel={() => setDialogState((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};
