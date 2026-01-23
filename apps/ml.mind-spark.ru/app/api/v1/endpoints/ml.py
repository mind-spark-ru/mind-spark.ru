from fastapi import APIRouter

from app.services.neural_service import neuro_service

router = APIRouter()


@router.get("/health")
async def health():
    return {
        "status": "healthy",
        "model_loaded": neuro_service.model is not None,
        "model_name": neuro_service.model_name,
    }


@router.get("/")
async def main():
    return {
        "success": True,
    }


@router.post("/embedding")
async def embededding(text: str):
    return neuro_service.get_embedding_list(text)
