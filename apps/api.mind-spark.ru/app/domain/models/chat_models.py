from sqlalchemy import Column, ForeignKey, Integer, String

from app.domain.models import BaseModel


class ChatModel(BaseModel):
    __tablename__ = "chats"

    user_id = Column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True
    )
    question = Column(String)
    answer = Column(String)