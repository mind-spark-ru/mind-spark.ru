from fastapi import APIRouter

from app.services.embedding_service import embedding_service


router = APIRouter()


@router.get("/embedding/health")
async def health():
    return {
        "status": "healthy",
        "model_loaded": embedding_service.model is not None,
        "model_name": embedding_service.model_name,
    }


@router.get("/")
async def main():
    return {
        "success": True,
    }


@router.post("/embedding")
async def embededding(text: str):
    return embedding_service.get_embedding_list(text)

