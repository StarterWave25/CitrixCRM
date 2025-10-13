document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('orderDetailsForm');
    const hqInput = document.getElementById('hq');
    const doctorNameInput = document.getElementById('doctorName');
    const productNameInput = document.getElementById('productName');
    const stripsInput = document.getElementById('strips');
    const freeStripsInput = document.getElementById('freeStrips');
    const deliveryAddressInput = document.getElementById('deliveryAddress');
    const mobileNumberInput = document.getElementById('mobileNumber');
    const dlCopyInput = document.getElementById('dlCopy');
    const prescriptionInput = document.getElementById('prescription');
    const msrName = username;
    const fileid = docId;
    // Get a reference to the static MSR name span

    // Sample data for static fields (to be updated dynamically)
    // Get a reference to the static MSR name span
    const msrNameSpan = document.getElementById('msrName');
    msrNameSpan.textContent = msrName; 
    document.getElementById('month').textContent = new Date().toLocaleString('default', { month: 'long' });

    // Submit button and loader elements
    const submitBtn = document.getElementById('submitBtn');
    const btnText = document.querySelector('.btn-text');
    const loader = document.querySelector('.loader');

    // Get modal elements
    const modal = document.getElementById('successModal');
    const modalMessage = document.getElementById('modalMessage');
    const closeModalBtn = document.querySelector('.close-modal-btn');

    // Real-time validation
    const validate = (input, regex, message) => {
        const validationMessage = document.getElementById(`${input.id}-validation`);

        const runValidation = () => {
            const trimmedValue = input.value.trim();
            if (trimmedValue === '') {
                validationMessage.textContent = 'This field is required.';
                validationMessage.classList.add('show');
            } else if (regex && !regex.test(trimmedValue)) {
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

    // Validations for each field
    const nameRegex = /^[A-Za-z\s]+$/;
    const alphanumericRegex = /^[A-Za-z0-9\s,.-]+$/;
    const phoneRegex = /^\d{10}$/;

    validate(hqInput, nameRegex, 'HQ must contain only letters and spaces.');
    validate(doctorNameInput, nameRegex, 'Doctor Name must contain only letters and spaces.');
    validate(productNameInput, alphanumericRegex, 'Product Name must contain letters and numbers.');
    validate(stripsInput, null, '');
    validate(freeStripsInput, null, '');
    validate(deliveryAddressInput, alphanumericRegex, 'Address must contain letters, numbers, and common punctuation.');
    validate(mobileNumberInput, phoneRegex, 'Please enter a valid 10-digit mobile number.');

    // Specific validation for file inputs
    const validateFile = (input) => {
        const validationMessage = document.getElementById(`${input.id}-validation`);
        if (input.files.length === 0) {
            validationMessage.textContent = 'A file must be uploaded.';
            validationMessage.classList.add('show');
            return false;
        } else {
            validationMessage.textContent = '';
            validationMessage.classList.remove('show');
            return true;
        }
    };
    dlCopyInput.addEventListener('change', () => validateFile(dlCopyInput));
    prescriptionInput.addEventListener('change', () => validateFile(prescriptionInput));


    // Form submission validation and loader logic
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const inputs = [
            hqInput, doctorNameInput, productNameInput, stripsInput, freeStripsInput,
            deliveryAddressInput, mobileNumberInput, dlCopyInput, prescriptionInput
        ];

        let formIsValid = true;
        inputs.forEach(input => {
            if (input.type === 'file') {
                if (!validateFile(input)) {
                    formIsValid = false;
                }
            } else if (input.value.trim() === '') {
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
            let dlCopy = dlCopyInput.files[0];
            let prescription = prescriptionInput.files[0];
            let data = new FormData();
            data.append('dlCopy', dlCopy);
            data.append('prescription', prescription);
            const req = await fetch('https://citrix.app.n8n.cloud/webhook/upload-images', {
                method: 'POST',
                body: data
            });
            const res = await req.json();
            if (res.dlCopy && res.prescription) {
                const sendReq = await fetch('https://citrix.app.n8n.cloud/webhook/employee', {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify({
                        filename: 'Orders', fileid,
                        hqInput: hqInput.value, doctorName: doctorNameInput.value, productName: productNameInput.value,
                        strips: stripsInput.value, freeStrips: freeStripsInput.value, address: deliveryAddressInput.value,
                        mobile: mobileNumberInput.value, dlCopy: res.dlCopy, prescription: res.prescription
                    })
                });
                const response = await sendReq.json();
                if (response.status) {
                    // Hide loading state and re-enable button
                    btnText.classList.remove('hidden');
                    btnText.textContent = 'Submit';
                    loader.classList.add('hidden');
                    submitBtn.disabled = false;

                    // Show success modal with personalized message
                    modalMessage.textContent = `${msrName}, you have submitted the Order Details successfully.`;
                    modal.classList.remove('hidden');
                    modal.classList.add('show');
                }
                else {
                    confirm('Try after some time !');
                }
            }
            else {
                confirm('Try after some time !');
            }
        }
    });

    // Add event listener to close the modal
    closeModalBtn.addEventListener('click', () => {
        modal.classList.remove('show');
        modal.classList.add('hidden');
        form.reset();
    });
});