/* --- CHANGED SNIPPET for employee/index.js (Adding New Button Logic) --- */

document.addEventListener('DOMContentLoaded', () => {
    const greetingElement = document.getElementById('employee-greeting');
    const logoutBtn = document.getElementById('logout-btn');
    const viewDataBtn = document.getElementById('view-data-btn'); // NEW ELEMENT
    const joinMeetingBtn = document.getElementById('join-meeting-btn'); // NEW ELEMENT

    /**
     * Retrieves user details from localStorage and populates the greeting.
     */
    const loadUserDetails = () => {
        const userDetailsString = localStorage.getItem('userDetails');
        // ... (rest of loadUserDetails remains the same) ...
    };


    /**
     * 2. Logout Functionality
     */
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('userDetails');
            console.log('User logged out. Redirecting to login.');
            window.location.href = './login.html';
        });
    }

    /**
     * 3. View Data Button Placeholder
     */
    if (viewDataBtn) {
        viewDataBtn.addEventListener('click', () => {
            console.log('View Data button clicked. Initiating redirection...');
            // Placeholder: Implement actual navigation logic here
        });
    }
    
    /**
     * 4. Join Meeting Button Placeholder (Fixed Button)
     */
    if (joinMeetingBtn) {
        joinMeetingBtn.addEventListener('click', () => {
            console.log('Join Meeting button clicked. Initiating meeting connection...');
            // Placeholder: Implement actual video conference link opening here
        });
    }

    // Execute the function upon page load
    // loadUserDetails();
});

/* --- END CHANGED SNIPPET --- */