/* ------------------------------------------------------------------------- */
/* EMPLOYEE MENU PAGE LOGIC - index.js */
/* Handles Auth Check, Personalization, and Interactive Features */
/* ------------------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements for general actions and content
    const greetingElement = document.getElementById('employee-greeting');
    const logoutBtn = document.getElementById('logout-btn');
    const viewDataBtn = document.getElementById('view-data-btn');
    const joinMeetingBtn = document.getElementById('join-meeting-btn');

    // Modal Elements for Join Meeting feature (simplified structure)
    const meetingModal = document.getElementById('meeting-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalLoadingState = document.getElementById('modal-loading-state');
    const modalResultState = document.getElementById('modal-result-state');

    /**
     * 1. Authentication and Personalization Check
     * Retrieves user details from localStorage and populates the greeting.
     */
    const loadUserDetails = () => {
        const userDetailsString = localStorage.getItem('userDetails');

        if (!userDetailsString) {
            // User details missing: Redirect to login page for authentication.
            console.warn('User details not found. Redirecting to login.');
            window.location.href = './employee-login.html'; 
            return;
        }

        try {
            const userDetails = JSON.parse(userDetailsString);

            if (userDetails.name) {
                // Update the greeting with the employee's name
                greetingElement.innerHTML = `Hello <span class="placeholder-name">${userDetails.name}!</span>`;
            } else {
                // Fallback if name is missing
                greetingElement.innerHTML = `Welcome! <span class="placeholder-name">Employee</span>`;
            }

        } catch (error) {
            console.error('Error parsing user details from localStorage:', error);
            // On parsing error, redirect to login to force re-authentication
            window.location.href = './employee-login.html'; 
        }
    };

    /**
     * Helper function to reset and close the meeting modal.
     */
    const closeModal = () => {
        meetingModal.classList.remove('active');
        // Reset modal state: Ensure loading state is visible and result is hidden for the next call
        modalLoadingState.classList.remove('hidden');
        modalLoadingState.style.opacity = '1';
        modalResultState.classList.add('hidden');
        modalResultState.innerHTML = '';
    };

    /**
     * 2. LOGOUT FUNCTIONALITY (API Integrated)
     * Calls the backend API (auth/logout, GET) to clear the JWT cookie.
     */
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            console.log('Attempting API logout: auth/logout (GET)');
            
            try {
                // Call the backend API as requested
                await apiFetch('auth/logout', 'GET');
                console.log('API Logout executed successfully.');

            } catch (error) {
                // Proceed with client-side logout even if API call fails
                console.error('Logout API call failed, but proceeding to clear local session:', error);
            }
            
            // Critical Step: Clear client-side session data and redirect
            localStorage.removeItem('userDetails');
            console.log('Client session cleared. Redirecting to employee login.');
            
            setTimeout(() => {
                window.location.href = './employee-login.html';
            }, 100); 
        });
    }

    /**
     * 3. View Data Button Placeholder
     */
    if (viewDataBtn) {
        viewDataBtn.addEventListener('click', () => {
            console.log('View Data button clicked. Redirecting to data dashboard...');
            // Placeholder for navigation logic
        });
    }
    
    /**
     * 4. Join Meeting Functionality (API Integrated with Premium Modal)
     */
    const handleJoinMeeting = async () => {
        // 1. Reset and Show the Modal
        closeModal();
        meetingModal.classList.add('active');

        try {
            // 2. API Fetch Call (common/join-meeting, GET)
            console.log('Fetching meeting link: common/join-meeting (GET)');
            const response = await apiFetch('common/join-meeting', 'GET');
            
            // 3. INSTANTLY transition to result state
            modalLoadingState.classList.add('hidden');
            modalLoadingState.style.opacity = '0';
            
            modalResultState.classList.remove('hidden');
            modalResultState.style.opacity = '1';

            if (response.success && response.meetingLink) {
                // 4. SUCCESS STATE: Meeting Found
                
                modalResultState.innerHTML = `
                    <h3 class="success-title">Your Meeting Link is Ready!</h3>
                    <p class="message">Click 'Join Now' to connect to your scheduled high-priority meeting.</p>
                    <a href="${response.meetingLink}" target="_blank" class="btn-primary join-btn" onclick="closeModal()">
                        <i class="fa-solid fa-video"></i> JOIN NOW
                    </a>
                `;

            } else {
                // 5. FAILURE STATE: No Meeting Found
                
                const message = response.message || 'We could not find a scheduled high-priority meeting for you today.';
                
                modalResultState.innerHTML = `
                    <h3 class="error-title">No Meetings Found</h3>
                    <p class="message">${message}</p>
                `;
            }
            
        } catch (error) {
            // 6. API/Network ERROR State (Instant transition to error view)
            console.error('API Error during join meeting check:', error);
            
            modalLoadingState.classList.add('hidden');
            modalLoadingState.style.opacity = '0';
            
            modalResultState.classList.remove('hidden');
            modalResultState.style.opacity = '1';

            modalResultState.innerHTML = `
                <h3 class="error-title">Connection Error</h3>
                <p class="message">
                    Failed to connect to the meeting scheduler API. Please check your network.
                </p>
                <button class="btn-primary" style="background-color: var(--error-red);" id="modal-retry-btn">
                    <i class="fa-solid fa-rotate-right"></i> Retry
                </button>
            `;
            
            document.getElementById('modal-retry-btn').addEventListener('click', () => {
                // Reset state and re-run the handler
                modalResultState.classList.add('hidden');
                modalLoadingState.style.opacity = '1';
                handleJoinMeeting(); 
            });
        }
    };
    
    // --- Initial Event Listeners ---
    if (joinMeetingBtn) {
        joinMeetingBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Stop default <a> navigation
            handleJoinMeeting();
        });
    }

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeModal);
    }

    // Close modal when clicking the backdrop
    meetingModal.addEventListener('click', (e) => {
        if (e.target === meetingModal) {
            closeModal();
        }
    });

    // Initialize the dashboard on load
    loadUserDetails();
});