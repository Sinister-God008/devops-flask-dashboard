let requestChart = null;
function initChart() {
    const ctx = document.getElementById('requestChart').getContext('2d');
    requestChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Total API Requests',
                data: [],
                borderColor: '#58a6ff',
                backgroundColor: 'rgba(88, 166, 255, 0.1)',
                borderWidth: 2,
                pointBackgroundColor: '#58a6ff',
                pointRadius: 3,
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            animation: { duration: 400 },
            plugins: {
                legend: {
                    labels: { color: '#8b949e', font: { size: 12 } }
                }
            },
            scales: {
                x: {
                    ticks: { color: '#8b949e', font: { size: 11 } },
                    grid: { color: '#21262d' }
                },
                y: {
                    ticks: { color: '#8b949e', font: { size: 11 } },
                    grid: { color: '#21262d' },
                    beginAtZero: true
                }
            }
        }
    });
}
async function fetchSystemInfo() {
    try {
        const res = await fetch('/api/system');
        if(res.status === 401) { window.location = '/login'; return; }
        const data = await res.json();

        document.getElementById('hostname').textContent = data.hostname;
        document.getElementById('ip').textContent = data.ip_address;
        document.getElementById('platform').textContent = data.platform;
        document.getElementById('python').textContent = data.python_version;
        document.getElementById('uptime').textContent = data.uptime;
        document.getElementById('last-restart').textContent = data.last_restart;
        document.getElementById('timestamp').textContent = data.timestamp;
        document.getElementById('request-count').textContent = data.request_count;
    } catch (err) {
        console.error('Failed to fetch system info:', err);
    }
}

async function fetchHealth() {
    try {
        const res = await fetch('/api/health');
        if(res.status === 401) { window.location = '/login'; return; }
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
        if(res.status === 401) { window.location = '/login'; return; }
        const data = await res.json();

        document.getElementById('env-environment').textContent = data.ENVIRONMENT;
        document.getElementById('env-version').textContent = data.APP_VERSION;
        document.getElementById('env-region').textContent = data.REGION;
        document.getElementById('env-debug').textContent = data.DEBUG;
    } catch (err) {
        console.error('Failed to fetch env info:', err);
    }
}
async function fetchStats() {
    try {
        const res = await fetch('/api/stats');
        if (res.status === 401) { window.location = '/login'; return; }
        const data = await res.json();
        document.getElementById('cpu-percent').textContent = data.cpu_percent + '%';
        document.getElementById('memory-percent').textContent = data.memory_percent + '%';
        document.getElementById('memory-used').textContent = data.memory_used_mb + ' MB';
        document.getElementById('memory-total').textContent = data.memory_total_mb + ' MB';
        document.getElementById('cpu-bar').style.width = data.cpu_percent + '%';
        document.getElementById('mem-bar').style.width = data.memory_percent + '%';
    } catch (err) {
        console.error('Failed to fetch stats:', err);
    }
}
async function fetchHistory() {
    try {
        const res = await fetch('/api/history');
        if (res.status === 401) { window.location = '/login'; return; }
        const data = await res.json();
        if (requestChart) {
            requestChart.data.labels = data.map(d => d.time);
            requestChart.data.datasets[0].data = data.map(d => d.count);
            requestChart.update();
        }
    } catch (err) {
        console.error('Failed to fetch history:', err);
    }
}
function refreshAll() {
    fetchSystemInfo();
    fetchHealth();
    fetchEnv();
    fetchStats();
    fetchHistory();
}
initChart();
refreshAll();
setInterval(refreshAll, 5000);
