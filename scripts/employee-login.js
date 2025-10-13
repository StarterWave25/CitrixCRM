document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const passwordToggle = document.getElementById('password-toggle');
    const emailValidation = document.getElementById('email-validation');
    const passwordValidation = document.getElementById('password-validation');

    function getCookie(name) {
        const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
        return match ? decodeURIComponent(match[1]) : null;
    }

    // Usage:
    const docId = getCookie('docId');
    if(docId) location.href="sheet-selection.html";

    // Toggle password visibility
    passwordToggle.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        passwordToggle.classList.toggle('fa-eye');
        passwordToggle.classList.toggle('fa-eye-slash');
    });

    // Real-time validation for Email
    emailInput.addEventListener('input', () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value)) {
            emailValidation.textContent = 'Please enter a valid email address.';
            emailValidation.classList.add('show');
        } else {
            emailValidation.textContent = '';
            emailValidation.classList.remove('show');
        }
    });

    // Real-time validation for Password
    passwordInput.addEventListener('input', () => {
        if (passwordInput.value.length < 6) {
            passwordValidation.textContent = 'Password must be at least 6 characters.';
            passwordValidation.classList.add('show');
        } else {
            passwordValidation.textContent = '';
            passwordValidation.classList.remove('show');
        }
    });

    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isEmailValid = emailRegex.test(emailInput.value);
        const isPasswordValid = passwordInput.value.length >= 6;

        if (!isEmailValid) {
            emailValidation.textContent = 'Please enter a valid email address.';
            emailValidation.classList.add('show');
        }

        if (!isPasswordValid) {
            passwordValidation.textContent = 'Password must be at least 6 characters.';
            passwordValidation.classList.add('show');
        }

        if (isEmailValid && isPasswordValid) {
            // Placeholder logic for employee login
            const isValid = await validateUser(emailInput.value, passwordInput.value);
            if (isValid) {
                location.href = 'sheet-selection.html';
            } else {
                passwordValidation.textContent = 'Incorrect credentials.';
                passwordValidation.classList.add('show');
            }
        }

        async function validateUser(email, password) {
            const req = await fetch("../data/validate-user.php", {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });
            const res = await req.json();

            if (res == null) {
                return false;
            } else {
                document.cookie = `docId=${res.doc_id}; path=/; max-age=604800`;
                document.cookie = `citrixUsername=${res.username}; path=/; max-age=604800`;
                return true;
            }
        }
    });
});