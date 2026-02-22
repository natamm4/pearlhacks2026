from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import os
import traceback

# Import routers (uncomment as you build them out)
from routes import (
    router_profiles,
    router_financial_profiles,
    router_income,
    router_debts,
    router_goals,
    router_preferences,
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    required_vars = ["SUPABASE_URL", "SUPABASE_SERVICE_KEY"]
    missing_vars = [var for var in required_vars if not os.getenv(var)]

    if missing_vars:
        print(f"WARNING: Missing environment variables: {', '.join(missing_vars)}")
    else:
        print("All required environment variables are set")
    yield


app = FastAPI(lifespan=lifespan, title="UYO API")

# CORS
allowed_origins_str = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://192.168.1.191:3000")
allowed_origins = [origin.strip() for origin in allowed_origins_str.split(",")]
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:8000",
        "http://127.0.0.1:3000",
        "http://192.168.1.191:3000"
    ],
    # allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global error handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    print(f"Error: {str(exc)}")
    print(f"Traceback: {traceback.format_exc()}")
    return JSONResponse(
        status_code=500,
        content={"detail": str(exc), "type": type(exc).__name__}
    )

# Include routers
app.include_router(router_profiles)
app.include_router(router_financial_profiles)
app.include_router(router_income)
app.include_router(router_debts)
app.include_router(router_goals)
app.include_router(router_preferences)


@app.get("/")
async def root():
    return {"message": "UYO API"}

@app.get("/health")
async def health():
    return {"status": "healthy"}