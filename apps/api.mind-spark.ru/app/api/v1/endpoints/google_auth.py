from fastapi import APIRouter, Body, Depends, HTTPException, status

from app.api.dependencies.services import get_googleoauth_service
from app.services.googleoauth_service import GoogleoauthService

router = APIRouter()


@router.get("/url")
def get_google_oauth_redirect_uri(
    service: GoogleoauthService = Depends(get_googleoauth_service)
)->dict:
    try:
        return {
            "url": service.generate_google_oauth_redirect_uri()
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=str(e),
        )


@router.post("/callback")
async def handle_code(
    code: str = Body(..., embed=True),
    service: GoogleoauthService = Depends(get_googleoauth_service)
)->dict:
    try:
        return await service.decode_token(code)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=str(e),
        )


