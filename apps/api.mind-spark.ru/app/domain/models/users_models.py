from sqlalchemy import Boolean, Column, String

from app.domain.models import BaseModel


class User(BaseModel):
    __tablename__ = "users"

    username = Column(String, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    fullname = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
