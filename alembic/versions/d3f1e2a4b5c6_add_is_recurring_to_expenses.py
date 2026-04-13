"""add is_recurring to expenses

Revision ID: d3f1e2a4b5c6
Revises: 592921e33dda
Create Date: 2026-03-05 12:15:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = 'd3f1e2a4b5c6'
down_revision: Union[str, None] = '592921e33dda'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('expenses', sa.Column('is_recurring', sa.Boolean(), nullable=False, server_default=sa.false()))


def downgrade() -> None:
    op.drop_column('expenses', 'is_recurring')
