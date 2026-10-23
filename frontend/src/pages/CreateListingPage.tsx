import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload, Image as ImageIcon, Sparkles, MapPin, DollarSign,
  AlertCircle, CheckCircle2, ArrowRight, Loader2, X
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { AIClassificationResult } from '../types';

const CATEGORIES = [
  'Electronics',
  'Books and educational materials',
  'Furniture',
  'Clothing and accessories',
  'Home appliances',
  'Household items',
  'Sports and recreation',
  'Other',
];

const CONDITIONS = ['New', 'Like New', 'Good', 'Fair', 'Needs Repair'];

const PURPOSES = [
  'Give away',
  'Sell for reuse',
  'Request repair',
  'Donate',
  'Responsible recycling',
];

export const CreateListingPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { success, error, info } = useToast();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [condition, setCondition] = useState('Good');
  const [purpose, setPurpose] = useState('Give away');
  const [price, setPrice] = useState('0');
  const [locationName, setLocationName] = useState(user?.location || 'Campus Center');
  const [pickupNotes, setPickupNotes] = useState('');

  // Image upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // AI Category Suggestion state
  const [isClassifying, setIsClassifying] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<AIClassificationResult | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const localPreview = URL.createObjectURL(file);
      setPreviewUrl(localPreview);

      // Auto-upload image to backend
      setIsUploadingImage(true);
      try {
        const uploadRes = await api.uploadImage(file);
        setUploadedImageUrl(uploadRes.url);
        success('Item photo uploaded successfully!');

        // Run AI classification suggestion
        runAiClassification(file);
      } catch (err: any) {
        error(err.message || 'Image upload failed');
      } finally {
        setIsUploadingImage(false);
      }
    }
  };

  const runAiClassification = async (fileToUse?: File) => {
    const f = fileToUse || selectedFile || undefined;
    if (!f && !title) {
      info('Upload an image or enter a title to get AI category suggestions.');
      return;
    }
    setIsClassifying(true);
    try {
      const res = await api.suggestCategory(f, title);
      setAiSuggestion(res);
    } catch {
      // Graceful fallback
    } finally {
      setIsClassifying(false);
    }
  };

  const handleApplyAiSuggestion = () => {
    if (aiSuggestion) {
      setCategory(aiSuggestion.suggested_category);
      if (aiSuggestion.suggested_condition) setCondition(aiSuggestion.suggested_condition);
      if (aiSuggestion.suggested_purpose) setPurpose(aiSuggestion.suggested_purpose);
      success(`Applied category: ${aiSuggestion.suggested_category}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      info('Please sign in to publish an item listing.');
      navigate('/auth');
      return;
    }

    if (!title.trim() || !description.trim()) {
      error('Please provide both a title and description.');
      return;
    }

    setIsSubmitting(true);
    try {
      const newListing = await api.createListing({
        title: title.trim(),
        description: description.trim(),
        category,
        condition,
        purpose,
        price: parseFloat(price) || 0,
        image_url: uploadedImageUrl || previewUrl || 'https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=600&q=80',
        location_name: locationName.trim(),
        pickup_notes: pickupNotes.trim(),
      });
      success('Item listing created! Available now in the marketplace.');
      navigate(`/items/${newListing.id}`);
    } catch (err: any) {
      error(err.message || 'Failed to create listing');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-forest-950 font-sans">
          List an Item for Circular Life
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-600 mt-1">
          Extend the usefulness of your unused products through student reuse, repair, donation, or recycling.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Photo Upload & AI Classifier */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-sage-200 shadow-card space-y-4">
          <h2 className="text-base font-bold text-forest-900 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-leaf-600" />
            <span>1. Item Photography & Visual Check</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            {/* Upload Dropzone */}
            <div className="relative border-2 border-dashed border-sage-300 rounded-2xl p-6 text-center hover:border-forest-800 transition-colors bg-cream-50 cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-xl bg-sage-100 text-leaf-600 flex items-center justify-center mx-auto">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="text-xs font-bold text-forest-900">
                  {isUploadingImage ? 'Uploading photo...' : 'Click or Drag to Upload Photo'}
                </div>
                <p className="text-[11px] text-charcoal-500">
                  PNG, JPG, WEBP up to 10MB
                </p>
              </div>
            </div>

            {/* Preview Box */}
            <div className="aspect-[4/3] rounded-2xl bg-cream-200 border border-sage-300 overflow-hidden relative flex items-center justify-center text-charcoal-400">
              {previewUrl ? (
                <>
                  <img src={previewUrl} alt="Item preview" className="w-full h-full object-cover" />
                  <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-forest-900/80 text-white text-[10px] font-bold">
                    Uploaded Preview
                  </span>
                </>
              ) : (
                <div className="text-center p-4">
                  <ImageIcon className="w-8 h-8 mx-auto text-charcoal-400 mb-1" />
                  <span className="text-xs font-medium">No photo selected yet</span>
                </div>
              )}
            </div>
          </div>

          {/* AI Modular Category Suggestion Banner */}
          <div className="pt-2">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-sage-100 to-cream-100 border border-sage-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-forest-900">
                  <Sparkles className="w-4 h-4 text-leaf-600" />
                  <span>AI Category Suggestion Helper</span>
                  <span className="text-[10px] px-2 py-0.2 rounded-full bg-leaf-500/20 text-leaf-800 font-semibold">
                    Transparent Heuristics
                  </span>
                </div>
                <p className="text-[11px] text-charcoal-600">
                  {aiSuggestion
                    ? `Suggestion: "${aiSuggestion.suggested_category}" (${Math.round(aiSuggestion.confidence * 100)}% confidence). ${aiSuggestion.explanation}`
                    : 'Our modular classifier detects aspect ratio and keywords to suggest the best circular category.'}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {aiSuggestion ? (
                  <button
                    type="button"
                    onClick={handleApplyAiSuggestion}
                    className="px-3 py-1.5 rounded-xl bg-forest-900 text-cream-50 text-xs font-bold hover:bg-forest-800 transition-colors shadow-xs"
                  >
                    Apply "{aiSuggestion.suggested_category}"
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={isClassifying}
                    onClick={() => runAiClassification()}
                    className="px-3 py-1.5 rounded-xl bg-white border border-forest-800 text-forest-900 text-xs font-bold hover:bg-forest-900 hover:text-white transition-colors"
                  >
                    {isClassifying ? 'Analyzing...' : 'Suggest Category'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Core Item Details */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-sage-200 shadow-card space-y-5">
          <h2 className="text-base font-bold text-forest-900">2. Item Details & Classification</h2>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
              Item Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. ThinkPad T480 Laptop (8GB RAM / 256GB SSD)"
              className="w-full px-3.5 py-2.5 rounded-xl border border-sage-300 text-sm focus:outline-none focus:ring-2 focus:ring-forest-800 bg-cream-50"
            />
          </div>

          {/* Category & Condition */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-sage-300 text-sm bg-cream-50 font-medium text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-800"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
                Condition *
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-sage-300 text-sm bg-cream-50 font-medium text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-800"
              >
                {CONDITIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Purpose & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
                Listing Purpose *
              </label>
              <select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-sage-300 text-sm bg-cream-50 font-medium text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-800"
              >
                {PURPOSES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
                Price ($ USD)
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-3" />
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  disabled={purpose === 'Give away' || purpose === 'Donate' || purpose === 'Responsible recycling'}
                  value={purpose === 'Give away' || purpose === 'Donate' || purpose === 'Responsible recycling' ? '0' : price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-sage-300 text-sm focus:outline-none focus:ring-2 focus:ring-forest-800 bg-cream-50 disabled:bg-cream-200/50 disabled:text-charcoal-400"
                />
              </div>
              <span className="text-[11px] text-charcoal-500 mt-1 block">
                {purpose === 'Give away' || purpose === 'Donate' || purpose === 'Responsible recycling'
                  ? 'Set to $0 for free community transfers.'
                  : 'Optional price for circular resale.'}
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
              Description & Specifications *
            </label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe condition, history, included accessories, or any minor defects..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-sage-300 text-sm focus:outline-none focus:ring-2 focus:ring-forest-800 bg-cream-50"
            />
          </div>
        </div>

        {/* Section 3: Location and Pickup Details */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-sage-200 shadow-card space-y-4">
          <h2 className="text-base font-bold text-forest-900">3. Safe Exchange & Pickup Information</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
                General Pickup Location (Public Landmark) *
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  placeholder="e.g. Science Library Lobby / Campus Center"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-sage-300 text-sm focus:outline-none focus:ring-2 focus:ring-forest-800 bg-cream-50"
                />
              </div>
              <p className="text-[11px] text-charcoal-500 mt-1">
                For privacy, never share your room or apartment number publicly.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
                Pickup Availability / Timing
              </label>
              <input
                type="text"
                value={pickupNotes}
                onChange={(e) => setPickupNotes(e.target.value)}
                placeholder="e.g. Weekdays after 3 PM or weekends"
                className="w-full px-3.5 py-2.5 rounded-xl border border-sage-300 text-sm focus:outline-none focus:ring-2 focus:ring-forest-800 bg-cream-50"
              />
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-4 pt-2">
          <button
            type="button"
            onClick={() => navigate('/marketplace')}
            className="px-5 py-2.5 rounded-xl border border-sage-300 text-xs font-semibold text-charcoal-700 hover:bg-cream-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 rounded-xl bg-forest-900 text-white font-bold text-sm hover:bg-forest-800 transition-colors shadow-md flex items-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Publishing...</span>
            ) : (
              <>
                <span>Publish Item Listing</span>
                <ArrowRight className="w-4 h-4 text-leaf-300" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
