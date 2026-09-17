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

    # If Supabase JWT Secret is configured, decode and verify the JWT
    if settings.SUPABASE_JWT_SECRET:
        try:
            payload = jwt.decode(
                token,
                settings.SUPABASE_JWT_SECRET,
                algorithms=["HS256"],
                audience="authenticated"
            )
            return {
                "id": payload.get("sub"),
                "email": payload.get("email"),
                "name": payload.get("user_metadata", {}).get("name", "Candidate"),
                "role": payload.get("role", "authenticated")
            }
        except jwt.PyJWTError as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Invalid Supabase token: {str(e)}",
            )

    # In local development when keys are not yet provided, accept the token or provide mock user
    return default_dev_user
