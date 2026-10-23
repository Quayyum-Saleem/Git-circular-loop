import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, Legend
} from 'recharts';
import { Leaf, Recycle, Wrench, Heart, ShieldCheck, Info, BarChart3 } from 'lucide-react';
import { ImpactAnalytics } from '../types';
import { api } from '../services/api';

export const ImpactPage: React.FC = () => {
  const [data, setData] = useState<ImpactAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadImpact() {
      try {
        const res = await api.getImpactAnalytics();
        setData(res);
      } catch (err) {
        console.error('Failed to load impact analytics:', err);
      } finally {
        setLoading(false);
      }
    }
    loadImpact();
  }, []);

  if (loading || !data) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center text-xs text-charcoal-500">
        Loading environmental impact analytics...
      </div>
    );
  }

  const { summary, category_breakdown, monthly_trends, methodology } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-forest-950 via-forest-900 to-leaf-600 rounded-3xl p-8 sm:p-10 text-cream-50 shadow-xl border border-forest-800 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-leaf-400/20 text-leaf-200 border border-leaf-300/30 text-xs font-semibold">
          <Leaf className="w-3.5 h-3.5 text-leaf-300" />
          <span>Verified Circular Metrics & Life-Cycle Analysis</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-sans">
          Environmental Impact Analytics
        </h1>
        <p className="text-xs sm:text-sm text-sage-100 max-w-2xl leading-relaxed">
          Tracking tangible greenhouse gas abatement and material conservation achieved by student reuse, community repair, and ethical recycling.
        </p>
      </div>

      {/* Primary 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-sage-200 shadow-card space-y-2">
          <div className="flex items-center justify-between text-leaf-600">
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500">
              Landfill Waste Diverted
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Recycle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-forest-950">
            {summary.total_waste_diverted_kg} <span className="text-base font-normal text-charcoal-500">kg</span>
          </div>
          <p className="text-[11px] text-charcoal-600">
            Solid goods retained in circulation instead of disposal.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-sage-200 shadow-card space-y-2">
          <div className="flex items-center justify-between text-leaf-600">
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500">
              Emissions Avoided
            </span>
            <div className="w-8 h-8 rounded-xl bg-leaf-100 text-leaf-800 flex items-center justify-center">
              <Leaf className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-forest-950">
            {summary.total_co2_avoided_kg} <span className="text-base font-normal text-charcoal-500">kg CO2e</span>
          </div>
          <p className="text-[11px] text-charcoal-600">
            Equivalent to ~{(summary.total_co2_avoided_kg * 4.2).toFixed(0)} km of gasoline driving.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-sage-200 shadow-card space-y-2">
          <div className="flex items-center justify-between text-leaf-600">
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500">
              Completed Hand-offs
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-forest-950">
            {summary.total_completed_exchanges}
          </div>
          <p className="text-[11px] text-charcoal-600">
            {summary.total_reused} reused • {summary.total_repaired} repaired • {summary.total_donated} donated.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-sage-200 shadow-card space-y-2">
          <div className="flex items-center justify-between text-leaf-600">
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500">
              Community Participants
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center">
              <Heart className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-forest-950">
            {summary.active_participants_count}
          </div>
          <p className="text-[11px] text-charcoal-600">
            Students and mentors actively trading & repairing.
          </p>
        </div>
      </div>

      {/* Interactive Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Trend Area Chart */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-sage-200 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-forest-950">
              Avoided Carbon Emissions Trend (kg CO2e)
            </h3>
            <span className="text-xs text-charcoal-500 font-medium">Monthly Campus Trajectory</span>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthly_trends} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCo2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F8A5B" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#4F8A5B" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E6E2D4" />
                <XAxis dataKey="month" stroke="#677D69" fontSize={12} />
                <YAxis stroke="#677D69" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#F8F8F2', borderRadius: '12px', border: '1px solid #DDEBDD' }}
                />
                <Area type="monotone" dataKey="co2_avoided_kg" name="Avoided CO2 (kg)" stroke="#174B38" strokeWidth={2} fillOpacity={1} fill="url(#colorCo2)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Bar Chart */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-sage-200 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-forest-950">
              Diverted Waste by Category (kg)
            </h3>
            <span className="text-xs text-charcoal-500 font-medium">Material Balance</span>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={category_breakdown} margin={{ top: 10, right: 10, left: -10, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E6E2D4" />
                <XAxis dataKey="category" stroke="#677D69" fontSize={10} angle={-20} textAnchor="end" />
                <YAxis stroke="#677D69" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#F8F8F2', borderRadius: '12px', border: '1px solid #DDEBDD' }}
                />
                <Bar dataKey="waste_diverted_kg" name="Diverted Waste (kg)" fill="#1F5E47" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Impact Methodology & Assumptions Section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-sage-200 shadow-card space-y-6">
        <div className="flex items-center gap-2 pb-3 border-b border-sage-200">
          <ShieldCheck className="w-5 h-5 text-leaf-600" />
          <h2 className="text-base font-bold text-forest-900">
            Impact Calculation Methodology & Factor Standards
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs text-charcoal-700">
          <div className="space-y-3">
            <h4 className="font-bold text-forest-950 text-sm">
              Standard: {methodology.framework}
            </h4>
            <p className="leading-relaxed">
              {methodology.description}
            </p>

            <h5 className="font-bold text-charcoal-900 mt-3">Pathway Multipliers:</h5>
            <ul className="space-y-1.5 list-disc pl-4 text-charcoal-600">
              {Object.entries(methodology.pathway_hierarchy).map(([k, v]) => (
                <li key={k}>
                  <strong>{k}:</strong> {v}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-forest-950 text-sm">
              Category Emission & Weight Factors:
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px] border border-sage-200 rounded-xl overflow-hidden">
                <thead className="bg-cream-100 font-bold text-forest-900 border-b border-sage-200">
                  <tr>
                    <th className="p-2">Category</th>
                    <th className="p-2">Avg Weight (kg)</th>
                    <th className="p-2">Embodied Factor (kg CO2e/kg)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sage-100">
                  {methodology.category_assumptions.map((cat, idx) => (
                    <tr key={idx} className="hover:bg-cream-50">
                      <td className="p-2 font-medium">{cat.category}</td>
                      <td className="p-2">{cat.avg_weight_kg} kg</td>
                      <td className="p-2">{cat.embodied_co2_factor} kg CO2e</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 text-[11px] mt-2">
              <strong>Notice:</strong> {methodology.disclaimer}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
