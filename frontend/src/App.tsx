import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { MarketplacePage } from './pages/MarketplacePage';
import { ItemDetailPage } from './pages/ItemDetailPage';
import { CreateListingPage } from './pages/CreateListingPage';
import { SmartMatchingPage } from './pages/SmartMatchingPage';
import { RepairAssistantPage } from './pages/RepairAssistantPage';
import { NearbyMapPage } from './pages/NearbyMapPage';
import { ImpactPage } from './pages/ImpactPage';
import { RewardsPage } from './pages/RewardsPage';
import { ProfilePage } from './pages/ProfilePage';

export function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <div className="min-h-screen flex flex-col bg-[#F8F8F2] text-[#202821]">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/marketplace" element={<MarketplacePage />} />
                <Route path="/items/:id" element={<ItemDetailPage />} />
                <Route path="/create-listing" element={<CreateListingPage />} />
                <Route path="/smart-matching" element={<SmartMatchingPage />} />
                <Route path="/repair-assistant" element={<RepairAssistantPage />} />
                <Route path="/nearby-map" element={<NearbyMapPage />} />
                <Route path="/impact" element={<ImpactPage />} />
                <Route path="/rewards" element={<RewardsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
