from fastapi import APIRouter, Depends, HTTPException
from typing import Dict, Any
from app.core.auth import get_current_user
from app.services.supabase_service import supabase_service
from app.models.user import UserProfileSchema, UserProfileUpdate

router = APIRouter(prefix="/auth", tags=["Authentication & User"])

@router.get("/me", response_model=UserProfileSchema)
async def get_my_profile(current_user: Dict[str, Any] = Depends(get_current_user)):
    """Fetches profile of the currently authenticated Supabase user."""
    profile = await supabase_service.get_profile(current_user["id"])
    return profile

@router.put("/me", response_model=UserProfileSchema)
async def update_my_profile(
    updates: UserProfileUpdate,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Updates profile of the current user."""
    update_data = {k: v for k, v in updates.model_dump().items() if v is not None}
    updated = await supabase_service.update_profile(current_user["id"], update_data)
    return updated

@router.post("/sync")
async def sync_user(current_user: Dict[str, Any] = Depends(get_current_user)):
    """Ensures user record is initialized in Supabase PostgreSQL."""
    profile = await supabase_service.get_profile(current_user["id"])
    return {"status": "synced", "user": profile}
