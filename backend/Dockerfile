# Use official Python lightweight image
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=8080

# Set work directory — must be /app so "from backend.xxx" imports work
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies first (cached layer)
COPY backend/requirements.txt /app/backend/requirements.txt
RUN pip install --no-cache-dir -r /app/backend/requirements.txt

# Copy the entire backend project into /app/backend/
COPY backend/ /app/backend/

# Create media dir
RUN mkdir -p /app/backend/media

# Run from /app so Python resolves "backend" package correctly
CMD uvicorn backend.main:app --host 0.0.0.0 --port ${PORT:-8080}
