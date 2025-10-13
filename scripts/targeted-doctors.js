document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('targetedDoctorsForm');
    const doctorNameInput = document.getElementById('doctorName');
    const hqInput = document.getElementById('headQuarter');
    const patchInput = document.getElementById('patch');
    const mocInput = document.getElementById('moc');
    const brandsInput = document.getElementById('brands');
    const submitBtn = document.querySelector('.submit-btn');
    const btnText = document.querySelector('.btn-text');
    const loader = document.querySelector('.loader');
    const successModal = document.getElementById('successModal');
    const successMessage = document.getElementById('successMessage');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const msrNameSpan = document.getElementById('msrName');
    const monthSpan = document.getElementById('month');
    const formTitleHeading = document.querySelector('.form-title');

    // Sample data for static fields (to be updated dynamically)
    msrNameSpan.textContent = username;
    monthSpan.textContent = 'September';

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
    validate(doctorNameInput, alphaRegex, 'Dr. Name must contain only letters and spaces.');
    validate(hqInput, alphaRegex, 'Head Quarter must contain only letters and spaces.');
    validate(patchInput, alphaRegex, 'Patch must contain only letters and spaces.');
    validate(mocInput, alphaRegex, 'MOC must contain only letters and spaces.');
    validate(brandsInput, /^[A-Za-z0-9\s,.-]+$/, 'Brands must contain only letters, numbers, spaces, commas, and hyphens.');

    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const inputs = [doctorNameInput, hqInput, patchInput, mocInput, brandsInput];
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
                moc: mocInput.value,
                brands: brandsInput.value,
                fileid: docId,
                filename: "Target Doctors"
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