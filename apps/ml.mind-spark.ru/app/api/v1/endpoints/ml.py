from fastapi import APIRouter

from app.services.neural_service import neural_service
from app.core.config import settings

router = APIRouter()


@router.get("/")
async def root():
    return {
        "message": "Neural Network API"
    }

@router.get("/health")
async def health_check():
    return {
        "status": "healthy", "model_loaded": settings.MODEL_NAME
    }

@router.get("/model/info")
async def model_info():
    return {
        "model_name": "your_model_name",
        "version": "1.0.0",
        "input_shape": "model.input_shape",
        "output_classes": "num_classes"
    }

@router.post("/predict")
async def predict(text: str):
    prediction = neural_service.chat(text)
    return {
        "prediction": prediction
    }
