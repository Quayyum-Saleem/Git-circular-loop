"""
CircularLoop Database Seed Script.
Populates realistic demonstration data for hackathons:
- Sample users with roles
- Featured circular listings across Electronics, Books, Furniture, Appliances, Clothing
- Completed exchanges with environmental impact records
- Gamification rewards and badges
- Local repair providers and campus fix-it clinics
"""

import sys
import os

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.db.session import engine, Base, SessionLocal
from app.models.models import (
    User, ItemListing, CompletedExchange, ImpactRecord,
    RewardTransaction, UserBadge, RepairProvider
)
from app.core.security import get_password_hash
from app.services.impact import calculate_item_impact
from app.services.rewards import award_exchange_rewards

def seed_database():
    # Recreate tables cleanly
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # Check if already seeded
        if db.query(User).count() > 0:
            print("Database already contains data. Clearing existing demo records for clean seed...")
            Base.metadata.drop_all(bind=engine)
            Base.metadata.create_all(bind=engine)

        print("Seeding CircularLoop demo users...")
        # 1. Users
        maya = User(
            email="maya.student@circularloop.edu",
            hashed_password=get_password_hash("demo_password_123"),
            full_name="Maya Chen",
            location="North Campus Dorms",
            bio="CS Junior passionate about zero-waste tech, circular electronics, and hardware repair.",
            avatar_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
            circular_points=320,
            is_demo=True
        )

        alex = User(
            email="alex.repair@circularloop.edu",
            hashed_password=get_password_hash("demo_password_123"),
            full_name="Alex Thorne",
            location="Engineering Innovation Hub",
            bio="Makerspace mentor and repair enthusiast. I fix appliances, solder circuits, and upcycle furniture.",
            avatar_url="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80",
            circular_points=450,
            is_demo=True
        )

        sam = User(
            email="sam.coordinator@circularloop.edu",
            hashed_password=get_password_hash("demo_password_123"),
            full_name="Sam Rivera",
            location="Campus Sustainability Office",
            bio="Campus Sustainability Lead organizing university move-out donation drives and zero-waste initiatives.",
            avatar_url="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80",
            circular_points=580,
            is_demo=True
        )

        jordan = User(
            email="jordan.lee@circularloop.edu",
            hashed_password=get_password_hash("demo_password_123"),
            full_name="Jordan Lee",
            location="West Campus Apartments",
            bio="Design student seeking reusable art supplies and secondhand mid-century furnishings.",
            avatar_url="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80",
            circular_points=180,
            is_demo=True
        )

        db.add_all([maya, alex, sam, jordan])
        db.commit()

        print("Seeding CircularLoop item listings...")
        # 2. Item Listings
        listings_data = [
            # Primary Demonstration Scenario Item: Unused Laptop
            {
                "title": "ThinkPad T480 Laptop (8GB RAM / 256GB SSD)",
                "description": "Clean, gently used ThinkPad T480 in great working condition. Battery holds 4+ hours of charge. Includes original 65W USB-C charger. Upgraded to a lab workstation and want to give this to a fellow student for coding or coursework.",
                "category": "Electronics",
                "condition": "Like New",
                "purpose": "Give away",
                "price": 0.0,
                "image_url": "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80",
                "location_name": "Science Library Hallway",
                "latitude": 42.3601,
                "longitude": -71.0942,
                "pickup_notes": "Available for handoff weekdays between 2 PM and 5 PM at Science Library.",
                "status": "Available",
                "owner_id": maya.id
            },
            # Educational Books
            {
                "title": "Calculus: Early Transcendentals & Intro to Algorithms (CLRS)",
                "description": "Essential textbooks for math and computer science students. Hardcover, no highlighting, excellent binding. Looking to pass them on rather than letting them gather dust on a bookshelf.",
                "category": "Books and educational materials",
                "condition": "Good",
                "purpose": "Give away",
                "price": 0.0,
                "image_url": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80",
                "location_name": "Student Union 2nd Floor",
                "latitude": 42.3592,
                "longitude": -71.0935,
                "pickup_notes": "Can meet outside the campus bookstore or coffee shop.",
                "status": "Available",
                "owner_id": jordan.id
            },
            # Repairable Office Chair
            {
                "title": "Ergonomic Mesh Swivel Desk Chair (Loose Armrest)",
                "description": "High-quality breathable mesh office chair with lumbar support. The right armrest bolt is stripped and wobbles, but the pneumatic gas lift and recline mechanism are 100% solid. Perfect for someone handy with basic tools.",
                "category": "Furniture",
                "condition": "Needs Repair",
                "purpose": "Request repair",
                "price": 0.0,
                "image_url": "https://images.unsplash.com/photo-1580481077195-c3a821a5060f?auto=format&fit=crop&w=800&q=80",
                "location_name": "Engineering Quad - Makerspace",
                "latitude": 42.3615,
                "longitude": -71.0910,
                "pickup_notes": "Ground floor pickup; elevator accessible.",
                "status": "Available",
                "owner_id": alex.id
            },
            # Household Kitchen Item
            {
                "title": "NutriBullet 600W Blender with 2 Travel Cups",
                "description": "Compact high-speed blender for smoothies and shakes. Cleaned and tested thoroughly. Stainless steel extractor blade in sharp condition. Moving dorms and downsizing kitchen appliances.",
                "category": "Home appliances",
                "condition": "Like New",
                "purpose": "Sell for reuse",
                "price": 20.0,
                "image_url": "https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=800&q=80",
                "location_name": "East Campus Housing Quad",
                "latitude": 42.3620,
                "longitude": -71.0880,
                "pickup_notes": "Evenings after 6 PM.",
                "status": "Available",
                "owner_id": sam.id
            },
            # Donation Clothing
            {
                "title": "Unisex Winter Down Parka (Size Medium)",
                "description": "Heavy-duty windproof and waterproof winter coat. Warm fleece lining and deep insulated pockets. Freshly dry-cleaned. Donating to ensure an incoming student stays warm through the upcoming semester.",
                "category": "Clothing and accessories",
                "condition": "Good",
                "purpose": "Donate",
                "price": 0.0,
                "image_url": "https://images.unsplash.com/photo-1539533018447-63fcce667823?auto=format&fit=crop&w=800&q=80",
                "location_name": "Community Care Center Drop-Off",
                "latitude": 42.3580,
                "longitude": -71.0960,
                "pickup_notes": "Pick up anytime during community desk hours (9am - 7pm).",
                "status": "Available",
                "owner_id": sam.id
            },
            # Responsible Recycling Item
            {
                "title": "Collection of Depleted Rechargeable Tool Batteries & Chargers",
                "description": "Safe bulk batch of depleted 18V tool batteries and redundant cords collected from makerspace cleanout. Offering to certified e-waste recyclers for proper lithium/nickel recovery.",
                "category": "Electronics",
                "condition": "Needs Repair",
                "purpose": "Responsible recycling",
                "price": 0.0,
                "image_url": "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80",
                "location_name": "Campus Facilities Loading Bay",
                "latitude": 42.3575,
                "longitude": -71.0980,
                "pickup_notes": "Authorized e-waste handlers only.",
                "status": "Available",
                "owner_id": alex.id
            },
            # Sports Item
            {
                "title": "Commuter Hybrid Bicycle (21-Speed, 18-inch Frame)",
                "description": "Reliable campus commuter bike with puncture-resistant tires, rear cargo rack, and fenders. Tuned up with fresh brake pads.",
                "category": "Sports and recreation",
                "condition": "Good",
                "purpose": "Sell for reuse",
                "price": 45.0,
                "image_url": "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80",
                "location_name": "Student Center Bike Racks",
                "latitude": 42.3590,
                "longitude": -71.0945,
                "pickup_notes": "Meet near bike lockers.",
                "status": "Available",
                "owner_id": jordan.id
            }
        ]

        created_listings = []
        for l_data in listings_data:
            item = ItemListing(**l_data)
            db.add(item)
            created_listings.append(item)
        db.commit()

        print("Seeding completed historical exchanges and impact records...")
        # 3. Completed Historical Exchanges for rich analytics demonstration
        historical_exchanges = [
            {
                "title": "Dell UltraSharp 27-inch IPS Monitor",
                "desc": "Transferred to graduate research assistant for dual-monitor workstation.",
                "cat": "Electronics",
                "type": "reuse",
                "owner": alex,
                "req": maya,
                "weight": 5.8,
                "co2": 85.0
            },
            {
                "title": "Solid Oak 4-Shelf Bookcase",
                "desc": "Upcycled dorm bookshelf preserved through student move-out.",
                "cat": "Furniture",
                "type": "reuse",
                "owner": sam,
                "req": jordan,
                "weight": 22.0,
                "co2": 67.0
            },
            {
                "title": "Espresso Machine with Clogged Descaling Valve",
                "desc": "Restored at Campus Fix-It Clinic by clearing calcium blockage.",
                "cat": "Home appliances",
                "type": "repair",
                "owner": jordan,
                "req": alex,
                "weight": 6.5,
                "co2": 42.0
            },
            {
                "title": "Pack of 8 Engineering Course Binders & Dividers",
                "desc": "Donated to incoming freshman STEM cohort.",
                "cat": "Books and educational materials",
                "type": "donation",
                "owner": maya,
                "req": sam,
                "weight": 3.2,
                "co2": 5.4
            },
            {
                "title": "Bulk Defective Motherboards & Copper Heat Sinks",
                "desc": "Diverted to state-certified precious metal recycler.",
                "cat": "Electronics",
                "type": "recycling",
                "owner": alex,
                "req": sam,
                "weight": 8.4,
                "co2": 64.6
            }
        ]

        for hist in historical_exchanges:
            # Create completed listing
            l = ItemListing(
                title=hist["title"],
                description=hist["desc"],
                category=hist["cat"],
                condition="Good",
                purpose="Give away" if hist["type"] == "reuse" else ("Request repair" if hist["type"] == "repair" else "Donate"),
                price=0.0,
                image_url="https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=800&q=80",
                location_name="Campus Sustainability Hub",
                status="Completed",
                owner_id=hist["owner"].id
            )
            db.add(l)
            db.commit()

            comp = CompletedExchange(
                listing_id=l.id,
                owner_id=hist["owner"].id,
                requester_id=hist["req"].id,
                exchange_type=hist["type"],
                item_category=hist["cat"],
                estimated_weight_kg=hist["weight"],
                estimated_co2_kg=hist["co2"]
            )
            db.add(comp)
            db.flush()

            imp = ImpactRecord(
                exchange_id=comp.id,
                category=hist["cat"],
                weight_kg=hist["weight"],
                co2_avoided_kg=hist["co2"],
                exchange_type=hist["type"]
            )
            db.add(imp)

            award_exchange_rewards(db, comp)

        db.commit()

        print("Seeding verified local repair providers and community clinics...")
        # 4. Repair Providers
        repair_providers = [
            RepairProvider(
                name="CircularLoop Campus Fix-It Clinic",
                category="General & Electronics",
                address="Student Center Makerspace (Rm 104)",
                phone="(555) 019-2834",
                website="https://circularloop.edu/repair-clinic",
                latitude=42.3595,
                longitude=-71.0940,
                rating=4.9,
                is_verified=True,
                description="Weekly free student-run repair cafe with 3D printers, soldering irons, and sewing machines."
            ),
            RepairProvider(
                name="Apex Electronics & Micro-Soldering Hub",
                category="Electronics",
                address="142 Tech Square Boulevard",
                phone="(555) 018-9921",
                website="https://apextechrepair.example.com",
                latitude=42.3625,
                longitude=-71.0915,
                rating=4.8,
                is_verified=True,
                description="Specialists in laptop motherboard diagnostics, screen replacement, and battery refurbishing."
            ),
            RepairProvider(
                name="Campus Community Bike Workshop",
                category="Bicycles & Sports",
                address="Athletic Center Basement Bay 2",
                phone="(555) 014-4412",
                website="https://circularloop.edu/bike-coop",
                latitude=42.3585,
                longitude=-71.0965,
                rating=4.9,
                is_verified=True,
                description="Do-it-together bike maintenance cooperative with free tube patching and tool loaning."
            ),
            RepairProvider(
                name="Timber & Thread Furniture Restoration",
                category="Furniture & Clothing",
                address="88 Industrial Way",
                phone="(555) 017-3388",
                website="https://timberandthread.example.com",
                latitude=42.3650,
                longitude=-71.0850,
                rating=4.7,
                is_verified=True,
                description="Professional joinery repairs, chair re-upholstery, and heavy canvas alterations."
            )
        ]
        db.add_all(repair_providers)
        db.commit()

        print("CircularLoop database successfully seeded with demonstration data!")
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
