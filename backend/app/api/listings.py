import os
import uuid
import shutil
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, desc, asc
from app.db.session import get_db
from app.models.models import ItemListing, User, Favourite, ListingImage
from app.schemas.schemas import (
    ItemListingCreate, ItemListingUpdate, ItemListingResponse, UserBrief
)
from app.api.deps import get_current_user, get_optional_user
from app.core.config import settings
from app.services.matching import haversine_distance_km

router = APIRouter(prefix="/listings", tags=["Listings"])

ALLOWED_IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".avif"}
MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB

def serialize_listing(listing: ItemListing, current_user_id: Optional[int] = None) -> ItemListingResponse:
    is_fav = False
    if current_user_id and listing.favourited_by:
        is_fav = any(f.user_id == current_user_id for f in listing.favourited_by)
    
    owner_brief = UserBrief(
        id=listing.owner.id,
        full_name=listing.owner.full_name,
        email=listing.owner.email,
        avatar_url=listing.owner.avatar_url,
        location=listing.owner.location
    )

    return ItemListingResponse(
        id=listing.id,
        title=listing.title,
        description=listing.description,
        category=listing.category,
        condition=listing.condition,
        purpose=listing.purpose,
        price=listing.price or 0.0,
        image_url=listing.image_url,
        location_name=listing.location_name,
        latitude=listing.latitude,
        longitude=listing.longitude,
        pickup_notes=listing.pickup_notes,
        status=listing.status,
        owner_id=listing.owner_id,
        owner=owner_brief,
        is_favourited=is_fav,
        created_at=listing.created_at,
        updated_at=listing.updated_at
    )

@router.get("", response_model=List[ItemListingResponse])
def get_listings(
    search: Optional[str] = None,
    category: Optional[str] = None,
    condition: Optional[str] = None,
    purpose: Optional[str] = None,
    status_filter: Optional[str] = "Available",
    sort_by: Optional[str] = "newest", # "newest", "price_low", "price_high", "distance"
    user_lat: Optional[float] = None,
    user_lon: Optional[float] = None,
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
    optional_user: Optional[User] = Depends(get_optional_user)
):
    query = db.query(ItemListing)

    if status_filter and status_filter.lower() != "all":
        query = query.filter(ItemListing.status == status_filter)

    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            or_(
                ItemListing.title.ilike(search_filter),
                ItemListing.description.ilike(search_filter),
                ItemListing.location_name.ilike(search_filter)
            )
        )

    if category and category.lower() != "all":
        query = query.filter(ItemListing.category == category)

    if condition and condition.lower() != "all":
        query = query.filter(ItemListing.condition == condition)

    if purpose and purpose.lower() != "all":
        query = query.filter(ItemListing.purpose == purpose)

    # Sorting
    if sort_by == "price_low":
        query = query.order_by(asc(ItemListing.price))
    elif sort_by == "price_high":
        query = query.order_by(desc(ItemListing.price))
    else:
        query = query.order_by(desc(ItemListing.created_at))

    listings = query.offset(skip).limit(limit).all()

    # If distance sorting requested and user coordinates available
    if sort_by == "distance" and user_lat is not None and user_lon is not None:
        listings = sorted(
            listings,
            key=lambda item: haversine_distance_km(user_lat, user_lon, item.latitude, item.longitude)
            if item.latitude is not None and item.longitude is not None else 999999
        )

    user_id = optional_user.id if optional_user else None
    return [serialize_listing(l, user_id) for l in listings]

@router.get("/categories")
def get_categories():
    return [
        "Electronics",
        "Books and educational materials",
        "Furniture",
        "Clothing and accessories",
        "Home appliances",
        "Household items",
        "Sports and recreation",
        "Other"
    ]

@router.get("/my/listings", response_model=List[ItemListingResponse])
def get_my_listings(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    listings = db.query(ItemListing).filter(ItemListing.owner_id == current_user.id).order_by(desc(ItemListing.created_at)).all()
    return [serialize_listing(l, current_user.id) for l in listings]

@router.get("/my/favourites", response_model=List[ItemListingResponse])
def get_my_favourites(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    favourites = db.query(Favourite).filter(Favourite.user_id == current_user.id).all()
    listing_ids = [f.listing_id for f in favourites]
    listings = db.query(ItemListing).filter(ItemListing.id.in_(listing_ids)).all()
    return [serialize_listing(l, current_user.id) for l in listings]

@router.get("/{id}", response_model=ItemListingResponse)
def get_listing(
    id: int,
    db: Session = Depends(get_db),
    optional_user: Optional[User] = Depends(get_optional_user)
):
    listing = db.query(ItemListing).filter(ItemListing.id == id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    user_id = optional_user.id if optional_user else None
    return serialize_listing(listing, user_id)

@router.post("", response_model=ItemListingResponse, status_code=status.HTTP_201_CREATED)
def create_listing(
    listing_in: ItemListingCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    listing = ItemListing(
        title=listing_in.title.strip(),
        description=listing_in.description.strip(),
        category=listing_in.category,
        condition=listing_in.condition,
        purpose=listing_in.purpose,
        price=listing_in.price or 0.0,
        image_url=listing_in.image_url or "https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=600&q=80",
        location_name=listing_in.location_name or current_user.location or "Campus Center",
        latitude=listing_in.latitude,
        longitude=listing_in.longitude,
        pickup_notes=listing_in.pickup_notes,
        status="Available",
        owner_id=current_user.id
    )
    db.add(listing)
    db.commit()
    db.refresh(listing)
    return serialize_listing(listing, current_user.id)

@router.put("/{id}", response_model=ItemListingResponse)
def update_listing(
    id: int,
    update_in: ItemListingUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    listing = db.query(ItemListing).filter(ItemListing.id == id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    if listing.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="You do not have permission to modify this listing")

    update_data = update_in.model_dump(exclude_unset=True)
    for field, val in update_data.items():
        setattr(listing, field, val)

    db.commit()
    db.refresh(listing)
    return serialize_listing(listing, current_user.id)

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_listing(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    listing = db.query(ItemListing).filter(ItemListing.id == id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    if listing.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="You do not have permission to delete this listing")

    db.delete(listing)
    db.commit()
    return None

@router.post("/{id}/favourite")
def toggle_favourite(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    listing = db.query(ItemListing).filter(ItemListing.id == id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")

    existing = db.query(Favourite).filter(
        Favourite.user_id == current_user.id,
        Favourite.listing_id == id
    ).first()

    if existing:
        db.delete(existing)
        db.commit()
        return {"favourited": False, "message": "Removed from favourites"}
    else:
        fav = Favourite(user_id=current_user.id, listing_id=id)
        db.add(fav)
        db.commit()
        return {"favourited": True, "message": "Saved to favourites"}

@router.post("/upload-image")
def upload_image(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    # Extension validation
    ext = os.path.splitext(file.filename)[1].lower() if file.filename else ""
    if ext not in ALLOWED_IMAGE_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported image format '{ext}'. Allowed: {', '.join(ALLOWED_IMAGE_EXTENSIONS)}"
        )

    # Safe unique filename
    safe_name = f"{uuid.uuid4().hex}{ext}"
    target_path = os.path.join(settings.UPLOAD_DIR, safe_name)

    # Write file safely
    try:
        with open(target_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save image: {str(e)}")

    # Return accessible relative URL
    return {
        "url": f"/uploads/{safe_name}",
        "filename": safe_name
    }
