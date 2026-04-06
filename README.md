DevOps Flask Dashboard
A production-grade Dockerized Flask application with a live system monitoring dashboard. Built for DevSecOps and cloud deployment portfolios.

Features
Live auto-refreshing dashboard (every 5 seconds)
System info: hostname, IP, platform, Python version, uptime
Health check endpoint
Environment variable visibility
API request counter
Multi-stage Docker build (smaller, more secure image)
Non-root container user (security best practice)
Gunicorn production server
Docker Compose with health checks
Trivy vulnerability scanning
GitHub Actions CI/CD pipeline
Project Structure
devops-flask-dashboard/
├── app/
│   ├── __init__.py          # Flask app factory
│   ├── routes.py            # API routes and logic
│   ├── templates/
│   │   └── index.html       # Dynamic dashboard UI
│   └── static/
│       ├── css/style.css    # Dark theme styling
│       └── js/main.js       # Live data fetching (JS)
├── run.py                   # App entry point
├── requirements.txt         # Python dependencies
├── Dockerfile               # Multi-stage secure Docker build
├── docker-compose.yml       # Local orchestration with env vars
├── .dockerignore            # Files excluded from Docker image
├── trivy-scan.sh            # Vulnerability scan script
└── .github/
    └── workflows/
        └── ci.yml           # GitHub Actions CI/CD pipeline

API Endpoints
Endpoint	Description
GET /	Serves the live dashboard UI
GET /api/system	Returns hostname, IP, uptime, platform
GET /api/health	Returns container health status
GET /api/env	Returns environment variables
How to Run
Option 1: Docker Compose (Recommended)
docker-compose up --build

Open: http://localhost:5000

Option 2: Docker manually
# Build the image
docker build -t flask-dashboard .
# Run with environment variables
docker run -p 5000:5000 \
  -e ENVIRONMENT=DEV \
  -e APP_VERSION=1.0.0 \
  -e REGION=us-east-1 \
  flask-dashboard

Security Scan
# Build image first
docker build -t flask-dashboard .
# Run Trivy scan
bash trivy-scan.sh

CI/CD Pipeline
The GitHub Actions pipeline (.github/workflows/ci.yml) automatically:

Builds the Docker image on every push to main
Runs a Trivy vulnerability scan (fails on HIGH/CRITICAL issues)
Pushes the image to Docker Hub (on main branch only)
Setup secrets in GitHub
Go to your repo → Settings → Secrets and add:

DOCKER_USERNAME — your Docker Hub username
DOCKER_PASSWORD — your Docker Hub password or access token
Key DevSecOps Concepts Demonstrated
Concept	Implementation
Containerization	Docker multi-stage build
Security hardening	Non-root user inside container
Vulnerability scanning	Trivy (HIGH/CRITICAL detection)
Production server	Gunicorn (not Flask dev server)
Orchestration	Docker Compose with health checks
CI/CD automation	GitHub Actions pipeline
Environment management	Environment variables via Docker
Live monitoring	Auto-refreshing dashboard via JS fetch