import math
from typing import List, Dict, Any, Optional

def haversine_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    # Earth radius in kilometers
    R = 6371.0
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = math.sin(delta_phi / 2.0) ** 2 + \
        math.cos(phi1) * math.cos(phi2) * \
        math.sin(delta_lambda / 2.0) ** 2

    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(R * c, 2)

def evaluate_listing_match(
    listing,
    preferred_category: Optional[str] = None,
    preferred_purpose: Optional[str] = None,
    user_lat: Optional[float] = None,
    user_lon: Optional[float] = None,
    search_query: Optional[str] = None
) -> Dict[str, Any]:
    score = 40 # Base baseline for available items
    factors: List[str] = []

    # 1. Search Query relevance
    if search_query:
        query_terms = search_query.lower().split()
        title_lower = listing.title.lower()
        desc_lower = listing.description.lower()
        matched_terms = [t for t in query_terms if t in title_lower or t in desc_lower]
        if matched_terms:
            boost = min(30, len(matched_terms) * 15)
            score += boost
            factors.append(f"Title and description match '{', '.join(matched_terms)}' (+{boost}%)")

    # 2. Category compatibility
    if preferred_category:
        if listing.category.lower() == preferred_category.lower():
            score += 25
            factors.append(f"Direct category match for '{listing.category}' (+25%)")
        else:
            factors.append(f"Alternative circular category '{listing.category}'")
    else:
        # General item popularity/utility
        factors.append(f"Category: {listing.category}")

    # 3. Purpose alignment
    if preferred_purpose:
        if listing.purpose.lower() == preferred_purpose.lower():
            score += 15
            factors.append(f"Aligns with your exchange goal: '{listing.purpose}' (+15%)")
    else:
        if listing.purpose in ["Give away", "Donate"]:
            score += 10
            factors.append(f"Zero-cost community transfer: '{listing.purpose}' (+10%)")
        elif listing.purpose == "Request repair":
            score += 5
            factors.append("Active repair community opportunity (+5%)")

    # 4. Item Condition
    if listing.condition in ["Like New", "New"]:
        score += 10
        factors.append(f"Pristine condition '{listing.condition}' (+10%)")
    elif listing.condition == "Good":
        score += 8
        factors.append(f"Readily usable condition '{listing.condition}' (+8%)")
    elif listing.condition == "Needs Repair":
        factors.append("Great project for community repair hands-on experience")

    # 5. Location Proximity (if coordinates are provided)
    if user_lat is not None and user_lon is not None and listing.latitude is not None and listing.longitude is not None:
        dist_km = haversine_distance_km(user_lat, user_lon, listing.latitude, listing.longitude)
        if dist_km <= 2.0:
            score += 15
            factors.append(f"Very close: within {dist_km} km for low-carbon pickup (+15%)")
        elif dist_km <= 5.0:
            score += 10
            factors.append(f"Nearby: within {dist_km} km (+10%)")
        elif dist_km <= 15.0:
            score += 5
            factors.append(f"Within {dist_km} km driving/transit radius (+5%)")
        else:
            factors.append(f"Located {dist_km} km away")

    # Clamp score to 0 - 99
    score = max(20, min(99, score))

    if score >= 80:
        level = "Excellent"
        summary = f"Strong match: matches category, suitable condition, and accessible local pickup."
    elif score >= 60:
        level = "Strong"
        summary = f"Good circular fit: matches search parameters and community reuse needs."
    else:
        level = "Moderate"
        summary = f"Potential match: alternative option for reuse or repurposing."

    return {
        "score": score,
        "level": level,
        "summary": summary,
        "factors": factors
    }
