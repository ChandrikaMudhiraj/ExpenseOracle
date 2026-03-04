"""rename goal current_amount to current_saved

Revision ID: 592921e33dda
Revises: 206f3e732202
Create Date: 2026-03-04 20:30:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '592921e33dda'
down_revision: Union[str, None] = '206f3e732202'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Rename current_amount to current_saved in goals table
    op.alter_column('goals', 'current_amount', new_column_name='current_saved')


def downgrade() -> None:
    # Rename back current_saved to current_amount in goals table
    op.alter_column('goals', 'current_saved', new_column_name='current_amount')
