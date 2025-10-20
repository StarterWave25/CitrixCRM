/* ------------------------------------------------------------------------- */
/* DYNAMIC EMPLOYEE FORM LOGIC - forms.js */
/* Handles form generation, dependencies, conditional fields, and SUBMISSION. */
/* ------------------------------------------------------------------------- */

const formSchemas = {
    // ⬇️ UPDATED TOUR PLAN SCHEMA ⬇️
    tourPlan: {
        formId: 'tour-plan-form',
        title: 'Tour Plan',
        fields: [
            { name: 'extensionName', type: 'select', label: 'Extension Name', required: true, options: [] },
            { name: 'outStation', type: 'checkbox', label: 'Out Station', required: false },
            { name: 'jointWork', type: 'text', label: 'Joint Work', required: false }
        ]
    },
    // ⬆️ END OF UPDATED TOUR PLAN SCHEMA ⬆️
    doctorsList: {
        formId: 'doctors-list-form',
        title: 'Doctors List',
        fields: [
            { name: 'doctorName', type: 'text', label: 'Doctor Name', required: true },
            { name: 'phone', type: 'tel', label: 'Phone Number', required: true },
            { name: 'orderStatus', type: 'checkbox', label: 'Order Placed', required: false },
            { name: 'feedback', type: 'textarea', label: 'Feedback', required: true }
        ]
    },
    expenses: {
        formId: 'expenses-form',
        title: 'Expenses',
        fields: [
            { name: 'headquarter', type: 'text', label: 'Headquarter', readOnly: true },
            { name: 'extension', type: 'text', label: 'Extension', readOnly: true },
            { name: 'outStation', type: 'checkbox', label: 'Out Station', required: false },
            { name: 'kilometers', type: 'number', label: 'Kilometers (Total Distance)', required: false, conditional: { field: 'outStation', value: false } },
            { name: 'normalExpense', type: 'number', label: 'Normal Expense (₹)', required: true, defaultValue: 200, isExpense: true },
            { name: 'extensionExpense', type: 'number', label: 'Extension Expense (₹)', required: true, isExpense: true },
            { name: 'totalExpense', type: 'number', label: 'Total Expense (₹)', readOnly: true },
            { name: 'travelBill', type: 'file', label: 'Travel Bill (Image)', required: true, accept: 'image/*' },
            { name: 'stayBill', type: 'file', label: 'Stay Bill (Image)', required: false, accept: 'image/*' }
        ]
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const formTitleElement = document.getElementById('form-title');
    const formArea = document.getElementById('dynamic-form-area');
    const submitBtn = formArea.querySelector('.form-submit-btn');
    const userDetails = JSON.parse(localStorage.getItem('userDetails') || '{}');

    // --- Global Helpers ---
    const hqName = userDetails.hqName;
    const empId = userDetails.id;
    const exName = localStorage.getItem('lastSubmittedExName');
    const exId = localStorage.getItem('lastSubmittedExId');

    // Assumed global notification function
    const showNotification = window.showNotification || ((msg, type) => console.log(`[Notification ${type}]: ${msg}`));

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

    // 2. Form Generation and Dependency Fetch
    const generateAndPopulateForm = async () => {
        if (formName === 'tourPlan') {
            await setupTourPlanForm();
        } else if (formName === 'expenses') {
            setupExpensesForm();
        } else {
            currentSchema.fields.forEach(field => {
                const fieldHTML = createFormField(field);
                formArea.insertBefore(fieldHTML, submitBtn.parentElement);
            });
            setupConditionalLogic(currentSchema.fields);
        }

        submitBtn.removeAttribute('disabled');
    };

    // -------------------------------------------------------------
    // --- EXPENSES FORM: Specific Setup and Logic ---
    // -------------------------------------------------------------
    const setupExpensesForm = () => {
        const fields = currentSchema.fields;

        // --- 1. Generate Fields ---
        fields.forEach(field => {
            let fieldHTML = createFormField(field);
            formArea.insertBefore(fieldHTML, submitBtn.parentElement);
        });

        // --- 2. Get DOM References ---
        // This will now correctly find the element because the ID is set in createFormField
        const outStationCb = document.getElementById('outStation');
        const kilometersGroup = formArea.querySelector('[data-field-name="kilometers"]');
        const kilometersInput = document.getElementById('kilometers');
        const normalExpenseInput = document.getElementById('normalExpense');
        const extensionExpenseInput = document.getElementById('extensionExpense');
        const totalExpenseInput = document.getElementById('totalExpense');

        // Initial Readonly Field Values
        document.getElementById('headquarter').value = hqName || 'N/A';
        document.getElementById('extension').value = exName || 'N/A (Submit Tour Plan first)';

        // Initial Expense Values
        normalExpenseInput.value = 200;
        extensionExpenseInput.value = 0;
        totalExpenseInput.value = 200;
        normalExpenseInput.readOnly = true;
        extensionExpenseInput.readOnly = true;

        // --- 3. Calculation & Condition Logic ---

        const calculateTotal = () => {
            const normal = parseFloat(normalExpenseInput.value) || 0;
            const extension = parseFloat(extensionExpenseInput.value) || 0;
            totalExpenseInput.value = (normal + extension).toFixed(0);
        };

        const updateKilometersExpense = () => {
            const km = parseFloat(kilometersInput.value) || 0;
            extensionExpenseInput.value = (km * 2).toFixed(0);
            calculateTotal();
        };

        const handleOutStationChange = () => {
            // Check will now pass as outStationCb is not null
            const isOutStation = outStationCb.checked;
            const isSameStation = hqName === exName;

            // Kilometers displays ONLY IF (NOT OutStation AND NOT SameStation)
            const showKilometers = !isOutStation && !isSameStation;

            kilometersGroup.classList.toggle('hidden', !showKilometers);
            kilometersInput.required = showKilometers;

            // B. Expense Read-only Toggle (Normal & Extension)
            normalExpenseInput.readOnly = !isOutStation;
            normalExpenseInput.value = isOutStation ? '' : 200;

            extensionExpenseInput.readOnly = !isOutStation;

            if (isOutStation) {
                // If Outstation is checked, allow manual input for extension
                extensionExpenseInput.value = '';
            } else if (showKilometers) {
                // If local travel (hq != ex), use kilometer calculation
                updateKilometersExpense();
            } else {
                // If local and (hq == ex), fixed extension expense to 0
                extensionExpenseInput.value = 0;
            }

            calculateTotal();
        };

        // --- 4. Event Listeners ---
        // The error occurred here, now fixed by setting the ID in createFormField
        outStationCb.addEventListener('change', handleOutStationChange);

        // Listeners for input changes
        kilometersInput.addEventListener('input', updateKilometersExpense);

        // Attach input listener for expenses only when NOT read-only (i.e., for outstation)
        normalExpenseInput.addEventListener('input', () => {
            if (!normalExpenseInput.readOnly) calculateTotal();
        });
        extensionExpenseInput.addEventListener('input', () => {
            if (!extensionExpenseInput.readOnly) calculateTotal();
        });


        // Initial state setup
        handleOutStationChange();
    };

    // -------------------------------------------------------------
    // --- UTILITY FUNCTIONS ---
    // -------------------------------------------------------------

    /**
     * Converts a File object to a Base64 string.
     */
    

    /**
     * Generates HTML for a form field.
     */
    const createFormField = (field) => {
        const group = document.createElement('div');
        group.classList.add('form-group');
        group.setAttribute('data-field-name', field.name);

        const requiredMark = field.required ? '<span class="required-mark">*</span>' : '';

        if (field.conditional) {
            group.classList.add('conditional-field', 'hidden');
            group.setAttribute('data-condition-field', field.conditional.field);
            group.setAttribute('data-condition-value', field.conditional.value);
        }

        const label = document.createElement('label');
        label.setAttribute('for', field.name);
        label.innerHTML = field.label + requiredMark;

        let input;

        if (field.type === 'textarea') {
            input = document.createElement('textarea');
        } else if (field.type === 'select') {
            input = document.createElement('select');
        } else if (field.type === 'checkbox') {
            group.classList.add('form-group--checkbox');
            input = document.createElement('input');
            input.setAttribute('type', 'checkbox');
            // ✅ FIX: Set the ID attribute for checkboxes
            input.setAttribute('id', field.name);
            group.appendChild(input);
            group.appendChild(label);
            return group;
        } else {
            input = document.createElement('input');
            input.setAttribute('type', field.type);
        }

        input.setAttribute('id', field.name);
        input.setAttribute('name', field.name);
        if (field.required) input.setAttribute('required', 'true');
        if (field.readOnly) input.setAttribute('readonly', 'true');
        if (field.accept) input.setAttribute('accept', field.accept);

        if (field.type === 'select') {
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = `-- Select ${field.label} --`;
            defaultOption.setAttribute('disabled', 'true');
            defaultOption.setAttribute('selected', 'true');
            input.appendChild(defaultOption);

            (field.options || []).forEach(option => {
                const opt = document.createElement('option');
                opt.value = option.value;
                opt.textContent = option.label;
                if (option.dataExId) {
                    opt.setAttribute('data-ex-id', option.dataExId);
                }
                if (option.disabled) {
                    opt.setAttribute('disabled', 'true');
                }
                input.appendChild(opt);
            });
        }

        group.appendChild(label);
        group.appendChild(input);

        return group;
    };

    const setupConditionalLogic = (fields) => {
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

    // -------------------------------------------------------------
    // --- TOUR PLAN SPECIFIC SETUP ---
    // -------------------------------------------------------------

    const setupTourPlanForm = async () => {
        let extensionOptions = [];
        const hqId = userDetails.hqId;

        if (hqId) {
            try {
                const response = await apiFetch('employee/fetch-form-dependencies', 'POST', { formName: 'tourPlan', hqId: hqId });

                // Retain user's logic for fetching extensions
                if (response.data && Array.isArray(response.data.extensions)) {
                    extensionOptions = response.data.extensions.map(item => ({
                        value: item.extensionName,
                        label: item.extensionName,
                        dataExId: item.exId
                    }));
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
    };

    // -------------------------------------------------------------
    // --- FORM SUBMISSION HANDLERS ---
    // -------------------------------------------------------------

    formArea.addEventListener('submit', async (e) => {
        e.preventDefault();

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting...';

        try {
            if (formName === 'expenses') {
                await submitExpensesForm();
            } else if (formName === 'tourPlan') {
                await submitTourPlanForm();
            }

        } catch (error) {
            console.error('Submission API Error:', error);
            showNotification('An unexpected network error occurred.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fa-solid fa-save"></i> Submit';
        }
    });

    const submitTourPlanForm = async () => {
        const formData = new FormData(formArea);
        const data = Object.fromEntries(formData);

        const selectedOption = formArea.querySelector('select[name="extensionName"] option:checked');
        const selectedExId = selectedOption ? selectedOption.getAttribute('data-ex-id') : null;

        // Uses the corrected form data check for the checkbox state
        const isOutStation = data.outStation ? true : false;

        const submissionData = {
            empId: parseInt(empId),
            hqId: parseInt(userDetails.hqId),
            exId: parseInt(selectedExId),
            extensionName: data.extensionName,
            outStation: isOutStation ? 'Yes' : 'No',
            jointWork: data.jointWork || '',
            // 'date' field is correctly removed as per the updated schema
        };

        const apiBody = { form: 'tourPlan', data: submissionData };
        const response = await apiFetch('employee/forms-submit', 'POST', apiBody);

        if (response.success) {
            localStorage.setItem('lastSubmittedExId', submissionData.exId);
            localStorage.setItem('lastSubmittedExName', submissionData.extensionName);

            showNotification(`Tour Plan submitted successfully for ${submissionData.extensionName}.`, 'success');
            formArea.reset();

        } else {
            const errorMessage = response.message || 'Tour Plan submission failed due to a server error.';
            showNotification(errorMessage, 'error');
        }
    };

    const submitExpensesForm = async () => {

        const fileToBase64 = (file) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file); // This is the key: readAsDataURL
                reader.onload = () => resolve(reader.result); // This will include the data:image/... prefix
                reader.onerror = (error) => reject(error);
            });
        };



        const travelBillFile = document.getElementById('travelBill').files[0];
        const stayBillFile = document.getElementById('stayBill').files[0];

        if (!travelBillFile) {
            showNotification('Travel Bill is required.', 'error');
            return;
        }

        // 1. Upload Travel Bill
        showNotification('Uploading Travel Bill...', 'info');
        const travelBase64 = await fileToBase64(travelBillFile);
        const travelUploadResponse = await apiFetch('employee/upload-image', 'POST', { image: travelBase64 });

        if (!travelUploadResponse.url) {
            showNotification('Travel Bill upload failed.', 'error');
            return;
        }
        const travelBillLink = travelUploadResponse.url;

        // 2. Upload Stay Bill (Optional)
        let stayBillLink = '';
        if (stayBillFile) {
            showNotification('Uploading Stay Bill...', 'info');
            const stayBase64 = await fileToBase64(stayBillFile);
            const stayUploadResponse = await apiFetch('employee/upload-image', 'POST', { image: stayBase64 });

            if (!stayUploadResponse.url) {
                showNotification('Stay Bill upload failed. Submitting without stay bill.', 'warning');
            } else {
                stayBillLink = stayUploadResponse.url;
            }
        }

        // 3. Prepare Final Expense Data
        const normalExpense = document.getElementById('normalExpense').value;
        const extensionExpense = document.getElementById('extensionExpense').value;
        const totalExpense = document.getElementById('totalExpense').value;

        const submissionData = {
            empId: parseInt(empId),
            exId: parseInt(exId || 0),
            normalExpense: parseInt(normalExpense || 0),
            extensionExpense: parseInt(extensionExpense || 0),
            totalExpense: parseInt(totalExpense || 0),
            paidStatus: 'Not Paid',
            travelBill: travelBillLink,
            stayBill: stayBillLink
        };

        // 4. Submit Expenses Data
        const apiBody = { form: 'expenses', data: submissionData };
        const finalResponse = await apiFetch('employee/forms-submit', 'POST', apiBody);

        if (finalResponse.success) {
            showNotification('Expenses submitted successfully and pending approval.', 'success');
            formArea.reset();
        } else {
            const errorMessage = finalResponse.message || 'Expenses submission failed due to a server error.';
            showNotification(errorMessage, 'error');
        }
    };


    // 4. Initialization
    generateAndPopulateForm();
});