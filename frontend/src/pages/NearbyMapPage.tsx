import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Wrench, Package, List, Map as MapIcon, ExternalLink, ShieldCheck } from 'lucide-react';
import { ItemListing, RepairProvider } from '../types';
import { api } from '../services/api';
import { Link } from 'react-router-dom';

// Custom Map Marker Icons using Leaflet DivIcon with clean Tailwind styles
const createCustomIcon = (bgColor: string, iconHtml: string) => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="background-color: ${bgColor}; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2); border: 2px solid white; color: white;">
        ${iconHtml}
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -34],
  });
};

const itemIcon = createCustomIcon(
  '#174B38',
  '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16.5 9.4 7.55 4.24a1.78 1.78 0 0 0-2.5 1.55v12.42a1.78 1.78 0 0 0 2.5 1.55L16.5 14.6a1.78 1.78 0 0 0 0-3.2z"/></svg>'
);

const repairIcon = createCustomIcon(
  '#D97706',
  '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>'
);

export const NearbyMapPage: React.FC = () => {
  const [items, setItems] = useState<ItemListing[]>([]);
  const [providers, setProviders] = useState<RepairProvider[]>([]);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [loading, setLoading] = useState(true);
  const [mapError, setMapError] = useState(false);

  // Default campus center coordinates (MIT / Cambridge / Boston area standard coordinates from seed)
  const defaultCenter: [number, number] = [42.3601, -71.0942];

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [listingsData, providersData] = await Promise.all([
          api.getListings({ limit: 30 as any }),
          api.getRepairProviders(),
        ]);
        setItems(listingsData.filter((i) => i.latitude && i.longitude));
        setProviders(providersData);
      } catch (err) {
        console.error('Failed to load map data:', err);
        setMapError(true);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-forest-950 font-sans">
            Nearby Circular Opportunities
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-600 mt-1">
            Explore items available for low-carbon campus pickup and community repair clinics.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2 bg-cream-100 p-1 rounded-xl border border-sage-200 self-start sm:self-auto">
          <button
            onClick={() => setViewMode('map')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
              viewMode === 'map' ? 'bg-forest-900 text-white shadow-xs' : 'text-charcoal-700 hover:bg-cream-200'
            }`}
          >
            <MapIcon className="w-4 h-4" />
            <span>Map View</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
              viewMode === 'list' ? 'bg-forest-900 text-white shadow-xs' : 'text-charcoal-700 hover:bg-cream-200'
            }`}
          >
            <List className="w-4 h-4" />
            <span>List Fallback</span>
          </button>
        </div>
      </div>

      {/* Map Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs bg-white p-3.5 rounded-2xl border border-sage-200 shadow-card">
        <span className="font-bold text-charcoal-500 uppercase tracking-wider text-[11px]">
          Map Legend:
        </span>
        <div className="flex items-center gap-1.5">
          <div className="w-3.5 h-3.5 rounded-full bg-forest-900"></div>
          <span className="font-medium text-charcoal-800">Circular Items for Handoff</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3.5 h-3.5 rounded-full bg-amber-600"></div>
          <span className="font-medium text-charcoal-800">Verified Repair Clinics</span>
        </div>
        <div className="ml-auto text-[11px] text-charcoal-500 flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-leaf-600" />
          <span>Approximate landmark coordinates only (Privacy Preserved)</span>
        </div>
      </div>

      {/* Map Container View */}
      {viewMode === 'map' && !mapError ? (
        <div className="w-full h-[550px] rounded-3xl overflow-hidden border border-sage-200 shadow-xl relative bg-cream-200">
          <MapContainer
            center={defaultCenter}
            zoom={15}
            scrollWheelZoom={false}
            className="w-full h-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Item Markers */}
            {items.map((item) => (
              <Marker
                key={`item-${item.id}`}
                position={[item.latitude!, item.longitude!]}
                icon={itemIcon}
              >
                <Popup>
                  <div className="p-1 space-y-1.5 max-w-[220px]">
                    <img
                      src={item.image_url?.startsWith('/uploads') ? `http://localhost:8000${item.image_url}` : item.image_url}
                      alt={item.title}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <h4 className="font-bold text-xs text-charcoal-900 line-clamp-1">{item.title}</h4>
                    <p className="text-[11px] text-leaf-600 font-semibold">{item.category} • {item.purpose}</p>
                    <p className="text-[11px] text-charcoal-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-leaf-500" />
                      <span>{item.location_name}</span>
                    </p>
                    <Link
                      to={`/items/${item.id}`}
                      className="block text-center mt-2 px-2.5 py-1 rounded-md bg-forest-900 text-white text-[11px] font-bold"
                    >
                      View Item
                    </Link>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* Repair Provider Markers */}
            {providers.map((p) => (
              <Marker
                key={`provider-${p.id}`}
                position={[p.latitude, p.longitude]}
                icon={repairIcon}
              >
                <Popup>
                  <div className="p-1 space-y-1 max-w-[220px]">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs text-charcoal-900">{p.name}</h4>
                      <span className="text-[10px] px-1 rounded bg-amber-100 text-amber-900 font-bold">
                        ★ {p.rating}
                      </span>
                    </div>
                    <p className="text-[11px] text-charcoal-600 font-medium">{p.category}</p>
                    <p className="text-[10px] text-charcoal-500">{p.address}</p>
                    {p.description && (
                      <p className="text-[10px] text-charcoal-600 mt-1 italic">{p.description}</p>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      ) : (
        /* Graceful List View Fallback */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Nearby Items List */}
          <div className="space-y-4">
            <h3 className="font-bold text-base text-forest-900 flex items-center gap-2">
              <Package className="w-5 h-5 text-leaf-600" />
              <span>Campus Items Available for Handoff</span>
            </h3>
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-4 rounded-2xl border border-sage-200 shadow-card flex items-center gap-3"
                >
                  <img
                    src={item.image_url?.startsWith('/uploads') ? `http://localhost:8000${item.image_url}` : item.image_url}
                    alt={item.title}
                    className="w-16 h-16 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <Link to={`/items/${item.id}`} className="font-bold text-sm text-charcoal-900 truncate block hover:underline">
                      {item.title}
                    </Link>
                    <p className="text-xs text-leaf-600 font-semibold">{item.category}</p>
                    <p className="text-[11px] text-charcoal-500 mt-0.5 flex items-center gap-1 truncate">
                      <MapPin className="w-3 h-3 text-leaf-500 shrink-0" />
                      <span>{item.location_name}</span>
                    </p>
                  </div>
                  <Link
                    to={`/items/${item.id}`}
                    className="px-3 py-1.5 rounded-lg bg-forest-900 text-white text-xs font-bold shrink-0"
                  >
                    View
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Repair Clinics List */}
          <div className="space-y-4">
            <h3 className="font-bold text-base text-forest-900 flex items-center gap-2">
              <Wrench className="w-5 h-5 text-amber-600" />
              <span>Local Repair Hubs & Clinics</span>
            </h3>
            <div className="space-y-3">
              {providers.map((p) => (
                <div
                  key={p.id}
                  className="bg-white p-4 rounded-2xl border border-sage-200 shadow-card space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-forest-900">{p.name}</h4>
                    <span className="text-xs px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-bold">
                      ★ {p.rating}
                    </span>
                  </div>
                  <p className="text-xs text-leaf-700 font-medium">{p.category}</p>
                  <p className="text-xs text-charcoal-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-leaf-500" />
                    <span>{p.address}</span>
                  </p>
                  {p.description && (
                    <p className="text-xs text-charcoal-600 mt-1">{p.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
