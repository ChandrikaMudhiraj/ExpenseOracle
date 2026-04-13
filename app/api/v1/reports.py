from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.services.expense_service import list_expenses
from app.services.goal_service import GoalService
import csv
from io import StringIO
from datetime import datetime
from typing import Optional

router = APIRouter(prefix="/reports", tags=["Reports"])

@router.get("/expenses/csv")
def export_expenses_csv(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    expenses = list_expenses(db, current_user.id)
    output = StringIO()
    writer = csv.writer(output)
    writer.writerow(['Date', 'Amount', 'Category', 'Description'])
    for expense in expenses:
        writer.writerow([expense.created_at, expense.amount, expense.category, expense.title])
    output.seek(0)
    return {"csv": output.getvalue()}

@router.get("/monthly-summary/pdf")
def export_monthly_summary_pdf(
    year: int = datetime.now().year,
    month: int = datetime.now().month,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Calculate summary
    expenses = list_expenses(db, current_user.id)
    monthly_expenses = [e for e in expenses if e.created_at.year == year and e.created_at.month == month]
    total_expenses = sum(e.amount for e in monthly_expenses)
    
    total_income = 0  # Placeholder
    total_savings = total_income - total_expenses
    
    categories = {}
    for e in monthly_expenses:
        categories[e.category] = categories.get(e.category, 0) + e.amount
    top_category = max(categories, key=categories.get) if categories else "None"
    
    goals = GoalService.get_goals(db, current_user.id)
    goal_contributions = sum(g.current_saved for g in goals)
    
    # Simple text PDF placeholder
    pdf_content = f"""
Monthly Financial Summary - {month}/{year}

Total Income: ${total_income:.2f}
Total Expenses: ${total_expenses:.2f}
Total Savings: ${total_savings:.2f}
Top Spending Category: {top_category}
Goal Contributions This Month: ${goal_contributions:.2f}
"""
    return {"pdf": pdf_content}

@router.get("/goal-progress/pdf")
def export_goal_progress_pdf(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    goals = GoalService.get_goals(db, current_user.id)
    pdf_content = "Goal Progress Report\n\n"
    
    for goal in goals:
        progress = (goal.current_saved / goal.target_amount) * 100 if goal.target_amount > 0 else 0
        pdf_content += f"Goal: {goal.name}\nTarget: ${goal.target_amount:.2f}\nCurrent: ${goal.current_saved:.2f}\nProgress: {progress:.1f}%\n\n"
    
    return {"pdf": pdf_content}