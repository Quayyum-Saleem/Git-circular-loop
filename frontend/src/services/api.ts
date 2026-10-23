import {
  User, ItemListing, ExchangeRequest, MatchRecommendation,
  RepairGuide, RepairProvider, ImpactAnalytics, UserRewards,
  LeaderboardEntry, AIClassificationResult
} from '../types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('circularloop_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorDetail = 'Network request failed';
    try {
      const errJson = await response.json();
      errorDetail = errJson.detail || errJson.message || JSON.stringify(errJson);
    } catch {
      errorDetail = `Error ${response.status}: ${response.statusText}`;
    }
    throw new Error(errorDetail);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export const api = {
  // Auth
  register: (data: { email: string; password: string; full_name: string; location?: string }) =>
    request<{ access_token: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: (data: { email: string; password: string }) =>
    request<{ access_token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  demoLogin: (role: 'student' | 'repairer' | 'coordinator') =>
    request<{ access_token: string; user: User }>('/auth/demo-login', {
      method: 'POST',
      body: JSON.stringify({ role }),
    }),

  getCurrentUser: () => request<User>('/auth/me'),

  // Listings
  getListings: (params: {
    search?: string;
    category?: string;
    condition?: string;
    purpose?: string;
    sort_by?: string;
    user_lat?: number;
    user_lon?: number;
    limit?: number;
  } = {}) => {
    const searchParams = new URLSearchParams();
    if (params.search) searchParams.append('search', params.search);
    if (params.category && params.category !== 'All') searchParams.append('category', params.category);
    if (params.condition && params.condition !== 'All') searchParams.append('condition', params.condition);
    if (params.purpose && params.purpose !== 'All') searchParams.append('purpose', params.purpose);
    if (params.sort_by) searchParams.append('sort_by', params.sort_by);
    if (params.user_lat) searchParams.append('user_lat', params.user_lat.toString());
    if (params.user_lon) searchParams.append('user_lon', params.user_lon.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());

    const qs = searchParams.toString();
    return request<ItemListing[]>(`/listings${qs ? `?${qs}` : ''}`);
  },

  getListing: (id: number) => request<ItemListing>(`/listings/${id}`),

  getMyListings: () => request<ItemListing[]>('/listings/my/listings'),

  getMyFavourites: () => request<ItemListing[]>('/listings/my/favourites'),

  createListing: (data: Partial<ItemListing>) =>
    request<ItemListing>('/listings', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateListing: (id: number, data: Partial<ItemListing>) =>
    request<ItemListing>(`/listings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteListing: (id: number) =>
    request<void>(`/listings/${id}`, {
      method: 'DELETE',
    }),

  toggleFavourite: (id: number) =>
    request<{ favourited: boolean; message: string }>(`/listings/${id}/favourite`, {
      method: 'POST',
    }),

  uploadImage: async (file: File): Promise<{ url: string; filename: string }> => {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('circularloop_token');
    const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

    const response = await fetch(`${API_BASE}/listings/upload-image`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      let errDetail = 'Image upload failed';
      try {
        const errJson = await response.json();
        errDetail = errJson.detail || errDetail;
      } catch {}
      throw new Error(errDetail);
    }

    return response.json();
  },

  // Exchanges
  createExchangeRequest: (listing_id: number, message: string) =>
    request<ExchangeRequest>('/exchanges/requests', {
      method: 'POST',
      body: JSON.stringify({ listing_id, message }),
    }),

  getIncomingRequests: () => request<ExchangeRequest[]>('/exchanges/requests/incoming'),

  getOutgoingRequests: () => request<ExchangeRequest[]>('/exchanges/requests/outgoing'),

  updateRequestStatus: (id: number, status: 'Accepted' | 'Rejected' | 'Cancelled') =>
    request<ExchangeRequest>(`/exchanges/requests/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),

  completeExchange: (data: { listing_id: number; exchange_request_id?: number; exchange_type?: string }) =>
    request<{ id: number; listing_id: number; estimated_weight_kg: number; estimated_co2_kg: number }>(
      '/exchanges/complete',
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    ),

  // Smart Matching
  getRecommendations: (params: {
    category?: string;
    purpose?: string;
    query?: string;
    user_lat?: number;
    user_lon?: number;
  } = {}) => {
    const searchParams = new URLSearchParams();
    if (params.category && params.category !== 'All') searchParams.append('category', params.category);
    if (params.purpose && params.purpose !== 'All') searchParams.append('purpose', params.purpose);
    if (params.query) searchParams.append('query', params.query);
    if (params.user_lat) searchParams.append('user_lat', params.user_lat.toString());
    if (params.user_lon) searchParams.append('user_lon', params.user_lon.toString());

    const qs = searchParams.toString();
    return request<MatchRecommendation[]>(`/matching/recommendations${qs ? `?${qs}` : ''}`);
  },

  // Repair
  getRepairGuide: (category: string, problemType: string = 'general') =>
    request<RepairGuide>(`/repair/guide?category=${encodeURIComponent(category)}&problem_type=${encodeURIComponent(problemType)}`),

  getRepairProviders: (category?: string, lat?: number, lon?: number) => {
    const searchParams = new URLSearchParams();
    if (category && category !== 'All') searchParams.append('category', category);
    if (lat) searchParams.append('user_lat', lat.toString());
    if (lon) searchParams.append('user_lon', lon.toString());
    const qs = searchParams.toString();
    return request<RepairProvider[]>(`/repair/providers${qs ? `?${qs}` : ''}`);
  },

  // Impact
  getImpactAnalytics: () => request<ImpactAnalytics>('/impact/analytics'),

  // Rewards
  getUserRewards: () => request<UserRewards>('/rewards/my-rewards'),

  getLeaderboard: () => request<LeaderboardEntry[]>('/rewards/leaderboard'),

  // AI Classification
  suggestCategory: async (file?: File, itemTitle?: string): Promise<AIClassificationResult> => {
    const formData = new FormData();
    if (file) formData.append('file', file);
    if (itemTitle) formData.append('item_title', itemTitle);

    const response = await fetch(`${API_BASE}/classify/suggest-category`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('AI category suggestion failed');
    }
    return response.json();
  },
};
