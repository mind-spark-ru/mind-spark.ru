from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.api import router
from app.core.config import settings
from app.services.neural_service import neural_service


@asynccontextmanager
async def lifespan(app: FastAPI):
    if not settings.SKIP_MODEL_LOAD:
        neural_service.load()
    yield
    if neural_service.llm:
        neural_service.llm = None


app = FastAPI(
    title="ml.mind-spark.ru",
    version="1.0.0",
    lifespan=lifespan,
)

app.include_router(router)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8001,
        reload=True,
    )
