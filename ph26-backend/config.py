import os
from dotenv import load_dotenv
from pydantic_settings import BaseSettings, SettingsConfigDict

load_dotenv()  # <-- force load .env before Pydantic runs

class Settings(BaseSettings):
    SUPABASE_URL: str
    SUPABASE_SERVICE_KEY: str

    model_config = SettingsConfigDict(
        extra="ignore",
    )

settings = Settings()