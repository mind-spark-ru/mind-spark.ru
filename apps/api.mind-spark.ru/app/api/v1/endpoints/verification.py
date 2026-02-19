from fastapi import APIRouter

from app.services.mail_service import mail_service

router = APIRouter()


@router.get("/health")
def verification_health()->dict:
    return {"health": True}

@router.post("/send_verification_code")
async def send_verification_code(
    email: str,
)-> dict:
    return await mail_service.send_verification_code(email)

@router.get("/verification")
async def verification_email(
    email: str,
    code: int,
)-> dict:
    return await mail_service.verify_code(email, code)
