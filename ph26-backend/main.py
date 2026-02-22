from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import os
import traceback
from database import create_db_and_tables

# Import routers
from api.catalogs import router as catalogs_router
from api.templates import router as templates_router
from api.mappings import router as mappings_router                                                                                                                                                      
                                                                                                                                                                                                        
                                                                                                                                                                                                        
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Validate required environment variables
    required_vars = ["DATABASE_URL", "SUPABASE_URL", "SUPABASE_ANON_KEY"]
    missing_vars = [var for var in required_vars if not os.getenv(var)]

    if missing_vars:
        print(f"WARNING: Missing environment variables: {', '.join(missing_vars)}")
    else:
        print("All required environment variables are set")

    create_db_and_tables()
    yield                                                                                                                                                                                                 
                                                                                                                                                                                                        
                                                                                                                                                                                                        
app = FastAPI(lifespan=lifespan, title="Pre-Flight API")                                                                                                                                                  
                                                                                                                                                                                                        
# CORS configuration
allowed_origins_str = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173")
allowed_origins = [origin.strip() for origin in allowed_origins_str.split(",")]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global exception handler to ensure CORS headers are sent even on errors
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    error_traceback = traceback.format_exc()
    print(f"Error: {str(exc)}")
    print(f"Traceback: {error_traceback}")

    return JSONResponse(
        status_code=500,
        content={"detail": str(exc), "type": type(exc).__name__}
    )

# Include routers
app.include_router(catalogs_router)
app.include_router(templates_router)
app.include_router(mappings_router)                                                                                                                                                                      
                                                                                                                                                                                                        
                                                                                                                                                                                                        
@app.get("/")
async def root():
    return {"message": "Pre-Flight API"}


@app.get("/health")
async def health():
    return {"status": "healthy"} 