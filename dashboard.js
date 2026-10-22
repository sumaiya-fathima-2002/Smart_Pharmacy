/**
 * Smart Pharmacy - Control Dashboard Core Analytics Driver
 */

document.addEventListener('DOMContentLoaded', () => {
    // Inject dynamic analytical hooks delayed to guarantee baseline state storage processing completes smoothly.
    setTimeout(() => {
        executeDashboardPipeline();
    }, 150);
});

/**
 * Executes complete mathematical aggregation transformations to render graphical widgets.
 */
function executeDashboardPipeline() {
    const rawData = localStorage.getItem('pharmacy_inventory');
    const catalog = rawData ? JSON.parse(rawData) : [];

    // Base Calculations
    const totalCount = catalog.length;
    let optimalCount = 0;
    let lowCount = 0;
    let expiredCount = 0;

    const today = new Date();
    const categoriesMap = {};

    catalog.forEach(item => {
        // Evaluate therapeutic asset categorization mappings
        categoriesMap[item.category] = (categoriesMap[item.category] || 0) + item.quantity;

        // Evaluate validation timestamps
        const expiry = new Date(item.expiryDate);
        if (expiry <= today) {
            expiredCount++;
            item.status = "Expired";
        } else if (item.quantity <= 20) {
            lowCount++;
            item.status = "Low Stock";
        } else {
            optimalCount++;
            item.status = "In Stock";
        }
    });

    // Write Computed Metrics Back To Structural DOM Target Selectors
    document.getElementById('metric-total').innerText = totalCount;
    document.getElementById('metric-optimal').innerText = optimalCount;
    document.getElementById('metric-low').innerText = lowCount;
    document.getElementById('metric-expired').innerText = expiredCount;

    // Render Data Logs
    renderDashboardScanJournal();

    // Render Chart Visualizations
    renderCategoryPieChart(categoriesMap);
    renderStockLevelBarChart(catalog);
}

/**
 * Builds standard chart metrics matching category maps.
 */
function renderCategoryPieChart(categoriesMap) {
    const ctx = document.getElementById('chartCategoryPie').getContext('2d');
    const labels = Object.keys(categoriesMap);
    const dataValues = Object.values(categoriesMap);

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels.length ? labels : ['No Assets Tracked'],
            datasets: [{
                data: dataValues.length ? dataValues : [1],
                backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']
            }]
        },
        options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
    });
}

/**
 * Instantiates the physical resource density bar visualization chart component context.
 */
function renderStockLevelBarChart(catalog) {
    const ctx = document.getElementById('chartStockBar').getContext('2d');
    const labels = catalog.map(m => m.name);
    const volumes = catalog.map(m => m.quantity);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Unit In-Stock Volume Matrix',
                data: volumes,
                backgroundColor: catalog.map(m => m.quantity <= 20 ? '#ef4444' : '#3b82f6'),
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            scales: { y: { beginAtZero: true } },
            plugins: { legend: { display: false } }
        }
    });
}

/**
 * Formats data logs table.
 */
function renderDashboardScanJournal() {
    const logBody = document.getElementById('dashboard-scans-tbody');
    const rawScans = localStorage.getItem('scan_history');
    const scanLogs = rawScans ? JSON.parse(rawScans) : [];

    if (!logBody) return;
    if (scanLogs.length === 0) return;

    logBody.innerHTML = '';
    // Display the 5 most recent scan logs
    scanLogs.slice(-5).reverse().forEach(log => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><code>${log.timestamp}</code></td>
            <td><span class="badge badge-warning">${log.hardwareId}</span></td>
            <td><strong>${log.lookupCode}</strong></td>
            <td>${log.resolvedName}</td>
            <td><span class="badge ${log.status === 'MATCH FOUND' ? 'badge-success' : 'badge-danger'}">${log.status}</span></td>
        `;
        logBody.appendChild(row);
    });
}