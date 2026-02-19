from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from app.core.config import settings
from app.services.neural_service import neural_service

router = APIRouter()


@router.get("/health")
async def ml_health():
    return {
        "health": True,
    }


@router.get("/")
async def root():
    return {
        "message": "Neural Network API",
    }


@router.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "model_loaded": settings.MODEL_NAME,
    }


@router.post("/predict")
async def predict(text: str):
    return StreamingResponse(
        neural_service.chat(text),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        },
    )
