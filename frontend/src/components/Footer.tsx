import React from 'react';
import { Link } from 'react-router-dom';
import { Recycle, Heart, ShieldCheck, ExternalLink, Leaf } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-forest-950 text-sage-100 border-t border-forest-900 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-leaf-600 flex items-center justify-center text-white">
                <Recycle className="w-5 h-5 text-cream-50" />
              </div>
              <span className="text-xl font-bold tracking-tight text-cream-50">
                Circular<span className="text-leaf-400">Loop</span>
              </span>
            </div>
            <p className="text-sm text-sage-200/80 leading-relaxed">
              "Give Every Product Another Life."
            </p>
            <p className="text-xs text-sage-300/70">
              Extending product life-cycles through student reuse, community repair, responsible donation, and ethical recycling.
            </p>
          </div>

          {/* Pathways Col */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-leaf-400 mb-3">
              Circular Pathways
            </h4>
            <ul className="space-y-2 text-sm text-sage-200/90">
              <li>
                <Link to="/marketplace?purpose=Give%20away" className="hover:text-white transition-colors">
                  Direct Reuse & Transfer
                </Link>
              </li>
              <li>
                <Link to="/repair-assistant" className="hover:text-white transition-colors">
                  Repair-First Diagnostics
                </Link>
              </li>
              <li>
                <Link to="/marketplace?purpose=Donate" className="hover:text-white transition-colors">
                  Campus Donation Drives
                </Link>
              </li>
              <li>
                <Link to="/marketplace?purpose=Responsible%20recycling" className="hover:text-white transition-colors">
                  Responsible E-Waste Recycling
                </Link>
              </li>
            </ul>
          </div>

          {/* Tools & Resources */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-leaf-400 mb-3">
              Tools & Verification
            </h4>
            <ul className="space-y-2 text-sm text-sage-200/90">
              <li>
                <Link to="/smart-matching" className="hover:text-white transition-colors">
                  AI Matching Engine
                </Link>
              </li>
              <li>
                <Link to="/impact" className="hover:text-white transition-colors">
                  Carbon Accounting Methodology
                </Link>
              </li>
              <li>
                <Link to="/nearby-map" className="hover:text-white transition-colors">
                  Local Fix-It Clinics Map
                </Link>
              </li>
              <li>
                <Link to="/rewards" className="hover:text-white transition-colors">
                  Circular Points & Badges
                </Link>
              </li>
            </ul>
          </div>

          {/* Sustainability Notice */}
          <div className="bg-forest-900/60 p-4 rounded-xl border border-forest-800">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-leaf-300 mb-2">
              <Leaf className="w-4 h-4" />
              <span>Demonstration Guarantee</span>
            </div>
            <p className="text-xs text-sage-200/80 leading-relaxed">
              CircularLoop calculations are based on EPA WARM and DEFRA circular coefficients. Demonstration data is clearly designated from verified campus records.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-forest-900/80 flex flex-col sm:flex-row items-center justify-between text-xs text-sage-300/60 gap-4">
          <p>© {new Date().getFullYear()} CircularLoop. Built for University & Community Zero-Waste.</p>
          <div className="flex items-center gap-6">
            <span>Privacy-Preserving Geolocation</span>
            <span>Zero E-Waste Target</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
