from fastapi import APIRouter

from .v1.endpoints import ml

router = APIRouter()

router.include_router(ml.router, prefix="/v1/ml", tags=["ml"])
