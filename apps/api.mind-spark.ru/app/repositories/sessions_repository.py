import secrets
from datetime import datetime, timedelta

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.models.session_models import SessionModel


class SessionRepository:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def create_session(
        self, user_id: int, expires_days: int = 3,
    ) -> SessionModel | None:
        token = secrets.token_urlsafe(32)
        expire_at = datetime.now() + timedelta(days=expires_days)

        session = SessionModel(
            user_id=user_id, token=token, expires_at=expire_at,
        )
        self.db.add(session)
        await self.db.commit()
        await self.db.refresh(session)
        return session

    async def get_session(self, session_id: int) -> SessionModel | None:
        result = await self.db.execute(
            select(SessionModel).where(SessionModel.id == session_id),
        )
        return result.scalar_one_or_none()
    
    async def get_session_by_token(self, token: str) -> SessionModel | None:
        result = await self.db.execute(
            select(SessionModel).where(SessionModel.token == token),
        )
        return result.scalar_one_or_none()

    async def delete_session(self, session_id: int) -> SessionModel | None:
        session = self.get_session(session_id)
        if session:
            await self.db.delete(session)
            await self.db.commit()
        return session

    async def is_valid(self, session: SessionModel):
        if not session:
            return False
        return datetime.now(timezone=True) < session.expires_at
