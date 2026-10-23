import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Recycle, Lock, Mail, User as UserIcon, MapPin, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthPage: React.FC = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [locationName, setLocationName] = useState('Campus Dorms');
  const [loading, setLoading] = useState(false);

  const { login, register, demoLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isRegistering) {
        await register({
          email,
          password,
          full_name: fullName,
          location: locationName,
        });
      } else {
        await login(email, password);
      }
      navigate(from, { replace: true });
    } catch {
      // Error is handled via Toast in AuthContext
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSelect = async (role: 'student' | 'repairer' | 'coordinator') => {
    setLoading(true);
    try {
      await demoLogin(role);
      navigate(from, { replace: true });
    } catch {
      // Handled via toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex w-12 h-12 rounded-2xl bg-forest-900 text-leaf-300 items-center justify-center shadow-md mb-3">
          <Recycle className="w-7 h-7 text-leaf-400" />
        </div>
        <h2 className="text-3xl font-extrabold text-forest-950 tracking-tight font-sans">
          {isRegistering ? 'Join CircularLoop' : 'Welcome Back'}
        </h2>
        <p className="mt-1.5 text-xs text-charcoal-600">
          {isRegistering
            ? 'Start giving your unused items another life & earn Circular Points'
            : 'Sign in to manage your listings, exchange requests, and impact'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        {/* Hackathon Quick Demo Access Callout */}
        <div className="mb-6 bg-gradient-to-r from-sage-100 to-cream-200 border border-sage-300 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-1.5 text-xs font-bold text-forest-900 mb-2">
            <Sparkles className="w-4 h-4 text-leaf-600" />
            <span>Hackathon Quick Demo Access (1-Click Login)</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleDemoSelect('student')}
              className="p-2 rounded-xl bg-white border border-sage-300 hover:border-forest-800 text-left transition-colors shadow-xs"
            >
              <div className="text-xs font-bold text-forest-900">Maya</div>
              <div className="text-[10px] text-charcoal-500">Student</div>
            </button>
            <button
              type="button"
              onClick={() => handleDemoSelect('repairer')}
              className="p-2 rounded-xl bg-white border border-sage-300 hover:border-forest-800 text-left transition-colors shadow-xs"
            >
              <div className="text-xs font-bold text-forest-900">Alex</div>
              <div className="text-[10px] text-charcoal-500">Repairer</div>
            </button>
            <button
              type="button"
              onClick={() => handleDemoSelect('coordinator')}
              className="p-2 rounded-xl bg-white border border-sage-300 hover:border-forest-800 text-left transition-colors shadow-xs"
            >
              <div className="text-xs font-bold text-forest-900">Sam</div>
              <div className="text-[10px] text-charcoal-500">Lead</div>
            </button>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white py-8 px-6 sm:px-10 shadow-card border border-sage-200 rounded-3xl">
          {/* Tabs */}
          <div className="flex rounded-xl bg-cream-100 p-1 mb-6 border border-sage-200">
            <button
              type="button"
              onClick={() => setIsRegistering(false)}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                !isRegistering ? 'bg-white text-forest-900 shadow-xs' : 'text-charcoal-600 hover:text-forest-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setIsRegistering(true)}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                isRegistering ? 'bg-white text-forest-900 shadow-xs' : 'text-charcoal-600 hover:text-forest-900'
              }`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegistering && (
              <>
                <div>
                  <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Jordan Lee"
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-sage-300 text-sm focus:outline-none focus:ring-2 focus:ring-forest-800 bg-cream-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1">
                    Campus / Local Neighborhood
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={locationName}
                      onChange={(e) => setLocationName(e.target.value)}
                      placeholder="e.g. North Campus / Dorm 5"
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-sage-300 text-sm focus:outline-none focus:ring-2 focus:ring-forest-800 bg-cream-50"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@campus.edu"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-sage-300 text-sm focus:outline-none focus:ring-2 focus:ring-forest-800 bg-cream-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-sage-300 text-sm focus:outline-none focus:ring-2 focus:ring-forest-800 bg-cream-50"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-forest-900 text-cream-50 font-bold text-sm hover:bg-forest-800 transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>{isRegistering ? 'Create Free Account' : 'Sign In'}</span>
                  <ArrowRight className="w-4 h-4 text-leaf-300" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
