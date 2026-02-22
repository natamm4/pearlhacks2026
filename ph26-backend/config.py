from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    SUPABASE_URL: str
    SUPABASE_SERVICE_KEY: str   # use the service key here, NOT the anon key
                                # service key bypasses RLS, which is fine since
                                # we're enforcing ownership in the route logic
    class Config:
        env_file = ".env"

settings = Settings()
```

And your `.env`:
```
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_KEY=eyJ... 