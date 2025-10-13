function getCookie(name) {
    const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
    return match ? decodeURIComponent(match[1]) : null;
}

// Usage:
const docId = getCookie('docId');
const username = getCookie('citrixUsername');
if (!docId) {
    location.href = "employee-login.html";
}