# Production-Grade Multi-Purpose Dockerfile
# Optimized for FastAPI and Celery Workers

FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONPATH /app
ENV PYTHONUNBUFFERED 1

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Set work directory
WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . .

# Expose port (default for FastAPI)
EXPOSE 8000

# Entrypoint will be overridden by docker-compose for workers
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
