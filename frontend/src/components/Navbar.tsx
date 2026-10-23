import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Recycle, PlusCircle, Sparkles, Wrench, MapPin, BarChart3,
  Award, User as UserIcon, LogOut, Menu, X, ChevronDown, Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout, demoLogin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Marketplace', path: '/marketplace' },
    { name: 'Smart Match', path: '/smart-matching', icon: Sparkles },
    { name: 'Repair First', path: '/repair-assistant', icon: Wrench },
    { name: 'Map & Nearby', path: '/nearby-map', icon: MapPin },
    { name: 'Impact', path: '/impact', icon: BarChart3 },
    { name: 'Rewards', path: '/rewards', icon: Award },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-cream-50/90 backdrop-blur-md border-b border-sage-200 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-forest-900 flex items-center justify-center text-sage-100 shadow-sm group-hover:bg-forest-800 transition-colors">
              <Recycle className="w-5 h-5 text-leaf-400 group-hover:rotate-45 transition-transform duration-300" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-forest-900 font-sans">
                Circular<span className="text-leaf-600">Loop</span>
              </span>
              <span className="text-[10px] text-charcoal-500 font-medium -mt-1 tracking-wider uppercase">
                Campus & Community
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    active
                      ? 'bg-sage-100 text-forest-900 font-semibold shadow-xs'
                      : 'text-charcoal-700 hover:text-forest-900 hover:bg-cream-200/60'
                  }`}
                >
                  {link.icon && <link.icon className={`w-4 h-4 ${active ? 'text-forest-900' : 'text-leaf-600'}`} />}
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Area */}
          <div className="hidden sm:flex items-center gap-3">
            {/* List an Item Button */}
            <Link
              to="/create-listing"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-forest-900 text-sage-50 text-sm font-medium hover:bg-forest-800 transition-colors shadow-xs"
            >
              <PlusCircle className="w-4 h-4 text-leaf-300" />
              <span>List an Item</span>
            </Link>

            {/* Quick Demo Switcher */}
            <div className="relative">
              <button
                onClick={() => setDemoMenuOpen(!demoMenuOpen)}
                className="px-2.5 py-1.5 rounded-lg border border-sage-300 bg-cream-100 text-xs font-semibold text-charcoal-700 hover:bg-cream-200 transition-colors flex items-center gap-1"
                title="Quick Demo Role Switcher"
              >
                <span className="w-2 h-2 rounded-full bg-leaf-500 animate-pulse"></span>
                <span>Demo Mode</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {demoMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-xl border border-sage-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseLeave={() => setDemoMenuOpen(false)}
                >
                  <div className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-charcoal-400">
                    Switch Demo Persona
                  </div>
                  <button
                    onClick={() => {
                      demoLogin('student');
                      setDemoMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-sage-50 flex items-center justify-between text-charcoal-800"
                  >
                    <div>
                      <div className="font-semibold text-forest-900">Maya Chen</div>
                      <div className="text-[11px] text-charcoal-500">Student (Seeking Laptop & Notes)</div>
                    </div>
                    {user?.email === 'maya.student@circularloop.edu' && <Check className="w-4 h-4 text-leaf-600" />}
                  </button>
                  <button
                    onClick={() => {
                      demoLogin('repairer');
                      setDemoMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-sage-50 flex items-center justify-between text-charcoal-800"
                  >
                    <div>
                      <div className="font-semibold text-forest-900">Alex Thorne</div>
                      <div className="text-[11px] text-charcoal-500">Repair Specialist / Fixer</div>
                    </div>
                    {user?.email === 'alex.repair@circularloop.edu' && <Check className="w-4 h-4 text-leaf-600" />}
                  </button>
                  <button
                    onClick={() => {
                      demoLogin('coordinator');
                      setDemoMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-sage-50 flex items-center justify-between text-charcoal-800"
                  >
                    <div>
                      <div className="font-semibold text-forest-900">Sam Rivera</div>
                      <div className="text-[11px] text-charcoal-500">Campus Sustainability Lead</div>
                    </div>
                    {user?.email === 'sam.coordinator@circularloop.edu' && <Check className="w-4 h-4 text-leaf-600" />}
                  </button>
                </div>
              )}
            </div>

            {/* User Profile / Auth State */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-full border border-sage-200 hover:border-sage-300 bg-cream-50 transition-colors"
                >
                  <img
                    src={user.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80'}
                    alt={user.full_name}
                    className="w-7 h-7 rounded-full object-cover border border-sage-300"
                  />
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-semibold text-forest-900 line-clamp-1 max-w-[90px]">
                      {user.full_name.split(' ')[0]}
                    </span>
                    <span className="text-[10px] text-leaf-600 font-bold -mt-0.5">
                      {user.circular_points} pts
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-charcoal-400" />
                </button>

                {userMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-48 rounded-xl bg-white shadow-xl border border-sage-200 py-1.5 z-50"
                    onMouseLeave={() => setUserMenuOpen(false)}
                  >
                    <div className="px-3 py-2 border-b border-sage-100">
                      <p className="text-xs font-bold text-forest-900">{user.full_name}</p>
                      <p className="text-[11px] text-charcoal-500 truncate">{user.email}</p>
                    </div>
                    <Link
                      to="/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs text-charcoal-700 hover:bg-sage-50 hover:text-forest-900"
                    >
                      <BarChart3 className="w-4 h-4 text-leaf-600" />
                      <span>My Dashboard</span>
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs text-charcoal-700 hover:bg-sage-50 hover:text-forest-900"
                    >
                      <UserIcon className="w-4 h-4 text-leaf-600" />
                      <span>Profile & Settings</span>
                    </Link>
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-700 hover:bg-rose-50 text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/auth"
                className="px-3.5 py-1.5 rounded-lg border border-forest-900 text-forest-900 text-sm font-semibold hover:bg-forest-900 hover:text-white transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex sm:hidden items-center gap-2">
            <Link
              to="/create-listing"
              className="p-1.5 rounded-lg bg-forest-900 text-sage-50"
              aria-label="List an item"
            >
              <PlusCircle className="w-5 h-5 text-leaf-300" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-charcoal-700 hover:bg-cream-200"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-sage-200 bg-cream-50 px-4 pt-2 pb-6 space-y-2 animate-in slide-in-from-top duration-150">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-sage-200">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`p-2.5 rounded-lg text-sm font-medium flex items-center gap-2 ${
                  isActive(link.path)
                    ? 'bg-sage-100 text-forest-900 font-semibold'
                    : 'text-charcoal-700 hover:bg-cream-200'
                }`}
              >
                {link.icon && <link.icon className="w-4 h-4 text-leaf-600" />}
                {link.name}
              </Link>
            ))}
          </div>

          {/* Mobile Demo Persona Buttons */}
          <div className="pt-2">
            <span className="text-[11px] font-bold text-charcoal-400 uppercase tracking-wider block mb-1.5">
              Quick Demo Personas:
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => {
                  demoLogin('student');
                  setMobileMenuOpen(false);
                }}
                className="text-xs px-2.5 py-1 rounded-md bg-sage-100 text-forest-900 font-medium"
              >
                Maya (Student)
              </button>
              <button
                onClick={() => {
                  demoLogin('repairer');
                  setMobileMenuOpen(false);
                }}
                className="text-xs px-2.5 py-1 rounded-md bg-sage-100 text-forest-900 font-medium"
              >
                Alex (Repairer)
              </button>
              <button
                onClick={() => {
                  demoLogin('coordinator');
                  setMobileMenuOpen(false);
                }}
                className="text-xs px-2.5 py-1 rounded-md bg-sage-100 text-forest-900 font-medium"
              >
                Sam (Lead)
              </button>
            </div>
          </div>

          {/* Mobile Auth Button */}
          <div className="pt-3 border-t border-sage-200">
            {isAuthenticated && user ? (
              <div className="flex items-center justify-between">
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-semibold text-forest-900"
                >
                  Dashboard ({user.circular_points} pts)
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs text-rose-700 font-medium"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-2 rounded-lg bg-forest-900 text-white font-medium text-sm"
              >
                Sign In / Register
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
