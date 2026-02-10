from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    DATABASE_URL: str

    SMTP_SERVER: str
    SMTP_PORT: str
    EMAIL_ADDRESS: str
    EMAIL_PASSWORD: str

    REDIS_HOST: str
    REDIS_PORT: int
    REDIS_PASSWORD: str
    REDIS_DB: int

    VERIFICATION_CODE_TTL: int = 600

    OAUTH_GOOGLE_CLIENT_SECRET: str
    OAUTH_GOOGLE_CLIENT_ID: str
    GOOGLE_TOKEN_URL: str

    JWT_SECRET_KEY: str

    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", case_sensitive=True,
    )


settings = Settings()
