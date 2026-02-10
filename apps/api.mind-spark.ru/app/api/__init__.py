from fastapi import APIRouter

from .v1.endpoints import google_auth, items, sessions, users

router = APIRouter()

router.include_router(
    items.router, prefix="/v1/items", tags=["items"]
)
router.include_router(
    users.router, prefix="/v1/users", tags=["users"]
)
router.include_router(
    sessions.router, prefix="/v1/sessions", tags=["sessions"],
)
router.include_router(
    google_auth.router, prefix="/v1/google", tags=["google_auth"]
)
