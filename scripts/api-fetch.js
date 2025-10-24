

function getCookie(name) {
    const match = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') + '=([^;]*)'));
    return match ? decodeURIComponent(match[1]) : null;
}

// --- Auto-detect mode based on where the code is running ---
const isLocalhost =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname.includes("192.168.");

const BASE_URL = isLocalhost
    ? "http://localhost:3000/api/"
    : "/api/"; // use relative path in production
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
        const result = await response.json();
        // if (!result.authorized) {
        //     localStorage.removeItem('userDetails');
        //     location.href = 'http://127.0.0.1:5500/';
        //     return;
        // }
        return result;
    } catch (err) {
        console.error("Fetch failed:", err);
        throw err; // rethrow so caller can handle
    }
}