from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.db.session import get_db
from app.models.models import ItemListing, User, ExchangeRequest, CompletedExchange, ImpactRecord
from app.schemas.schemas import (
    ExchangeRequestCreate, ExchangeRequestResponse, ExchangeStatusUpdate,
    CompleteExchangeRequest, CompletedExchangeResponse
)
from app.api.deps import get_current_user
from app.api.listings import serialize_listing
from app.services.impact import calculate_item_impact
from app.services.rewards import award_exchange_rewards

router = APIRouter(prefix="/exchanges", tags=["Exchanges"])

def serialize_request(req: ExchangeRequest, current_user_id: int) -> ExchangeRequestResponse:
    return ExchangeRequestResponse(
        id=req.id,
        listing_id=req.listing_id,
        listing=serialize_listing(req.listing, current_user_id),
        requester_id=req.requester_id,
        requester=req.requester,
        owner_id=req.owner_id,
        owner=req.owner,
        message=req.message,
        status=req.status,
        created_at=req.created_at,
        updated_at=req.updated_at
    )

@router.post("/requests", response_model=ExchangeRequestResponse, status_code=status.HTTP_201_CREATED)
def create_exchange_request(
    request_in: ExchangeRequestCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    listing = db.query(ItemListing).filter(ItemListing.id == request_in.listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")

    if listing.owner_id == current_user.id:
        raise HTTPException(status_code=400, detail="You cannot request your own listing")

    if listing.status != "Available":
        raise HTTPException(
            status_code=400,
            detail=f"This item is currently '{listing.status}' and cannot receive new requests."
        )

    # Check for existing pending request by same user
    existing_pending = db.query(ExchangeRequest).filter(
        ExchangeRequest.listing_id == listing.id,
        ExchangeRequest.requester_id == current_user.id,
        ExchangeRequest.status.in_(["Pending", "Accepted"])
    ).first()
    if existing_pending:
        raise HTTPException(
            status_code=400,
            detail="You already have an active request for this item."
        )

    exchange_req = ExchangeRequest(
        listing_id=listing.id,
        requester_id=current_user.id,
        owner_id=listing.owner_id,
        message=request_in.message or "Hi, I'm interested in this circular item!",
        status="Pending"
    )
    db.add(exchange_req)

    # Update listing status to Requested to signal interest
    listing.status = "Requested"

    db.commit()
    db.refresh(exchange_req)
    return serialize_request(exchange_req, current_user.id)

@router.get("/requests/incoming", response_model=List[ExchangeRequestResponse])
def get_incoming_requests(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    requests = db.query(ExchangeRequest).filter(
        ExchangeRequest.owner_id == current_user.id
    ).order_by(desc(ExchangeRequest.created_at)).all()
    return [serialize_request(r, current_user.id) for r in requests]

@router.get("/requests/outgoing", response_model=List[ExchangeRequestResponse])
def get_outgoing_requests(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    requests = db.query(ExchangeRequest).filter(
        ExchangeRequest.requester_id == current_user.id
    ).order_by(desc(ExchangeRequest.created_at)).all()
    return [serialize_request(r, current_user.id) for r in requests]

@router.put("/requests/{id}/status", response_model=ExchangeRequestResponse)
def update_request_status(
    id: int,
    status_in: ExchangeStatusUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    req = db.query(ExchangeRequest).filter(ExchangeRequest.id == id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")

    # Only listing owner can Accept or Reject
    if req.owner_id != current_user.id and req.requester_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this request")

    new_status = status_in.status.capitalize()
    if new_status not in ["Accepted", "Rejected", "Cancelled"]:
        raise HTTPException(status_code=400, detail="Invalid status transition")

    req.status = new_status

    listing = req.listing
    if new_status == "Accepted":
        listing.status = "Accepted"
        # Reject other pending requests for this listing
        other_requests = db.query(ExchangeRequest).filter(
            ExchangeRequest.listing_id == listing.id,
            ExchangeRequest.id != req.id,
            ExchangeRequest.status == "Pending"
        ).all()
        for other in other_requests:
            other.status = "Rejected"
    elif new_status in ["Rejected", "Cancelled"]:
        # Check if there are other pending requests
        other_pending = db.query(ExchangeRequest).filter(
            ExchangeRequest.listing_id == listing.id,
            ExchangeRequest.id != req.id,
            ExchangeRequest.status == "Pending"
        ).first()
        listing.status = "Requested" if other_pending else "Available"

    db.commit()
    db.refresh(req)
    return serialize_request(req, current_user.id)

@router.post("/complete", response_model=CompletedExchangeResponse)
def complete_exchange(
    complete_in: CompleteExchangeRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Atomic transaction completing the exchange:
    1. Validates ownership or participant authorization
    2. Prevents double-completion of the same listing
    3. Calculates environmental impact
    4. Records CompletedExchange and ImpactRecord
    5. Awards points & badges idempotently
    """
    listing = db.query(ItemListing).filter(ItemListing.id == complete_in.listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")

    # Check for existing completed exchange
    existing_completion = db.query(CompletedExchange).filter(
        CompletedExchange.listing_id == listing.id
    ).first()
    if existing_completion:
        raise HTTPException(status_code=400, detail="This listing has already been recorded as completed.")

    # Determine requester
    requester_id = current_user.id
    if complete_in.exchange_request_id:
        req = db.query(ExchangeRequest).filter(ExchangeRequest.id == complete_in.exchange_request_id).first()
        if req:
            requester_id = req.requester_id
            req.status = "Completed"
    else:
        # Check if there is an accepted request
        accepted_req = db.query(ExchangeRequest).filter(
            ExchangeRequest.listing_id == listing.id,
            ExchangeRequest.status == "Accepted"
        ).first()
        if accepted_req:
            requester_id = accepted_req.requester_id
            accepted_req.status = "Completed"

    # Verify authorization
    if current_user.id != listing.owner_id and current_user.id != requester_id:
        raise HTTPException(status_code=403, detail="Only the owner or recipient can mark this exchange as completed")

    # Calculate impact
    exchange_type = complete_in.exchange_type or (
        "repair" if "repair" in listing.purpose.lower() else
        "donation" if "donate" in listing.purpose.lower() else
        "recycling" if "recycl" in listing.purpose.lower() else
        "reuse"
    )
    impact_data = calculate_item_impact(listing.category, exchange_type)

    completed_record = CompletedExchange(
        listing_id=listing.id,
        exchange_request_id=complete_in.exchange_request_id,
        owner_id=listing.owner_id,
        requester_id=requester_id,
        exchange_type=exchange_type,
        item_category=listing.category,
        estimated_weight_kg=impact_data["weight_kg"],
        estimated_co2_kg=impact_data["co2_avoided_kg"]
    )
    db.add(completed_record)
    db.flush() # Flush to get completed_record.id

    # Add ImpactRecord
    impact_rec = ImpactRecord(
        exchange_id=completed_record.id,
        category=listing.category,
        weight_kg=impact_data["weight_kg"],
        co2_avoided_kg=impact_data["co2_avoided_kg"],
        exchange_type=exchange_type
    )
    db.add(impact_rec)

    # Update listing status
    listing.status = "Completed"

    # Award points and check badges
    award_exchange_rewards(db, completed_record)

    db.commit()
    db.refresh(completed_record)
    return completed_record
