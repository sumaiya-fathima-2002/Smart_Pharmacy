/**
 * Smart Pharmacy Inventory Management System - Global System Middleware
 * Handles global clock engines, navigation layouts, lifecycle seeding and local operations.
 */

document.addEventListener('DOMContentLoaded', () => {
    initializeSystemStorage();
    renderCommonSidebar();
    startSystemClock();
    highlightActiveNavigation();
});

/**
 * Initializes and hydrates LocalStorage with production baseline sets if missing.
 */
function initializeSystemStorage() {
    const baselineInventory = [
        { "id": "MED001", "name": "Metformin HCL", "category": "Antidiabetic", "manufacturer": "PharmaCorp Global", "quantity": 120, "expiryDate": "2027-12-15", "status": "In Stock", "barcode": "8901234567811", "rfid": "RFID-MET-001" },
        { "id": "MED002", "name": "Amoxicillin 500mg", "category": "Antibiotic", "manufacturer": "BioLabs Industries", "quantity": 15, "expiryDate": "2026-11-02", "status": "Low Stock", "barcode": "8901234567822", "rfid": "RFID-AMO-002" },
        { "id": "MED003", "name": "Lisinopril 10mg", "category": "Antihypertensive", "manufacturer": "MedLife Solutions", "quantity": 85, "expiryDate": "2024-03-10", "status": "Expired", "barcode": "8901234567833", "rfid": "RFID-LIS-003" },
        { "id": "MED004", "name": "Atorvastatin 20mg", "category": "Cardiovascular", "manufacturer": "PharmaCorp Global", "quantity": 200, "expiryDate": "2028-01-20", "status": "In Stock", "barcode": "8901234567844", "rfid": "RFID-ATO-004" },
        { "id": "MED005", "name": "Albuterol Inhaler", "category": "Respiratory", "manufacturer": "AeroHealth Inc.", "quantity": 8, "expiryDate": "2027-06-30", "status": "Low Stock", "barcode": "8901234567855", "rfid": "RFID-ALB-005" }
    ];

    if (!localStorage.getItem('pharmacy_inventory')) {
        localStorage.setItem('pharmacy_inventory', JSON.stringify(baselineInventory));
    }
    if (!localStorage.getItem('scan_history')) {
        localStorage.setItem('scan_history', JSON.stringify([]));
    }
}

/**
 * Renders standard template sidebar for global system context screens dynamically.
 */
function renderCommonSidebar() {
    const sidebarContainer = document.getElementById('global-sidebar-target');
    if (!sidebarContainer) return;

    sidebarContainer.innerHTML = `
        <div class="sidebar">
            <div class="brand">
                <i class="fas fa-heartbeat fa-lg"></i>
                <span>SmartPharmacy</span>
            </div>
            <ul class="nav-links">
                <li data-page="dashboard"><a href="dashboard.html"><i class="fas fa-th-large"></i>Dashboard</a></li>
                <li data-page="inventory"><a href="inventory.html"><i class="fas fa-boxes"></i>Inventory Matrix</a></li>
                <li data-page="scanner"><a href="scanner.html"><i class="fas fa-barcode"></i>IoT RFID/Scanner</a></li>
                <li data-page="recommendation"><a href="recommendation.html"><i class="fas fa-brain"></i>AI Rec Engine</a></li>
                <li data-page="analytics"><a href="analytics.html"><i class="fas fa-chart-pie"></i>Analytics Node</a></li>
                <li data-page="report"><a href="report.html"><i class="fas fa-file-alt"></i>Report Center</a></li>
                <li><a href="index.html"><i class="fas fa-sign-out-alt"></i>Exit App</a></li>
            </ul>
            <div class="sidebar-footer">
                <div class="cloud-status"><i class="fas fa-project-diagram"></i> DynamoDB Connected</div>
                <div class="cloud-status" style="color: #3b82f6; margin-top: 5px;"><i class="fas fa-cube"></i> TwinMaker Active</div>
                <p style="color: #64748b; font-size: 0.75rem; margin-top: 10px;">SDG 3 Compliance Verified</p>
            </div>
        </div>
    `;
}

/**
 * Evaluates execution context path to set programmatic active visual hooks down the tree.
 */
function highlightActiveNavigation() {
    const currentPath = window.location.pathname;
    const pageName = currentPath.substring(currentPath.lastIndexOf("/") + 1).replace(".html", "");
    const matchingTarget = document.querySelector(`[data-page="${pageName}"]`);
    if (matchingTarget) matchingTarget.classList.add('active');
}

/**
 * Orchestrates a centralized digital live logic clock reference framework.
 */
function startSystemClock() {
    const clockElement = document.getElementById('live-clock-display');
    if (!clockElement) return;

    const zeroPad = (num) => String(num).padStart(2, '0');
    
    const updateTime = () => {
        const now = new Date();
        clockElement.innerHTML = `<i class="far fa-clock"></i> ${now.getFullYear()}-${zeroPad(now.getMonth()+1)}-${zeroPad(now.getDate())} ${zeroPad(now.getHours())}:${zeroPad(now.getMinutes())}:${zeroPad(now.getSeconds())}`;
    };
    
    updateTime();
    setInterval(updateTime, 1000);
}