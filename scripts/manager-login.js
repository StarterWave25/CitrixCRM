document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const passwordToggle = document.getElementById('password-toggle');
    const usernameValidation = document.getElementById('username-validation');
    const passwordValidation = document.getElementById('password-validation');

    // Simple XOR encryption without external modules
    const encryptCredentials = (text) => {
        const key = 'citrix_key_secret';
        return text.split('').map((char, i) =>
            String.fromCharCode(char.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

    // Check for cookie on page load
    const checkCookie = () => {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i].trim();
            if (cookie.startsWith('citrix_user=')) {
                const encryptedUser = cookie.substring('citrix_user='.length);
                const decryptedUser = encryptCredentials(encryptedUser);
                if (decryptedUser === 'citrixboss') {
                    // Redirect to employees page if cookie is valid
                    window.location.href = 'employees.html';
                    return true;
                }
            }
        }
        return false;
    };

    // Check cookie on initial load
    checkCookie();

    // Toggle password visibility
    passwordToggle.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        passwordToggle.classList.toggle('fa-eye');
        passwordToggle.classList.toggle('fa-eye-slash');
    });

    // Real-time validation for Username
    usernameInput.addEventListener('input', () => {
        const value = usernameInput.value;
        const alphanumeric = /^[a-zA-Z0-9]*$/;

        if (!alphanumeric.test(value)) {
            usernameValidation.textContent = 'Only letters and numbers are allowed.';
            usernameValidation.classList.add('show');
        } else {
            usernameValidation.textContent = '';
            usernameValidation.classList.remove('show');
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

        const isUsernameValid = /^[a-zA-Z0-9]*$/.test(usernameInput.value) && usernameInput.value.length > 0;
        const isPasswordValid = passwordInput.value.length >= 6;

        if (!isUsernameValid) {
            usernameValidation.textContent = 'Username is required and must be alphanumeric.';
            usernameValidation.classList.add('show');
        }

        if (!isPasswordValid) {
            passwordValidation.textContent = 'Password must be at least 6 characters.';
            passwordValidation.classList.add('show');
        }

        if (isUsernameValid && isPasswordValid) {
            const adminUser = await getAdminUser();
            if (usernameInput.value === adminUser.username && passwordInput.value === adminUser.password) {
                let username = usernameInput.value;
                document.cookie = `citrix_user=${username}; path=/; max-age=86400`; // Cookie expires in 1 day
                window.location.href = 'employees.html';
            } else {
                passwordValidation.textContent = 'Incorrect Credientials!';
                passwordValidation.classList.add('show');
            }
        }
    });

    async function getAdminUser(){
        const req = await fetch('../data/get-admin.php');
        const res = await req.json();
        
        return res[0];
    }
});