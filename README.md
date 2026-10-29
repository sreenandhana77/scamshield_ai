# ScamShield AI - Advanced Cyber Threat Detection Platform

ScamShield AI is a complete, production-ready cybersecurity platform designed to protect users from multi-channel scams across **SMS/WhatsApp/Emails**, **URL Links**, and **Voice Call Recordings** using hybrid Artificial Intelligence (ML + Heuristic Explainable AI).

---

## 🛡️ Key Features
- **Message Scanner**: Detects fraud markers (impersonation, OTP extraction, urgency) in texts.
- **URL Reputation Auditor**: Dissects links for brand spoofing, insecure protocols (HTTP), lookalike domains, and redirection shorteners.
- **Voice Call Analyzer**: Uses speech-to-text models (Whisper AI) to transcribe voice notes and evaluate scam features.
- **Multilingual Support**: Automatically detects Indic languages (Hindi, Tamil, Telugu, Malayalam) and translates them to English before routing through threat classifiers.
- **Explainable AI (XAI)**: Explicitly alerts users on *why* a message is classified as a threat.
- **Threat Intelligence Console**: Interactive graphs tracking daily scan activity, scam types, and Indic dialect demographics.

---

## 🏗️ Directory Architecture

```
c:/ANTI SCAM ASSISTANT/
├── frontend/
│   ├── package.json          # React, Tailwind, Lucide, Recharts dependencies
│   ├── vite.config.js        # Vite compilation settings
│   ├── postcss.config.js     # PostCSS configurations
│   ├── tailwind.config.js    # Custom space-cyber dark theme specifications
│   ├── index.html            # Core HTML structure & Outfit fonts
│   └── src/
│       ├── main.jsx          # React app mount
│       ├── index.css         # Global rules, custom scrollbars, neon glows
│       ├── App.jsx           # App layout and route wrappers
│       ├── components/
│       │   ├── Sidebar.jsx   # Interactive drawer with blinking connection state
│       │   └── ScanResultCard.jsx # SVG gauge, reasons list, security guidelines
│       ├── services/
│       │   └── api.js        # API connector with offline fallback simulator
│       └── pages/
│           ├── Dashboard.jsx # Active load counters and quick launch panel
│           ├── MessageScan.jsx # SMS / WhatsApp / Email scanner with templates
│           ├── UrlScan.jsx   # Domain phishing and SSL inspector
│           ├── VoiceScan.jsx # Waveform visualizer, transcription readouts
│           ├── MultilingualScan.jsx # Auto-translator pipeline showcase
│           ├── ScanHistory.jsx # Scrollable audit table and modal inspector
│           └── AdminDashboard.jsx # SVG Area, Pie, and Bar charts for threats
└── backend/
    ├── requirements.txt      # FastAPI, SQLAlchemy, Scikit-learn, Pydantic packages
    ├── main.py               # Server launcher, CORS setup, production static file router
    ├── test_backend.py       # Localized test module validating ML services
    ├── database/
    │   ├── connection.py     # Session pool configuration (SQLite/MySQL)
    │   ├── models.py         # SQLAlchemy ORM definitions
    │   └── schemas.py        # Pydantic validation schemas
    ├── api/
    │   └── routes.py         # CRUD routes for scans, history, and analytics
    └── services/
        ├── ai_service.py     # Multinomial Naive Bayes + Heuristics blend
        ├── url_service.py    # Phishing lookalike domain parsing rules
        ├── translation_service.py # Unicode ranges dialect detection
        └── voice_service.py  # Call STT transcript generator
```

---

## ⚡ Setup & Run Instructions (Windows)

Follow these steps to spin up ScamShield AI locally.

### Prerequisites
- Python (v3.10+)
- Node.js & npm (v20+)
- Git

### 1. Backend Setup
1. Open PowerShell and navigate to the project root:
   ```powershell
   cd "ScamShield_AI"
   ```
2. Create and activate a virtual environment:
   ```powershell
   python -m venv .venv
   .venv\Scripts\Activate.ps1
   ```
3. Install dependencies:
   ```powershell
   python -m pip install -r backend/requirements.txt
   ```
