document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('detailsForm');
    const doctorNameInput = document.getElementById('doctorName');
    const hqInput = document.getElementById('headQuarter');
    const patchInput = document.getElementById('patch');
    const addressInput = document.getElementById('address');
    const phoneNoInput = document.getElementById('phoneNo');
    const pharmacyInput = document.getElementById('pharmacy');
    const inchargePhoneNoInput = document.getElementById('inchargePhoneNo');
    const submitBtn = document.querySelector('.submit-btn');
    const btnText = document.querySelector('.btn-text');
    const loader = document.querySelector('.loader');
    const successModal = document.getElementById('successModal');
    const successMessage = document.getElementById('successMessage');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const msrNameSpan = document.getElementById('msrName');
    const formTitleHeading = document.querySelector('.form-title');

    // Sample data for static fields (to be updated dynamically)
    msrNameSpan.textContent = username;

    // Real-time validation
    const validate = (input, regex, message) => {
        const validationMessage = document.getElementById(`${input.id}-validation`);

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

    // Validations for each field
    const alphaRegex = /^[A-Za-z\s.,'-]+$/;
    const alphanumericRegex = /^[A-Za-z0-9\s.,'-]+$/;
    const phoneRegex = /^\d{10}$/;

    validate(doctorNameInput, alphaRegex, 'Dr. Name must contain only letters and spaces.');
    validate(hqInput, alphaRegex, 'Head Quarter must contain only letters and spaces.');
    validate(patchInput, alphaRegex, 'Patch must contain only letters and spaces.');
    validate(addressInput, alphanumericRegex, 'Address can contain letters, numbers, and common symbols.');
    validate(phoneNoInput, phoneRegex, 'Please enter a valid 10-digit phone number.');
    validate(pharmacyInput, alphanumericRegex, 'Pharmacy Name can contain letters and numbers.');
    validate(inchargePhoneNoInput, phoneRegex, 'Please enter a valid 10-digit phone number.');

    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const inputs = [
            doctorNameInput,
            hqInput,
            patchInput,
            addressInput,
            phoneNoInput,
            pharmacyInput,
            inchargePhoneNoInput
        ];
        let formIsValid = true;

        inputs.forEach(input => {
            const trimmedValue = input.value.trim();
            if (trimmedValue === '') {
                const validationMessage = document.getElementById(`${input.id}-validation`);
                validationMessage.textContent = 'This field is required.';
                validationMessage.classList.add('show');
                formIsValid = false;
            }
        });

        // Re-run specific format validations on submit
        if (!alphaRegex.test(doctorNameInput.value)) formIsValid = false;
        if (!alphaRegex.test(hqInput.value)) formIsValid = false;
        if (!alphaRegex.test(patchInput.value)) formIsValid = false;
        if (!alphanumericRegex.test(addressInput.value)) formIsValid = false;
        if (!phoneRegex.test(phoneNoInput.value)) formIsValid = false;
        if (!alphanumericRegex.test(pharmacyInput.value)) formIsValid = false;
        if (!phoneRegex.test(inchargePhoneNoInput.value)) formIsValid = false;

        if (formIsValid) {
            // Change button text and show loading animation
            btnText.textContent = 'Submitting...';
            loader.classList.remove('hidden');
            submitBtn.disabled = true;

            let data = {
                msrName: msrNameSpan.textContent,
                doctorName: doctorNameInput.value,
                headQuarter: hqInput.value,
                patch: patchInput.value,
                address: addressInput.value,
                phoneNo: phoneNoInput.value,
                pharmacy: pharmacyInput.value,
                inchargePhoneNo: inchargePhoneNoInput.value,
                filename: "Doctors List",
                fileid: docId

            };


            let req = await fetch("https://citrix.app.n8n.cloud/webhook/employee", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            })

            let res = await req.json();
            if (res.status) {
                // Hide loading state
                btnText.classList.remove('hidden');
                btnText.textContent = 'Submit';
                loader.classList.add('hidden');

                // Show success modal with personalized message
                const formTitleText = formTitleHeading.textContent;
                successMessage.textContent = `${formTitleText}, You have Submitted the Tour Programme Successfully !`;
                // Hide loading animation and show success modal
                btnText.textContent = 'Submit';
                loader.classList.add('hidden');
                submitBtn.disabled = false;
                successModal.classList.remove('hidden');
                // Reset form after successful submission
                form.reset();
            }
            else {
                confirm('Try after some time !')
            }
        }
    });

    // Close modal event listener
    closeModalBtn.addEventListener('click', () => {
        successModal.classList.add('hidden');
    });

    successModal.addEventListener('click', (e) => {
        if (e.target === successModal) {
            successModal.classList.add('hidden');
        }
    });
});