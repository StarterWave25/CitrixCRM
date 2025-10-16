// scripts/employee/form-renderer.js
import apiFetch from "../api-fetch.js"; // Import central fetch utility 

// --- JSON Schemas Collection ---
// Future forms will be added here
const FORM_SCHEMAS = {
    tourPlan: {
        "type": "object",
        "properties": {
            "empId": { "type": "integer" },
            "hqId": { "type": "integer" },
            "exId": { "type": "integer" },
            "extensionName": { "type": "string", "maxLength": 100 },
            "outStation": { "type": "string" }, // 'Yes' or 'No'
            "jointWork": { "type": "string", "maxLength": 100 }
        },
        "required": ["empId", "hqId", "exId", "extensionName", "outStation", "jointWork"],
        "fieldOrder": ["extensionName", "outStation", "jointWork"], // UI order
        "labels": {
            "extensionName": "Select Extension Name",
            "outStation": "Out Station",
            "jointWork": "Joint Work Details"
        }
    }
    // Add future schemas here: doctorActivity: {...}, expenses: {...}
};

/**
 * Manages dynamic form rendering, client-side validation, and submission.
 */
export class DynamicFormRenderer {
    constructor(containerId, formName, dependencies = {}) {
        this.container = document.getElementById(containerId);
        this.formName = formName;
        this.schema = FORM_SCHEMAS[formName];
        this.dependencies = dependencies;
        this.userDetails = JSON.parse(localStorage.getItem('userDetails'));

        if (!this.schema) {
            this.container.innerHTML = `<p class="error-text">Error: Form schema for '${formName}' not found.</p>`;
            return;
        }
        if (!this.userDetails) {
            this.container.innerHTML = `<p class="error-text">Error: User details not found in localStorage. Cannot autofill IDs.</p>`;
            return;
        }

        this.renderForm();
    }

    /**
     * Client-side validation based on the JSON schema.
     * @param {object} formData - The data object to validate.
     * @returns {object} - { isValid: boolean, errors: object }
     */
    validate(formData) {
        const errors = {};
        let isValid = true;

        for (const key of this.schema.required) {
            // Check required fields
            if (!formData[key]) {
                // Ignore autofilled IDs if they are present in userDetails
                if (key !== 'empId' && key !== 'hqId') {
                    errors[key] = `${this.schema.labels[key] || key} is required.`;
                    isValid = false;
                }
            }
        }

        // Custom check for exId from the dropdown
        if (this.formName === 'tourPlan' && (!formData.exId || !formData.extensionName)) {
            errors['extensionName'] = 'Please select an Extension Name.';
            isValid = false;
        }

        // Check maxLength for string fields
        for (const [key, prop] of Object.entries(this.schema.properties)) {
            if (prop.maxLength && formData[key] && formData[key].length > prop.maxLength) {
                errors[key] = `${this.schema.labels[key] || key} cannot exceed ${prop.maxLength} characters.`;
                isValid = false;
            }
        }

        // In a real application, you'd use a robust JSON schema validator library (e.g., Ajv)

        this.displayErrors(errors);
        return { isValid, errors };
    }

    /**
     * Renders the complete HTML form based on the schema and dependencies.
     */
    renderForm() {
        const form = document.createElement('form');
        form.className = 'dynamic-form';
        form.addEventListener('submit', this.handleSubmit.bind(this));

        // Use fieldOrder for structured rendering
        this.schema.fieldOrder.forEach(key => {
            const prop = this.schema.properties[key];
            const labelText = this.schema.labels[key] || key;
            const isRequired = this.schema.required.includes(key);

            let inputElement;
            const wrapper = document.createElement('div');
            wrapper.className = 'form-group';

            const label = document.createElement('label');
            label.htmlFor = key;
            label.textContent = `${labelText}${isRequired ? ' *' : ''}:`;

            wrapper.appendChild(label);

            if (key === 'extensionName' && this.dependencies.extensions) {
                // --- Dropdown for Tour Plan ---
                inputElement = document.createElement('select');
                inputElement.id = key;
                inputElement.name = key;
                inputElement.className = 'form-container__input';

                const defaultOption = document.createElement('option');
                defaultOption.value = '';
                defaultOption.textContent = '--- Select an Extension ---';
                defaultOption.disabled = true;
                defaultOption.selected = true;
                inputElement.appendChild(defaultOption);

                this.dependencies.extensions.forEach(ext => {
                    const option = document.createElement('option');
                    option.value = ext.extensionName; // Displayed name
                    option.textContent = ext.extensionName;
                    option.setAttribute('data-exid', ext.exId); // Store exId in data attribute
                    inputElement.appendChild(option);
                });

                // Add event listener to save exId to localStorage on change
                inputElement.addEventListener('change', (e) => {
                    const selectedOption = e.target.options[e.target.selectedIndex];
                    const exId = selectedOption.getAttribute('data-exid');
                    const extensionName = selectedOption.value;
                    if (exId) {
                        // Save exId to localStorage as required
                        localStorage.setItem('exId', exId);
                        // Save the full extension name for the submission payload
                        localStorage.setItem('extensionName', extensionName);
                        console.log(`[LOCAL STORAGE] exId saved: ${exId}`);
                    }
                });

            } else if (prop.type === 'string' && key === 'outStation') {
                // --- Checkbox for Out Station ---
                wrapper.removeChild(label); // Remove default label for checkbox styling
                wrapper.className = 'form-group form-group--checkbox';

                inputElement = document.createElement('input');
                inputElement.type = 'checkbox';
                inputElement.id = key;
                inputElement.name = key;
                inputElement.className = 'form-container__input-checkbox';

                const checkboxLabel = document.createElement('label');
                checkboxLabel.htmlFor = key;
                checkboxLabel.textContent = labelText;

                wrapper.appendChild(inputElement);
                wrapper.appendChild(checkboxLabel);

            } else {
                // --- Standard Text Input for Joint Work ---
                inputElement = document.createElement('input');
                inputElement.type = 'text';
                inputElement.id = key;
                inputElement.name = key;
                inputElement.className = 'form-container__input';

                if (prop.maxLength) {
                    inputElement.maxLength = prop.maxLength;
                }
            }

            if (inputElement) {
                inputElement.required = isRequired;
                if (key !== 'outStation') wrapper.appendChild(inputElement);
                const errorSpan = document.createElement('span');
                errorSpan.className = 'error-message';
                errorSpan.id = `${key}-error`;
                wrapper.appendChild(errorSpan);
                form.appendChild(wrapper);
            }
        });

        // Submit button
        const submitButton = document.createElement('button');
        submitButton.type = 'submit';
        submitButton.className = 'cta-button cta-button--primary';
        submitButton.textContent = 'Submit Tour Plan';
        form.appendChild(submitButton);

        this.container.innerHTML = ''; // Clear 'loading' message
        this.container.appendChild(form);
    }

