from passlib.context import CryptContext
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.sessions_repository import SessionRepository
from app.repositories.user_repository import UserRepository
from app.domain.schemas.users_schemas import UserResponse

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
)


class SessionService:
    def __init__(self, db: AsyncSession) -> None:
        self.Sessionrepository = SessionRepository(db)
        self.Userrepository = UserRepository(db)

    @staticmethod
    def get_password_hash(password: str) -> str:
        return pwd_context.hash(password)

    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        return pwd_context.verify(plain_password, hashed_password)

    async def login(self, email: str, password: str) -> str:
        user = await self.Userrepository.get_by_email(email)
        if not user:
            raise ValueError("No such user")
        if not self.verify_password(password, user.hashed_password):
            raise ValueError("Incorrect password")
        session = await self.Sessionrepository.create_session(user_id=user.id)
        return session.token
    
    async def get_user_by_token(self, token: str)-> dict | None:
        token_obj = await self.Sessionrepository.get_session_by_token(token)
        if not token_obj:
            raise ValueError("Error: No such token")
        user = await self.Userrepository.get_by_id(token_obj.user_id)
        if not user:
            raise ValueError("Error: No such user")
        return {
            "id": user.id,
            "email": user.email,
            "username": user.username,
            "is_active": user.is_active,
            "created_at": user.created_at,
            "fullname": user.fullname,
        }
