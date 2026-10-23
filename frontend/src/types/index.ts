export interface User {
  id: number;
  email: string;
  full_name: string;
  avatar_url?: string;
  location?: string;
  bio?: string;
  circular_points: number;
  is_demo: boolean;
  created_at: string;
}

export interface UserBrief {
  id: number;
  full_name: string;
  email: string;
  avatar_url?: string;
  location?: string;
}

export interface ItemListing {
  id: number;
  title: string;
  description: string;
  category: string;
  condition: string;
  purpose: string;
  price: number;
  image_url: string;
  location_name: string;
  latitude?: number;
  longitude?: number;
  pickup_notes?: string;
  status: 'Available' | 'Requested' | 'Accepted' | 'Completed' | 'Cancelled';
  owner_id: number;
  owner: UserBrief;
  is_favourited?: boolean;
  created_at: string;
  updated_at: string;
}

export interface ExchangeRequest {
  id: number;
  listing_id: number;
  listing: ItemListing;
  requester_id: number;
  requester: UserBrief;
  owner_id: number;
  owner: UserBrief;
  message?: string;
  status: 'Pending' | 'Accepted' | 'Rejected' | 'Completed' | 'Cancelled';
  created_at: string;
  updated_at: string;
}

export interface MatchFactor {
  score: number;
  level: string;
  summary: string;
  factors: string[];
}

export interface MatchRecommendation {
  listing: ItemListing;
  match_explanation: MatchFactor;
}

export interface RepairTroubleshootStep {
  step_number: number;
  title: string;
  instruction: string;
  caution?: string;
}

export interface RepairGuide {
  category: string;
  problem_type: string;
  difficulty: string;
  diy_suitable: boolean;
  estimated_cost_savings: string;
  environmental_benefit: string;
  troubleshooting_steps: RepairTroubleshootStep[];
  disposal_recommendation: string;
}

export interface RepairProvider {
  id: number;
  name: string;
  category: string;
  address: string;
  phone?: string;
  website?: string;
  latitude: number;
  longitude: number;
  rating: number;
  is_verified: boolean;
  description?: string;
}

export interface ImpactSummary {
  total_completed_exchanges: number;
  total_reused: number;
  total_repaired: number;
  total_donated: number;
  total_recycled: number;
  total_waste_diverted_kg: number;
  total_co2_avoided_kg: number;
  active_participants_count: number;
}

export interface CategoryImpact {
  category: string;
  count: number;
  waste_diverted_kg: number;
  co2_avoided_kg: number;
}

export interface MonthlyTrend {
  month: string;
  exchanges_count: number;
  waste_diverted_kg: number;
  co2_avoided_kg: number;
}

export interface ImpactAnalytics {
  summary: ImpactSummary;
  category_breakdown: CategoryImpact[];
  monthly_trends: MonthlyTrend[];
  methodology: {
    framework: string;
    description: string;
    category_assumptions: Array<{
      category: string;
      avg_weight_kg: number;
      embodied_co2_factor: number;
    }>;
    pathway_hierarchy: Record<string, string>;
    disclaimer: string;
  };
}

export interface Badge {
  badge_key: string;
  badge_title: string;
  description: string;
  icon: string;
  earned: boolean;
  earned_at?: string;
}

export interface LeaderboardEntry {
  rank: number;
  user_id: number;
  full_name: string;
  avatar_url?: string;
  circular_points: number;
  exchanges_completed: number;
  co2_saved_kg: number;
}

export interface UserRewards {
  circular_points: number;
  badges: Badge[];
  history: Array<{
    id: number;
    points: number;
    action_type: string;
    description: string;
    created_at: string;
  }>;
}

export interface AIClassificationResult {
  suggested_category: string;
  confidence: number;
  alternative_categories: string[];
  suggested_purpose: string;
  suggested_condition: string;
  explanation: string;
  source: string;
}
