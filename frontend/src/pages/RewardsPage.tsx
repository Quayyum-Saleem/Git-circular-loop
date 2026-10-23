import React, { useEffect, useState } from 'react';
import {
  Award, Trophy, Sparkles, Repeat, Wrench, HeartHandshake,
  ShieldCheck, ArrowUpRight, History, CheckCircle2, Lock
} from 'lucide-react';
import { UserRewards, LeaderboardEntry } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const RewardsPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [rewardsData, setRewardsData] = useState<UserRewards | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRewards() {
      setLoading(true);
      try {
        const [board, userRew] = await Promise.all([
          api.getLeaderboard(),
          isAuthenticated ? api.getUserRewards() : Promise.resolve(null),
        ]);
        setLeaderboard(board);
        setRewardsData(userRew);
      } catch (err) {
        console.error('Failed to load rewards:', err);
      } finally {
        setLoading(false);
      }
    }
    loadRewards();
  }, [isAuthenticated]);

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Wrench':
        return Wrench;
      case 'HeartHandshake':
        return HeartHandshake;
      case 'Repeat':
        return Repeat;
      case 'ShieldCheck':
        return ShieldCheck;
      default:
        return Award;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-forest-900 via-forest-800 to-amber-700 rounded-3xl p-8 sm:p-10 text-cream-50 shadow-xl border border-forest-700 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-200 border border-amber-400/30 text-xs font-semibold">
            <Trophy className="w-3.5 h-3.5" />
            <span>Circular Gamification & Recognition</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-sans">
            Circular Rewards & Community
          </h1>
          <p className="text-xs sm:text-sm text-sage-200 leading-relaxed">
            Every completed reuse exchange, repaired item, and responsible donation earns points and unlocks sustainability credentials for your campus profile.
          </p>
        </div>

        {isAuthenticated && user && (
          <div className="p-5 rounded-2xl bg-forest-950/70 border border-amber-400/30 text-center shrink-0">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 block">
              Your Current Balance
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold text-cream-50 mt-1">
              {rewardsData?.circular_points ?? user.circular_points} <span className="text-sm font-normal text-sage-300">pts</span>
            </div>
          </div>
        )}
      </div>

      {/* Badges Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-leaf-600">
              Sustainability Achievements
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-forest-950 mt-0.5">
              Circular Badges & Honors
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(rewardsData?.badges || [
            { badge_key: 'first_reuse', badge_title: 'First Item Reused', description: 'Completed your first circular exchange on CircularLoop.', icon: 'Repeat', earned: true },
            { badge_key: 'repair_champion', badge_title: 'Repair Champion', description: 'Diagnosed and restored an item to keep it out of landfill.', icon: 'Wrench', earned: true },
            { badge_key: 'community_helper', badge_title: 'Community Helper', description: 'Donated usable goods directly to fellow community members.', icon: 'HeartHandshake', earned: false },
            { badge_key: 'circular_contributor', badge_title: 'Circular Campus Contributor', description: 'Completed 3 or more circular product handoffs.', icon: 'Sparkles', earned: true },
            { badge_key: 'climate_defender', badge_title: 'Climate Defender', description: 'Avoided over 25 kg of greenhouse carbon emissions.', icon: 'ShieldCheck', earned: false },
          ]).map((badge, idx) => {
            const IconComponent = getBadgeIcon(badge.icon);
            return (
              <div
                key={idx}
                className={`p-6 rounded-3xl border transition-all flex items-start gap-4 ${
                  badge.earned
                    ? 'bg-white border-sage-300 shadow-card hover:shadow-card-hover'
                    : 'bg-cream-100/60 border-sage-200 opacity-60'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    badge.earned
                      ? 'bg-forest-900 text-leaf-300 shadow-sm'
                      : 'bg-cream-300 text-charcoal-400'
                  }`}
                >
                  <IconComponent className="w-6 h-6" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-forest-950">{badge.badge_title}</h4>
                    {badge.earned ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        Earned
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cream-300 text-charcoal-600 flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        Locked
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-charcoal-600 leading-relaxed">
                    {badge.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Community Leaderboard & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Leaderboard Table */}
        <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-sage-200 shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-sage-200">
            <div>
              <h3 className="font-bold text-base text-forest-950">Campus Circular Leaderboard</h3>
              <p className="text-xs text-charcoal-500">Recognizing top contributors across campus</p>
            </div>
            <Trophy className="w-5 h-5 text-amber-500" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-cream-100 font-bold text-forest-900 border-b border-sage-200">
                <tr>
                  <th className="p-3 w-12 text-center">Rank</th>
                  <th className="p-3">Contributor</th>
                  <th className="p-3 text-center">Exchanges</th>
                  <th className="p-3 text-center">Avoided CO2</th>
                  <th className="p-3 text-right">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sage-100">
                {leaderboard.map((entry) => (
                  <tr key={entry.user_id} className="hover:bg-cream-50 transition-colors">
                    <td className="p-3 text-center font-bold">
                      {entry.rank === 1 ? (
                        <span className="inline-block w-6 h-6 rounded-full bg-amber-400 text-amber-950 font-extrabold leading-6">1</span>
                      ) : entry.rank === 2 ? (
                        <span className="inline-block w-6 h-6 rounded-full bg-slate-300 text-slate-900 font-extrabold leading-6">2</span>
                      ) : entry.rank === 3 ? (
                        <span className="inline-block w-6 h-6 rounded-full bg-amber-700 text-white font-extrabold leading-6">3</span>
                      ) : (
                        <span className="text-charcoal-500 font-semibold">{entry.rank}</span>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={entry.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80'}
                          alt={entry.full_name}
                          className="w-8 h-8 rounded-full object-cover border border-sage-300"
                        />
                        <span className="font-bold text-charcoal-900">{entry.full_name}</span>
                      </div>
                    </td>
                    <td className="p-3 text-center font-semibold text-charcoal-700">
                      {entry.exchanges_completed}
                    </td>
                    <td className="p-3 text-center font-semibold text-leaf-700">
                      {entry.co2_saved_kg} kg
                    </td>
                    <td className="p-3 text-right font-extrabold text-forest-900">
                      {entry.circular_points} pts
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Reward History / How Points are Earned */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-sage-200 shadow-card space-y-3">
            <h3 className="font-bold text-sm text-forest-950 uppercase tracking-wider">
              Points Breakdown Rules
            </h3>
            <ul className="space-y-2 text-xs text-charcoal-700">
              <li className="flex items-center justify-between p-2 rounded-lg bg-cream-50">
                <span>Direct Item Reuse Handoff</span>
                <span className="font-bold text-forest-900">+50 pts</span>
              </li>
              <li className="flex items-center justify-between p-2 rounded-lg bg-cream-50">
                <span>Completed Repair Restoration</span>
                <span className="font-bold text-forest-900">+75 pts</span>
              </li>
              <li className="flex items-center justify-between p-2 rounded-lg bg-cream-50">
                <span>Charity / Dorm Donation</span>
                <span className="font-bold text-forest-900">+60 pts</span>
              </li>
              <li className="flex items-center justify-between p-2 rounded-lg bg-cream-50">
                <span>Certified E-Waste Recycling</span>
                <span className="font-bold text-forest-900">+40 pts</span>
              </li>
            </ul>
          </div>

          {/* User History */}
          {rewardsData && rewardsData.history.length > 0 && (
            <div className="bg-white p-6 rounded-3xl border border-sage-200 shadow-card space-y-3">
              <h3 className="font-bold text-sm text-forest-950 uppercase tracking-wider flex items-center gap-1.5">
                <History className="w-4 h-4 text-leaf-600" />
                <span>Your Points History</span>
              </h3>
              <div className="space-y-2">
                {rewardsData.history.slice(0, 5).map((item) => (
                  <div key={item.id} className="p-2.5 rounded-xl bg-cream-50 border border-sage-200 text-xs flex items-center justify-between">
                    <div>
                      <p className="font-bold text-charcoal-900">{item.description}</p>
                      <span className="text-[10px] text-charcoal-400">
                        {new Date(item.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <span className="font-bold text-leaf-700">+{item.points} pts</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
