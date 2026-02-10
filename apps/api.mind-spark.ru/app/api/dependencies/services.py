from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.services.googleoauth_service import GoogleoauthService
from app.services.session_service import SessionService
from app.services.user_service import UserService


def get_user_service(db: AsyncSession = Depends(get_db)) -> UserService:
    return UserService(db)


def get_session_service(db: AsyncSession = Depends(get_db)) -> SessionService:
    return SessionService(db)


def get_googleoauth_service() -> GoogleoauthService:
    return GoogleoauthService()
