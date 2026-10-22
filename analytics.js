/**
 * Smart Pharmacy - Analytics Visualization Module Engine
 */

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        executeAnalyticsDashboardRendering();
    }, 150);
});

/**
 * Extracts historical state parameters to compile specialized data analytics graphs.
 */
function executeAnalyticsDashboardRendering() {
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
        categoriesMap[item.category] = (categoriesMap[item.category] || 0) + item.quantity;
        const expiry = new Date(item.expiryDate);
        if (expiry <= today) {
            expiredCount++;
        } else if (item.quantity <= 20) {
            lowCount++;
        } else {
            optimalCount++;
        }
    });

    // Write numerical summaries to analytics page indicators
    document.getElementById('an-node-total').innerText = totalCount;
    document.getElementById('an-node-optimal').innerText = optimalCount;
    document.getElementById('an-node-low').innerText = lowCount;
    document.getElementById('an-node-expired').innerText = expiredCount;

    // Build the structural data charts
    renderAnalyticsPieComponent(categoriesMap);
    renderAnalyticsBarComponent(catalog);
}

/**
 * Instantiates the distribution breakdown chart component context.
 */
function renderAnalyticsPieComponent(categoriesMap) {
    const ctx = document.getElementById('analyticsPieComponent').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(categoriesMap),
            datasets: [{
                data: Object.values(categoriesMap),
                backgroundColor: ['#1e3a8a', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']
            }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right' } } }
    });
}

/**
 * Instantiates the comparative volumetric bar chart asset component context.
 */
function renderAnalyticsBarComponent(catalog) {
    const ctx = document.getElementById('analyticsBarComponent').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: catalog.map(m => m.name),
            datasets: [{
                label: 'On-Hand Unit Concentrations',
                data: catalog.map(m => m.quantity),
                backgroundColor: '#3b82f6',
                borderRadius: 4
            }]
        },
        options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } } }
    });
}