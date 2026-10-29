from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

# Common Models
class AnalysisResultSchema(BaseModel):
    risk_score: int
    threat_level: str
    scam_probability: float
    detected_reasons: List[str]
    recommendations: List[str]
    language: Optional[str] = "English"

# Message Scan
class MessageScanRequest(BaseModel):
    message: str
    language: Optional[str] = None

class MessageScanResponse(AnalysisResultSchema):
    timestamp: datetime

# URL Scan
class URLScanRequest(BaseModel):
    url: str

class URLScanResponse(AnalysisResultSchema):
    url: str
    timestamp: datetime

# Voice Scan Response
class VoiceScanResponse(AnalysisResultSchema):
    transcript: str
    timestamp: datetime

# Translation
class TranslateRequest(BaseModel):
    text: str

class TranslateResponse(BaseModel):
    detected_language: str
    translated_text: str

# Scan History
class HistoryItemResponse(BaseModel):
    id: str
    type: str
    input: str
    risk_score: int
    threat_level: str
    language: str
    reasons: List[str]
    timestamp: datetime

    class Config:
        from_attributes = True

# Admin Analytics
class ScamTypeBreakdown(BaseModel):
    name: str
    value: int

class LanguageStat(BaseModel):
    name: str
    value: int

class ActivityLog(BaseModel):
    day: str
    scans: int
    threats: int

class AnalyticsResponse(BaseModel):
    total_scans: int
    detection_rate: int
    threats_prevented: int
    scam_types_breakdown: List[ScamTypeBreakdown]
    language_statistics: List[LanguageStat]
    activity_analytics: List[ActivityLog]

# Google Authentication
class GoogleAuthRequest(BaseModel):
    credential: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    role: str
    profile_pic: Optional[str] = None
    google_id: Optional[str] = None

    class Config:
        from_attributes = True

# Local Email/Password Authentication
class UserRegisterRequest(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: str
    password: str = Field(..., min_length=6)

class UserLoginRequest(BaseModel):
    username_or_email: str
    password: str


