from fastapi import APIRouter

from .v1.endpoints import api, google_auth, sessions, users, verification, chats

router = APIRouter()

router.include_router(
    api.router, prefix="/v1/api", tags=["api"]
)
router.include_router(
    verification.router, prefix="/v1/verification", tags=["verification"]
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
router.include_router(
    chats.router, prefix="/v1/chats", tags=["chats"]
)
