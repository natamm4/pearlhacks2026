from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    NEXT_PUBLIC_SUPABASE_URL: str
    NEXT_PUBLIC_SUPABASE_ANON_KEY: str

    class Config:
        env_file = ".env.local"

settings = Settings()
