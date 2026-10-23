from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import Optional, List
from datetime import datetime

# --- Auth & User Schemas ---
class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    location: Optional[str] = "Campus / Local Area"
    bio: Optional[str] = None
    avatar_url: Optional[str] = None

class UserCreate(UserBase):
    password: str = Field(..., min_length=6)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    circular_points: int
    is_demo: bool
    created_at: datetime

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# --- Item Listing Schemas ---
class ItemListingBase(BaseModel):
    title: str = Field(..., min_length=3, max_length=255)
    description: str = Field(..., min_length=5)
    category: str
    condition: str
    purpose: str
    price: Optional[float] = 0.0
    image_url: Optional[str] = None
    location_name: Optional[str] = "Campus Center"
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    pickup_notes: Optional[str] = None

class ItemListingCreate(ItemListingBase):
    pass

class ItemListingUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    condition: Optional[str] = None
    purpose: Optional[str] = None
    price: Optional[float] = None
    image_url: Optional[str] = None
    location_name: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    pickup_notes: Optional[str] = None
    status: Optional[str] = None

class UserBrief(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    full_name: str
    email: str
    avatar_url: Optional[str] = None
    location: Optional[str] = None

class ItemListingResponse(ItemListingBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    status: str
    owner_id: int
    owner: UserBrief
    is_favourited: Optional[bool] = False
    created_at: datetime
    updated_at: datetime

# --- Exchange Request Schemas ---
class ExchangeRequestCreate(BaseModel):
    listing_id: int
    message: Optional[str] = "Hi, I am interested in this item!"

class ExchangeStatusUpdate(BaseModel):
    status: str  # Accepted, Rejected, Cancelled

class ExchangeRequestResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    listing_id: int
    listing: ItemListingResponse
    requester_id: int
    requester: UserBrief
    owner_id: int
    owner: UserBrief
    message: Optional[str]
    status: str
    created_at: datetime
    updated_at: datetime

class CompleteExchangeRequest(BaseModel):
    exchange_request_id: Optional[int] = None
    listing_id: int
    exchange_type: str  # reuse, repair, donation, recycling

class CompletedExchangeResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    listing_id: int
    exchange_request_id: Optional[int]
    owner_id: int
    requester_id: int
    exchange_type: str
    item_category: str
    estimated_weight_kg: float
    estimated_co2_kg: float
    completed_at: datetime

# --- Matching Schemas ---
class MatchExplanation(BaseModel):
    score: int
    level: str  # Excellent, Strong, Moderate
    summary: str
    factors: List[str]

class MatchRecommendation(BaseModel):
    listing: ItemListingResponse
    match_explanation: MatchExplanation

# --- Impact Analytics Schemas ---
class ImpactSummary(BaseModel):
    total_completed_exchanges: int
    total_reused: int
    total_repaired: int
    total_donated: int
    total_recycled: int
    total_waste_diverted_kg: float
    total_co2_avoided_kg: float
    active_participants_count: int

class CategoryImpact(BaseModel):
    category: str
    count: int
    waste_diverted_kg: float
    co2_avoided_kg: float

class MonthlyTrend(BaseModel):
    month: str
    exchanges_count: int
    waste_diverted_kg: float
    co2_avoided_kg: float

class ImpactAnalyticsResponse(BaseModel):
    summary: ImpactSummary
    category_breakdown: List[CategoryImpact]
    monthly_trends: List[MonthlyTrend]
    methodology: dict

# --- Gamification / Rewards Schemas ---
class BadgeResponse(BaseModel):
    badge_key: str
    badge_title: str
    description: str
    icon: str
    earned: bool
    earned_at: Optional[datetime] = None

class RewardHistoryItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    points: int
    action_type: str
    description: str
    created_at: datetime

class LeaderboardEntry(BaseModel):
    rank: int
    user_id: int
    full_name: str
    avatar_url: Optional[str] = None
    circular_points: int
    exchanges_completed: int
    co2_saved_kg: float

class UserRewardsResponse(BaseModel):
    circular_points: int
    badges: List[BadgeResponse]
    history: List[RewardHistoryItem]

# --- Repair Assistant Schemas ---
class RepairTroubleshootStep(BaseModel):
    step_number: int
    title: str
    instruction: str
    caution: Optional[str] = None

class RepairGuide(BaseModel):
    category: str
    problem_type: str
    difficulty: str  # Easy, Moderate, Advanced / Professional
    diy_suitable: bool
    estimated_cost_savings: str
    environmental_benefit: str
    troubleshooting_steps: List[RepairTroubleshootStep]
    disposal_recommendation: str

class RepairProviderResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    category: str
    address: str
    phone: Optional[str] = None
    website: Optional[str] = None
    latitude: float
    longitude: float
    rating: float
    is_verified: bool
    description: Optional[str] = None

# --- AI Classification Schemas ---
class AIClassificationResponse(BaseModel):
    suggested_category: str
    confidence: float
    alternative_categories: List[str]
    suggested_purpose: str
    suggested_condition: str
    explanation: str
    source: str  # "heuristic_vision_v1" or "demo_model"
