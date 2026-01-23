
from passlib.context import CryptContext
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.schemas.users_schemas import (
    UserCreate,
    UserUpdate,
    UserUpdateInDB,
)
from app.repositories.user_repository import UserRepository

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
)


class UserService:
    def __init__(self, db: AsyncSession) -> None:
        self.repository = UserRepository(db)

    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        return pwd_context.verify(plain_password, hashed_password)

    @staticmethod
    def get_password_hash(password: str) -> str:
        return pwd_context.hash(password)

    async def create_user(self, user_data: UserCreate) -> dict:
        existing_user = await self.repository.get_by_email(user_data.email)
        if existing_user:
            raise ValueError("User with this email already exists")
        hashed_password = self.get_password_hash(user_data.password)

        user = await self.repository.create(user_data, hashed_password)
        return {
            "id": user.id,
            "email": user.email,
            "username": user.username,
            "is_active": user.is_active,
            "created_at": user.created_at,
            "fullname": user.fullname,
        }

    async def authenticate_user(
        self, email: str, password: str,
    ) -> dict | None:
        user = await self.repository.get_by_email(email)
        if not user:
            return None
        if not self.verify_password(password, user.hashed_password):
            return None
        return {
            "id": user.id,
            "email": user.email,
            "username": user.username,
        }

    async def update_user(self, user_id: int, user_data: UserUpdate):
        user_data = user_data.model_dump()
        if user_data.get("password"):
            user_data["hashed_password"] = self.get_password_hash(
                user_data["password"],
            )
            user_data.pop("password", None)
        user_data = UserUpdateInDB(**user_data)
        return await self.repository.update(user_id, user_data)
