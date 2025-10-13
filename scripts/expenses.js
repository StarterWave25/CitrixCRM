document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('expensesForm');
    const expenseTypeRadios = document.querySelectorAll('input[name="expenseType"]');
    const hqFields = document.getElementById('hqFields');
    const extensionFields = document.getElementById('extensionFields');

    // HQ fields
    const hqNameHQ = document.getElementById('hqNameHQ');
    const hqExpenses = document.getElementById('hqExpenses');
    const hqTotal = document.getElementById('hqTotal');

    // Extension fields
    const hqNameExt = document.getElementById('hqNameExt');
    const extensionName = document.getElementById('extensionName');
    const extExpenses = document.getElementById('extExpenses');
    const kilometers = document.getElementById('kilometers');
    const extTotal = document.getElementById('extTotal');

    // Sample data for static fields (to be updated dynamically)
    const msrNameSpan = document.getElementById('msrName');
    msrNameSpan.textContent = username;
    document.getElementById('month').textContent = new Date().toLocaleString('default', { month: 'long' });

    // Submit button and loader elements
    const submitBtn = document.getElementById('submitBtn');
    const btnText = document.querySelector('.btn-text');
    const loader = document.querySelector('.loader');

    // Get modal elements
    const modal = document.getElementById('successModal');
    const modalMessage = document.getElementById('modalMessage');
    const closeModalBtn = document.querySelector('.close-modal-btn');

    // Function to calculate totals
    const calculateTotals = () => {
        // HQ total
        hqTotal.value = hqExpenses.value;

        // Extension total
        const kmValue = parseFloat(kilometers.value) || 0;
        extTotal.value = parseFloat(extExpenses.value) + (kmValue * 2);
    };

    // Listen for changes on HQ fields
    hqExpenses.addEventListener('input', calculateTotals);

    // Listen for changes on Extension fields
    kilometers.addEventListener('input', calculateTotals);
    extExpenses.addEventListener('input', calculateTotals);

    // Initial calculation on page load
    calculateTotals();

    // Toggle form fields based on radio button selection
    expenseTypeRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'hq') {
                hqFields.classList.add('active');
                hqFields.classList.remove('hidden');
                extensionFields.classList.add('hidden');
                extensionFields.classList.remove('active');
            } else {
                hqFields.classList.add('hidden');
                hqFields.classList.remove('active');
                extensionFields.classList.add('active');
                extensionFields.classList.remove('hidden');
            }
        });
    });

    // Real-time validation for active form fields
    const validate = (input, message) => {
        const validationMessage = document.getElementById(`${input.id}-validation`);
        const regex = /^[A-Za-z\s]+$/;

        const runValidation = () => {
            const trimmedValue = input.value.trim();
            if (trimmedValue === '') {
                validationMessage.textContent = 'This field is required.';
                validationMessage.classList.add('show');
            } else if (!regex.test(trimmedValue)) {
                validationMessage.textContent = message;
                validationMessage.classList.add('show');
            } else {
                validationMessage.textContent = '';
                validationMessage.classList.remove('show');
            }
        };

        input.addEventListener('input', runValidation);
        input.addEventListener('blur', runValidation);
    };

    // Apply validations
    validate(hqNameHQ, 'HQ name must contain only letters and spaces.');
    validate(hqNameExt, 'HQ name must contain only letters and spaces.');
    validate(extensionName, 'Extension name must contain only letters and spaces.');
    validate(kilometers, 'Kilometers traveled must be a number.');

    // Form submission validation and loader logic
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const activeFields = document.querySelector('.form-section.active');
        const inputs = activeFields.querySelectorAll('input[required]');
        let formIsValid = true;

        inputs.forEach(input => {
            if (input.value.trim() === '') {
                const validationMessage = document.getElementById(`${input.id}-validation`);
                validationMessage.textContent = 'This field is required.';
                validationMessage.classList.add('show');
                formIsValid = false;
            } else {
                const validationMessage = document.getElementById(`${input.id}-validation`);
                validationMessage.textContent = '';
                validationMessage.classList.remove('show');
            }
        });

        if (formIsValid) {
            // Show loading state
            btnText.textContent = 'Submitting...';
            loader.classList.remove('hidden');
            submitBtn.disabled = true;

            // Collect data into an object
            let data = {};

            const expenseType = document.querySelector('input[name="expenseType"]:checked').value;
            data.expenseType = expenseType;
            if (expenseType === 'hq') {
                data.expenses = 200;
            } else {
                data.expenses = 250;
            }

            data.fileid = docId;
            data.filename = 'Expenses';
            data.hqName = hqNameHQ.value || hqNameExt.value;
            data.extensionName = extensionName.value || hqNameHQ.value;
            data.kilometersTraveled = kilometers.value || 0;
            data.total = extTotal.value;
            data.month = document.getElementById('month').textContent;
            console.log(data.month)

            console.log('Form data:', data);

            let respose = await fetch("https://citrix.app.n8n.cloud/webhook/employee", {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json"
                }
            });
            let result = await respose.json();
            console.log(result);

            // Simulate a network request
            setTimeout(() => {
                console.log('Form submitted successfully!');

                // Hide loading state and re-enable button
                btnText.classList.remove('hidden');
                btnText.textContent = 'Submit';
                loader.classList.add('hidden');
                submitBtn.disabled = false;

                // Show success modal with personalized message
                const msrName = document.getElementById('msrName').textContent;
                modalMessage.textContent = `${msrName}, you have submitted the Expenses successfully.`;
                modal.classList.remove('hidden');
                modal.classList.add('show');
                form.reset();
                calculateTotals(); // Reset totals
            }, 2000); // 2-second delay for demonstration
        }
    });

    // Add event listener to close the modal
    closeModalBtn.addEventListener('click', () => {
        modal.classList.remove('show');
        modal.classList.add('hidden');
    });
});