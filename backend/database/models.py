from sqlalchemy import Column, Integer, String, Float, Boolean, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.database.connection import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=True) # Nullable because Google users don't need a local password
    role = Column(String(20), default="user") # 'user', 'admin'
    google_id = Column(String(100), unique=True, index=True, nullable=True)
    profile_pic = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    scans = relationship("Scan", back_populates="user")

class Scan(Base):
    __tablename__ = "scans"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    scan_type = Column(String(30), nullable=False) # 'message', 'url', 'voice'
    input_content = Column(Text, nullable=False)
    risk_score = Column(Integer, nullable=False) # 0-100
    threat_level = Column(String(20), nullable=False) # 'Safe', 'Suspicious', 'Dangerous'
    scam_probability = Column(Float, default=0.0)
    language = Column(String(30), default="English")
    detected_reasons = Column(Text, nullable=False) # JSON-serialized list of strings
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="scans")
    url_details = relationship("URLAnalysis", back_populates="scan", uselist=False, cascade="all, delete-orphan")
    voice_details = relationship("VoiceAnalysis", back_populates="scan", uselist=False, cascade="all, delete-orphan")

class URLAnalysis(Base):
    __tablename__ = "url_analysis"

    id = Column(Integer, primary_key=True, index=True)
    scan_id = Column(Integer, ForeignKey("scans.id"), nullable=False)
    url = Column(Text, nullable=False)
    domain = Column(String(255), nullable=False)
    is_phishing = Column(Boolean, default=False)
    is_shortened = Column(Boolean, default=False)
    is_bank_impersonation = Column(Boolean, default=False)
    is_suspicious_domain = Column(Boolean, default=False)

    # Relationships
    scan = relationship("Scan", back_populates="url_details")

class VoiceAnalysis(Base):
    __tablename__ = "voice_analysis"

    id = Column(Integer, primary_key=True, index=True)
    scan_id = Column(Integer, ForeignKey("scans.id"), nullable=False)
    audio_path = Column(String(255), nullable=True)
    transcript = Column(Text, nullable=False)

    # Relationships
    scan = relationship("Scan", back_populates="voice_details")

class AnalyticsEvent(Base):
    __tablename__ = "analytics"

    id = Column(Integer, primary_key=True, index=True)
    event_type = Column(String(50), nullable=False) # 'scan_processed', 'threat_isolated'
    channel = Column(String(30), nullable=False) # 'message', 'url', 'voice'
    threat_level = Column(String(20), nullable=False)
    language = Column(String(30), default="English")
    timestamp = Column(DateTime, default=datetime.utcnow)
