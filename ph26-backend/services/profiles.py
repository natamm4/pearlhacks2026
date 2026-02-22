# from typing import Any, Optional
# from uuid import UUID

# def get_my_profile(supabase: Any, user_id: str) -> Optional[dict]:
#     result = supabase.table("profiles").select("*").eq("id", user_id).single().execute()
#     return result.data


# def update_my_profile(supabase: Any, user_id: str, updates: dict) -> Optional[dict]:
#     result = (
#         supabase.table("profiles")
#         .update(updates)
#         .eq("id", user_id)
#         .execute()
#     )
#     return result.data[0] if result.data else None


# def ensure_user_records(supabase: Any, user_id: str) -> dict:
#     # Ensure profiles row exists (profiles.id == auth.users.id)
#     prof = supabase.table("profiles").select("id").eq("id", user_id).maybe_single().execute()
#     created_profile = None
#     if not prof.data:
#         created_profile = supabase.table("profiles").insert({"id": user_id, "onboarded": False}).select().maybe_single().execute().data

#     # Ensure user_preferences exists
#     prefs = supabase.table("user_preferences").select("user_id,active_profile_id").eq("user_id", user_id).maybe_single().execute()
#     created_prefs = None
#     pref_profile_id = prefs.data["active_profile_id"] if prefs.data else None
#     if not prefs.data:
#         created_prefs = supabase.table("user_preferences").insert({"user_id": user_id}).select().maybe_single().execute().data

#     # Ensure at least one financial_profile exists for the user
#     fp = supabase.table("financial_profiles").select("id").eq("user_id", user_id).limit(1).maybe_single().execute()
#     created_fp = None
#     if not fp.data:
#         created_fp = (
#             supabase.table("financial_profiles")
#             .insert({"user_id": user_id, "label": "My Profile", "profile_type": "current_job", "is_active": True})
#             .select()
#             .maybe_single()
#             .execute()
#             .data
#         )
#         # if preferences existed but had no active_profile_id, set it
#         new_id = created_fp and created_fp.get("id")
#         if new_id and not pref_profile_id:
#             supabase.table("user_preferences").update({"active_profile_id": new_id}).eq("user_id", user_id).execute()

#     return {
#         "profile": prof.data or created_profile,
#         "preferences": prefs.data or created_prefs,
#         "financial_profile": fp.data or created_fp,
#     }

from typing import Any, Dict
from uuid import UUID

def ensure_user_records(supabase: Any, user_id: UUID) -> Dict:
    # 1) Fetch profile row
    prof = (
        supabase.table("profiles")
        .select("*")
        .eq("id", str(user_id))   # or eq("user_id", str(user_id)) depending on schema
        .execute()
    )

    # 🔥 If this is None, you’re not getting a real response object.
    if prof is None:
        raise RuntimeError("Supabase query returned None (check .execute() call and any try/except swallowing errors)")

    # Some versions provide .error; some throw exceptions. Safe check:
    err = getattr(prof, "error", None)
    if err:
        raise RuntimeError(f"Supabase error fetching profiles: {err}")

    data = getattr(prof, "data", None)
    if not data:
        # 2) Create profile if missing
        created = (
            supabase.table("profiles")
            .insert({"id": str(user_id), "onboarded": False})
            .execute()
        )
        if created is None:
            raise RuntimeError("Supabase insert returned None")
        cerr = getattr(created, "error", None)
        if cerr:
            raise RuntimeError(f"Supabase error inserting profiles: {cerr}")

    return {"ok": True}