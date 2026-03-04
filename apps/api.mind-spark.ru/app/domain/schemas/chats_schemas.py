from app.domain.schemas import Base


class ConversationBase(Base):
    question: str
    answer: str
    user_id: int