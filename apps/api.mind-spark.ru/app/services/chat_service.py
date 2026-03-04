from typing import List
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.chats_repository import ChatRepository
from app.domain.models.chat_models import ChatModel
from app.domain.schemas.chats_schemas import ConversationBase


class ChatService:
    def __init__(self, db: AsyncSession) -> None:
        self.repository = ChatRepository(db)

    async def get_chat_by_user_id(self, user_id: int) -> List[ChatModel]:
        result = await self.repository.get_all_conversation_by_user_id(user_id)
        return result

    async def create_conversation(self, user_data: ConversationBase) -> ConversationBase:
        result = await self.repository.create_conversation(user_data)
        return result
    