from flask import Blueprint, render_template, jsonify
import socket
import os
import platform
import datetime
import time

main = Blueprint('main', __name__)

START_TIME = time.time()
request_count = 0


@main.route('/')
def index():
    return render_template('index.html')


@main.route('/api/system')
def system_info():
    global request_count
    request_count += 1

    uptime_seconds = int(time.time() - START_TIME)
    hours, remainder = divmod(uptime_seconds, 3600)
    minutes, seconds = divmod(remainder, 60)

    return jsonify({
        "hostname": socket.gethostname(),
        "ip_address": socket.gethostbyname(socket.gethostname()),
        "platform": platform.system(),
        "python_version": platform.python_version(),
        "uptime": f"{hours}h {minutes}m {seconds}s",
        "timestamp": datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC"),
        "request_count": request_count
    })


@main.route('/api/health')
def health():
    global request_count
    request_count += 1

    return jsonify({
        "status": "healthy",
        "container": "running",
        "database": "not configured",
        "timestamp": datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")
    })


@main.route('/api/env')
def env_info():
    global request_count
    request_count += 1

    return jsonify({
        "ENVIRONMENT": os.getenv("ENVIRONMENT", "Not Set"),
        "APP_VERSION": os.getenv("APP_VERSION", "1.0.0"),
        "REGION": os.getenv("REGION", "Not Set"),
        "DEBUG": os.getenv("DEBUG", "False")
    })
