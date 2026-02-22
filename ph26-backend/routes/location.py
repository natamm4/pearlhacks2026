from fastapi import APIRouter, Depends, HTTPException, Query
from supabase import Client

from dependencies import get_supabase
from services.location import search_locations, get_location

router_location = APIRouter(prefix="/location", tags=["Location"])


@router_location.get("/search")
def location_search(
    q: str = Query(..., min_length=1, description="City name search term"),
    limit: int = Query(default=10, ge=1, le=50),
    supabase: Client = Depends(get_supabase),
):
    """Public endpoint — no auth required. Returns city matches with RPP index."""
    results = search_locations(supabase, q, limit)
    return {"results": results}


@router_location.get("/{state_abbr}/{city}")
def location_detail(
    state_abbr: str,
    city: str,
    supabase: Client = Depends(get_supabase),
):
    """Public endpoint — full location_data row for a given city + state."""
    row = get_location(supabase, city, state_abbr)
    if not row:
        raise HTTPException(status_code=404, detail="Location not found")
    return row
