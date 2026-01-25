from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).parent.parent.parent


class Settings(BaseSettings):

    MODEL_NAME: str
    MODELS_PATH: str

    @property
    def model_path(self) -> str:
        return f"{BASE_DIR}/{self.MODELS_PATH}/{self.MODEL_NAME}.gguf"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
    )


settings = Settings()
