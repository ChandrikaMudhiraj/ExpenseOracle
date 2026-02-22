from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, JSON
from app.models.user import Base


class AutonomousAction(Base):
    __tablename__ = "autonomous_actions"

    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    action_type = Column(String(128), nullable=False)
    payload = Column(JSON, nullable=True)
    status = Column(String(64), nullable=True)
