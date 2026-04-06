async function fetchSystemInfo() {
    try {
        const res = await fetch('/api/system');
        const data = await res.json();

        document.getElementById('hostname').textContent = data.hostname;
        document.getElementById('ip').textContent = data.ip_address;
        document.getElementById('platform').textContent = data.platform;
        document.getElementById('python').textContent = data.python_version;
        document.getElementById('uptime').textContent = data.uptime;
        document.getElementById('timestamp').textContent = data.timestamp;
        document.getElementById('request-count').textContent = data.request_count;
    } catch (err) {
        console.error('Failed to fetch system info:', err);
    }
}

async function fetchHealth() {
    try {
        const res = await fetch('/api/health');
        const data = await res.json();

        const statusEl = document.getElementById('health-status');
        if (data.status === 'healthy') {
            statusEl.textContent = 'Healthy';
            statusEl.className = 'info-value status-healthy';
        } else {
            statusEl.textContent = 'Unhealthy';
            statusEl.className = 'info-value status-error';
        }

        document.getElementById('container-status').textContent = data.container;
        document.getElementById('health-timestamp').textContent = data.timestamp;
    } catch (err) {
        console.error('Failed to fetch health:', err);
    }
}

async function fetchEnv() {
    try {
        const res = await fetch('/api/env');
        const data = await res.json();

        document.getElementById('env-environment').textContent = data.ENVIRONMENT;
        document.getElementById('env-version').textContent = data.APP_VERSION;
        document.getElementById('env-region').textContent = data.REGION;
        document.getElementById('env-debug').textContent = data.DEBUG;
    } catch (err) {
        console.error('Failed to fetch env info:', err);
    }
}

function refreshAll() {
    fetchSystemInfo();
    fetchHealth();
    fetchEnv();
}

refreshAll();
setInterval(refreshAll, 5000);
