/**
 * Smart Pharmacy - Inventory System Lifecycle CRUD Controller
 */

let activeEditTargetId = null;

document.addEventListener('DOMContentLoaded', () => {
    hydrateInventoryMatrixTable();
    setupInventoryLifecycleEvents();
});

/**
 * Attaches declarative event trigger handlers onto visual processing entry anchors.
 */
function setupInventoryLifecycleEvents() {
    // Search input filters
    document.getElementById('filter-search-field').addEventListener('input', hydrateInventoryMatrixTable);
    document.getElementById('filter-dropdown-category').addEventListener('change', hydrateInventoryMatrixTable);
    document.getElementById('filter-dropdown-sort').addEventListener('change', hydrateInventoryMatrixTable);

    // Modal view handlers
    const modal = document.getElementById('crud-modal-instance');
    const openBtn = document.getElementById('action-trigger-open-modal');
    const closeBtn = document.getElementById('action-trigger-close-modal');
    const cancelBtn = document.getElementById('action-trigger-cancel-modal');

    const displayModal = (show = true) => {
        if(show) {
            modal.classList.add('active-view');
        } else {
            modal.classList.remove('active-view');
            document.getElementById('inventory-crud-submission-form').reset();
            activeEditTargetId = null;
            document.getElementById('modal-headline-intent').innerText = "Register New Therapeutic Asset";
            document.getElementById('form-input-code').disabled = false;
        }
    };

    openBtn.addEventListener('click', () => displayModal(true));
    closeBtn.addEventListener('click', () => displayModal(false));
    cancelBtn.addEventListener('click', () => displayModal(false));

    // Form record capture submit workflow pipelines
    document.getElementById('inventory-crud-submission-form').addEventListener('submit', (e) => {
        e.preventDefault();
        commitFormInputToSystemCache();
        displayModal(false);
    });
}

/**
 * Pulls, transforms, sorts, slices, and injects storage records matching pipeline contexts.
 */
