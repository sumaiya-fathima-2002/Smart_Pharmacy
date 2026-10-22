# Smart Pharmacy Inventory Management System Matrix

An enterprise-grade, offline-first digital supply network hub built entirely using modular Vanilla standards. This platform is custom-mapped to meet **UN Sustainable Development Goal 3 (Good Health and Well-being)** requirements, stabilizing clinical therapeutic pipelines through tracking safeguards.

## 🛠️ Complete Technical Infrastructure
* **Interface Foundations:** Semantic HTML5 Structure Framework Layouts
* **Layout Compositing Node:** CSS3 Architecture Grid Layouts leveraging Custom Global Structural Variables
* **Execution Logic Pipeline Engine:** Modular Vanilla ES6 JavaScript (Strict Zero Dependency Architecture Framework)
* **Graphical Metrics Engine:** Chart.js Module Integration Sourced via Content Delivery Network Pipelines
* **Icon Data Sets:** Font Awesome Web Micro-Assets Package Assemblies
* **Data Persistent Hydration Layer:** Client-Side Engine Cache Models (`LocalStorage` File Mapping Paradigms)

## 📂 Structural Manifest Verification Map
* `index.html` & `css/index.css`: App Overview Landing Platform Interface Views.
* `dashboard.html`, `css/dashboard.css`, & `js/dashboard.js`: Control Grid Analytics Management Desks.
* `inventory.html`, `css/inventory.css`, & `js/inventory.js`: Complete Data Record Lifecycle CRUD Ledger Matrices.
* `scanner.html`, `css/scanner.css`, & `js/scanner.js`: Emulated Digital Laser/RFID IO Telemetry Processing Hubs.
* `recommendation.html`, `css/recommendation.css`, & `js/recommendation.js`: Pattern Classification Dataset Inference Panels.
* `analytics.html`, `css/analytics.css`, & `js/analytics.js`: Multi-Axis Asset Breakdown Visualization Frameworks.
* `report.html`, `css/report.css`, & `js/report.js`: Compliance Data Manifest Compiation and Flat File Document Exporters.
* `css/style.css` & `js/common.js`: Globally Shared Navigation Structural Layouts, Telemetry Sync Managers, & Shared Clock Nodes.
* `data/`: Persistent Application Pre-Seeds (`inventory.json`, `medicines.json`, `medicines.csv`).

## 🚀 Execution Guide Instructions
1.  Verify the complete structural directory schema matches the layout model file configuration specified down this manifest file.
2.  Launch Visual Studio Code and point your active project directory workspace at the root folder level structure.
3.  Right-click on the landing environment page profile `index.html` file and trigger execution via **Live Server**.
4.  The platform runtime layer will detect blank local storages and automatically seed the database using elements extracted from `data/inventory.json`.

## 📈 CSV Dataset Compilation Framework Notes
The local pattern recommendation sub-system functions by reading mapped structured fields from `data/medicines.json` via native fetch APIs. If adjustments or expansions to data sets are required via the companion flat file spreadsheet layout sheet `data/medicines.csv`, execute conversions according to this structural mapping framework profile:

```javascript
// Reference Parsing Transformation Pipeline Logic
function convertMedicinesCSVToJSON(csvStringData) {
    const lines = csvStringData.split('\n');
    const resultMatrixOutput = [];
    const headers = lines[0].split(',');

    for(let rowIndex = 1; rowIndex < lines.length; rowIndex++) {
        if(!lines[rowIndex]) continue;
        const currentLineCells = lines[rowIndex].split(',');
        const constructionEntryObject = {};
        
        headers.forEach((headerKey, cellIndex) => {
            let processedCellValue = currentLineCells[cellIndex].replace(/"/g, '').trim();
            // Demultiplex array-bound criteria fields separated using semi-colons
            if(headerKey === 'symptoms' || headerKey === 'alternatives') {
                processedCellValue = processedCellValue.split(';');
            }
            if(headerKey === 'confidenceScore') {
                processedCellValue = parseInt(processedCellValue, 10);
            }
            constructionEntryObject[headerKey.trim()] = processedCellValue;
        });
        resultMatrixOutput.push(constructionEntryObject);
    }
    return JSON.stringify(resultMatrixOutput, null, 2);
}