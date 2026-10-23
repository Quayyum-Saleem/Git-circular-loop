from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.models import User, RewardTransaction, UserBadge, CompletedExchange, ImpactRecord

BADGE_DEFINITIONS = [
    {
        "badge_key": "first_reuse",
        "badge_title": "First Item Reused",
        "description": "Completed your first circular exchange on CircularLoop.",
        "icon": "Repeat"
    },
    {
        "badge_key": "repair_champion",
        "badge_title": "Repair Champion",
        "description": "Diagnosed and restored an item to keep it out of landfill.",
        "icon": "Wrench"
    },
    {
        "badge_key": "community_helper",
        "badge_title": "Community Helper",
        "description": "Donated usable goods directly to fellow community members.",
        "icon": "HeartHandshake"
    },
    {
        "badge_key": "circular_contributor",
        "badge_title": "Circular Campus Contributor",
        "description": "Completed 3 or more circular product handoffs.",
        "icon": "Sparkles"
    },
    {
        "badge_key": "climate_defender",
        "badge_title": "Climate Defender",
        "description": "Avoided over 25 kg of greenhouse carbon emissions.",
        "icon": "ShieldCheck"
    }
]

POINT_VALUES = {
    "reuse": 50,
    "repair": 75,
    "donation": 60,
    "recycling": 40
}

def award_exchange_rewards(db: Session, exchange: CompletedExchange):
    """
    Safely awards points and updates badges for both owner and requester.
    Guarantees idempotency via database checks.
    """
    action_type = f"completed_{exchange.exchange_type.lower()}"
    base_points = POINT_VALUES.get(exchange.exchange_type.lower(), 50)

    # Award to owner
    existing_owner_reward = db.query(RewardTransaction).filter(
        RewardTransaction.user_id == exchange.owner_id,
        RewardTransaction.exchange_id == exchange.id,
        RewardTransaction.action_type == action_type
    ).first()

    if not existing_owner_reward:
        owner_tx = RewardTransaction(
            user_id=exchange.owner_id,
            points=base_points,
            action_type=action_type,
            description=f"Completed {exchange.exchange_type} for '{exchange.item_category}' listing",
            exchange_id=exchange.id
        )
        db.add(owner_tx)
        owner = db.query(User).filter(User.id == exchange.owner_id).first()
        if owner:
            owner.circular_points += base_points

    # Award to requester (if different user)
    if exchange.requester_id != exchange.owner_id:
        existing_req_reward = db.query(RewardTransaction).filter(
            RewardTransaction.user_id == exchange.requester_id,
            RewardTransaction.exchange_id == exchange.id,
            RewardTransaction.action_type == action_type
        ).first()

        if not existing_req_reward:
            req_tx = RewardTransaction(
                user_id=exchange.requester_id,
                points=base_points,
                action_type=action_type,
                description=f"Received circular item in {exchange.exchange_type} exchange",
                exchange_id=exchange.id
            )
            db.add(req_tx)
            requester = db.query(User).filter(User.id == exchange.requester_id).first()
            if requester:
                requester.circular_points += base_points

    db.flush()

    # Check and award badges for both users
    for user_id in set([exchange.owner_id, exchange.requester_id]):
        check_and_grant_badges(db, user_id)

def check_and_grant_badges(db: Session, user_id: int):
    # Count exchanges participated in
    total_exchanges = db.query(CompletedExchange).filter(
        (CompletedExchange.owner_id == user_id) | (CompletedExchange.requester_id == user_id)
    ).count()

    # Count repair exchanges
    repair_count = db.query(CompletedExchange).filter(
        ((CompletedExchange.owner_id == user_id) | (CompletedExchange.requester_id == user_id)),
        CompletedExchange.exchange_type == "repair"
    ).count()

    # Count donations
    donation_count = db.query(CompletedExchange).filter(
        ((CompletedExchange.owner_id == user_id) | (CompletedExchange.requester_id == user_id)),
        CompletedExchange.exchange_type == "donation"
    ).count()

    # Sum CO2 saved
    co2_sum = db.query(func.sum(CompletedExchange.estimated_co2_kg)).filter(
        (CompletedExchange.owner_id == user_id) | (CompletedExchange.requester_id == user_id)
    ).scalar() or 0.0

    eligible_keys = set()
    if total_exchanges >= 1:
        eligible_keys.add("first_reuse")
    if repair_count >= 1:
        eligible_keys.add("repair_champion")
    if donation_count >= 1:
        eligible_keys.add("community_helper")
    if total_exchanges >= 3:
        eligible_keys.add("circular_contributor")
    if co2_sum >= 25.0:
        eligible_keys.add("climate_defender")

    existing_badges = {b.badge_key for b in db.query(UserBadge).filter(UserBadge.user_id == user_id).all()}

    for badge_def in BADGE_DEFINITIONS:
        key = badge_def["badge_key"]
        if key in eligible_keys and key not in existing_badges:
            new_badge = UserBadge(
                user_id=user_id,
                badge_key=key,
                badge_title=badge_def["badge_title"],
                description=badge_def["description"],
                icon=badge_def["icon"]
            )
            db.add(new_badge)

    db.flush()

def get_leaderboard(db: Session, limit: int = 10):
    users = db.query(User).order_by(User.circular_points.desc()).limit(limit).all()
    results = []
    for rank, u in enumerate(users, start=1):
        exchanges_count = db.query(CompletedExchange).filter(
            (CompletedExchange.owner_id == u.id) | (CompletedExchange.requester_id == u.id)
        ).count()

        co2_total = db.query(func.sum(CompletedExchange.estimated_co2_kg)).filter(
            (CompletedExchange.owner_id == u.id) | (CompletedExchange.requester_id == u.id)
        ).scalar() or 0.0

        results.append({
            "rank": rank,
            "user_id": u.id,
            "full_name": u.full_name,
            "avatar_url": u.avatar_url,
            "circular_points": u.circular_points,
            "exchanges_completed": exchanges_count,
            "co2_saved_kg": round(co2_total, 1)
        })
    return results
