from sqlalchemy.orm import Session
from app.models.autonomous_action import AutonomousAction


def save_action(db: Session, action_type: str, payload: dict, status: str = "simulated_executed"):
    rec = AutonomousAction(action_type=action_type, payload=payload, status=status)
    db.add(rec)
    db.commit()
    db.refresh(rec)
    return rec
