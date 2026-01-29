import redis.asyncio as redis

from app.core.config import settings


class RedisClient:
    def __init__(self)->None:
        self.client = None

    async def connect(self)->None:
        self.client = redis.Redis(
            host=settings.REDIS_HOST,
            port=settings.REDIS_PORT,
            password=settings.REDIS_PASSWORD or None,
            db=settings.REDIS_DB,
            decode_responses=True,
            socket_timeout=5,
            socket_connect_timeout=5,
            retry_on_timeout=True,
        )
        await self.client.ping()

    async def disconnect(self)->None:
        if self.client:
            await self.client.close()

    async def save_verification_code(
        self,
        email: str,
        code: int,
    )->bool | None:
        try:
            key = f"verification:{email}"
            await self.client.setex(
                key,
                settings.VERIFICATION_CODE_TTL,
                code,
            )
            return True
        except Exception:
            return None

    async def get_verification_code(
            self,
            email: str,
        ) -> str | None:
        try:
            key = f"verification:{email}"
            return await self.client.get(key)
        except Exception:
            return None

    async def delete_verification_code(
            self,
            email: str,
        ) -> bool | None:
        try:
            key = f"verification:{email}"
            await self.client.delete(key)
            return True
        except Exception:
            return None

    async def is_code_valid(
            self,
            email: str,
            code: int,
            ) -> bool:

        stored_code = await self.get_verification_code(email)
        if stored_code:
            return int(stored_code) == code
        return None

redis_client = RedisClient()
