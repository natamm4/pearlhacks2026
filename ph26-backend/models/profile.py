from ph26_backend.base import BaseModel, UUID4, Field, Optional, datetime
from ph26_backend.enums import PayFrequency

class ProfileUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    onboarded: Optional[bool] = None

class ProfileResponse(BaseModel):
    id: UUID4
    created_at: datetime
    updated_at: datetime
    first_name: Optional[str]
    last_name: Optional[str]
    onboarded: bool

    class Config:
        from_attributes = True