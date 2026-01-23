from datetime import datetime

from pydantic import EmailStr

from app.domain.schemas import Base


class UserBase(Base):
    email: EmailStr
    username: str
    fullname: str | None = None


class UserCreate(UserBase):
    password: str | None


class UserUpdate(UserBase):
    email: EmailStr | None = None
    username: str | None = None
    fullname: str | None = None
    password: str | None = None


class UserUpdateInDB(UserBase):
    email: EmailStr
    username: str
    fullname: str
    hashed_password: str


class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime | None = None
    fullname: str

    class Config:
        from_attributes = True