function hydrateInventoryMatrixTable() {
    const tbody = document.getElementById('inventory-matrix-tbody');
    if (!tbody) return;

    const rawData = localStorage.getItem('pharmacy_inventory');
    let inventory = rawData ? JSON.parse(rawData) : [];

    const searchQuery = document.getElementById('filter-search-field').value.toLowerCase().trim();
    const categoryQuery = document.getElementById('filter-dropdown-category').value;
    const sortStrategy = document.getElementById('filter-dropdown-sort').value;

    // Filter Logic Integration
    inventory = inventory.filter(item => {
        const matchText = item.name.toLowerCase().includes(searchQuery) || 
                          item.id.toLowerCase().includes(searchQuery) ||
                          item.manufacturer.toLowerCase().includes(searchQuery);
        const matchCategory = (categoryQuery === 'ALL') || (item.category === categoryQuery);
        return matchText && matchCategory;
    });

    // Sorting Logic Application Transformation Matrices
    if (sortStrategy === 'ID_ASC') {
        inventory.sort((a, b) => a.id.localeCompare(b.id));
    } else if (sortStrategy === 'QTY_DESC') {
        inventory.sort((a, b) => b.quantity - a.quantity);
    } else if (sortStrategy === 'EXP_ASC') {
        inventory.sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));
    }

    tbody.innerHTML = '';

    if(inventory.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding: 2rem; color: var(--text-muted);">No records cleared processing checks based on criteria.</td></tr>`;
        return;
    }

    // Dynamic State Refresh Execution loop
    const today = new Date();
    inventory.forEach(item => {
        const itemExpiry = new Date(item.expiryDate);
        let badgeClass = 'badge-success';
        let stateLabel = 'In Stock';

        if (itemExpiry <= today) {
            badgeClass = 'badge-danger';
            stateLabel = 'Expired';
        } else if (item.quantity <= 20) {
            badgeClass = 'badge-warning';
            stateLabel = 'Low Stock';
        }

        const row = document.createElement('tr');
        row.innerHTML = `
            <td><code>${item.id}</code></td>
            <td><strong>${item.name}</strong></td>
            <td>${item.category}</td>
            <td>${item.manufacturer}</td>
            <td><strong>${item.quantity} units</strong></td>
            <td>${item.expiryDate}</td>
            <td><span class="badge ${badgeClass}">${stateLabel}</span></td>
            <td style="text-align: center;">
                <button class="btn btn-primary" style="padding: 0.35rem 0.75rem; font-size:0.8rem;" onclick="initializeEditOperation('${item.id}')"><i class="fas fa-edit"></i></button>
                <button class="btn btn-danger" style="padding: 0.35rem 0.75rem; font-size:0.8rem;" onclick="purgeAssetRecord('${item.id}')"><i class="fas fa-trash-alt"></i></button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

/**
 * Commits the tracking fields downstream.
 */
function commitFormInputToSystemCache() {
    const rawData = localStorage.getItem('pharmacy_inventory');
    let inventory = rawData ? JSON.parse(rawData) : [];

    const assetId = document.getElementById('form-input-code').value.trim().toUpperCase();
    const assetName = document.getElementById('form-input-name').value.trim();
    const assetCategory = document.getElementById('form-input-category').value.trim();
    const assetManufacturer = document.getElementById('form-input-manufacturer').value.trim();
    const assetQty = parseInt(document.getElementById('form-input-qty').value, 10);
    const assetExpiry = document.getElementById('form-input-expiry').value;
    const barcodeStr = document.getElementById('form-input-barcode').value.trim();
    const rfidSig = document.getElementById('form-input-rfid').value.trim();

    if (activeEditTargetId) {
        // Update operational target matching ID
        inventory = inventory.map(item => {
            if (item.id === activeEditTargetId) {
                return { ...item, name: assetName, category: assetCategory, manufacturer: assetManufacturer, quantity: assetQty, expiryDate: assetExpiry, barcode: barcodeStr, rfid: rfidSig };
            }
            return item;
        });
    } else {
        // Enforce deduplication checks on direct new mutations
        if(inventory.some(m => m.id === assetId)) {
            alert(`Collision detected: Asset identity handle [${assetId}] exists within this context node.`);
            return;
        }
        inventory.push({ id: assetId, name: assetName, category: assetCategory, manufacturer: assetManufacturer, quantity: assetQty, expiryDate: assetExpiry, barcode: barcodeStr, rfid: rfidSig, status: "In Stock" });
    }

    localStorage.setItem('pharmacy_inventory', JSON.stringify(inventory));
    hydrateInventoryMatrixTable();
}

/**
 * Binds active record profiles inside structural editing dialog contexts.
 */
window.initializeEditOperation = function(id) {
    const rawData = localStorage.getItem('pharmacy_inventory');
    const inventory = rawData ? JSON.parse(rawData) : [];
    const target = inventory.find(m => m.id === id);

    if (!target) return;

    activeEditTargetId = id;
    document.getElementById('modal-headline-intent').innerText = `Modify Infrastructure Profile: ${id}`;
    
    document.getElementById('form-input-code').value = target.id;
    document.getElementById('form-input-code').disabled = true;
    
    document.getElementById('form-input-name').value = target.name;
    document.getElementById('form-input-category').value = target.category;
    document.getElementById('form-input-manufacturer').value = target.manufacturer;
    document.getElementById('form-input-qty').value = target.quantity;
    document.getElementById('form-input-expiry').value = target.expiryDate;
    document.getElementById('form-input-barcode').value = target.barcode || "";
    document.getElementById('form-input-rfid').value = target.rfid || "";

    document.getElementById('crud-modal-instance').classList.add('active-view');
};

/**
 * Removes data tracking instances directly across LocalStorage references.
 */
window.purgeAssetRecord = function(id) {
    if(!confirm(`Confirm terminal removal action against structural asset registry key: ${id}?`)) return;

    const rawData = localStorage.getItem('pharmacy_inventory');
    let inventory = rawData ? JSON.parse(rawData) : [];

    inventory = inventory.filter(m => m.id !== id);
    localStorage.setItem('pharmacy_inventory', JSON.stringify(inventory));
    hydrateInventoryMatrixTable();
};