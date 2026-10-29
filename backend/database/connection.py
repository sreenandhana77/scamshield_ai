import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Default to local SQLite database in development, override with environment variable in production
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./scamshield.db")

# Connection parameters
connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    # SQLite requires check_same_thread=False for multithreading in FastAPI
    connect_args = {"check_same_thread": False}
else:
    # MySQL pool configurations for production
    connect_args = {
        "pool_pre_ping": True,
        "pool_recycle": 3600,
    }

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# DB Dependency injection generator
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
