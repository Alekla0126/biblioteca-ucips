from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime, timezone
from app.core.database import get_db
from app.core.firebase import verify_firebase_token, set_admin_claim
from app.models.user import User, UserRole
from app.schemas.user import UserCreate, UserResponse, UserUpdate
from app.api.deps import get_current_user, get_current_admin
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

router = APIRouter(prefix="/auth", tags=["auth"])
bearer = HTTPBearer()


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(
    credentials: HTTPAuthorizationCredentials = Depends(bearer),
    db: AsyncSession = Depends(get_db),
):
    """Register user in DB after Firebase signup. Called once after Firebase creates the account."""
    try:
        payload = verify_firebase_token(credentials.credentials)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))

    uid = payload["uid"]
    email = payload.get("email", "")

    result = await db.execute(select(User).where(User.uid == uid))
    existing = result.scalar_one_or_none()
    if existing:
        existing.last_login = datetime.now(timezone.utc)
        return existing

    user = User(
        uid=uid,
        email=email,
        display_name=payload.get("name"),
        role=UserRole.user,
    )
    db.add(user)
    await db.flush()
    return user


@router.post("/login", response_model=UserResponse)
async def login(
    credentials: HTTPAuthorizationCredentials = Depends(bearer),
    db: AsyncSession = Depends(get_db),
):
    """Validate Firebase token and update last_login."""
    try:
        payload = verify_firebase_token(credentials.credentials)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))

    uid = payload["uid"]
    result = await db.execute(select(User).where(User.uid == uid))
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no registrado. Por favor registre su cuenta.",
        )

    user.last_login = datetime.now(timezone.utc)
    return user


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.patch("/me", response_model=UserResponse)
async def update_me(
    data: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if data.display_name is not None:
        current_user.display_name = data.display_name
    return current_user


@router.patch("/users/{uid}/role", response_model=UserResponse)
async def update_user_role(
    uid: str,
    data: UserUpdate,
    _admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    """Admin: change user role."""
    result = await db.execute(select(User).where(User.uid == uid))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    if data.role is not None:
        user.role = data.role
        set_admin_claim(uid, data.role == UserRole.admin)
    if data.is_active is not None:
        user.is_active = data.is_active
    return user