4. Run localized backend verification tests:
   ```powershell
   $env:PYTHONIOENCODING = "utf-8"
   python -m backend.test_backend
   ```
   *(Ensure all tests report `[PASS]`)*
5. Start the FastAPI development server:
   ```powershell
   python -m uvicorn backend.main:app --reload --port 8000
   ```
   The backend API and integrated frontend are now running at `http://localhost:8000`.

### 2. Frontend Setup (Development)
1. Open a new PowerShell terminal:
   ```powershell
   cd "ScamShield_AI\frontend"
   ```
2. Install frontend dependencies:
   ```powershell
   npm install
   ```
3. Build the production React assets:
   ```powershell
   npm run build
   ```
   *Note: Building compiled files will output to `frontend/dist/`. FastAPI is configured to automatically serve these files. Once compiled, you can visit `http://localhost:8000/` in your browser to view the complete production app directly from the FastAPI server!*
4. Alternatively, run the Vite development server:
   ```powershell
   npm run dev
   ```
   The interactive development dashboard is now running at `http://localhost:5173`.

---

## 🌐 Live Deployment Options

### Option A: GitHub Pages (Automatic CI/CD)
This repository includes a configured GitHub Actions workflow (`.github/workflows/deploy.yml`).
1. Push this repository to GitHub:
   ```powershell
   git push -u origin main
   ```
2. In your GitHub repository, navigate to **Settings** > **Pages**.
3. Under **Build and deployment** > **Source**, choose **GitHub Actions**.
4. The workflow will automatically build the React app and deploy it live to:
   `https://<your-username>.github.io/<repo-name>/`
   *(e.g., `https://sreenandhana77.github.io/ScamShield_AI/`)*

### Option B: Vercel (Instant 1-Click Frontend Deployment)
This repository contains a pre-configured `vercel.json`.
1. Go to [Vercel](https://vercel.com/) and click **Add New Project**.
2. Select your `ScamShield_AI` GitHub repository.
3. Keep default settings and click **Deploy**.
4. Your application will be live at `https://<project-name>.vercel.app`.

### Option C: Render.com (Full-Stack FastAPI + React AI Engine)
This repository includes `render.yaml` and `Procfile`.
1. Go to [Render](https://render.com/) and connect your GitHub account.
2. Click **New +** > **Blueprint** (or **Web Service**).
3. Connect `ScamShield_AI`.
4. Render will run the full Python AI backend + React frontend together at `https://scamshield-ai.onrender.com`.

---

## 🛢️ Database Configuration: Switching to MySQL

By default, ScamShield AI runs on a local SQLite database (`scamshield.db`) for zero-configuration development. 

To shift the application to MySQL for production deployment:
1. Ensure a MySQL Server instance is running.
2. Edit your environment variables (or create a `.env` file in the root) and set `DATABASE_URL`:
   ```bash
   DATABASE_URL=mysql+pymysql://<user>:<password>@<host>:<port>/<database_name>
   ```
   *Example:*
   ```bash
   DATABASE_URL=mysql+pymysql://admin:cybersecure101@localhost:3306/scamshield
   ```
3. Restart the FastAPI backend. SQLAlchemy will automatically create all tables (`users`, `scans`, `url_analysis`, `voice_analysis`, `analytics`) on the MySQL database.

---

## 🤖 Machine Learning & Threat Scoring
ScamShield AI utilizes a **Hybrid Text Classification Engine**:
- **Explainable AI (XAI)**: A regex heuristic filter checks for exact pattern presence (e.g. OTP, PAN Card, electricity bills, direct bank names). This populates detailed reason descriptors back to the user.
- **Multinomial Naive Bayes (ML)**: A text classifier is trained on startup using TF-IDF tokenization. It outputs a scam probability from `0.0` to `1.0`. The Naive Bayes model specializes in identifying linguistic combinations of phishing context.
- **Scoring Engine**: Evaluates a combined score from `0` to `100`.
  - **0–30 (Safe)**: Green layout. Heuristics are clear, ML confidence is low.
  - **31–70 (Suspicious)**: Amber layout. Potential indicators detected.
  - **71–100 (Dangerous)**: Crimson layout. High threat confidence. Immediate actions (block, report) are recommended.
