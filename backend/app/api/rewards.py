from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.db.session import get_db
from app.models.models import User, UserBadge, RewardTransaction
from app.schemas.schemas import (
    UserRewardsResponse, BadgeResponse, LeaderboardEntry, RewardHistoryItem
)
from app.api.deps import get_current_user
from app.services.rewards import BADGE_DEFINITIONS, get_leaderboard

router = APIRouter(prefix="/rewards", tags=["Rewards & Community"])

@router.get("/my-rewards", response_model=UserRewardsResponse)
def get_user_rewards(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user_badges = {b.badge_key: b.earned_at for b in current_user.badges}

    badge_responses = []
    for b_def in BADGE_DEFINITIONS:
        is_earned = b_def["badge_key"] in user_badges
        earned_at = user_badges.get(b_def["badge_key"])
        badge_responses.append(
            BadgeResponse(
                badge_key=b_def["badge_key"],
                badge_title=b_def["badge_title"],
                description=b_def["description"],
                icon=b_def["icon"],
                earned=is_earned,
                earned_at=earned_at
            )
        )

    history = db.query(RewardTransaction).filter(
        RewardTransaction.user_id == current_user.id
    ).order_by(desc(RewardTransaction.created_at)).all()

    return UserRewardsResponse(
        circular_points=current_user.circular_points,
        badges=badge_responses,
        history=history
    )

@router.get("/leaderboard", response_model=List[LeaderboardEntry])
def get_community_leaderboard(db: Session = Depends(get_db)):
    return get_leaderboard(db, limit=10)
