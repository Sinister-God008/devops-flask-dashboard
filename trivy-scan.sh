#!/bin/bash

IMAGE_NAME="flask-dashboard"

echo "========================================="
echo " Running Trivy Security Scan"
echo " Image: $IMAGE_NAME"
echo "========================================="

# Check if trivy is installed
if ! command -v trivy &> /dev/null; then
    echo "Trivy not found. Installing..."
    curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh -s -- -b /usr/local/bin
fi

# Run vulnerability scan
trivy image --exit-code 1 --severity HIGH,CRITICAL "$IMAGE_NAME"

if [ $? -eq 0 ]; then
    echo "Scan passed — no HIGH or CRITICAL vulnerabilities found."
else
    echo "Scan failed — HIGH or CRITICAL vulnerabilities detected. Fix before deploying."
    exit 1
fi
