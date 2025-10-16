// scripts/employee/tour-plan.js
import { DynamicFormRenderer } from "./form-renderer.js";
import apiFetch from "../api-fetch.js";

async function initializeTourPlanForm() {
    const container = document.getElementById('dynamic-form-container');
    const formName = 'tourPlan';
    const userDetails = JSON.parse(localStorage.getItem('userDetails'));

    if (!userDetails || !userDetails.hqId) {
        container.innerHTML = `<p class="error-text">Cannot load form: Missing user details or hqId.</p>`;
        return;
    }

    try {
        // 1. Fetch dependencies required before rendering the form
        container.innerHTML = '<p>Fetching extension data...</p>';

        // Route to fetch extension data using hqId from localStorage [prompt requirement]
        const dependencyResponse = await apiFetch('employee/fetch-form-dependencies', 'POST', {
            formName: formName,
            hqId: userDetails.hqId
        });

        if (dependencyResponse.success && dependencyResponse.data.extensions) {
            // 2. Render the form dynamically after fetching data
            new DynamicFormRenderer('dynamic-form-container', formName, {
                extensions: dependencyResponse.data.extensions
            });
        } else {
            container.innerHTML = `<p class="error-text">Failed to load form dependencies: ${dependencyResponse.message || 'Unknown error'}</p>`;
        }

    } catch (error) {
        console.error("Dependency fetch error:", error);
        container.innerHTML = `<p class="error-red">System error loading form. Please refresh.</p>`;
    }
}

// Initialize the form when the script runs
initializeTourPlanForm();