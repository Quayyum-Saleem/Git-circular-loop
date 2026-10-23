import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.db.session import engine, Base, SessionLocal
from app.models.models import User, ItemListing, ExchangeRequest, CompletedExchange, ImpactRecord

client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_test_db():
    # Setup fresh test database state
    Base.metadata.create_all(bind=engine)
    yield
    # Teardown if needed

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}

def test_register_and_login():
    email = "test_user_circular@example.com"
    password = "secure_password_123"

    # Register
    reg_res = client.post("/api/auth/register", json={
        "email": email,
        "password": password,
        "full_name": "Test User",
        "location": "Dorm 4"
    })
    assert reg_res.status_code in [201, 400] # 400 if already created in earlier test run

    # Login
    login_res = client.post("/api/auth/login", json={
        "email": email,
        "password": password
    })
    assert login_res.status_code == 200
    data = login_res.json()
    assert "access_token" in data
    assert data["user"]["email"] == email

def test_demo_login():
    res = client.post("/api/auth/demo-login", json={"role": "student"})
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert data["user"]["email"] == "maya.student@circularloop.edu"

def test_create_and_get_listing():
    # Login as demo student
    login_res = client.post("/api/auth/demo-login", json={"role": "student"})
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Create listing
    create_res = client.post("/api/listings", headers=headers, json={
        "title": "TI-84 Plus CE Graphing Calculator",
        "description": "Rechargeable battery, color screen, with charging cord.",
        "category": "Electronics",
        "condition": "Like New",
        "purpose": "Give away",
        "price": 0.0,
        "location_name": "Math Building Foyer"
    })
    assert create_res.status_code == 201
    item = create_res.json()
    item_id = item["id"]
    assert item["title"] == "TI-84 Plus CE Graphing Calculator"

    # Get single listing
    get_res = client.get(f"/api/listings/{item_id}")
    assert get_res.status_code == 200
    assert get_res.json()["category"] == "Electronics"

def test_listing_filters_and_search():
    # Search for laptop
    res = client.get("/api/listings?search=ThinkPad")
    assert res.status_code == 200
    items = res.json()
    assert any("ThinkPad" in item["title"] for item in items)

    # Filter by category
    cat_res = client.get("/api/listings?category=Books%20and%20educational%20materials")
    assert cat_res.status_code == 200
    for item in cat_res.json():
        assert item["category"] == "Books and educational materials"

def test_access_control_edit_other_user_listing():
    # Student Maya creates an item
    maya_token = client.post("/api/auth/demo-login", json={"role": "student"}).json()["access_token"]
    create_res = client.post("/api/listings", headers={"Authorization": f"Bearer {maya_token}"}, json={
        "title": "Private Maya Item",
        "description": "For testing permissions only.",
        "category": "Other",
        "condition": "Fair",
        "purpose": "Give away",
        "price": 0.0
    })
    item_id = create_res.json()["id"]

    # Alex tries to edit Maya's item -> Should be rejected 403
    alex_token = client.post("/api/auth/demo-login", json={"role": "repairer"}).json()["access_token"]
    edit_res = client.put(f"/api/listings/{item_id}", headers={"Authorization": f"Bearer {alex_token}"}, json={
        "title": "Hacked Title"
    })
    assert edit_res.status_code == 403

def test_full_exchange_workflow_and_idempotency():
    # 1. Student creates an item
    student_token = client.post("/api/auth/demo-login", json={"role": "student"}).json()["access_token"]
    create_res = client.post("/api/listings", headers={"Authorization": f"Bearer {student_token}"}, json={
        "title": "Circular Test Textbook",
        "description": "Chemistry Principles 5th Edition.",
        "category": "Books and educational materials",
        "condition": "Good",
        "purpose": "Give away",
        "price": 0.0
    })
    listing_id = create_res.json()["id"]

    # 2. Repairer requests the item
    repairer_token = client.post("/api/auth/demo-login", json={"role": "repairer"}).json()["access_token"]
    req_res = client.post("/api/exchanges/requests", headers={"Authorization": f"Bearer {repairer_token}"}, json={
        "listing_id": listing_id,
        "message": "I would love to pick this up!"
    })
    assert req_res.status_code == 201
    request_id = req_res.json()["id"]

    # 3. Student accepts the request
    accept_res = client.put(f"/api/exchanges/requests/{request_id}/status", headers={"Authorization": f"Bearer {student_token}"}, json={
        "status": "Accepted"
    })
    assert accept_res.status_code == 200
    assert accept_res.json()["status"] == "Accepted"

    # 4. Complete the exchange
    comp_res = client.post("/api/exchanges/complete", headers={"Authorization": f"Bearer {student_token}"}, json={
        "listing_id": listing_id,
        "exchange_request_id": request_id,
        "exchange_type": "reuse"
    })
    assert comp_res.status_code == 200
    comp_data = comp_res.json()
    assert comp_data["listing_id"] == listing_id
    assert comp_data["estimated_weight_kg"] > 0
    assert comp_data["estimated_co2_kg"] > 0

    # 5. Prevent duplicate completion
    dup_res = client.post("/api/exchanges/complete", headers={"Authorization": f"Bearer {student_token}"}, json={
        "listing_id": listing_id,
        "exchange_request_id": request_id,
        "exchange_type": "reuse"
    })
    assert dup_res.status_code == 400

def test_smart_matching_recommendations():
    res = client.get("/api/matching/recommendations?query=laptop&category=Electronics")
    assert res.status_code == 200
    recommendations = res.json()
    assert isinstance(recommendations, list)
    if len(recommendations) > 0:
        first = recommendations[0]
        assert "listing" in first
        assert "match_explanation" in first
        assert first["match_explanation"]["score"] >= 40
        assert len(first["match_explanation"]["factors"]) > 0

def test_repair_guides_and_providers():
    guide_res = client.get("/api/repair/guide?category=Electronics&problem_type=battery")
    assert guide_res.status_code == 200
    guide = guide_res.json()
    assert guide["difficulty"] in ["Easy", "Moderate", "Advanced / Professional"]
    assert len(guide["troubleshooting_steps"]) > 0

    prov_res = client.get("/api/repair/providers")
    assert prov_res.status_code == 200
    assert len(prov_res.json()) > 0

def test_impact_analytics_and_methodology():
    impact_res = client.get("/api/impact/analytics")
    assert impact_res.status_code == 200
    data = impact_res.json()
    assert "summary" in data
    assert "category_breakdown" in data
    assert "monthly_trends" in data
    assert "methodology" in data
    assert data["summary"]["total_completed_exchanges"] >= 1
    assert data["summary"]["total_waste_diverted_kg"] > 0