    /**
     * Handles form submission, validation, and API POST.
     */
    async handleSubmit(event) {
        event.preventDefault(); // Prevent default form submission [cite: 300]
        const form = event.target;
        const submitButton = form.querySelector('button[type="submit"]');

        // 1. Extract form data
        const formData = {};

        // Include autofilled IDs from localStorage
        formData.empId = this.userDetails.empId;
        formData.hqId = this.userDetails.hqId;

        // Include exId and extensionName from localStorage/selection
        formData.exId = parseInt(localStorage.getItem('exId'));
        formData.extensionName = localStorage.getItem('extensionName');

        // Extract user input fields
        this.schema.fieldOrder.forEach(key => {
            const input = form.elements[key];
            if (input) {
                if (input.type === 'checkbox') {
                    // Checkbox value: 'Yes' if checked, 'No' otherwise
                    formData[key] = input.checked ? 'Yes' : 'No';
                } else if (key !== 'extensionName') {
                    formData[key] = input.value;
                }
            }
        });

        console.log("Submission Payload Draft:", formData);

        // 2. Perform client-side validation
        const { isValid } = this.validate(formData);

        if (!isValid) {
            // Show error notification [cite: 303]
            this.showNotification('Error: Please correct the marked fields.', 'error');
            return;
        }

        // 3. Prepare final API payload
        const finalPayload = {
            form: this.formName,
            data: formData // Matches the required submission format
        };

        // 4. API Call
        try {
            submitButton.disabled = true; // Disable button while loading [cite: 339]
            submitButton.textContent = 'Submitting...';

            const response = await apiFetch('employee/forms-submit', 'POST', finalPayload); // Single submission endpoint

            // 5. Handle response [cite: 302]
            if (response.success) {
                this.showNotification(response.message, 'success');
                // 6. Reset form or redirect (optional: form.reset())
                form.reset();
                localStorage.removeItem('exId');
                localStorage.removeItem('extensionName');
            } else {
                // Backend error response [cite: 302]
                this.showNotification(response.message || 'Submission failed. Please try again.', 'error');
            }

        } catch (error) {
            // Network/Fetch failed [cite: 302]
            this.showNotification('A network error occurred. Check console.', 'error');
            console.error('Submission failed:', error);
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Submit Tour Plan';
        }
    }

    /**
     * Displays validation errors below fields.
     */
    displayErrors(errors) {
        document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
        document.querySelectorAll('.form-group .form-container__input, .form-group .form-container__input-checkbox, .form-group select').forEach(el => {
            el.style.borderColor = 'var(--border-color)'; // Reset to default [cite: 230]
        });

        for (const [key, message] of Object.entries(errors)) {
            const errorElement = document.getElementById(`${key}-error`);
            const inputElement = document.getElementById(key);

            if (errorElement) {
                errorElement.textContent = message;
            }
            if (inputElement) {
                // Apply error styling [cite: 301]
                inputElement.style.borderColor = 'var(--error-red)';
            }
        }
    }

    /**
     * Shows a top-right notification toast[cite: 303]. (Simplified for brevity)
     */
    showNotification(message, type) {
        // In a real implementation, this would use a robust toast system.
        const notificationContainer = document.querySelector('.notification-container') || (() => {
            const div = document.createElement('div');
            div.className = 'notification-container'; // Positioned top-right in global.css
            document.body.appendChild(div);
            return div;
        })();

        const toast = document.createElement('div');
        toast.className = `toast toast--${type}`;
        toast.textContent = message;

        notificationContainer.appendChild(toast);

        // Auto-dismiss [cite: 303]
        setTimeout(() => {
            toast.remove();
        }, 4000);
    }
}