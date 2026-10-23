from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.db.session import get_db
from app.models.models import ItemListing, User
from app.schemas.schemas import MatchRecommendation, MatchExplanation
from app.api.deps import get_optional_user
from app.api.listings import serialize_listing
from app.services.matching import evaluate_listing_match

router = APIRouter(prefix="/matching", tags=["Smart Matching"])

@router.get("/recommendations", response_model=List[MatchRecommendation])
def get_recommendations(
    category: Optional[str] = None,
    purpose: Optional[str] = None,
    query: Optional[str] = None,
    user_lat: Optional[float] = None,
    user_lon: Optional[float] = None,
    limit: int = 12,
    db: Session = Depends(get_db),
    optional_user: Optional[User] = Depends(get_optional_user)
):
    """
    Rule-based transparent matching algorithm that scores available listings
    based on category compatibility, purpose alignment, condition, and geographic proximity.
    """
    listings = db.query(ItemListing).filter(ItemListing.status == "Available").all()
    user_id = optional_user.id if optional_user else None

    # Do not recommend the user's own items
    candidates = [l for l in listings if user_id is None or l.owner_id != user_id]

    scored = []
    for item in candidates:
        eval_res = evaluate_listing_match(
            listing=item,
            preferred_category=category if category and category.lower() != "all" else None,
            preferred_purpose=purpose if purpose and purpose.lower() != "all" else None,
            user_lat=user_lat,
            user_lon=user_lon,
            search_query=query
        )
        scored.append((item, eval_res))

    # Sort descending by match score
    scored.sort(key=lambda x: x[1]["score"], reverse=True)

    recommendations = []
    for item, match_data in scored[:limit]:
        recommendations.append(
            MatchRecommendation(
                listing=serialize_listing(item, user_id),
                match_explanation=MatchExplanation(
                    score=match_data["score"],
                    level=match_data["level"],
                    summary=match_data["summary"],
                    factors=match_data["factors"]
                )
            )
        )

    return recommendations
