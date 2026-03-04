from typing import Annotated, List
from fastapi import APIRouter, status, Depends, HTTPException

from app.domain.schemas.chats_schemas import ConversationBase, ConversationCreate
from app.services.chat_service import ChatService
from app.api.dependencies.services import get_chat_service


router = APIRouter()


@router.get("/health")
def health()->dict:
    return {"health": True}


@router.post("/", response_model=ConversationBase, status_code=status.HTTP_201_CREATED)
async def create_conversation(
    user_data: ConversationCreate, service: Annotated[ChatService, Depends(get_chat_service)]
):
    try:
        return await service.create_conversation_by_email(user_data)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=str(e)
        )


@router.get("/", response_model=List[ConversationBase], status_code=status.HTTP_200_OK)
async def get_conversations_by_user_id(
    user_id: int, service: Annotated[ChatService, Depends(get_chat_service)]
):
    try:
        return await service.get_chat_by_user_id(user_id)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=str(e)
        )
    