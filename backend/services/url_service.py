import re
from urllib.parse import urlparse
from typing import Dict, Any

class URLService:
    # Popular URL shorteners
    SHORTENERS = [
        "bit.ly", "tinyurl.com", "t.co", "goo.gl", "is.gd", "buff.ly", 
        "ow.ly", "db.tt", "git.io", "tr.im", "rebrand.ly", "t.ly", "lnkd.in"
    ]

    # Suspicious Top Level Domains
    SUSPICIOUS_TLDS = [
        "xyz", "click", "club", "ru", "gq", "cf", "ml", "ga", "top", 
        "info", "work", "loan", "men", "date", "win", "stream", "download"
    ]

    @classmethod
    def analyze_url(cls, url: str) -> Dict[str, Any]:
        """
        Analyzes a URL for phishing and fraudulent signatures.
        """
        parsed_url = urlparse(url)
        domain = parsed_url.netloc or parsed_url.path.split('/')[0]
        domain_lower = domain.lower()
        
        reasons = []
        score = 10  # Baseline safe score

        # 1. Check if URL shortener is used
        is_shortened = any(shortener in domain_lower for shortener in cls.SHORTENERS)
        if is_shortened:
            score += 30
            reasons.append("URL Shortener Used")

        # 2. Check if connection is HTTP (Insecure)
        if url.lower().startswith("http://"):
            score += 15
            reasons.append("Insecure Protocol (HTTP)")

        # 3. Check for suspicious TLDs
        tld_match = re.search(r"\.([a-z0-9\-]+)$", domain_lower)
        if tld_match:
            tld = tld_match.group(1)
            if tld in cls.SUSPICIOUS_TLDS:
                score += 35
                reasons.append("Suspicious Domain Extension (.%s)" % tld)

        # 4. Check for login / verification patterns in URL path
        path_lower = parsed_url.path.lower()
        if re.search(r"(login|signin|verify|account|billing|update|security|secure|auth|card|credentials)", path_lower):
            score += 20
            reasons.append("Login / Verification Path Detected")

        # 5. Check for brand impersonation
        brands = ["sbi", "hdfc", "icici", "paypal", "netflix", "amazon", "google", "apple", "microsoft"]
        has_brand = any(brand in domain_lower for brand in brands)
        
        # Heuristics for fake subdomains: e.g. hdfc.verification-net.com
        parts = domain_lower.split('.')
        is_spoof = False
        if len(parts) > 2:
            # Check if brand name is in subdomains but not the main domain name
            main_domain = parts[-2]
            subdomains = parts[:-2]
            for brand in brands:
                if any(brand in sub for sub in subdomains) and brand not in main_domain:
                    is_spoof = True
                    break
        
        if is_spoof or (has_brand and not any(domain_lower == (b + ".com") or domain_lower.endswith("." + b + ".com") for b in brands)):
            score += 35
            reasons.append("Brand Spoofing / Impersonation Heuristics")

        # Cap score at 100
        score = min(score, 100)

        # Threat levels
        if score <= 30:
            threat_level = "Safe"
        elif score <= 70:
            threat_level = "Suspicious"
        else:
            threat_level = "Dangerous"

        if not reasons:
            reasons.append("No phishing indicators detected on domain.")

        # Recommendations
        recommendations = []
        if is_shortened:
            recommendations.append("Do not visit. Expand the shortened URL using a preview tool first.")
        if "Brand Spoofing / Impersonation Heuristics" in reasons or "Login / Verification Path Detected" in reasons:
            recommendations.append("Directly type the official domain URL (e.g. hdfcbank.com) in your address bar.")
        if "Insecure Protocol (HTTP)" in reasons:
            recommendations.append("Never input login credentials or financial details on HTTP websites.")
        if not recommendations:
            recommendations.append("URL appears standard, but remain vigilant on unknown websites.")

        return {
            "risk_score": score,
            "threat_level": threat_level,
            "scam_probability": round(score / 100, 2),
            "detected_reasons": reasons,
            "recommendations": recommendations,
            "domain": domain,
            "is_phishing": threat_level == "Dangerous",
            "is_shortened": is_shortened,
            "is_bank_impersonation": "Brand Spoofing / Impersonation Heuristics" in reasons,
            "is_suspicious_domain": "Suspicious Domain Extension" in str(reasons)
        }
