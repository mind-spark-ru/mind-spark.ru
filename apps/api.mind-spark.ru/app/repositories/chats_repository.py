from datetime import datetime, timedelta

from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.models.chat_models import ChatModel
from app.domain.schemas.chats_schemas import ConversationBase


class ChatRepository:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db
    
    async def get_conversation(
        self, id: int
    ) -> ChatModel | None:
        result = await self.db.execute(
            select(ChatModel)
            .where(ChatModel.id == id)
        )
        return result.scalar_one_or_none()
    
    async def create_conversation(
        self, conversation: ConversationBase
    ) -> ChatModel | None: 
        db_conversation = ChatModel(
            **conversation.model_dump()
        )
        self.db.add(db_conversation)
        await self.db.commit()
        await self.db.refresh(db_conversation)
        return db_conversation
    
    async def get_all_conversation_by_user_id(
            self, user_id: int
    ) -> list[ChatModel]:
        result = await self.db.execute(
            select(ChatModel)
            .where(ChatModel.user_id == user_id)
            .order_by(ChatModel.created_at.desc())
        )
        conversations = result.scalars().all()
        return conversations
    
    async def get_all_conversation_by_user_id_limit_offset(
        self,
        user_id: int,
        limit: int = 20,
        offset: int = 0,
    ) -> list[ChatModel]:
        limit = min(max(limit, 1), 100)
        offset = max(offset, 0)
        result = await self.db.execute(
            select(ChatModel)
            .where(ChatModel.user_id == user_id)
            .order_by(desc(ChatModel.created_at))
            .offset(offset)
            .limit(limit)
        )
        items = result.scalars().all()
        return items
    
