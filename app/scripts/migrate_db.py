from sqlalchemy import text
from app.core.database import engine

def migrate():
    with engine.connect() as conn:
        print("Starting manual migration...")
        
        # Add monthly_savings to users
        try:
            conn.execute(text("ALTER TABLE users ADD COLUMN monthly_savings FLOAT DEFAULT 0.0;"))
            print("Added monthly_savings to users table.")
        except Exception as e:
            print(f"Note: monthly_savings column status: {e}")

        # Add risk_tolerance to users
        try:
            conn.execute(text("ALTER TABLE users ADD COLUMN risk_tolerance VARCHAR DEFAULT 'Moderate';"))
            print("Added risk_tolerance to users table.")
        except Exception as e:
            print(f"Note: risk_tolerance column status: {e}")
            
        conn.commit()
        print("Migration successful.")

if __name__ == "__main__":
    migrate()
