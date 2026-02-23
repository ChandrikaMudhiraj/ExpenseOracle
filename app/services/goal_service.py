from sqlalchemy.orm import Session
from app.repository import goal_repository
from app.schemas.goal import GoalCreate, GoalUpdate


class GoalService:
    @staticmethod
    def get_goals(db: Session, user_id: int):
        return goal_repository.get_goals_by_user(db, user_id)

    @staticmethod
    def create_goal(db: Session, user_id: int, goal: GoalCreate):
        return goal_repository.create_goal(db, goal, user_id)

    @staticmethod
    def update_goal(db: Session, goal_id: int, goal_update: GoalUpdate):
        return goal_repository.update_goal(db, goal_id, goal_update)

    @staticmethod
    def delete_goal(db: Session, goal_id: int):
        return goal_repository.delete_goal(db, goal_id)
