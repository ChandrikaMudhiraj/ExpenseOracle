from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.api.deps import get_db
from app.schemas.goal import GoalCreate, GoalUpdate, GoalResponse
from app.services.goal_service import GoalService

router = APIRouter(prefix="/goals", tags=["Goals"])
service = GoalService()


@router.get("/", response_model=List[GoalResponse])
def get_goals(user_id: int, db: Session = Depends(get_db)):
    return service.get_goals(db, user_id)


@router.post("/", response_model=GoalResponse)
def create_goal(user_id: int, goal: GoalCreate, db: Session = Depends(get_db)):
    return service.create_goal(db, user_id, goal)


@router.put("/{goal_id}", response_model=GoalResponse)
def update_goal(goal_id: int, goal_update: GoalUpdate, db: Session = Depends(get_db)):
    goal = service.update_goal(db, goal_id, goal_update)
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    return goal


@router.delete("/{goal_id}")
def delete_goal(goal_id: int, db: Session = Depends(get_db)):
    if not service.delete_goal(db, goal_id):
        raise HTTPException(status_code=404, detail="Goal not found")
    return {"message": "Goal deleted"}
