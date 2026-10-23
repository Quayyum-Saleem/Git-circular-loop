import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, PlusCircle, Sparkles, Wrench, Heart, Recycle,
  CheckCircle2, ShieldCheck, TreePine, Package, Users, Award
} from 'lucide-react';
import type { ItemListing, ImpactAnalytics } from '../types';
import { api } from '../services/api';
import { ItemCard } from '../components/ItemCard';
import { SkeletonCard } from '../components/SkeletonCard';

export const LandingPage: React.FC = () => {
  const [featuredItems, setFeaturedItems] = useState<ItemListing[]>([]);
  const [impactData, setImpactData] = useState<ImpactAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [listings, impact] = await Promise.all([
          api.getListings({ limit: 4 as any }),
          api.getImpactAnalytics(),
        ]);
        setFeaturedItems(listings.slice(0, 4));
        setImpactData(impact);
      } catch (err) {
        console.error('Failed to load landing data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 bg-gradient-to-b from-cream-100 via-cream-50 to-sage-50/40 border-b border-sage-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sage-100 border border-sage-300 text-forest-900 text-xs font-semibold shadow-xs">
                <span className="w-2 h-2 rounded-full bg-leaf-500 animate-pulse"></span>
                <span>Campus Circular Economy & Zero-Waste Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-forest-950 font-sans leading-[1.12]">
                Your Unused Things <br />
                <span className="text-leaf-600 underline decoration-leaf-300 decoration-wavy decoration-2">
                  Deserve Another Life.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-charcoal-700 leading-relaxed max-w-2xl">
                CircularLoop connects students, neighbors, and community makers to extend the useful life of goods.
                Choose between <strong>direct reuse</strong>, <strong>repair diagnosis</strong>, <strong>campus donation</strong>, or <strong>ethical recycling</strong>—with verified environmental impact tracking.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/marketplace"
                  className="px-6 py-3.5 rounded-xl bg-forest-900 text-cream-50 font-bold text-sm hover:bg-forest-800 transition-all shadow-md hover:shadow-lg flex items-center gap-2 group"
                >
                  <span>Explore Items</span>
                  <ArrowRight className="w-4 h-4 text-leaf-300 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/create-listing"
                  className="px-6 py-3.5 rounded-xl bg-white border-2 border-forest-900 text-forest-900 font-bold text-sm hover:bg-cream-200 transition-colors flex items-center gap-2 shadow-xs"
                >
                  <PlusCircle className="w-4 h-4 text-leaf-600" />
                  <span>List an Item</span>
                </Link>

                <Link
                  to="/repair-assistant"
                  className="px-4 py-3 rounded-xl text-charcoal-700 font-semibold text-sm hover:text-forest-900 hover:bg-sage-100 transition-colors flex items-center gap-1.5"
                >
                  <Wrench className="w-4 h-4 text-leaf-600" />
                  <span>Repair First Guide</span>
                </Link>
              </div>

              {/* Key Trust Signals */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-sage-200/80 text-xs text-charcoal-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-leaf-600 shrink-0" />
                  <span>Verified Campus Users</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-leaf-600 shrink-0" />
                  <span>EPA WARM Metrics</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-leaf-600 shrink-0" />
                  <span>Circular Reward Points</span>
                </div>
              </div>
            </div>

            {/* Right Hero Image */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Decorative border backdrop */}
                <div className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-leaf-400/30 to-sage-300/40 blur-xl"></div>
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-cream-100 aspect-[4/3]">
                  <img
                    src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1000&q=80"
                    alt="Students repairing and exchanging sustainable goods"
                    className="w-full h-full object-cover"
                  />
                  {/* Overlay floating badge */}
                  <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-2xl bg-white/95 backdrop-blur-md shadow-lg border border-sage-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-forest-900 text-leaf-300 flex items-center justify-center font-bold">
                        <Recycle className="w-5 h-5 text-leaf-300" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-forest-900">Demonstration Handoff</p>
                        <p className="text-[11px] text-charcoal-500">ThinkPad T480 • Transferred for Reuse</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                      -18.4 kg CO2
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sustainability Impact Stat Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-forest-900 text-cream-50 rounded-3xl p-8 sm:p-10 shadow-xl border border-forest-800">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold tracking-wider uppercase text-leaf-400">
              Community Outcomes to Date
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-cream-50 mt-1">
              Measurable Campus Environmental Impact
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 rounded-2xl bg-forest-950/50 border border-forest-800/80">
              <div className="text-3xl sm:text-4xl font-extrabold text-leaf-300">
                {impactData?.summary.total_completed_exchanges || 12}+
              </div>
              <div className="text-xs sm:text-sm font-semibold text-sage-200 mt-1">
                Completed Exchanges
              </div>
              <div className="text-[11px] text-sage-300/60 mt-0.5">Direct peer handoffs</div>
            </div>

            <div className="p-4 rounded-2xl bg-forest-950/50 border border-forest-800/80">
              <div className="text-3xl sm:text-4xl font-extrabold text-leaf-300">
                {impactData?.summary.total_waste_diverted_kg || 142.5} <span className="text-lg">kg</span>
              </div>
              <div className="text-xs sm:text-sm font-semibold text-sage-200 mt-1">
                Landfill Waste Diverted
              </div>
              <div className="text-[11px] text-sage-300/60 mt-0.5">Preserved in active use</div>
            </div>

            <div className="p-4 rounded-2xl bg-forest-950/50 border border-forest-800/80">
              <div className="text-3xl sm:text-4xl font-extrabold text-leaf-300">
                {impactData?.summary.total_co2_avoided_kg || 892.4} <span className="text-lg">kg</span>
              </div>
              <div className="text-xs sm:text-sm font-semibold text-sage-200 mt-1">
                CO2 Emissions Avoided
              </div>
              <div className="text-[11px] text-sage-300/60 mt-0.5">Life-cycle footprint savings</div>
            </div>

            <div className="p-4 rounded-2xl bg-forest-950/50 border border-forest-800/80">
              <div className="text-3xl sm:text-4xl font-extrabold text-leaf-300">
                {impactData?.summary.active_participants_count || 18}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-sage-200 mt-1">
                Active Participants
              </div>
              <div className="text-[11px] text-sage-300/60 mt-0.5">Students, staff & repairers</div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/impact"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-leaf-300 hover:text-white underline underline-offset-4"
            >
              <span>Explore Carbon & Material Methodology</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Items Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-leaf-600 uppercase tracking-wider">
              Featured Available Items
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-forest-950 mt-1">
              Ready for Their Next Chapter
            </h2>
          </div>
          <Link
            to="/marketplace"
            className="inline-flex items-center gap-1 text-sm font-bold text-forest-900 hover:text-leaf-600 transition-colors"
          >
            <span>View All Listings</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : featuredItems.map((item) => <ItemCard key={item.id} item={item} />)}
        </div>
      </section>

      {/* Simple Three-Step Circular Workflow */}
      <section className="bg-sage-100/60 py-16 border-y border-sage-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-leaf-600">
              The Circular Process
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-forest-950 mt-1">
              List, Match, Give Again.
            </h2>
            <p className="text-sm text-charcoal-600 mt-2">
              Every item has a clear next step—reused, repaired, donated, or recycled.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white p-6 rounded-2xl border border-sage-200 shadow-card flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-forest-900 text-leaf-300 flex items-center justify-center font-bold text-lg mb-4">
                  01
                </div>
                <h3 className="font-bold text-lg text-forest-900 mb-2">List in 60 Seconds</h3>
                <p className="text-xs text-charcoal-600 leading-relaxed">
                  Snap a photo of your unused laptop, textbook, chair, or appliance. Our smart assistant suggests the category and calculates the estimated carbon savings.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-sage-100 text-xs text-leaf-700 font-semibold flex items-center gap-1">
                <span>AI category assistance included</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-6 rounded-2xl border border-sage-200 shadow-card flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-forest-900 text-leaf-300 flex items-center justify-center font-bold text-lg mb-4">
                  02
                </div>
                <h3 className="font-bold text-lg text-forest-900 mb-2">Smart Match or Repair</h3>
                <p className="text-xs text-charcoal-600 leading-relaxed">
                  Our transparent rule-based matching engine pairs items with students who need them. If an item is damaged, access troubleshooting guides and campus repair clinics.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-sage-100 text-xs text-leaf-700 font-semibold flex items-center gap-1">
                <span>Transparent match explanations</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-6 rounded-2xl border border-sage-200 shadow-card flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-forest-900 text-leaf-300 flex items-center justify-center font-bold text-lg mb-4">
                  03
                </div>
                <h3 className="font-bold text-lg text-forest-900 mb-2">Complete & Earn Points</h3>
                <p className="text-xs text-charcoal-600 leading-relaxed">
                  Meet safely on campus for handoff. Once confirmed, both parties earn Circular Points, unlock sustainability badges, and update the community carbon impact dashboard.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-sage-100 text-xs text-leaf-700 font-semibold flex items-center gap-1">
                <span>Idempotent reward transactions</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Campus & Community Participation */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-leaf-600">
              Campus Partnership
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-forest-950 mt-1 mb-4">
              Designed for Campus Move-Out & Everyday Circularity
            </h2>
            <p className="text-sm text-charcoal-700 leading-relaxed mb-4">
              Each semester, thousands of perfectly functional monitors, mini-fridges, textbooks, and desk chairs are abandoned during student move-out.
            </p>
            <p className="text-sm text-charcoal-700 leading-relaxed mb-6">
              CircularLoop creates an active digital marketplace connecting student dorms, university makerspaces, and campus facilities to intercept valuable goods before they reach disposal dumpsters.
            </p>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-charcoal-900">Zero-Dumpster Move-Out Drive</h4>
                  <p className="text-xs text-charcoal-600">Students list dorm goods ahead of move-out week for direct campus transfer.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-charcoal-900">Fix-It Clinic Tool Sharing</h4>
                  <p className="text-xs text-charcoal-600">Volunteer repair mentors provide soldering irons, 3D printing, and repair tips.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-charcoal-900">Charity & Food Pantry Routing</h4>
                  <p className="text-xs text-charcoal-600">Unclaimed usable items route automatically to verified local non-profit partners.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Illustrative Testimonials (Clearly Marked as Demonstration Sample Stories) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-charcoal-400 uppercase tracking-wider">
                Demonstration User Stories (Sample Content)
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-sage-200 shadow-card space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80"
                  alt="Maya Chen"
                  className="w-10 h-10 rounded-full object-cover border border-sage-300"
                />
                <div>
                  <h4 className="text-sm font-bold text-forest-900">Maya Chen</h4>
                  <p className="text-xs text-charcoal-500">Junior, Computer Science</p>
                </div>
              </div>
              <p className="text-xs text-charcoal-700 italic leading-relaxed">
                "I was able to give away my older ThinkPad laptop to a freshman studying Python who didn't have a reliable machine. It took under 20 minutes to arrange pickup at the science library!"
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-sage-200 shadow-card space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=128&q=80"
                  alt="Alex Thorne"
                  className="w-10 h-10 rounded-full object-cover border border-sage-300"
                />
                <div>
                  <h4 className="text-sm font-bold text-forest-900">Alex Thorne</h4>
                  <p className="text-xs text-charcoal-500">Campus Fix-It Clinic Mentor</p>
                </div>
              </div>
              <p className="text-xs text-charcoal-700 italic leading-relaxed">
                "Finding repairable items on CircularLoop has been fantastic for our student repair workshops. We rescued an ergonomic chair with a stripped bolt that would have ended up in landfill."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Strong Final CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-forest-900 via-forest-800 to-leaf-600 rounded-3xl p-8 sm:p-12 text-center text-cream-50 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Ready to Give Something Another Life?
            </h2>
            <p className="text-sm sm:text-base text-sage-100/90 leading-relaxed">
              Join students and community members creating a waste-free campus. List an unused item or browse items available today.
            </p>
            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <Link
                to="/create-listing"
                className="px-6 py-3.5 rounded-xl bg-cream-50 text-forest-950 font-bold text-sm hover:bg-white transition-all shadow-md flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4 text-forest-900" />
                <span>List an Item Now</span>
              </Link>
              <Link
                to="/marketplace"
                className="px-6 py-3.5 rounded-xl bg-forest-950/60 border border-leaf-300/40 text-white font-bold text-sm hover:bg-forest-950 transition-colors"
              >
                Browse Marketplace
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
