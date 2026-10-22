/**
 * Smart Pharmacy - IoT Hardware Telemetry Emulation Processing System
 */

document.addEventListener('DOMContentLoaded', () => {
    setupHardwareInputDrivers();
});

/**
 * Binds active capture pipelines to interface submission inputs.
 */
function setupHardwareInputDrivers() {
    const form = document.getElementById('hardware-scanner-mock-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const signalValue = document.getElementById('hardware-stream-input').value.trim();
        processHardwareSignalEvaluation(signalValue);
    });
}

/**
 * Direct abstraction helper to execute programmatic macro shortcut selection events.
 */
window.injectQuickSignal = function(signalValue) {
    document.getElementById('hardware-stream-input').value = signalValue;
    processHardwareSignalEvaluation(signalValue);
};

/**
 * Emulates full physical scan processing passes with realistic async latency timeouts.
 */
function processHardwareSignalEvaluation(rawSignal) {
    const screen = document.getElementById('console-interactive-screen');
    const statusPill = document.getElementById('console-status-pill');

    if(!rawSignal) return;

    // Switch screen layout metrics to signal active worker routines
    statusPill.className = "status-indicator-light status-working";
    statusPill.innerText = "Processing Telemetry Data";
    
    screen.innerHTML = `
        <div style="text-align:center; color: #f59e0b;">
            <i class="fas fa-spinner fa-spin fa-3x" style="margin-bottom:1rem;"></i>
            <p>Decoding hardware transmission packets...</p>
            <p style="font-size:0.75rem; opacity:0.7; margin-top:0.5rem;">[Signal Matrix ID: ${rawSignal}]</p>
        </div>
    `;

    // Simulate standard operational hardware processing delay thresholds
    setTimeout(() => {
        const inventoryRaw = localStorage.getItem('pharmacy_inventory');
        const catalog = inventoryRaw ? JSON.parse(inventoryRaw) : [];

        // Match barcode signatures or passive RFID tags
        const matchedAsset = catalog.find(m => (m.barcode === rawSignal) || (m.rfid === rawSignal));

        const now = new Date();
        const timestampStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;

        const scanLogsRaw = localStorage.getItem('scan_history');
        const scanHistory = scanLogsRaw ? JSON.parse(scanLogsRaw) : [];

        if (matchedAsset) {
            statusPill.className = "status-indicator-light status-success";
            statusPill.innerText = "Match Verified";

            screen.innerHTML = `
                <div class="telemetry-readout-packet">
                    <h2><i class="fas fa-barcode"></i> MATCH RESOLVED: ${matchedAsset.id}</h2>
                    <p>Asset Label: <strong>${matchedAsset.name}</strong></p>
                    <p>Therapeutic Category: ${matchedAsset.category}</p>
                    <p>Current Node Balance: <strong>${matchedAsset.quantity} units</strong></p>
                    <p>Expiration Window: ${matchedAsset.expiryDate}</p>
                    <p>Production Facility: ${matchedAsset.manufacturer}</p>
                    <p style="margin-top:1rem; font-size:0.75rem; color:#64748b;">Dynamic Cloud Mirror States Synced to Amazon DynamoDB Layer Instance.</p>
                </div>
            `;

            // Commit structured transaction to history logs
            scanHistory.push({
                timestamp: timestampStr,
                hardwareId: rawSignal.startsWith('RFID') ? 'RFID_RX_01' : 'LASER_BAR_02',
                lookupCode: rawSignal,
                resolvedName: matchedAsset.name,
                status: 'MATCH FOUND'
            });

        } else {
            statusPill.className = "status-indicator-light status-fail";
            statusPill.innerText = "Lookup Exception Fault";

            screen.innerHTML = `
                <div style="color: #ef4444;">
                    <h3><i class="fas fa-exclamation-triangle"></i> NO REGISTERED PROFILE IDENTIFIED</h3>
                    <p style="margin-top:1rem; color:#94a3b8; font-size:0.9rem;">The scanned tracking tag <code>${rawSignal}</code> returned no active matching allocation records within this local partition grid system.</p>
                </div>
            `;

            scanHistory.push({
                timestamp: timestampStr,
                hardwareId: 'UNKNOWN_NODE',
                lookupCode: rawSignal,
                resolvedName: 'Unresolved System Fault Exception',
                status: 'NOT FOUND'
            });
        }

        localStorage.setItem('scan_history', JSON.stringify(scanHistory));

    }, 850);
}