from typing import Optional, Dict, Any
from fastapi import Header, HTTPException, status, Depends
import jwt
from app.core.config import settings

async def get_current_user(authorization: Optional[str] = Header(None)) -> Dict[str, Any]:
    """
    Extracts and validates Supabase Auth JWT token from Authorization header.
    Falls back to mock user in local development if Supabase JWT secret is not configured.
    """
    default_dev_user = {
        "id": "00000000-0000-0000-0000-000000000001",
        "email": "alex.morgan@example.com",
        "name": "Alex Morgan",
        "role": "Full Stack Developer"
    }

    if not authorization:
        # If no auth header provided, allow guest/mock access in development mode
        if settings.ENVIRONMENT == "development":
            return default_dev_user
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing Authorization header",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        scheme, token = authorization.split(" ")
        if scheme.lower() != "bearer":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication scheme. Expected Bearer.",
            )
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header format",
        )

    # Allow fallback demo token in development mode
    if settings.ENVIRONMENT == "development" and token == "mock-demo-token":
        return default_dev_user

    # If Supabase is fully configured, verify the JWT via Supabase API
    if settings.is_supabase_configured:
        try:
            from supabase import create_client
            supabase_client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
            user_response = supabase_client.auth.get_user(token)
            
            if user_response and user_response.user:
                return {
                    "id": user_response.user.id,
                    "email": user_response.user.email,
                    "name": user_response.user.user_metadata.get("name", "Candidate"),
                    "role": user_response.user.role or "authenticated"
                }
            else:
                raise ValueError("User not found in token")
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Invalid Supabase token: {str(e)}",
            )

    # In local development when keys are not yet provided, accept the token or provide mock user
    return default_dev_user
