import random
from typing import List, Tuple

# Set random seed for reproducible dataset generation
random.seed(42)

BANKS = ["SBI", "HDFC Bank", "ICICI Bank", "Axis Bank", "Punjab National Bank", "Bank of Baroda", "Kotak Mahindra", "Canara Bank", "Union Bank", "IndusInd Bank"]
SUSPICIOUS_DOMAINS = ["net", "xyz", "click", "club", "info", "online", "site", "top", "work", "co.in-verify.com"]
SAFE_DOMAINS = ["sbi.co.in", "hdfcbank.com", "icicibank.com", "amazon.in", "flipkart.com", "swiggy.com", "irctc.co.in"]
NAMES = ["Rahul", "Priya", "Amit", "Sneha", "Vikram", "Ananya", "Rohan", "Pooja", "Suresh", "Kavita", "Rajesh", "Deepika", "Manish", "Sunita", "Arjun", "Meera"]
CITIES = ["Mumbai", "Delhi", "Bengaluru", "Chennai", "Hyderabad", "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Lucknow"]
COMPANIES = ["TCS", "Infosys", "Wipro", "Accenture", "Cognizant", "Google", "Microsoft", "Amazon", "Flipkart", "Reliance"]

SCAM_TEMPLATES = [
    # Category 1: Banking & KYC Fraud
    "URGENT: Your {bank} account #{acc} is suspended due to pending KYC verification. Update immediately at http://{bank_clean}-kyc-update.{tld}",
    "Dear customer, your {bank} netbanking account will be blocked within 24 hours. Verify your PAN card details now at http://secure-{bank_clean}-update.{tld}",
    "ALERT: Suspicious transaction of Rs {amount} detected on your {bank} card. If not done by you, block card at http://{bank_clean}-block-card.{tld}",
    "Your {bank} credit card point balance of {pts} pts (value Rs {amount}) expires today. Redeem cash at http://{bank_clean}-rewards.{tld}",
    "Attention! Your {bank} debit card has been blocked. Share OTP {otp} with our agent or verify at http://{bank_clean}-verify.{tld} to unblock.",

    # Category 2: OTP & Credential Harvesting
    "Your OTP for transaction of Rs {amount} at {company} is {otp}. Never share your OTP with anyone. To stop transaction click http://cancel-{company_clean}.{tld}",
    "Security Alert: Someone attempted login to your email from {city}. Verification code is {otp}. If this wasn't you, log in at http://security-{tld}/login",
    "Verification Code: {otp}. Enter this code on the portal http://verify-identity.{tld} to confirm your mobile wallet transfer of Rs {amount}.",
    "Dear user, your Google Pay / Paytm account is locked. Verify 6-digit PIN {otp} at http://paytm-security.{tld} to restore access.",
    "Your WhatsApp registration code is {otp}. Share code with support at http://whatsapp-support.{tld} to avoid account termination.",

    # Category 3: Lottery, Prize & Reward Scams
    "Congratulations! Your mobile number won 1st prize of Rs {lakhs} Lakhs in KBC Lucky Draw {year}. Call manager Mr {name} at 9876543210 or visit http://kbc-draw.{tld}",
    "You have won a cash reward of Rs {amount} from Jio / Airtel Mega Offer! Click link http://claim-reward.{tld} and pay processing fee of Rs 500 to claim.",
    "Bumper Offer! You are selected for {company} lucky gift worth Rs {amount}. Enter address and claim prize at http://{company_clean}-gift.{tld}",
    "Dear subscriber, your phone number won {crores} Crore rupees in International Telecom Lottery. Email claim@lottery-{tld} to process reward.",
    "Congratulations! You won a brand new SUV car / iPhone 15 in spinning wheel contest. Redeem prize now at http://win-prize-today.{tld}",

    # Category 4: Utility & Bill Disconnection Threats
    "Electricity Alert: Dear consumer, your power connection for CA No {ca} will be disconnected tonight at 9:30 PM due to unpaid bill of Rs {amount}. Contact electricity officer at http://ebill-pay.{tld}",
    "Dear user, your BSES / TATA Power electricity bill of Rs {amount} is overdue. Pay immediately at http://power-bill-update.{tld} to prevent power cut.",
    "Urgent: Your LPG gas cylinder booking is cancelled due to pending e-KYC. Verify Aadhaar details at http://lpg-kyc-update.{tld}",
    "Notice: Your mobile SIM card will be deactivated within 2 hours as per TRAI guidelines. Re-verify SIM at http://sim-kyc-trai.{tld}",
    "Broadband Alert: Your internet connection will be disconnected today. Pay overdue bill of Rs {amount} at http://wifi-bill-pay.{tld}",

    # Category 5: Job & Part-time Income Scams
    "Work From Home Opportunity! Earn Rs {amount} daily by liking YouTube videos & Telegram tasks. No experience needed. Join WhatsApp http://job-earn.{tld}",
    "Part-time job offer from {company}! Earn Rs 5,000 to Rs 25,000 daily from mobile. Contact HR on Telegram http://t.me/parttimejob_{rand}",
    "Data Entry Job Opening: Earn Rs {amount} per page. Daily payout guaranteed. Registration fee Rs 299. Apply at http://dataentry-jobs.{tld}",
    "Selected for Amazon / Flipkart review assistant role. Daily income Rs 8,000. Click link to start work http://earn-reviews.{tld}",
    "International hiring for online rating agent. Guaranteed weekly income of $500. Register at http://global-ratings-job.{tld}",

    # Category 6: Parcel / Customs / India Post Scams
    "India Post Alert: Your parcel #{tracking} cannot be delivered due to incomplete address. Update address within 12h at http://indiapost-update.{tld}",
    "FedEx / DHL Notice: Package #{tracking} held at {city} customs. Pay customs duty of Rs {amount} at http://courier-customs-pay.{tld} to release.",
    "Express Courier: Shipment delivery failed. Pay redelivery fee of Rs 48 at http://shipment-redelivery.{tld}",
    "Customs Department: Contraband item detected in package addressed to you. Connect with officer immediately at http://customs-verification.{tld}",
    "Package Alert: Your delivery is pending at local warehouse. Pay Rs 25 holding fee at http://delhivery-track.{tld}",

    # Category 7: Income Tax & Govt Subsidy Scams
    "Income Tax Department: You are eligible for tax refund of Rs {amount}. Submit bank account details at http://incometax-refund-portal.{tld} to credit.",
    "PM Kisan Samman Nidhi: Your 16th installment of Rs 2,000 is on hold. Update Aadhaar e-KYC at http://pmkisan-kyc.{tld}",
    "Govt Loan Scheme: Approved for collateral-free loan of Rs 5 Lakhs under Mudra Scheme. Pay processing fee at http://govt-mudra-loan.{tld}",
    "EPFO Alert: Your Provident Fund interest of Rs {amount} is queued. Verify UAN number at http://epfo-claim-update.{tld}",
    "Free Laptop Govt Scheme {year}: Students eligible for free laptop. Register roll number at http://govt-free-laptop.{tld}"
]

