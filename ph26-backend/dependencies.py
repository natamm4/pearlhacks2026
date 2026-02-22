# dependencies.py
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from supabase import create_client, Client
from config import settings

# ============================================================
# SUPABASE CLIENT
# Single instance reused across all requests
# ============================================================
supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_KEY)
def get_supabase() -> Client:
    return supabase

# ============================================================
# AUTH
# Extracts the JWT from the Authorization: Bearer <token> header,
# then asks Supabase to validate it and return the user
# ============================================================
bearer_scheme = HTTPBearer()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Client = Depends(get_supabase)    # renamed from supabase → db
):
    token = credentials.credentials
    try:
        response = db.auth.get_user(token)
        if not response.user:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
        return response.user
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")