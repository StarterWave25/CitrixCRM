/* ------------------------------------------------------------------------- */
/* EMPLOYEE LOGIN PAGE LOGIC - login.js */
/* ------------------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.getElementById('login-btn');
    const role = document.getElementById('role-input').value; // 'Employee'
    const passwordToggle = document.getElementById('password-toggle'); // NEW ELEMENT
    /**
     * Pre-Login Check: Checks if the user is already authenticated.
     * Required by Instruction 3.
     */

    // --- Eye Icon Logic (NEW) ---
    if (passwordToggle) {
        passwordToggle.addEventListener('click', () => {
            // Get the current type of the password input
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';

            // Set the new type
            passwordInput.setAttribute('type', type);

            // Toggle the icon (fa-eye <-> fa-eye-slash)
            passwordToggle.classList.toggle('fa-eye');
            passwordToggle.classList.toggle('fa-eye-slash');
        });
    }
    const checkAuthStatus = async () => {
        try {
            // apiFetch is assumed to be globally available from ../api-fetch.js
            const response = await apiFetch('auth/check', 'POST', {url: window.location.href});

            if (response.success) {
                // If already logged in, redirect to the main role landing page
                console.log('User already authenticated. Redirecting...');
                window.location.href = 'dashboard.html';
            }
        } catch (error) {
            // Ignore if check fails (user not logged in), stay on login page
            console.warn('Auth check failed or user not logged in.');
        }
    };

    /**
     * Client-side Validation Logic.
     * Ensures dynamic, real-time feedback (UX principle).
     */
    const validateField = (input, minLength, maxLength) => {
        const value = input.value.trim();
        const formGroup = input.closest('.form-group');
        const errorElement = document.getElementById(`${input.id}-error`);
        let isValid = true;
        let errorMessage = '';

        // 1. Check if empty
        if (!value) {
            errorMessage = `${input.id.charAt(0).toUpperCase() + input.id.slice(1)} is required.`;
            isValid = false;
        }

        // 2. Check length constraints
        else if (minLength && value.length < minLength) {
            errorMessage = `${input.id.charAt(0).toUpperCase() + input.id.slice(1)} must be ${minLength} characters.`;
            isValid = false;
        }
        else if (maxLength && value.length > maxLength) {
            errorMessage = `${input.id.charAt(0).toUpperCase() + input.id.slice(1)} must be ${maxLength} characters.`;
            isValid = false;
        }

        // 3. Specific validation for Email
        else if (input.type === 'email' && !/\S+@\S+\.\S+/.test(value)) {
            errorMessage = 'Please enter a valid email address.';
            isValid = false;
        }

        // Apply visual feedback
        if (!isValid) {
            formGroup.classList.add('form-group--error');
            errorElement.textContent = errorMessage;
        } else {
            formGroup.classList.remove('form-group--error');
            errorElement.textContent = '';
        }

        return isValid;
    };


    /**
     * Enables/Disables the Login Button based on overall form validity.
     * Checks the CURRENT state of both fields without showing immediate errors.
     */
    const checkFormValidity = () => {
        // Only check the value/length state for button enablement, don't display errors yet.
        const isEmailValid = emailInput.value.trim() && (/\S+@\S+\.\S+/.test(emailInput.value.trim()));
        const isPasswordValid = passwordInput.value.length === 8;

        // Button is enabled ONLY when both are valid
        loginBtn.disabled = !(isEmailValid && isPasswordValid);
    };

    // --- Event Listeners for Dynamic Validation ---

    // 1. INPUT EVENT: Only checks the form validity to toggle the Login Button state.
    // This provides the user with visual feedback on *readiness to submit*.
    emailInput.addEventListener('input', checkFormValidity);
    passwordInput.addEventListener('input', checkFormValidity);

    // 2. BLUR EVENT: Triggers detailed validation and displays error messages.
    // This is the standard best practice for non-intrusive validation feedback.
    emailInput.addEventListener('blur', () => {
        validateField(emailInput, 1, 50); // Validate email field only
    });
    passwordInput.addEventListener('blur', () => {
        validateField(passwordInput, 8, 8); // Validate password field only
    });

    // --- Event Listeners for Dynamic Validation ---
    emailInput.addEventListener('input', checkFormValidity);
    passwordInput.addEventListener('input', checkFormValidity);
    emailInput.addEventListener('blur', () => validateField(emailInput, 1, 50));
    passwordInput.addEventListener('blur', () => validateField(passwordInput, 8, 8));

    // --- Form Submission Handler (Required by Instruction 1 & 2) ---
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Final check before submission
        if (loginBtn.disabled) return;

        // Temporarily disable button to prevent double submission
        loginBtn.disabled = true;
        loginBtn.textContent = 'Logging in...';

        const payload = {
            email: emailInput.value.trim(),
            password: passwordInput.value.trim(),
            role: role // 'Employee'
        };

        try {
            // API Call: auth/login (Instruction 1)
            const response = await apiFetch('auth/login', 'POST', payload);
            console.log(response)
            if (response.success) {
                // Store data in localStorage (Instruction 2)
                
                localStorage.setItem('userDetails', JSON.stringify(response.data));

                // Display success notification (UX Principle)
                showNotification(`Welcome, ${response.data.name}!`, 'success');

                const token = response.token; // from backend response

                // Store it as a browser cookie (client-side)
                setCookie('jwt', token, 7, { path: '/', sameSite: 'Lax', secure: false });

                // Redirect to Employee Dashboard
                setTimeout(() => {
                    window.location.href = './dashboard.html';
                }, 1000);

            } else {
                // Display error message from backend (Instruction 4)
                showNotification(response.message || 'Login failed. Please check your credentials.', 'error');
                loginBtn.disabled = false;
                loginBtn.innerHTML = 'Login';
            }
        } catch (error) {
            // Handle network or unexpected API errors
            console.error('Login failed:', error);
            showNotification('A network error occurred. Please try again.', 'error');
            loginBtn.disabled = false;
            loginBtn.innerHTML = 'Login';
        }
    });

    function setCookie(name, value, days = 7, options = {}) {
        // options: { path, domain, sameSite, secure }
        const expires = new Date(Date.now() + days * 864e5).toUTCString();
        let cookieStr = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; Expires=${expires}; Path=${options.path || '/'}`;

        if (options.domain) cookieStr += `; Domain=${options.domain}`;
        // sameSite values: 'Lax' (default), 'Strict', 'None'
        if (options.sameSite) cookieStr += `; SameSite=${options.sameSite}`;
        if (options.secure) cookieStr += `; Secure`; // only set in https contexts
        // HttpOnly cannot be set via JS

        document.cookie = cookieStr;
    }

    // Run the initial check
    checkAuthStatus();
});
