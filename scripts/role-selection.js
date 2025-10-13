// Currently, there are no specific JavaScript interactions for a static role selection page.
// This file is included to maintain the project structure and can be used for future enhancements
// such as a simple page loader, smooth scroll, or other interactive elements.
// Example: Adding a smooth transition for button clicks.

document.addEventListener('DOMContentLoaded', () => {
    const roleButtons = document.querySelectorAll('.role-btn');

    roleButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Prevent the default link behavior for a moment to allow for a visual effect
            // e.preventDefault();
            
            // Add a temporary class for an animation or effect if needed
            // button.classList.add('is-clicking');
            
            // In a real application, you would navigate after a brief delay
            // setTimeout(() => {
            //     window.location.href = button.href;
            // }, 300);
            
        });
    });
});