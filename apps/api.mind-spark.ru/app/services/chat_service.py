from typing import List
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.chats_repository import ChatRepository
from app.repositories.user_repository import UserRepository
from app.domain.models.chat_models import ChatModel
from app.domain.schemas.chats_schemas import ConversationBase, ConversationCreate


class ChatService:
    def __init__(self, db: AsyncSession) -> None:
        self.repository = ChatRepository(db)
        self.userRepository = UserRepository(db)

    async def get_chat_by_user_id(self, user_id: int) -> List[ChatModel]:
        result = await self.repository.get_all_conversation_by_user_id(user_id)
        return result

    async def create_conversation_by_user_id(self, user_data: ConversationBase) -> ChatModel:
        result = await self.repository.create_conversation(user_data)
        return result
    
    async def create_conversation_by_email(self, user_data: ConversationCreate) -> ChatModel:
        user = await self.userRepository.get_by_email(user_data.email)
        conversation_data = ConversationBase(
        user_id=user.id, 
        question=user_data.question, 
        answer=user_data.answer
    )
        result = await self.repository.create_conversation(conversation_data)
        return result
    