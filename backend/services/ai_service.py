import re
import json
from typing import List, Dict, Any
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB

from backend.services.dataset_generator import generate_training_corpus

# Generate 3,000 realistic labeled examples (1500 Scam, 1500 Safe)
TRAINING_CORPUS = generate_training_corpus(3000)


class AIService:
    _vectorizer = TfidfVectorizer()
    _classifier = MultinomialNB(alpha=0.1)
    _ml_trained = False

    @classmethod
    def _train_local_model(cls):
        """Fits a fast, lightweight Logistic Regression classifier on startup."""
        if cls._ml_trained:
            return
        
        texts = [x[0] for x in TRAINING_CORPUS]
        labels = [x[1] for x in TRAINING_CORPUS]
        
        # Fit vectorizer & classifier
        X = cls._vectorizer.fit_transform(texts)
        cls._classifier.fit(X, labels)
        cls._ml_trained = True

    @classmethod
    def analyze_scam(cls, text: str, language: str = "English") -> Dict[str, Any]:
        """
        Analyzes a message using heuristics and machine learning.
        Returns a dictionary with risk score, threat level, reasons, and recommendations.
        """
        if not cls._ml_trained:
            cls._train_local_model()

        lower_text = text.lower()
        reasons = []
        score = 10  # Baseline safe score

        # Heuristics Engine (Explainable AI triggers)
        # 1. OTP Request Detection
        if re.search(r"\b(otp|one time password|verification code|6-digit code|auth code)\b", lower_text) or \
           "ओटीपी" in lower_text or "ஒடிபி" in lower_text or "ఓటిపి" in lower_text:
            score += 35
            reasons.append("OTP Request Detected")
            
        # 2. Urgency & Account Suspension Detection
        if re.search(r"\b(urgent|immediately|blocked|suspended|suspension|action required|24 hours|deactivated)\b", lower_text) or \
           "முடக்கப்பட்டுள்ளது" in lower_text or "தற்காலிகமாக" in lower_text or "तुरंत" in lower_text or "तुरन्त" in lower_text or "వెంటనే" in lower_text or "ബ്ലോക്ക്" in lower_text:
            score += 25
            reasons.append("Urgent Language Detected")
            
        # 3. Brand / Bank Impersonation
        if re.search(r"\b(sbi|hdfc|icici|yono|paytm|phonepe|gpay|netflix|paypal|amazon|bank)\b", lower_text) or \
           "வங்கி" in lower_text or "बैंक" in lower_text or "ఖాతా" in lower_text or "ബാങ്ക്" in lower_text:
            score += 15
            reasons.append("Bank / Brand Impersonation")
            
        # 4. Lottery / Prize Scam Detection
        if re.search(r"\b(win|winner|prize|lottery|lucky draw|reward|crore|lakh|cash reward)\b", lower_text) or \
           "பரிசு" in lower_text or "வெற்றி" in lower_text or "லொட்டரி" in lower_text or "लॉटरी" in lower_text or "पुरस्कार" in lower_text or "जीत" in lower_text or "బహుమతి" in lower_text or "లక్కీ డ్రా" in lower_text or "ലോട്ടറി" in lower_text or "സമ്മാനം" in lower_text:
            score += 30
            reasons.append("Prize / Lottery Scam Indicators")
            
        # 5. KYC Fraud Detection
        if re.search(r"\b(kyc|pan card|aadhaar|verify card|update details|update bank)\b", lower_text) or \
           "கேஒய்சி" in lower_text or "केवाईसी" in lower_text or "ఆధార్" in lower_text:
            score += 20
            reasons.append("KYC Scam Indicators")
            
        # 6. Suspicious Links
        if "http://" in lower_text or "https://" in lower_text or re.search(r"\b\w+\.(xyz|click|club|ru|net|click|info)\b", lower_text) or \
           "லிங்க்" in lower_text or "लिंक" in lower_text:
            score += 20
            reasons.append("Suspicious URL / Link Included")

        # 7. Utilities / Disconnection Threats
        if re.search(r"\b(electricity|bill overdue|disconnected|power cut|cut tonight)\b", lower_text) or \
           "மின்சார" in lower_text or "बिजली" in lower_text or "കണക്ഷൻ" in lower_text:
            score += 25
            reasons.append("Disconnection Threat Detected")

        # Machine Learning Engine Predictor
        try:
            # Optionally attempt HuggingFace pipeline if available
            # (In production, the system can load DistilBERT. Fall back to local sklearn model)
            import torch
            from transformers import pipeline
            # If HuggingFace packages are available, evaluate sentiment/spam
            # (We keep it in a try block to avoid crashing when resources are low)
            pass
        except ImportError:
            pass

        # Evaluate sklearn model
        X_test = cls._vectorizer.transform([text])
        ml_prob = float(cls._classifier.predict_proba(X_test)[0][1])

        # Blend scores: Heuristics + ML output
        # If ML model is highly confident, let it drive the risk score directly
        ml_contribution = int(ml_prob * 100)
        
        # Check for transactional scam keywords
        if re.search(r"\b(fee|fees|deposit|transfer|processing|claim|money|cash|pay)\b", lower_text):
            score += 20
            reasons.append("Financial Request Detected")

        score = max(score, ml_contribution)
        
        # Cap score at 100
        score = min(score, 100)
        
        # Risk Levels
        # 0-30 -> Safe
        # 31-70 -> Suspicious
        # 71-100 -> Dangerous
        if score <= 30:
            threat_level = "Safe"
        elif score <= 70:
            threat_level = "Suspicious"
        else:
            threat_level = "Dangerous"

        if not reasons:
            if threat_level == "Safe":
                reasons.append("No explicit scam indicators detected.")
            else:
                reasons.append("AI models detected high similarity to known fraud text.")

        # Recommendations Module
        recommendations = []
        if "OTP Request Detected" in reasons:
            recommendations.append("Do not share OTP / passwords under any circumstances.")
        if "Suspicious URL / Link Included" in reasons:
            recommendations.append("Do not click the link. Verify the site using a URL scanner.")
        if "Bank / Brand Impersonation" in reasons:
            recommendations.append("Contact official customer support via verified numbers only.")
        if "Urgent Language Detected" in reasons or "Disconnection Threat Detected" in reasons:
            recommendations.append("Be cautious of artificial urgency. Official authorities do not threaten immediate disconnection via SMS.")
        if "Prize / Lottery Scam Indicators" in reasons or "KYC Scam Indicators" in reasons:
            recommendations.append("Block the sender and report the message to national cyber crime authorities.")
        
        if not recommendations:
            recommendations.append("Keep practicing safe messaging and do not forward unverified news.")

        return {
            "risk_score": score,
            "threat_level": threat_level,
            "scam_probability": round(max(ml_prob, score / 100), 2),
            "detected_reasons": reasons,
            "recommendations": recommendations,
            "language": language
        }
# Initialize model fitting
AIService._train_local_model()
