# --- Stage 1: Build ---
FROM python:3.10-slim AS builder

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir --prefix=/install -r requirements.txt


# --- Stage 2: Final secure image ---
FROM python:3.10-slim

WORKDIR /app

# Copy installed packages from builder stage
COPY --from=builder /install /usr/local

# Copy app source
COPY . .

# Create a non-root user for security
RUN useradd --no-create-home --shell /bin/false appuser
USER appuser

# Expose port
EXPOSE 5000

# Use gunicorn as production server
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "2", "run:app"]
