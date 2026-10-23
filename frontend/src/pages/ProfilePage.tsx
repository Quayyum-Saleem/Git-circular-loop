import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User as UserIcon, Mail, MapPin, Award, Shield, Bell,
  LogOut, Save, CheckCircle2, Lock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const { success } = useToast();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState(user?.full_name || '');
  const [locationName, setLocationName] = useState(user?.location || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [notifyExchange, setNotifyExchange] = useState(true);
  const [privacyCoords, setPrivacyCoords] = useState(true);
  const [leaderboardOptIn, setLeaderboardOptIn] = useState(true);

  if (!user) {
    navigate('/auth');
    return null;
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    success('Profile and preferences updated successfully.');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-forest-950 font-sans">
          Profile & Preferences
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-600 mt-1">
          Manage your account credentials, privacy preferences, and circular activity.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-sage-200 shadow-card space-y-6">
          <div className="flex items-center gap-5 pb-6 border-b border-sage-200">
            <img
              src={user.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'}
              alt={user.full_name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-sage-300 shadow-sm"
            />
            <div>
              <h2 className="text-xl font-bold text-forest-950">{user.full_name}</h2>
              <p className="text-xs text-charcoal-500">{user.email}</p>
              <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sage-100 text-forest-900 text-xs font-bold">
                <Award className="w-3.5 h-3.5 text-leaf-600" />
                <span>{user.circular_points} Circular Points</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-sage-300 text-sm focus:outline-none focus:ring-2 focus:ring-forest-800 bg-cream-50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1">
                Campus Location
              </label>
              <input
                type="text"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-sage-300 text-sm focus:outline-none focus:ring-2 focus:ring-forest-800 bg-cream-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1">
              Short Bio & Sustainability Interests
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="e.g. Seeking vintage electronics, repairing small appliances..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-sage-300 text-sm focus:outline-none focus:ring-2 focus:ring-forest-800 bg-cream-50"
            />
          </div>
        </div>

        {/* Privacy & Notification Settings */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-sage-200 shadow-card space-y-4">
          <h3 className="font-bold text-sm text-forest-950 uppercase tracking-wider flex items-center gap-2">
            <Shield className="w-4 h-4 text-leaf-600" />
            <span>Privacy & Safety Defaults</span>
          </h3>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-xl bg-cream-50 border border-sage-200 cursor-pointer">
              <div>
                <span className="font-bold text-xs text-charcoal-900 block">
                  Preserve Location Privacy (Fuzzy Landmark Radius)
                </span>
                <span className="text-[11px] text-charcoal-500">
                  Never exposes exact room numbers or street addresses on the public map.
                </span>
              </div>
              <input
                type="checkbox"
                checked={privacyCoords}
                onChange={(e) => setPrivacyCoords(e.target.checked)}
                className="w-4 h-4 rounded text-forest-900 focus:ring-forest-800"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-cream-50 border border-sage-200 cursor-pointer">
              <div>
                <span className="font-bold text-xs text-charcoal-900 block">
                  Community Leaderboard Display
                </span>
                <span className="text-[11px] text-charcoal-500">
                  Display your public display name on campus circular milestones.
                </span>
              </div>
              <input
                type="checkbox"
                checked={leaderboardOptIn}
                onChange={(e) => setLeaderboardOptIn(e.target.checked)}
                className="w-4 h-4 rounded text-forest-900 focus:ring-forest-800"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-cream-50 border border-sage-200 cursor-pointer">
              <div>
                <span className="font-bold text-xs text-charcoal-900 block">
                  Exchange Notifications
                </span>
                <span className="text-[11px] text-charcoal-500">
                  Notify me when an owner accepts or updates my exchange request.
                </span>
              </div>
              <input
                type="checkbox"
                checked={notifyExchange}
                onChange={(e) => setNotifyExchange(e.target.checked)}
                className="w-4 h-4 rounded text-forest-900 focus:ring-forest-800"
              />
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={logout}
            className="px-4 py-2.5 rounded-xl border border-rose-300 text-rose-700 text-xs font-bold hover:bg-rose-50 transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-forest-900 text-white text-xs font-bold hover:bg-forest-800 transition-colors shadow-sm flex items-center gap-1.5"
          >
            <Save className="w-4 h-4 text-leaf-300" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
};
