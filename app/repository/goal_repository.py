from sqlalchemy.orm import Session
from app.models.goal import Goal
from app.schemas.goal import GoalCreate, GoalUpdate


def get_goal(db: Session, goal_id: int):
    return db.query(Goal).filter(Goal.id == goal_id).first()


def get_goals_by_user(db: Session, user_id: int):
    return db.query(Goal).filter(Goal.user_id == user_id).all()


def create_goal(db: Session, goal: GoalCreate, user_id: int):
    db_goal = Goal(**goal.model_dump(), user_id=user_id)
    db.add(db_goal)
    db.commit()
    db.refresh(db_goal)
    return db_goal


def update_goal(db: Session, goal_id: int, goal_update: GoalUpdate):
    db_goal = db.query(Goal).filter(Goal.id == goal_id).first()
    if db_goal:
        update_data = goal_update.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_goal, key, value)
        db.commit()
        db.refresh(db_goal)
    return db_goal


def delete_goal(db: Session, goal_id: int):
    db_goal = db.query(Goal).filter(Goal.id == goal_id).first()
    if db_goal:
        db.delete(db_goal)
        db.commit()
        return True
    return False
