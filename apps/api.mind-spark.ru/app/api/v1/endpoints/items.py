from fastapi import APIRouter

router = APIRouter()


@router.get("/")
def items():
    return {"success": True}
