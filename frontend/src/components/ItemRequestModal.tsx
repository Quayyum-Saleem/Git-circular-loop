import React, { useState } from 'react';
import { X, Send, Leaf, Sparkles, MapPin, AlertCircle } from 'lucide-react';
import type { ItemListing } from '../types';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';

interface ItemRequestModalProps {
  item: ItemListing;
  isOpen: boolean;
  onClose: () => void;
  onRequestSubmitted: () => void;
}

export const ItemRequestModal: React.FC<ItemRequestModalProps> = ({
  item,
  isOpen,
  onClose,
  onRequestSubmitted,
}) => {
  const [message, setMessage] = useState(
    `Hi ${item.owner.full_name.split(' ')[0]}, I would love to connect and arrange pickup for your "${item.title}". I am flexible on timing!`
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { success, error } = useToast();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.createExchangeRequest(item.id, message);
      success('Exchange request sent to the item owner! You can monitor status in your dashboard.');
      onRequestSubmitted();
      onClose();
    } catch (err: any) {
      error(err.message || 'Could not send request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-charcoal-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-sage-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-cream-100 border-b border-sage-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-forest-900 text-leaf-300 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-forest-900">Request Circular Exchange</h3>
              <p className="text-xs text-charcoal-500">Connecting directly with the item owner</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-charcoal-400 hover:text-charcoal-700 hover:bg-cream-200 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Item summary */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-sage-50 border border-sage-200">
            <img
              src={item.image_url?.startsWith('/uploads') ? `http://localhost:8000${item.image_url}` : item.image_url}
              alt={item.title}
              className="w-14 h-14 rounded-lg object-cover shrink-0 border border-sage-300"
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-sm text-charcoal-900 truncate">{item.title}</h4>
              <p className="text-xs text-leaf-600 font-semibold">{item.category} • {item.condition}</p>
              <div className="flex items-center gap-1 text-[11px] text-charcoal-500 mt-0.5">
                <MapPin className="w-3 h-3 text-leaf-500 shrink-0" />
                <span className="truncate">{item.location_name}</span>
              </div>
            </div>
          </div>

          {/* Environmental Benefit Banner */}
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs">
            <Leaf className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              By completing this exchange, you will divert ~<strong>2.5 kg</strong> of waste and avoid ~<strong>18.4 kg CO2e</strong>!
            </span>
          </div>

          {/* Pickup Notes reminder if present */}
          {item.pickup_notes && (
            <div className="p-3 rounded-xl bg-cream-100 border border-sage-200 text-xs text-charcoal-700">
              <span className="font-bold text-forest-900 block mb-0.5">Owner's Pickup Preferences:</span>
              <p>{item.pickup_notes}</p>
            </div>
          )}

          {/* Message textarea */}
          <div>
            <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
              Message to Owner ({item.owner.full_name})
            </label>
            <textarea
              rows={4}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Introduce yourself and propose a convenient pickup time..."
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-sage-300 focus:outline-none focus:ring-2 focus:ring-forest-800 bg-cream-50"
            />
            <p className="text-[11px] text-charcoal-500 mt-1">
              Your contact details will only be shared once the owner accepts your request.
            </p>
          </div>

          {/* Footer actions */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-sage-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-charcoal-600 hover:bg-cream-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-forest-900 text-white text-xs font-bold hover:bg-forest-800 transition-colors shadow-sm flex items-center gap-1.5 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Sending...</span>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5 text-leaf-300" />
                  <span>Send Exchange Request</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
