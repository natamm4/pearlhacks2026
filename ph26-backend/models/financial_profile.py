from ph26_backend.base import BaseModel, UUID4, Optional, datetime
from ph26_backend.enums import ProfileType

class FinancialProfileCreate(BaseModel):
    label: str = "My Profile"
    profile_type: ProfileType = ProfileType.current_job

class FinancialProfileUpdate(BaseModel):
    label: Optional[str] = None
    profile_type: Optional[ProfileType] = None

class FinancialProfileResponse(BaseModel):
    id: UUID4
    user_id: UUID4
    created_at: datetime
    updated_at: datetime
    label: str
    is_active: bool
    profile_type: ProfileType

    class Config:
        from_attributes = True