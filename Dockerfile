# Production-Grade Multi-Purpose Dockerfile
# Optimized for FastAPI and Celery Workers

FROM node:18-bullseye AS frontend
WORKDIR /src
COPY app/frontend/package.json app/frontend/vite.config.js app/frontend/index.html ./
COPY app/frontend/src ./src
RUN npm install --legacy-peer-deps && npm run build

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

# Copy backend project files
COPY . .
# Remove any local virtualenvs copied into the image to avoid platform
# mismatches (e.g., Windows wheels) which break runtime imports like matplotlib.
RUN rm -rf myenv || true

# Build-time sanity check: ensure important API modules were copied into the image.
# This will fail the build early and print directory contents if a file is missing.
RUN if [ ! -f app/api/v1/health.py ]; then \
    echo "ERROR: app/api/v1/health.py not found in image"; \
    echo "Listing app/api:"; ls -la app/api || true; \
    echo "Listing app/api/v1:"; ls -la app/api/v1 || true; \
    exit 1; \
    fi

# Copy frontend build output into static folder
COPY --from=frontend /src/../static ./app/static

# Expose port (default for FastAPI)
EXPOSE 8000

# Entrypoint
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
