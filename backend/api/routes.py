import json
import requests
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import List

from backend.database.connection import get_db
from backend.database import models, schemas
from backend.services.ai_service import AIService
from backend.services.url_service import URLService
from backend.services.translation_service import TranslationService
from backend.services.voice_service import VoiceService

router = APIRouter()

@router.post("/analyze-message", response_model=schemas.MessageScanResponse)
def analyze_message(payload: schemas.MessageScanRequest, db: Session = Depends(get_db)):
    try:
        # Detect language
        detected_lang = payload.language or TranslationService.detect_language(payload.message)
        
        # Translate to English for analysis
        translated_text = TranslationService.translate_to_english(payload.message, detected_lang)
        
        # Perform Scam Detection
        result = AIService.analyze_scam(translated_text, detected_lang)
        
        # Store in Database
        scan = models.Scan(
            scan_type="message",
            input_content=payload.message,
            risk_score=result["risk_score"],
            threat_level=result["threat_level"],
            scam_probability=result["scam_probability"],
            language=result["language"],
            detected_reasons=json.dumps(result["detected_reasons"])
        )
        db.add(scan)
        db.commit()
        db.refresh(scan)
        
        # Store Analytics Event
        event = models.AnalyticsEvent(
            event_type="scan_processed" if result["threat_level"] == "Safe" else "threat_isolated",
            channel="message",
            threat_level=result["threat_level"],
            language=result["language"]
        )
        db.add(event)
        db.commit()
        
        return {
            "risk_score": result["risk_score"],
            "threat_level": result["threat_level"],
            "scam_probability": result["scam_probability"],
            "detected_reasons": result["detected_reasons"],
            "recommendations": result["recommendations"],
            "language": result["language"],
            "timestamp": scan.created_at
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Message analysis error: {str(e)}")

@router.post("/analyze-url", response_model=schemas.URLScanResponse)
def analyze_url(payload: schemas.URLScanRequest, db: Session = Depends(get_db)):
    try:
        result = URLService.analyze_url(payload.url)
        
        # Store in Database
        scan = models.Scan(
            scan_type="url",
            input_content=payload.url,
            risk_score=result["risk_score"],
            threat_level=result["threat_level"],
            scam_probability=result["scam_probability"],
            language="N/A",
            detected_reasons=json.dumps(result["detected_reasons"])
        )
        db.add(scan)
        db.commit()
        db.refresh(scan)
        
        # Store URL Specific Details
        url_details = models.URLAnalysis(
            scan_id=scan.id,
            url=payload.url,
            domain=result["domain"],
            is_phishing=result["is_phishing"],
            is_shortened=result["is_shortened"],
            is_bank_impersonation=result["is_bank_impersonation"],
            is_suspicious_domain=result["is_suspicious_domain"]
        )
        db.add(url_details)
        
        # Store Analytics Event
        event = models.AnalyticsEvent(
            event_type="scan_processed" if result["threat_level"] == "Safe" else "threat_isolated",
            channel="url",
            threat_level=result["threat_level"],
            language="N/A"
        )
        db.add(event)
        db.commit()
        
        return {
            "url": payload.url,
            "risk_score": result["risk_score"],
            "threat_level": result["threat_level"],
            "scam_probability": result["scam_probability"],
            "detected_reasons": result["detected_reasons"],
            "recommendations": result["recommendations"],
            "language": "N/A",
            "timestamp": scan.created_at
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"URL analysis error: {str(e)}")

@router.post("/analyze-voice", response_model=schemas.VoiceScanResponse)
async def analyze_voice(file: UploadFile = File(...), db: Session = Depends(get_db)):
    try:
        content = await file.read()
        result = VoiceService.transcribe_and_analyze(content, file.filename)
        
        # Store in Database
        scan = models.Scan(
            scan_type="voice",
            input_content="Audio file: " + file.filename,
            risk_score=result["risk_score"],
            threat_level=result["threat_level"],
            scam_probability=result["scam_probability"],
            language=result["language"],
            detected_reasons=json.dumps(result["detected_reasons"])
        )
        db.add(scan)
        db.commit()
        db.refresh(scan)
        
        # Store Voice Specific Details
        voice_details = models.VoiceAnalysis(
            scan_id=scan.id,
            audio_path=f"uploads/{file.filename}",
            transcript=result["transcript"]
        )
        db.add(voice_details)
        
        # Store Analytics Event
        event = models.AnalyticsEvent(
            event_type="scan_processed" if result["threat_level"] == "Safe" else "threat_isolated",
            channel="voice",
            threat_level=result["threat_level"],
            language=result["language"]
        )
        db.add(event)
        db.commit()
        
        return {
            "transcript": result["transcript"],
            "risk_score": result["risk_score"],
            "threat_level": result["threat_level"],
            "scam_probability": result["scam_probability"],
            "detected_reasons": result["detected_reasons"],
            "recommendations": result["recommendations"],
            "language": result["language"],
            "timestamp": scan.created_at
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Voice analysis error: {str(e)}")

@router.post("/translate", response_model=schemas.TranslateResponse)
def translate(payload: schemas.TranslateRequest):
    try:
        detected_lang = TranslationService.detect_language(payload.text)
        translated_text = TranslationService.translate_to_english(payload.text, detected_lang)
        return {
            "detected_language": detected_lang,
            "translated_text": translated_text
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Translation error: {str(e)}")

@router.get("/history", response_model=List[schemas.HistoryItemResponse])
def get_history(db: Session = Depends(get_db)):
    try:
        scans = db.query(models.Scan).order_by(models.Scan.created_at.desc()).limit(50).all()
        history = []
        for scan in scans:
            reasons = json.loads(scan.detected_reasons)
            
            # If voice, display transcription as input preview
            input_content = scan.input_content
            if scan.scan_type == "voice" and scan.voice_details:
                input_content = f"Transcript: \"{scan.voice_details.transcript}\""
                
            history.append({
                "id": f"scan_{scan.id}",
                "type": scan.scan_type,
                "input": input_content,
                "risk_score": scan.risk_score,
                "threat_level": scan.threat_level,
                "language": scan.language,
                "reasons": reasons,
                "timestamp": scan.created_at
            })
        return history
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch scan history: {str(e)}")

@router.get("/analytics", response_model=schemas.AnalyticsResponse)
def get_analytics(db: Session = Depends(get_db)):
    try:
        total_scans = db.query(models.Scan).count()
        dangerous_scans = db.query(models.Scan).filter(models.Scan.threat_level == "Dangerous").count()
        suspicious_scans = db.query(models.Scan).filter(models.Scan.threat_level == "Suspicious").count()
        
        threats_prevented = dangerous_scans + suspicious_scans
        detection_rate = int((threats_prevented / total_scans * 100)) if total_scans > 0 else 74

        # Scam Types breakdown (aggregating top reasons)
        scans = db.query(models.Scan).all()
        reason_counts = {}
        for s in scans:
            reasons = json.loads(s.detected_reasons)
            for r in reasons:
                if "No explicit" not in r and "No phishing" not in r:
                    reason_counts[r] = reason_counts.get(r, 0) + 1

        types_breakdown = [
            {"name": k, "value": v} for k, v in reason_counts.items()
        ]
        types_breakdown = sorted(types_breakdown, key=lambda x: x["value"], reverse=True)[:5]
        
        # Fallback details if database is fresh
        if not types_breakdown:
            types_breakdown = [
                {"name": "Bank Impersonation", "value": 0},
                {"name": "OTP Fraud", "value": 0},
                {"name": "Phishing Links", "value": 0},
                {"name": "KYC Lockouts", "value": 0},
                {"name": "Fake Prizes", "value": 0}
            ]

        # Language Statistics
        languages = ["English", "Hindi", "Tamil", "Telugu", "Malayalam"]
        language_stats = []
        for lang in languages:
            count = db.query(models.Scan).filter(models.Scan.language == lang).count()
            language_stats.append({"name": lang, "value": count})

        # Activity Load (past 7 days)
        activity_analytics = []
        today = datetime.utcnow().date()
        for i in range(6, -1, -1):
            day = today - timedelta(days=i)
            day_start = datetime.combine(day, datetime.min.time())
            day_end = datetime.combine(day, datetime.max.time())
            
            scans_count = db.query(models.Scan).filter(models.Scan.created_at.between(day_start, day_end)).count()
            threats_count = db.query(models.Scan).filter(
                models.Scan.created_at.between(day_start, day_end),
                models.Scan.threat_level.in_(["Dangerous", "Suspicious"])
            ).count()
            
            activity_analytics.append({
                "day": day.strftime("%a"),
                "scans": scans_count,
                "threats": threats_count
            })

        return {
            "total_scans": total_scans,
            "detection_rate": detection_rate,
            "threats_prevented": threats_prevented,
            "scam_types_breakdown": types_breakdown,
            "language_statistics": language_stats,
            "activity_analytics": activity_analytics
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate analytics: {str(e)}")

@router.post("/auth/google", response_model=schemas.UserResponse)
def auth_google(payload: schemas.GoogleAuthRequest, db: Session = Depends(get_db)):
    try:
        token = payload.credential
        # Call Google tokeninfo to verify JWT authenticity and decode properties
        response = requests.get(f"https://oauth2.googleapis.com/tokeninfo?id_token={token}", timeout=10)
        if not response.ok:
            raise HTTPException(status_code=400, detail="Invalid Google OAuth credential token")
            
        id_info = response.json()
        email = id_info.get("email")
        name = id_info.get("name")
        picture = id_info.get("picture")
        sub = id_info.get("sub") # Google User ID
        
        if not email:
            raise HTTPException(status_code=400, detail="Google token does not contain email details")
            
        user = db.query(models.User).filter(models.User.google_id == sub).first()
        if not user:
            user = db.query(models.User).filter(models.User.email == email).first()
            if user:
                user.google_id = sub
                user.profile_pic = picture
            else:
                username = email.split('@')[0]
                existing_username = db.query(models.User).filter(models.User.username == username).first()
                if existing_username:
                    username = f"{username}_{sub[:6]}"
                    
                user = models.User(
                    username=username,
                    email=email,
                    google_id=sub,
                    profile_pic=picture,
                    role="user"
                )
                db.add(user)
            db.commit()
            db.refresh(user)
            
        return user
    except HTTPException as he:
        raise he
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Google Authentication failed: {str(e)}")

# Password Cryptographic Helpers (PBKDF2 SHA-256)
import hashlib
import os

def hash_password(password: str) -> str:
    salt = os.urandom(16)
    pw_hash = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt, 100000)
    return salt.hex() + ":" + pw_hash.hex()

def verify_password(stored_password_hash: str, password: str) -> bool:
    try:
        salt_hex, hash_hex = stored_password_hash.split(":")
        salt = bytes.fromhex(salt_hex)
        pw_hash = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt, 100000)
        return pw_hash.hex() == hash_hex
    except Exception:
        return False

@router.post("/auth/register", response_model=schemas.UserResponse)
def register_user(payload: schemas.UserRegisterRequest, db: Session = Depends(get_db)):
    try:
        # Check if email already exists
        existing_email = db.query(models.User).filter(models.User.email == payload.email).first()
        if existing_email:
            raise HTTPException(status_code=400, detail="A user with this email already exists.")
            
        # Check if username already exists
        existing_username = db.query(models.User).filter(models.User.username == payload.username).first()
        if existing_username:
            raise HTTPException(status_code=400, detail="This username is already taken.")
            
        # Create user
        hashed_pw = hash_password(payload.password)
        user = models.User(
            username=payload.username,
            email=payload.email,
            password_hash=hashed_pw,
            role="user"
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        return user
    except HTTPException as he:
        raise he
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Registration failed: {str(e)}")

@router.post("/auth/login", response_model=schemas.UserResponse)
def login_user(payload: schemas.UserLoginRequest, db: Session = Depends(get_db)):
    try:
        # User can input either email or username
        user = db.query(models.User).filter(
            (models.User.email == payload.username_or_email) | 
            (models.User.username == payload.username_or_email)
        ).first()
        
        if not user or not user.password_hash:
            raise HTTPException(status_code=400, detail="Invalid username/email or password.")
            
        # Verify password
        if not verify_password(user.password_hash, payload.password):
            raise HTTPException(status_code=400, detail="Invalid username/email or password.")
            
        return user
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Login failed: {str(e)}")

