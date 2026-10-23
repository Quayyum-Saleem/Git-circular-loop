from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.db.session import get_db
from app.models.models import User
from app.schemas.schemas import UserCreate, UserLogin, UserResponse, Token
from app.core.security import get_password_hash, verify_password, create_access_token
from app.api.deps import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

class DemoLoginRequest(BaseModel):
    role: str = "student" # "student", "repairer", "donor"

@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_in.email.lower()).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists"
        )
    user = User(
        email=user_in.email.lower(),
        hashed_password=get_password_hash(user_in.password),
        full_name=user_in.full_name,
        location=user_in.location or "Campus Center",
        bio=user_in.bio,
        avatar_url=user_in.avatar_url or f"https://api.dicebear.com/7.x/bottts/svg?seed={user_in.email}",
        circular_points=50, # Initial welcome points
        is_demo=False
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token(user.id)
    return Token(access_token=token, user=UserResponse.model_validate(user))

@router.post("/login", response_model=Token)
def login(login_in: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_in.email.lower()).first()
    if not user or not verify_password(login_in.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    token = create_access_token(user.id)
    return Token(access_token=token, user=UserResponse.model_validate(user))

@router.get("/me", response_model=UserResponse)
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    return UserResponse.model_validate(current_user)

@router.post("/demo-login", response_model=Token)
def demo_login(req: DemoLoginRequest, db: Session = Depends(get_db)):
    """
    Clearly separated hackathon demo login allowing instant testing
    as different stakeholders (Student Maya, Repairer Alex, or Coordinator Sam).
    """
    demo_emails = {
        "student": "maya.student@circularloop.edu",
        "repairer": "alex.repair@circularloop.edu",
        "coordinator": "sam.coordinator@circularloop.edu"
    }
    target_email = demo_emails.get(req.role, demo_emails["student"])
    user = db.query(User).filter(User.email == target_email).first()

    if not user:
        # Create on demand if seed not yet executed
        role_names = {
            "student": ("Maya Chen", "College Student (CS Junior)", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80"),
            "repairer": ("Alex Thorne", "Community Tech & Repair Enthusiast", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80"),
            "coordinator": ("Sam Rivera", "Campus Sustainability Coordinator", "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80")
        }
        name, bio, avatar = role_names.get(req.role, role_names["student"])
        user = User(
            email=target_email,
            hashed_password=get_password_hash("demo_password_123"),
            full_name=name,
            location="University Campus",
            bio=bio,
            avatar_url=avatar,
            circular_points=240,
            is_demo=True
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    token = create_access_token(user.id)
    return Token(access_token=token, user=UserResponse.model_validate(user))
