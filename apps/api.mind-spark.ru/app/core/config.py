from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Database
    DATABASE_URL: str

    SMTP_SERVER: str 
    SMTP_PORT: str
    EMAIL_ADDRESS: str
    EMAIL_PASSWORD: str
    
    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", case_sensitive=True,
    )


settings = Settings()
