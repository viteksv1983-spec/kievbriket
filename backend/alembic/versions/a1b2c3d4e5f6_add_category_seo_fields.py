"""Add category SEO fields

Revision ID: a1b2c3d4e5f6
Revises: 869e47cb71c3
Create Date: 2026-02-28 14:20:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a1b2c3d4e5f6'
down_revision: Union[str, Sequence[str], None] = '869e47cb71c3'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Add advanced SEO fields to category_metadata — all nullable, safe for existing data."""
    op.add_column('category_metadata', sa.Column('meta_title', sa.String(255), nullable=True))
    op.add_column('category_metadata', sa.Column('meta_description', sa.Text(), nullable=True))
    op.add_column('category_metadata', sa.Column('seo_h1', sa.String(255), nullable=True))
    op.add_column('category_metadata', sa.Column('og_title', sa.String(255), nullable=True))
    op.add_column('category_metadata', sa.Column('og_description', sa.Text(), nullable=True))
    op.add_column('category_metadata', sa.Column('og_image', sa.String(), nullable=True))
    op.add_column('category_metadata', sa.Column('is_indexable', sa.Boolean(), nullable=False, server_default=sa.text('1')))
    op.add_column('category_metadata', sa.Column('canonical_url', sa.String(), nullable=True))


def downgrade() -> None:
    """Remove advanced SEO fields from category_metadata."""
    op.drop_column('category_metadata', 'canonical_url')
    op.drop_column('category_metadata', 'is_indexable')
    op.drop_column('category_metadata', 'og_image')
    op.drop_column('category_metadata', 'og_description')
    op.drop_column('category_metadata', 'og_title')
    op.drop_column('category_metadata', 'seo_h1')
    op.drop_column('category_metadata', 'meta_description')
    op.drop_column('category_metadata', 'meta_title')
