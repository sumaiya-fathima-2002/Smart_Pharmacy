/**
 * Smart Pharmacy - Local AI Diagnostic Recommendation Search Engine Middleware
 */

document.addEventListener('DOMContentLoaded', () => {
    setupRecommendationInferencePipeline();
});

/**
 * Initializes and registers operational event control hooks onto form submit actions.
 */
function setupRecommendationInferencePipeline() {
    const form = document.getElementById('recommendation-inference-query-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        executeLocalInferenceMatchLoop();
    });
}

/**
 * Executes async pattern parsing over local medicines dataset.
 */
async function executeLocalInferenceMatchLoop() {
    const viewport = document.getElementById('recommendation-render-output-viewport');
    const diseaseInput = document.getElementById('query-input-disease').value.toLowerCase().trim();
    const symptomInput = document.getElementById('query-input-symptom').value.toLowerCase().trim();

    if(!diseaseInput && !symptomInput) {
        alert("System Input Required: Provide a disease model classification or symptomatic vector terms.");
        return;
    }

    viewport.innerHTML = `
        <div style="text-align:center; padding: 4rem;">
            <i class="fas fa-brain fa-spin fa-3x" style="color: var(--primary-light); margin-bottom:1rem;"></i>
            <p>Parsing local database tables for matches...</p>
        </div>
    `;

    try {
        // Fetch static production payload parameters
        const operationalDataResponse = await fetch('data/medicines.json');
        const clinicalProfilesMatrix = await operationalDataResponse.json();

        // Execution ranking scan loop filters
        const matchingProfiles = clinicalProfilesMatrix.filter(profile => {
            const matchesDiseaseName = diseaseInput && profile.disease.toLowerCase().includes(diseaseInput);
            const matchesSymptomEntries = symptomInput && profile.symptoms.some(s => s.toLowerCase().includes(symptomInput));
            return matchesDiseaseName || matchesSymptomEntries;
        });

        // Display structured profiles matching parameters
        if (matchingProfiles.length === 0) {
            viewport.innerHTML = `
                <div class="neutral-empty-slate" style="border-color: var(--danger);">
                    <i class="fas fa-heart-broken fa-4x" style="color: var(--danger);"></i>
                    <h4>No System Matches Extracted</h4>
                    <p>The query patterns provided did not clear baseline lookup parameters within the offline Kaggle data indices.</p>
                </div>
            `;
            return;
        }

        // Output first high-confidence match profile signature to display
        const primaryMatch = matchingProfiles[0];
        renderResolvedInferenceCard(primaryMatch, viewport);

    } catch (criticalFetchException) {
        console.error("Critical Matrix Failure: Data layer unreachable.", criticalFetchException);
        viewport.innerHTML = `<div class="neutral-empty-slate"><p style="color:var(--danger);">Error: Failed to process local data assets.</p></div>`;
    }
}

/**
 * Builds the responsive result presentation layout component structure.
 */
function renderResolvedInferenceCard(dataPayload, containerElement) {
    containerElement.innerHTML = `
        <div class="resolved-inference-card">
            <div class="result-hero-banner">
                <div>
                    <span>Primary Core Classification Target Match</span>
                    <h2>Therapeutic Choice: ${dataPayload.medicine}</h2>
                    <p style="font-size:0.9rem; opacity:0.9;"><i class="fas fa-virus-slash"></i> Condition Map: ${dataPayload.disease}</p>
                </div>
                <div class="confidence-score-badge">
                    <span>Inference Rank</span>
                    <strong>${dataPayload.confidenceScore}%</strong>
                </div>
            </div>
            
            <div class="result-details-grid">
                <div>
                    <div class="detail-section-block">
                        <h4>Programmatic Processing Matrix Rationale</h4>
                        <p>The system executed standard keyword lookups across database schemas and matched terms against recorded indicators with high algorithmic alignment.</p>
                    </div>
                    <div class="detail-section-block">
                        <h4>Functional Mechanism Description</h4>
                        <p>${dataPayload.description}</p>
                    </div>
                    <div class="detail-section-block">
                        <h4>Standard Clinical Dosage Protocol Matrix</h4>
                        <p><code>${dataPayload.dosage}</code></p>
                    </div>
                </div>
                
                <div>
                    <div class="detail-section-block">
                        <h4>Production Supplier</h4>
                        <p><strong>${dataPayload.manufacturer}</strong></p>
                    </div>
                    <div class="detail-section-block">
                        <h4>Alternative Formulations</h4>
                        <p>${dataPayload.alternatives.join(', ')}</p>
                    </div>
                    <div class="detail-section-block">
                        <h4>Critical Clinical Precautions</h4>
                        <div class="alert-precaution-box">
                            <i class="fas fa-exclamation-triangle"></i> ${dataPayload.precautions}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}