SAFE_TEMPLATES = [
    # Category 1: Personal Conversations & Family
    "Hey {name}, are we still meeting for lunch today at 1:30 PM in {city}?",
    "Hi Mom, I reached {city} safely. The train was on time. Talk to you later!",
    "Can you please share the notes from yesterday's meeting with {company}?",
    "Thanks for the birthday wishes {name}! Had a wonderful day with family.",
    "Don't forget to buy milk, bread, and fruits on your way back home.",
    "Happy Weekend {name}! Let's plan a movie trip this Sunday.",
    "Please send me the doctor's prescription when you get a chance.",
    "Good morning! Hope you have a productive day at work.",
    "Hey, did you check out the new episode of the show we were talking about?",
    "I'll call you back in 15 minutes, currently in a client discussion.",

    # Category 2: Work & Team Collaboration
    "Hi team, please review the updated project roadmap slide deck in Google Drive.",
    "Reminder: Sprint planning meeting starts at 10 AM tomorrow in Conference Room B.",
    "Hi {name}, I have approved your leave request for next Monday and Tuesday.",
    "Please find attached the quarterly financial report and performance metrics.",
    "Code review completed for pull request #{rand}. Looks good to merge!",
    "Can someone help check the server logs for the deployment issue on staging?",
    "Great presentation today at the all-hands meeting! Kudos to the team.",
    "Please update your task status on Jira before the daily standup.",
    "The client has signed the agreement. We can kick off Phase 2 next week.",
    "Draft proposal document has been uploaded to the shared folder for feedback.",

    # Category 3: Legitimate Transaction Alerts (No suspicious URLs)
    "Rs {amount} debited from your {bank} account #{acc} on {date} towards grocery store payment. Available balance Rs {bal}.",
    "Rs {amount} credited to your {bank} account #{acc} via UPI from {name} on {date}. Ref No {ref}.",
    "Your {bank} credit card bill for month of October is Rs {amount}. Due date is 15th Oct. Pay via official mobile app.",
    "ATM Cash Withdrawal: Rs 5,000 withdrawn from {bank} ATM in {city} on {date}. Bal: Rs {bal}.",
    "Salary Credit: Rs {salary} credited to your {bank} salary account from {company} on 1st of month.",

    # Category 4: E-Commerce & Service Updates
    "Your Amazon order for wireless headphones is out for delivery today. Agent: {name} (Ph: 9812345678).",
    "Flipkart Update: Order #{tracking} has been delivered successfully. Rate your experience in app.",
    "Swiggy: Your order from Spice Garden is being prepared. Delivery partner {name} assigned.",
    "Zomato: Order delivered! Enjoy your meal. Don't forget to rate your delivery executive.",
    "Uber / Ola: Your driver {name} is arriving in a White Swift (KA 01 AB 1234).",

    # Category 5: Official Service OTPs (Safe context)
    "Your OTP for logging into {company} portal is {otp}. Valid for 10 minutes. Do not share with anyone.",
    "Use {otp} as your verification code for logging in. Official security notification.",
    "{otp} is your secret OTP for authenticating transaction at {company}. Never reveal it to callers.",
    "Your login code is {otp}. If you did not request this, please change your account password immediately.",
    "Authentication Code: {otp}. Use this code to complete registration on official application.",

    # Category 6: Travel & Booking Confirmations
    "IRCTC PNR {pnr}: Train 12626 Kerala Express, Date: 15-Nov, Class: 3A, Status: CNF/B2/45. Wish you a happy journey.",
    "MakeMyTrip: Flight UK-814 from {city} to Delhi confirmed. Departure: 08:30 AM, Seat: 12F.",
    "BookMyShow: Booking confirmed for 2 tickets at PVR Cinemas for 7:15 PM show. Booking ID: BMS-{rand}.",
    "Uber Intercity: Your ride from {city} is confirmed for tomorrow 6:00 AM.",
    "Hotel Booking Confirmed: 2 Nights stay at Taj Hotel, {city}. Check-in: 12:00 PM."
]

