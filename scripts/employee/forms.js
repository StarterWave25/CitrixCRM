/* ------------------------------------------------------------------------- */
/* DYNAMIC EMPLOYEE FORM LOGIC - forms.js */
/* Handles form generation, dependencies, conditional fields, and SUBMISSION. */
/* ------------------------------------------------------------------------- */

// NOTE: The formSchemas object is kept here for reference and field generation
const formSchemas = {
    tourplan: {
        formId: 'tour-plan-form',
        title: 'Tour Plan',
        fields: [
            // This will be a dropdown populated by the API call
            { name: 'extensionName', type: 'select', label: 'Extension Name', required: true, options: [] },
            { name: 'outStation', type: 'checkbox', label: 'Out Station', required: false },
            { name: 'jointWork', type: 'text', label: 'Joint Work', required: false}
        ]
    },
    doctorsList: { /* ... (remaining schemas) ... */
        formId: 'doctors-list-form',
        title: 'Doctors List',
        fields: [
            { name: 'doctorName', type: 'text', label: 'Doctor Name', required: true },
            { name: 'phone', type: 'tel', label: 'Phone Number', required: true },
            { name: 'orderStatus', type: 'checkbox', label: 'Order Placed', required: false },
            {
                name: 'products',
                type: 'section',
                label: 'Products Ordered',
                conditional: { field: 'orderStatus', value: true },
                subFields: [
                    { name: 'productName', type: 'text', label: 'Product Name', required: true },
                    { name: 'strips', type: 'number', label: 'Strips', required: true }
                ]
            },
            { name: 'feedback', type: 'textarea', label: 'Feedback', required: true }
        ]
    },
    expenses: {
        formId: 'expenses-form',
        title: 'Expenses',
        fields: [
            { name: 'normalExpense', type: 'number', label: 'Normal Expense', required: false },
            { name: 'extensionExpense', type: 'number', label: 'Extension Expense', required: false },
            { name: 'outstationExpense', type: 'number', label: 'Outstation Expense', required: false }
        ]
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const formTitleElement = document.getElementById('form-title');
    const formArea = document.getElementById('dynamic-form-area');
    const submitBtn = formArea.querySelector('.form-submit-btn');
    const userDetails = JSON.parse(localStorage.getItem('userDetails') || '{}');

    // 1. Determine which form to load
    const urlParams = new URLSearchParams(window.location.search);
    const formName = urlParams.get('name');

    if (!formName || !formSchemas[formName]) {
        formTitleElement.textContent = 'Error: Form Not Found';
        return;
    }

    const currentSchema = formSchemas[formName];
    formTitleElement.textContent = currentSchema.title;
    formArea.setAttribute('id', currentSchema.formId);

    // Placeholder for global notification function (defined in global.js or similar)
    // We assume a global function showNotification(message, type) exists.
    const showNotification = window.showNotification || ((msg, type) => console.log(`[Notification ${type}]: ${msg}`));


    // 2. Form Generation and Dependency Fetch (unchanged)
    const generateAndPopulateForm = async () => {
        let extensionOptions = [];
        const hqId = userDetails.hqId;

        // Only fetch dependencies for the 'tourPlan' form
        if (formName === 'tourplan' && hqId) {
            try {
                const apiPath = 'employee/fetch-form-dependencies';
                const body = { formName: formName, hqId: hqId };

                const response = await apiFetch(apiPath, 'POST', body);
                console.log(response)
                if (response.data && Array.isArray(response.data.extensions)) {
                    extensionOptions = response.data.extensions.map(item => ({
                        value: item.extensionName,
                        label: item.extensionName,
                        dataExId: item.exId
                    }));
                } else {
                    console.warn('API returned no extension data.');
                }
            } catch (error) {
                console.error('Failed to fetch form dependencies:', error);
                extensionOptions.push({ value: '', label: 'Error fetching extensions', disabled: true });
            }
        }

        const extensionField = currentSchema.fields.find(f => f.name === 'extensionName');
        if (extensionField) {
            extensionField.options = extensionOptions;
        }

        currentSchema.fields.forEach(field => {
            const fieldHTML = createFormField(field);
            formArea.insertBefore(fieldHTML, submitBtn.parentElement);
        });

        setupConditionalLogic(currentSchema.fields);
        submitBtn.removeAttribute('disabled');
    };

    // --- Helper Functions (createFormField and setupConditionalLogic remain the same) ---
    const createFormField = (field) => {
        // ... (implementation of createFormField as previously defined) ...
        const group = document.createElement('div');
        group.classList.add('form-group');
        group.setAttribute('data-field-name', field.name);

        const requiredMark = field.required ? '<span class="required-mark">*</span>' : '';

        if (field.conditional) {
            group.classList.add('conditional-field', 'hidden');
            group.setAttribute('data-condition-field', field.conditional.field);
            group.setAttribute('data-condition-value', field.conditional.value);
        }

        if (field.type === 'checkbox') {
            group.classList.add('form-group--checkbox');

            const checkbox = document.createElement('input');
            checkbox.setAttribute('type', 'checkbox');
            checkbox.setAttribute('id', field.name);
            checkbox.setAttribute('name', field.name);

            const label = document.createElement('label');
            label.setAttribute('for', field.name);
            label.textContent = field.label;

            group.appendChild(checkbox);
            group.appendChild(label);

        } else if (field.type === 'select') {
            const label = document.createElement('label');
            label.setAttribute('for', field.name);
            label.innerHTML = field.label + requiredMark;
            group.appendChild(label);

            const select = document.createElement('select');
            select.setAttribute('id', field.name);
            select.setAttribute('name', field.name);
            if (field.required) select.setAttribute('required', 'true');

            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = `-- Select ${field.label} --`;
            defaultOption.setAttribute('disabled', 'true');
            defaultOption.setAttribute('selected', 'true');
            select.appendChild(defaultOption);

            field.options.forEach(option => {
                const opt = document.createElement('option');
                opt.value = option.value;
                opt.textContent = option.label;
                if (option.dataExId) {
                    opt.setAttribute('data-ex-id', option.dataExId);
                }
                if (option.disabled) {
                    opt.setAttribute('disabled', 'true');
                }
                select.appendChild(opt);
            });
            group.appendChild(select);

        } else {
            const label = document.createElement('label');
            label.setAttribute('for', field.name);
            label.innerHTML = field.label + requiredMark;
            group.appendChild(label);

            const input = document.createElement('input');
            input.setAttribute('type', field.type);
            input.setAttribute('id', field.name);
            input.setAttribute('name', field.name);
            if (field.required) input.setAttribute('required', 'true');

            group.appendChild(input);
        }

        return group;
    };

    const setupConditionalLogic = (fields) => {
        // ... (implementation of setupConditionalLogic as previously defined) ...
        const conditionalFields = document.querySelectorAll('.conditional-field');

        const conditionsMap = {};
        conditionalFields.forEach(cf => {
            const conditionField = cf.getAttribute('data-condition-field');
            if (!conditionsMap[conditionField]) {
                conditionsMap[conditionField] = [];
            }
            conditionsMap[conditionField].push(cf);
        });

        Object.keys(conditionsMap).forEach(controlName => {
            const controlInput = document.getElementById(controlName);
            if (controlInput) {
                controlInput.addEventListener('change', () => {
                    conditionsMap[controlName].forEach(targetField => {
                        const conditionValue = targetField.getAttribute('data-condition-value');
                        let isVisible = false;

                        if (controlInput.type === 'checkbox') {
                            isVisible = controlInput.checked.toString() === conditionValue;
                        } else {
                            isVisible = controlInput.value === conditionValue;
                        }

                        if (isVisible) {
                            targetField.classList.remove('hidden');
                        } else {
                            targetField.classList.add('hidden');
                        }
                    });
                });

                controlInput.dispatchEvent(new Event('change'));
            }
        });
    };

    // 3. Form Submission Handler (TOUR PLAN IMPLEMENTATION)
    formArea.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (formName !== 'tourplan') {
            // Safety guard for other forms
            console.warn(`Submission logic not yet implemented for ${formName}.`);
            return;
        }

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting...';

        try {
            // 1. Gather raw data
            const formData = new FormData(formArea);
            const data = Object.fromEntries(formData);

            // 2. Extract specific required fields and format data
            const selectedOption = formArea.querySelector('select[name="extensionName"] option:checked');
            const exId = selectedOption ? selectedOption.getAttribute('data-ex-id') : null;

            const outStationChecked = document.getElementById('outStation').checked;

            const submissionData = {
                empId: parseInt(userDetails.id),
                hqId: parseInt(userDetails.hqId),
                exId: parseInt(exId), // Get exId from the selected option's data attribute
                extensionName: data.extensionName,
                outStation: outStationChecked ? 'Yes' : 'No', // Convert boolean to 'Yes'/'No' string
                jointWork: data.jointWork || '', // Only include if present, otherwise send empty string
                date: data.date,
            };

            // 3. API Call
            const apiPath = 'employee/forms-submit';
            const apiBody = {
                form: formName, // 'tourPlan'
                data: submissionData
            };

            const response = await apiFetch(apiPath, 'POST', apiBody);

            // 4. Handle Response
            if (response.success) {
                // Success: Store exId in localStorage and show notification
                localStorage.setItem('exId', submissionData.exId);
                localStorage.setItem('exName', submissionData.extensionName);

                showNotification(`Tour Plan submitted successfully for ${submissionData.extensionName}.`, 'success');
                formArea.reset(); // Clear the form on success

            } else {
                // Failure: Show error notification
                const errorMessage = response.message || 'Form submission failed due to a server error.';
                showNotification(errorMessage, 'error');
            }

        } catch (error) {
            console.error('Submission API Error:', error);
            showNotification('Network error or invalid response. Please try again.', 'error');
        } finally {
            // Re-enable button and reset text
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fa-solid fa-save"></i> Submit';
        }
    });

    // 4. Initialization
    generateAndPopulateForm();
});