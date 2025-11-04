

function getCookie(name) {
    const match = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') + '=([^;]*)'));
    return match ? decodeURIComponent(match[1]) : null;
}

function deleteCookie(name) {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function isLoginPage() {
    const path = window.location.pathname;
    return path.endsWith('employee-login.html') ||
        path.endsWith('manager-login.html') ||
        path.endsWith('md-login.html');
}

(function () {
    const token = getCookie('jwt');
    const userDetails = localStorage.getItem('userDetails');
    const path = window.location.pathname;

    if (!token || !userDetails) {
        // If either token or userDetails is missing, clear both.
        localStorage.removeItem('userDetails');
        deleteCookie('jwt');

        // If we are not on a login page, redirect to the appropriate one.
        if (!isLoginPage()) { // Changed to function call
            if (path.includes('/employee/')) {
                window.location.href = './employee-login.html';
            } else if (path.includes('/manager/')) {
                window.location.href = './manager-login.html';
            } else if (path.includes('/md/')) {
                window.location.href = './md-login.html';
            }
        }
    }
})();

// --- Auto-detect mode based on where the code is running ---
const isLocalhost =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname.includes("192.168.");

const BASE_URL = isLocalhost
    ? "http://localhost:3000/api/"
    : "https://citrixcrm-dm9mw.sevalla.app/api/"; // use relative path in production
// --- The universal fetch wrapper ---
async function apiFetch(url, type = "GET", data = {}) {
    try {
        const endpoint = `${BASE_URL}${url}`;

        const options = {
            method: type.toUpperCase(),
            headers: { "Content-Type": "application/json" },
            credentials: "include"
        };

        if (type.toUpperCase() !== "GET") {
            options.body = JSON.stringify(data);
        }
        const tokenFromCookie = getCookie('jwt');
        if (tokenFromCookie) {
            options.headers['Authorization'] = `Bearer ${tokenFromCookie}`;
        }

        const response = await fetch(endpoint, options);

        if (response.status === 401 || response.status === 403) {
            // If either token or userDetails is missing, clear both.
            localStorage.removeItem('userDetails');
            deleteCookie('jwt');

            // If we are not on a login page, redirect to the appropriate one.
            if (!isLoginPage()) { // Changed to function call
                if (path.includes('/employee/')) {
                    window.location.href = './employee-login.html';
                } else if (path.includes('/manager/')) {
                    window.location.href = './manager-login.html';
                } else if (path.includes('/md/')) {
                    window.location.href = './md-login.html';
                }
            }
            return; // Stop further execution
        }

        const result = await response.json();
        return result;
    } catch (err) {
        console.error("Fetch failed:", err);
        throw err; // rethrow so caller can handle
    }
}