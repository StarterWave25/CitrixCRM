document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('tourForm');
    const hqInput = document.getElementById('hq');
    const dateInput = document.getElementById('date');
    const dayInput = document.getElementById('day');
    const townInput = document.getElementById('town');
    const jointWorkInput = document.getElementById('jointWork');

    // Get a reference to the static MSR name span
    const msrNameSpan = document.getElementById('msrName');
    const username = getCookie('citrixUsername');
    msrNameSpan.textContent = username;

    // Dynamically set the current month and MSR name
    const currentMonth = new Date().toLocaleString('default', {
        month: 'long'
    });
    document.getElementById('month').textContent = currentMonth;

    // Submit button and loader elements
    const submitBtn = document.getElementById('submitBtn');
    const btnText = document.querySelector('.btn-text');
    const loader = document.querySelector('.loader');

    // Create and append the modal to the body
    const modal = document.createElement('div');
    modal.id = 'successModal';
    modal.className = 'modal hidden';
    modal.innerHTML = `
        <div class="modal-content">
            <img src="../../img/checkmark-circle.png" alt="Success Icon" class="success-icon">
            <p id="modalMessage"></p>
            <button class="close-modal-btn">OK</button>
        </div>
    `;
    document.body.appendChild(modal);

    const closeModalBtn = document.querySelector('.close-modal-btn');
    const modalMessage = document.getElementById('modalMessage');

    // Get cookie
    function getCookie(name) {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i].trim();
            if (cookie.startsWith(name + '=')) {
                return cookie.substring(name.length + 1);
            }
        }
        return '';
    }

    // New event listener to update the day when the date changes
    dateInput.addEventListener('change', () => {
        const selectedDate = dateInput.value;
        if (selectedDate) {
            const dateObj = new Date(selectedDate + 'T00:00:00'); // Add time to avoid timezone issues
            const dayOfWeek = dateObj.toLocaleDateString('en-US', {
                weekday: 'long'
            });
            dayInput.value = dayOfWeek;
        } else {
            dayInput.value = '';
        }
    });


    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Show loading state
        btnText.classList.add('hidden');
        loader.classList.remove('hidden');
        submitBtn.disabled = true;

        const tourForm = new FormData(form);
        const date = tourForm.get('date').split("-");
        const newDate = date.reverse().join("-");

        let data = {
            hq: hqInput.value,
            date: newDate,
            day: dayInput.value,
            town: townInput.value,
            jointWork: jointWorkInput.value,
            fileid: docId,
            filename: "Tour Plan"
        };

        try {
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
                submitBtn.disabled = false;
                // Show success modal with personalized message
                const msrName = msrNameSpan.textContent;
                modalMessage.textContent = `${msrName}, You have Submitted the Tour Programme Successfully !`;
                modal.classList.remove('hidden');
                form.reset();
            } else {
                // Show a user-friendly message without using confirm()
                modalMessage.textContent = 'Something went wrong. Please try again after some time.';
                modal.classList.remove('hidden');
                btnText.classList.remove('hidden');
                btnText.textContent = 'Submit';
                loader.classList.add('hidden');
                submitBtn.disabled = false;
            }
        } catch (error) {
            console.error('Submission error:', error);
            // Show a user-friendly message without using confirm()
            modalMessage.textContent = 'An error occurred. Please check your network and try again.';
            modal.classList.remove('hidden');
            btnText.classList.remove('hidden');
            btnText.textContent = 'Submit';
            loader.classList.add('hidden');
            submitBtn.disabled = false;
        }
    });

    // Add event listener to close the modal
    closeModalBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
    });
});