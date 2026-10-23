from datetime import datetime, timezone
from sqlalchemy import (
    Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, UniqueConstraint
)
from sqlalchemy.orm import relationship
from app.db.session import Base

def utcnow():
    return datetime.now(timezone.utc)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    avatar_url = Column(String(500), nullable=True)
    location = Column(String(255), default="Campus / Local Area")
    bio = Column(Text, nullable=True)
    circular_points = Column(Integer, default=50)
    is_demo = Column(Boolean, default=False)
    created_at = Column(DateTime, default=utcnow)

    # Relationships
    listings = relationship("ItemListing", back_populates="owner", cascade="all, delete-orphan")
    sent_requests = relationship("ExchangeRequest", foreign_keys="ExchangeRequest.requester_id", back_populates="requester")
    received_requests = relationship("ExchangeRequest", foreign_keys="ExchangeRequest.owner_id", back_populates="owner")
    favourites = relationship("Favourite", back_populates="user", cascade="all, delete-orphan")
    reward_transactions = relationship("RewardTransaction", back_populates="user", cascade="all, delete-orphan")
    badges = relationship("UserBadge", back_populates="user", cascade="all, delete-orphan")


class ItemListing(Base):
    __tablename__ = "item_listings"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), index=True, nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String(100), index=True, nullable=False)
    # Categories: Electronics, Books and educational materials, Furniture, Clothing and accessories, Home appliances, Household items, Sports and recreation, Other
    condition = Column(String(50), nullable=False)
    # Condition: New, Like New, Good, Fair, Needs Repair
    purpose = Column(String(50), index=True, nullable=False)
    # Purpose: Give away, Sell for reuse, Request repair, Donate, Responsible recycling
    price = Column(Float, default=0.0)
    image_url = Column(String(500), nullable=True)
    location_name = Column(String(255), default="Campus Center")
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    pickup_notes = Column(Text, nullable=True)
    status = Column(String(50), default="Available", index=True)
    # Status: Available, Requested, Accepted, Completed, Cancelled

    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=utcnow)
    updated_at = Column(DateTime, default=utcnow, onupdate=utcnow)

    # Relationships
    owner = relationship("User", back_populates="listings")
    requests = relationship("ExchangeRequest", back_populates="listing", cascade="all, delete-orphan")
    completed_exchange = relationship("CompletedExchange", back_populates="listing", uselist = False)
    images = relationship("ListingImage", back_populates="listing", cascade="all, delete-orphan")
    favourited_by = relationship("Favourite", back_populates="listing", cascade="all, delete-orphan")


class ListingImage(Base):
    __tablename__ = "listing_images"

    id = Column(Integer, primary_key=True, index=True)
    listing_id = Column(Integer, ForeignKey("item_listings.id"), nullable=False)
    image_url = Column(String(500), nullable=False)
    is_primary = Column(Boolean, default=False)
    created_at = Column(DateTime, default=utcnow)

    listing = relationship("ItemListing", back_populates="images")


class Favourite(Base):
    __tablename__ = "favourites"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    listing_id = Column(Integer, ForeignKey("item_listings.id"), nullable=False)
    created_at = Column(DateTime, default=utcnow)

    __table_args__ = (UniqueConstraint("user_id", "listing_id", name="uq_user_listing_favourite"),)

    user = relationship("User", back_populates="favourites")
    listing = relationship("ItemListing", back_populates="favourited_by")


class ExchangeRequest(Base):
    __tablename__ = "exchange_requests"

    id = Column(Integer, primary_key=True, index=True)
    listing_id = Column(Integer, ForeignKey("item_listings.id"), nullable=False)
    requester_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    message = Column(Text, nullable=True)
    status = Column(String(50), default="Pending", index=True)
    # Status: Pending, Accepted, Rejected, Completed, Cancelled
    created_at = Column(DateTime, default=utcnow)
    updated_at = Column(DateTime, default=utcnow, onupdate=utcnow)

    listing = relationship("ItemListing", back_populates="requests")
    requester = relationship("User", foreign_keys=[requester_id], back_populates="sent_requests")
    owner = relationship("User", foreign_keys=[owner_id], back_populates="received_requests")
    completed_record = relationship("CompletedExchange", back_populates="exchange_request", uselist=False)


class CompletedExchange(Base):
    __tablename__ = "completed_exchanges"

    id = Column(Integer, primary_key=True, index=True)
    listing_id = Column(Integer, ForeignKey("item_listings.id"), unique=True, nullable=False)
    exchange_request_id = Column(Integer, ForeignKey("exchange_requests.id"), unique=True, nullable=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    requester_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    exchange_type = Column(String(50), nullable=False) # reuse, repair, donation, recycling
    item_category = Column(String(100), nullable=False)
    estimated_weight_kg = Column(Float, default=1.0)
    estimated_co2_kg = Column(Float, default=2.5)
    completed_at = Column(DateTime, default=utcnow)

    listing = relationship("ItemListing", back_populates="completed_exchange")
    exchange_request = relationship("ExchangeRequest", back_populates="completed_record")
    impact_record = relationship("ImpactRecord", back_populates="exchange", uselist=False, cascade="all, delete-orphan")


class ImpactRecord(Base):
    __tablename__ = "impact_records"

    id = Column(Integer, primary_key=True, index=True)
    exchange_id = Column(Integer, ForeignKey("completed_exchanges.id"), unique=True, nullable=False)
    category = Column(String(100), nullable=False)
    weight_kg = Column(Float, nullable=False)
    co2_avoided_kg = Column(Float, nullable=False)
    exchange_type = Column(String(50), nullable=False)
    created_at = Column(DateTime, default=utcnow)

    exchange = relationship("CompletedExchange", back_populates="impact_record")


class RewardTransaction(Base):
    __tablename__ = "reward_transactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    points = Column(Integer, nullable=False)
    action_type = Column(String(50), nullable=False)  # completed_reuse, completed_repair, completed_donation, completed_recycle, welcome_bonus
    description = Column(String(255), nullable=False)
    exchange_id = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=utcnow)

    __table_args__ = (UniqueConstraint("user_id", "exchange_id", "action_type", name="uq_user_exchange_reward"),)

    user = relationship("User", back_populates="reward_transactions")


class UserBadge(Base):
    __tablename__ = "user_badges"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    badge_key = Column(String(100), nullable=False)
    badge_title = Column(String(100), nullable=False)
    description = Column(String(255), nullable=False)
    icon = Column(String(50), default="Award")
    earned_at = Column(DateTime, default=utcnow)

    __table_args__ = (UniqueConstraint("user_id", "badge_key", name="uq_user_badge"),)

    user = relationship("User", back_populates="badges")


class RepairProvider(Base):
    __tablename__ = "repair_providers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False) # Electronics, Bicycles, Furniture, Clothing, General
    address = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=True)
    website = Column(String(255), nullable=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    rating = Column(Float, default=4.8)
    is_verified = Column(Boolean, default=True)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=utcnow)
