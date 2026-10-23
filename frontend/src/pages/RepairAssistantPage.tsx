import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Wrench, AlertTriangle, CheckCircle2, ShieldAlert, DollarSign,
  Leaf, MapPin, ExternalLink, ArrowRight, Sparkles, HelpCircle
} from 'lucide-react';
import { RepairGuide, RepairProvider } from '../types';
import { api } from '../services/api';

const ISSUE_PRESETS = [
  { category: 'Electronics', problem: 'battery', label: 'Battery draining fast / won\'t charge' },
  { category: 'Electronics', problem: 'screen', label: 'Cracked screen / flickering display' },
  { category: 'Furniture', problem: 'wobbly', label: 'Wobbly legs / stripped screws' },
  { category: 'Home appliances', problem: 'motor', label: 'Blender / vacuum motor jammed or overheating' },
  { category: 'Clothing and accessories', problem: 'zipper', label: 'Broken zipper / separated teeth' },
];

export const RepairAssistantPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('Electronics');
  const [selectedProblem, setSelectedProblem] = useState('battery');
  const [guide, setGuide] = useState<RepairGuide | null>(null);
  const [providers, setProviders] = useState<RepairProvider[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadRepairData() {
      setLoading(true);
      try {
        const [guideData, providerData] = await Promise.all([
          api.getRepairGuide(selectedCategory, selectedProblem),
          api.getRepairProviders(selectedCategory),
        ]);
        setGuide(guideData);
        setProviders(providerData);
      } catch (err) {
        console.error('Error fetching repair guide:', err);
      } finally {
        setLoading(false);
      }
    }
    loadRepairData();
  }, [selectedCategory, selectedProblem]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-forest-900 to-forest-800 rounded-3xl p-8 sm:p-10 text-cream-50 shadow-xl border border-forest-700 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-leaf-500/20 text-leaf-300 border border-leaf-400/30 text-xs font-semibold">
            <Wrench className="w-3.5 h-3.5" />
            <span>Repair Before Replacing Principle</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-sans">
            Repair-First Diagnostic Assistant
          </h1>
          <p className="text-xs sm:text-sm text-sage-200/90 leading-relaxed">
            Over 68% of discarded electronics and furniture can be restored in under 30 minutes with basic tools.
            Diagnose common defects, follow safety checklists, and find campus fix-it workshops.
          </p>
        </div>

        <Link
          to="/create-listing?purpose=Request%20repair"
          className="px-5 py-3 rounded-2xl bg-leaf-500 text-forest-950 hover:bg-leaf-400 font-bold text-xs flex items-center gap-2 transition-colors shrink-0 shadow-sm"
        >
          <span>Post as "Needs Repair"</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Interactive Diagnostic Selector */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-sage-200 shadow-card space-y-6">
        <h2 className="text-base font-bold text-forest-900">
          Step 1: Select Item Category & Symptom
        </h2>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {['Electronics', 'Furniture', 'Home appliances', 'Clothing and accessories', 'General'].map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                if (cat === 'Electronics') setSelectedProblem('battery');
                else if (cat === 'Furniture') setSelectedProblem('wobbly');
                else if (cat === 'Home appliances') setSelectedProblem('motor');
                else if (cat === 'Clothing and accessories') setSelectedProblem('zipper');
                else setSelectedProblem('general');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                selectedCategory === cat
                  ? 'bg-forest-900 text-cream-50 shadow-xs'
                  : 'bg-cream-100 text-charcoal-700 hover:bg-cream-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Common Problem Presets */}
        <div>
          <label className="block text-xs font-bold text-charcoal-500 uppercase tracking-wider mb-2">
            Common Symptoms & Faults:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {ISSUE_PRESETS.filter((p) => p.category === selectedCategory || selectedCategory === 'General').map((preset, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedProblem(preset.problem)}
                className={`p-3 rounded-xl border text-left text-xs font-medium transition-all ${
                  selectedProblem === preset.problem
                    ? 'border-forest-900 bg-sage-50 text-forest-900 font-bold shadow-xs ring-1 ring-forest-900'
                    : 'border-sage-200 bg-white text-charcoal-700 hover:bg-cream-100'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Troubleshooting Checklist & Diagnostics */}
      {guide && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Step-by-Step Instructions */}
          <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-sage-200 shadow-card space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-sage-200">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-leaf-600">
                  {guide.category} Troubleshooting Checklist
                </span>
                <h3 className="text-xl font-bold text-forest-950 mt-0.5">
                  Resolution Guide for {guide.problem_type.toUpperCase()} Faults
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
                  Difficulty: {guide.difficulty}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  guide.diy_suitable ? 'bg-emerald-100 text-emerald-900' : 'bg-rose-100 text-rose-900'
                }`}>
                  {guide.diy_suitable ? 'DIY Friendly' : 'Mentor / Pro Advised'}
                </span>
              </div>
            </div>

            {/* Checklist Steps */}
            <div className="space-y-4">
              {guide.troubleshooting_steps.map((step) => (
                <div
                  key={step.step_number}
                  className="p-4 rounded-2xl bg-cream-50 border border-sage-200 space-y-1.5"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-forest-900 text-leaf-300 font-bold text-xs flex items-center justify-center shrink-0">
                      {step.step_number}
                    </span>
                    <h4 className="font-bold text-sm text-forest-900">{step.title}</h4>
                  </div>
                  <p className="text-xs text-charcoal-700 pl-8 leading-relaxed">
                    {step.instruction}
                  </p>
                  {step.caution && (
                    <div className="ml-8 mt-2 p-2.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 text-xs flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>{step.caution}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Disposal Recommendation */}
            <div className="p-4 rounded-2xl bg-sage-50 border border-sage-200 text-xs text-charcoal-700">
              <span className="font-bold text-forest-900 block mb-1">
                If Unrepairable Next Step:
              </span>
              <p>{guide.disposal_recommendation}</p>
            </div>
          </div>

          {/* Right: Circular Pathways Comparison */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-sage-200 shadow-card space-y-4">
              <h3 className="text-sm font-bold text-forest-900 uppercase tracking-wider">
                Circularity Impact Comparison
              </h3>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                  <div className="font-bold text-emerald-950 flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    <span>Cost Savings</span>
                  </div>
                  <p className="text-emerald-900 mt-1">{guide.estimated_cost_savings}</p>
                </div>

                <div className="p-3 rounded-xl bg-sage-100 border border-sage-300">
                  <div className="font-bold text-forest-950 flex items-center gap-1.5">
                    <Leaf className="w-4 h-4 text-leaf-600" />
                    <span>Environmental Benefit</span>
                  </div>
                  <p className="text-forest-900 mt-1">{guide.environmental_benefit}</p>
                </div>
              </div>
            </div>

            {/* Local Repair Providers / Fix-It Clinics */}
            <div className="bg-white p-6 rounded-3xl border border-sage-200 shadow-card space-y-4">
              <h3 className="text-sm font-bold text-forest-900 uppercase tracking-wider flex items-center justify-between">
                <span>Verified Local Clinics</span>
                <span className="text-[10px] text-leaf-600 font-semibold">Campus & Area</span>
              </h3>

              <div className="space-y-3">
                {providers.slice(0, 3).map((provider) => (
                  <div
                    key={provider.id}
                    className="p-3 rounded-xl bg-cream-50 border border-sage-200 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-charcoal-900">{provider.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                        ★ {provider.rating}
                      </span>
                    </div>
                    <p className="text-charcoal-500 text-[11px] flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-leaf-500" />
                      <span>{provider.address}</span>
                    </p>
                    {provider.phone && (
                      <p className="text-charcoal-600 text-[11px] font-mono">{provider.phone}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
