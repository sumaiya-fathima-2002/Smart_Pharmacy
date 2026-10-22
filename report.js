/**
 * Smart Pharmacy - Compliance Reporting & Data Export Management Middleware
 */

document.addEventListener('DOMContentLoaded', () => {
    hydrateReportPreviewGridManifest();
});

/**
 * Loads baseline layout profiles to populate the report view screen component canvas.
 */
function hydrateReportPreviewGridManifest() {
    const tbody = document.getElementById('report-preview-manifest-tbody');
    if (!tbody) return;

    const rawData = localStorage.getItem('pharmacy_inventory');
    const inventory = rawData ? JSON.parse(rawData) : [];

    if(inventory.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color: var(--text-muted);">No records registered within active execution frames.</td></tr>`;
        return;
    }

    tbody.innerHTML = '';
    inventory.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><code>${item.id}</code></td>
            <td><strong>${item.name}</strong></td>
            <td>${item.category}</td>
            <td>${item.manufacturer}</td>
            <td>${item.quantity} units</td>
            <td>${item.expiryDate}</td>
        `;
        tbody.appendChild(row);
    });
}

/**
 * Transforms stored JSON dataset into standardized downloadable CSV flat data streams.
 */
window.exportInventoryManifestToCSV = function() {
    const rawData = localStorage.getItem('pharmacy_inventory');
    const inventory = rawData ? JSON.parse(rawData) : [];

    if(inventory.length === 0) {
        alert("Action Aborted: The active ledger data partition is empty.");
        return;
    }

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Asset ID,Medicine Name,Therapeutic Category,Manufacturer,Stock Quantity,Expiration Date,Barcode String,RFID Signature\n";

    inventory.forEach(item => {
        const lineContent = `"${item.id}","${item.name}","${item.category}","${item.manufacturer}",${item.quantity},"${item.expiryDate}","${item.barcode || ''}","${item.rfid || ''}"\n`;
        csvContent += lineContent;
    });

    const encodedUri = encodeURI(csvContent);
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", encodedUri);
    downloadAnchor.setAttribute("download", `Pharmacy_Inventory_Manifest_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
};

/**
 * Compiles stored hardware scanning log tables down to file records.
 */
window.exportHardwareLogsToCSV = function() {
    const rawScans = localStorage.getItem('scan_history');
    const logs = rawScans ? JSON.parse(rawScans) : [];

    if(logs.length === 0) {
        alert("Action Aborted: No tracking log sequences buffered during this runtime window.");
        return;
    }

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Timestamp Metric,Hardware Node Identifier,Lookup Key Sequence,Identified Descriptor Object,Validation Output Code\n";

    logs.forEach(log => {
        csvContent += `"${log.timestamp}","${log.hardwareId}","${log.lookupCode}","${log.resolvedName}","${log.status}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", encodedUri);
    downloadAnchor.setAttribute("download", `Hardware_Scan_Telemetry_Journal.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
};

/**
 * Intercepts default viewport focus states to isolate the table element for native system print drivers.
 */
window.executeSystemPrintSequence = function() {
    window.print();
};