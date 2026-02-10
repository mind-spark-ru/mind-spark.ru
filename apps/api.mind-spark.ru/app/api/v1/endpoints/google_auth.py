from fastapi import APIRouter, Body, Response, Request, Depends

from app.services.googleoauth_service import GoogleoauthService
from app.api.dependencies.services import get_googleoauth_service
router = APIRouter()


@router.get("/url")
def get_google_oauth_redirect_uri(
    service: GoogleoauthService = Depends(get_googleoauth_service)
):
    uri = service.generate_google_oauth_redirect_uri()
    return {
        "url": uri
    }


@router.post("/callback")
async def handle_code(
    code: str = Body(..., embed=True),
    responseAPI: Response = None,
    request: Request = None,
    service: GoogleoauthService = Depends(get_googleoauth_service)
):
    data = await service.decode_token(code)
    print(data)
    return data