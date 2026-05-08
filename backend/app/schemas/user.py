from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional
from app.models.user import UserRole


class UserCreate(BaseModel):
    uid: str
    email: EmailStr
    display_name: Optional[str] = None


class UserResponse(BaseModel):
    uid: str
    email: str
    display_name: Optional[str]
    role: UserRole
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class UserUpdate(BaseModel):
    display_name: Optional[str] = None
    role: Optional[UserRole] = None
    is_active: Optional[bool] = None
