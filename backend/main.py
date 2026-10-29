import os
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from backend.database.connection import engine, Base
from backend.api import routes

# Initialize FastAPI App
app = FastAPI(
    title="Anti Scam Assistant API",
    description="Cybersecurity AI platform protecting users from multi-channel scams",
    version="1.0.0"
)

# CORS Policy configuration (Allows local React development server to interact)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Database Schema on start
try:
    Base.metadata.create_all(bind=engine)
    print("Anti Scam Assistant Database successfully initialized.")
except Exception as e:
    print(f"Error initializing database tables: {e}")

# Include Threat Analysis Routers
app.include_router(routes.router)

# Mount compiled static frontend assets (production deployment wrapper)
FRONTEND_DIST_DIR = os.path.join(os.path.dirname(__file__), "..", "frontend", "dist")

if os.path.exists(FRONTEND_DIST_DIR):
    app.mount("/assets", StaticFiles(directory=os.path.join(FRONTEND_DIST_DIR, "assets")), name="static")
    
    @app.get("/")
    def serve_root():
        return FileResponse(os.path.join(FRONTEND_DIST_DIR, "index.html"))

    # Catch-all route to serve Index.html for Single-Page React Routing
    @app.get("/{catchall:path}")
    def serve_frontend(catchall: str):
        # Allow API endpoints to route cleanly
        if catchall.startswith(("analyze-", "translate", "history", "analytics", "auth", "docs", "openapi.json", "assets")):
            raise HTTPException(status_code=404, detail="Not Found")
        file_path = os.path.join(FRONTEND_DIST_DIR, catchall)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(FRONTEND_DIST_DIR, "index.html"))
else:
    print(f"Warning: Production frontend dist directory not found at {FRONTEND_DIST_DIR}.")
    print("Run frontend compilation (npm run build) to serve React directly from FastAPI.")

if __name__ == "__main__":
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
