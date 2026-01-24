from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.api import router
from app.services.embedding_service import embedding_service


@asynccontextmanager
async def lifespan(app: FastAPI):
    embedding_service.load_model()
    yield
    embedding_service.model = None
    embedding_service.tokenizer = None


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
