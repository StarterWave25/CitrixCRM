/* ------------------------------------------------------------------------- */
/* UNIVERSAL NOTIFICATION SYSTEM - notification.js */
/* Creates visually outstanding, animated toast notifications. */
/* ------------------------------------------------------------------------- */

/**
 * Displays a visually outstanding toast notification.
 * @param {string} message - The message to display.
 * @param {string} type - The notification type ('error', 'success', 'info').
 * @param {number} duration - Time in ms before hiding.
 */
function showNotification(message, type = 'info', duration = 2000) {
    const area = document.getElementById('notification-area');
    if (!area) {
        console.error('Notification area element not found.');
        return;
    }

    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;

    // Select icon based on type for visual anchoring
    let iconClass;
    let iconColor;

    switch (type) {
        case 'error':
            iconClass = 'fa-solid fa-triangle-exclamation';
            iconColor = 'var(--error-red)';
            break;
        case 'success':
            iconClass = 'fa-solid fa-circle-check';
            iconColor = '#4CAF50'; // Standard Green for success
            break;
        default:
            iconClass = 'fa-solid fa-circle-info';
            iconColor = 'var(--blue)';
    }

    notification.innerHTML = `
        <i class="notification-icon ${iconClass}" style="color: ${iconColor};"></i>
        <span class="notification-message">${message}</span>
    `;

    // 1. Append and show (triggers slide-in transition)
    area.appendChild(notification);
    // Use requestAnimationFrame for guaranteed repaint/animation trigger
    requestAnimationFrame(() => notification.classList.add('show'));

    // 2. Set timer to hide and remove
    const timerId = setTimeout(() => {
        // Trigger slide-out transition
        notification.classList.remove('show');

        // Remove element after transition completes (0.5s)
        notification.addEventListener('transitionend', () => {
            notification.remove();
        }, { once: true });

    }, duration);

    // Allow user to click to dismiss immediately
    notification.addEventListener('click', () => {
        clearTimeout(timerId);
        notification.classList.remove('show');
        notification.addEventListener('transitionend', () => {
            notification.remove();
        }, { once: true });
    });
}