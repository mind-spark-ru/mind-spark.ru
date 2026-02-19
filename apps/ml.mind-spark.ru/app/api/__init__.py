from fastapi import APIRouter

from .v1.endpoints import ml, api

router = APIRouter()

router.include_router(api.router, prefix="/v1/api", tags=["api"])
router.include_router(ml.router, prefix="/v1/ml", tags=["ml"])