def generate_training_corpus(total_samples: int = 3000) -> List[Tuple[str, int]]:
    """
    Generates a balanced dataset of `total_samples` (e.g. 1500 Scam [1] and 1500 Safe [0])
    with rich variations of banks, names, amounts, URLs, reference codes, and templates.
    """
    corpus = []
    samples_per_class = total_samples // 2

    # 1. Generate Scam Samples (Label = 1)
    for i in range(samples_per_class):
        template = random.choice(SCAM_TEMPLATES)
        bank = random.choice(BANKS)
        bank_clean = bank.lower().replace(" ", "").replace("bank", "")
        company = random.choice(COMPANIES)
        company_clean = company.lower()
        tld = random.choice(SUSPICIOUS_DOMAINS)
        name = random.choice(NAMES)
        city = random.choice(CITIES)

        msg = template.format(
            bank=bank,
            bank_clean=bank_clean,
            company=company,
            company_clean=company_clean,
            tld=tld,
            name=name,
            city=city,
            acc=str(random.randint(1000, 9999)),
            amount=f"{random.randint(1, 99)},{random.randint(100, 999)}",
            pts=str(random.randint(1500, 9800)),
            otp=str(random.randint(100000, 999999)),
            lakhs=str(random.choice([15, 25, 50, 75])),
            crores=str(random.choice([1, 2, 5])),
            year="2026",
            ca=str(random.randint(100000000, 999999999)),
            tracking=f"IN{random.randint(1000000, 9999999)}",
            rand=str(random.randint(100, 999))
        )
        corpus.append((msg, 1))

    # 2. Generate Safe Samples (Label = 0)
    for i in range(samples_per_class):
        template = random.choice(SAFE_TEMPLATES)
        bank = random.choice(BANKS)
        company = random.choice(COMPANIES)
        name = random.choice(NAMES)
        city = random.choice(CITIES)

        msg = template.format(
            bank=bank,
            company=company,
            name=name,
            city=city,
            acc=str(random.randint(1000, 9999)),
            amount=f"{random.randint(100, 15000):,}",
            bal=f"{random.randint(15000, 250000):,}",
            salary=f"{random.randint(45000, 180000):,}",
            otp=str(random.randint(100000, 999999)),
            ref=f"UPI/{random.randint(100000000, 999999999)}",
            date=f"{random.randint(1, 28)}-Oct-2026",
            tracking=f"OD{random.randint(100000000, 999999999)}",
            pnr=str(random.randint(1000000000, 9999999999)),
            rand=str(random.randint(1000, 9999))
        )
        corpus.append((msg, 0))

    # Shuffle corpus to ensure random distribution during vectorizer training
    random.shuffle(corpus)
    return corpus

if __name__ == "__main__":
    data = generate_training_corpus(3000)
    scam_cnt = sum(1 for x in data if x[1] == 1)
    safe_cnt = sum(1 for x in data if x[1] == 0)
    print(f"Dataset generated successfully! Total samples: {len(data)} (Scam: {scam_cnt}, Safe: {safe_cnt})")
    print("Sample 1:", data[0])
    print("Sample 2:", data[1])
