from fastapi import APIRouter

from app.services.neural_service import neural_service

router = APIRouter()


@router.get("/")
async def main():
    return {
        "success": True,
    }


@router.post("/")
async def chat(text: str) -> str:
    return neural_service.chat(text)

