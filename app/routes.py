from flask import Blueprint, render_template, jsonify,session,redirect, url_for,request
from functools import wraps
import socket
import os
import platform
import datetime
import time
import psutil

main = Blueprint('main', __name__)

START_TIME = time.time()
request_count = 0
request_history=[]
def login_required(f):
    @wraps(f)
    def decorated(*args,**kwargs):
        if not session.get('logged_in'):
            return redirect(url_for('main.login'))
        return f(*args,**kwargs)
    return decorated

@main.route('/login', methods=['GET', 'POST'])
def login():
    error = None
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        valid_user = os.getenv("DASHBOARD_USER", "admin")
        valid_pass = os.getenv("DASHBOARD_PASS", "admin123")
        if username == valid_user and password == valid_pass:
            session['logged_in'] = True
            return redirect(url_for('main.index'))
        else:
            error = "Invalid username or password."
    return render_template('login.html', error=error)
@main.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('main.login'))



@main.route('/')
@login_required
def index():
    return render_template('index.html')


@main.route('/api/system')
@login_required
def system_info():
    global request_count
    request_count += 1

    uptime_seconds = int(time.time() - START_TIME)
    hours, remainder = divmod(uptime_seconds, 3600)
    minutes, seconds = divmod(remainder, 60)
    restart_time= datetime.datetime.utcfromtimestamp(START_TIME).strftime("%Y-%m-%d %H:%M:%S UTC")


    return jsonify({
        "hostname": socket.gethostname(),
        "ip_address": socket.gethostbyname(socket.gethostname()),
        "platform": platform.system(),
        "python_version": platform.python_version(),
        "uptime": f"{hours}h {minutes}m {seconds}s",
        "last_restart": restart_time,"timestamp": datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC"),
        "request_count": request_count
    })


@main.route('/api/health')
@login_required
def health():
    global request_count
    request_count += 1

    return jsonify({
        "status": "healthy",
        "container": "running",
        #"database": "not configured",
        "timestamp": datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")
    })


@main.route('/api/env')
@login_required
def env_info():
    global request_count
    request_count += 1

    return jsonify({
        "ENVIRONMENT": os.getenv("ENVIRONMENT", "Not Set"),
        "APP_VERSION": os.getenv("APP_VERSION", "1.0.0"),
        "REGION": os.getenv("REGION", "Not Set"),
        "DEBUG": os.getenv("DEBUG", "False")
    })
@main.route('/api/stats')
@login_required
def stats():
    global request_count
    request_count += 1
    cpu = psutil.cpu_percent(interval=0.1)
    mem = psutil.virtual_memory()
    return jsonify({
        "cpu_percent": cpu,
        "memory_percent": mem.percent,
        "memory_used_mb": round(mem.used / (1024 * 1024), 1),
        "memory_total_mb": round(mem.total / (1024 * 1024), 1)
    })
@main.route('/api/history')
@login_required
def history():
    global request_count, request_history
    request_count += 1
    snapshot = {
        "time": datetime.datetime.utcnow().strftime("%H:%M:%S"),
        "count": request_count
    }
    request_history.append(snapshot)
    if len(request_history) > 20:
        request_history.pop(0)
    return jsonify(request_history)