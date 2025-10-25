/* ------------------------------------------------------------------------- */
/* EMPLOYEE MENU PAGE LOGIC - dashboard.js */
/* Handles Auth Check, Personalization, and Interactive Features */
/* ------------------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
    // --- Existing DOM Elements ---
    const greetingElement = document.getElementById('employee-greeting');
    const logoutBtn = document.getElementById('logout-btn');
    const viewDataBtn = document.getElementById('view-data-btn');
    const joinMeetingBtn = document.getElementById('join-meeting-btn');

    // Modal Elements for Join Meeting feature
    const meetingModal = document.getElementById('meeting-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalLoadingState = document.getElementById('modal-loading-state');
    const modalResultState = document.getElementById('modal-result-state');

    // --- NEW: Data Viewer DOM Elements ---
    const dataViewerModal = document.getElementById('data-viewer-modal');
    const dataViewerCloseBtn = document.getElementById('data-viewer-close-btn');
    const dataLoadingState = document.getElementById('data-loading-state');
    const dataDisplayState = document.getElementById('data-display-state');
    const dataErrorState = document.getElementById('data-error-state');
    const dataErrorMessage = document.getElementById('data-error-message');
    const dataRetryBtn = document.getElementById('data-retry-btn');

    // Controls
    const extensionSelect = document.getElementById('extension-select');
    const fromDateInput = document.getElementById('from-date-input');
    const toDateInput = document.getElementById('to-date-input');
    // Hidden ISO fields are CRITICAL for the API format (YYYY-MM-DD)
    const fromDateIsoInput = document.getElementById('from-date-iso');
    const toDateIsoInput = document.getElementById('to-date-iso');
    const applyDataBtn = document.getElementById('apply-data-btn');
    const sheetSelect = document.getElementById('sheet-select');
    const dataSheetsContainer = document.getElementById('data-sheets-container');

    // Validation Message Element
    const dateValidationMessageBox = document.getElementById('date-validation-message');

    // --- Global State Variables ---
    let allSheetData = {}; // Stores fetched data for all sheets for the selected date range
    let validTourDates = []; // Stores dates fetched from API in YYYY-MM-DD format
    // Map API keys to user-friendly sheet names
    const sheetNameMap = {
        'tourplan': 'Tour Plan',
        'doctorsList': 'Doctors List',
        'orders': 'Orders'
    };

    /**
     * Helper to safely get user details from localStorage.
     */
    const getUserDetails = () => {
        try {
            const userDetailsString = localStorage.getItem('userDetails');
            if (userDetailsString) {
                return JSON.parse(userDetailsString);
            }
        } catch (e) {
            console.error("Error retrieving user details:", e);
        }
        return null;
    };

    // --- MODAL & STATE MANAGEMENT ---

    /**
     * 1. Authentication and Personalization Check
     */
    const loadUserDetails = () => {
        const userDetails = getUserDetails();

        if (!userDetails) {
            console.warn('User details not found. Redirecting to login.');
            window.location.href = './employee-login.html';
            return;
        }

        if (userDetails.name) {
            greetingElement.innerHTML = `Hello <span class="placeholder-name">${userDetails.name}!</span>`;
        } else {
            greetingElement.innerHTML = `Welcome! <span class="placeholder-name">Employee</span>`;
        }
    };

    // Returns anchor tag if value is a URL, else returns value as-is
    function formatIfUrl(value) {
        // Basic URL regex
        const urlPattern = /^(https?:\/\/[^\s/$.?#].[^\s]*)$/i;
        if (typeof value === 'string' && urlPattern.test(value)) {
            // Safe target blank
            return `<a href="${value}" target="_blank" rel="noopener noreferrer">Click to Open</a>`;
        }
        return value;
    }

    /**
     * NEW: Helper function to display/hide validation messages.
     */
    const showValidationMessage = (message) => {
        if (message) {
            dateValidationMessageBox.textContent = message;
            dateValidationMessageBox.classList.add('active');
        } else {
            dateValidationMessageBox.textContent = '';
            dateValidationMessageBox.classList.remove('active');
        }
    };

    // When showing the data viewer modal
    function openDataViewerModal() {
        document.body.classList.add('modal-open');
        dataViewerModal.classList.add('active');
        fetchExtensions(); // Existing call
        setupFilterListeners();
    }
    /**
     * NEW: Helper function to reset and close the data modal.
     */
    const closeDataModal = () => {
        document.body.classList.remove('modal-open');
        dataViewerModal.classList.remove('active');
        // Reset controls and state for next opening
        extensionSelect.innerHTML = '<option value="" disabled selected>Loading Extensions...</option>';
        extensionSelect.disabled = true;
        fromDateInput.value = '';
        toDateInput.value = '';
        fromDateInput.disabled = true;
        toDateInput.disabled = true;
        applyDataBtn.disabled = true;

        // Hide result states and validation message
        dataDisplayState.classList.add('hidden');
        dataErrorState.classList.add('hidden');
        dataSheetsContainer.innerHTML = '';
        showValidationMessage(null); // Clear validation message
    };

    /**
     * NEW: Function to show a specific data modal state.
     */
    const showDataModalState = (stateId) => {
        const states = [dataLoadingState, dataDisplayState, dataErrorState];
        states.forEach(state => {
            if (state.id === stateId) {
                state.classList.remove('hidden');
                state.classList.add('active');
            } else {
                state.classList.add('hidden');
                state.classList.remove('active');
            }
        });

        // When showing a non-loading/non-error state, ensure the controls are visually active
        if (stateId === 'data-display-state') {
            dataLoadingState.classList.add('hidden');
        }
    };

    // --- CORE DATA RENDERING LOGIC ---

    /**
 * Dynamically generates an HTML table for a nested array of objects (e.g., Product Details).
 * @param {string} key - The title for the nested section (e.g., "Product Details").
 * @param {Array<Object>} nestedArray - The array of objects to render.
 * @returns {string} The HTML string for the table section.
 */
    const renderNestedTable = (key, nestedArray) => {
        if (!nestedArray || nestedArray.length === 0) return '';

        // 1. Group all unique keys (column headers) from all objects
        let allKeys = new Set();
        nestedArray.forEach(obj => {
            Object.keys(obj).forEach(k => allKeys.add(k));
        });

        const headers = Array.from(allKeys);

        // 2. Build the Table Header (<thead>)
        const headerRow = headers.map(h => `<th>${h}</th>`).join('');
        const tableHeader = `<thead><tr>${headerRow}</tr></thead>`;

        // 3. Build the Table Body (<tbody>)
        const tableBodyRows = nestedArray.map(item => {
            const cells = headers.map(header => {
                const value = item[header] !== undefined ? item[header] : '-';
                // Use a class for potential number alignment/styling
                const cellClass = typeof value === 'number' ? 'data-numeric' : '';
                return `<td class="${cellClass}">${value}</td>`;
            }).join('');
            return `<tr>${cells}</tr>`;
        }).join('');

        const tableBody = `<tbody>${tableBodyRows}</tbody>`;

        // 4. Assemble the final HTML structure
        return `
        <div class="product-details-section">
            <h4 class="section-title">${key}</h4>
            <table class="product-details-table">
                ${tableHeader}
                ${tableBody}
            </table>
        </div>
    `;
    };

    /**
 * Function to render the data into mobile-friendly cards,
 * automatically detecting and rendering nested arrays as tables.
 */
    const renderDataCards = (sheetKey, data) => {
        // Handle empty or invalid data
        if (!Array.isArray(data) || data.length === 0) {
            return `<p class="no-data-message">No Data Found for ${sheetNameMap[sheetKey] || sheetKey}.</p>`;
        }

        // --- Expense Logic Removed: notPaidTotalHtml is no longer needed ---

        // Get all keys excluding IDs
        const keys = Object.keys(data[0] || {}).filter(key => key !== 'tId' && key !== 'docId');

        const cardsHtml = data.map((item) => {
            let rowsHtml = ''; // Initialize mutable string to build the card content

            keys.forEach(key => {
                const formattedKey = key.replace(/_/g, ' ');

                // Get the value: check for nested 'value' property or direct value
                let rawValue = item[key];
                const value = rawValue && typeof rawValue === 'object' && 'value' in rawValue
                    ? rawValue.value
                    : rawValue;

                // -----------------------------------------------------------------
                // 1. ARRAY DETECTION & TABLE RENDERING (Nested Array Logic)
                // -----------------------------------------------------------------
                const nestedArray = Array.isArray(value) ? value : null;

                if (nestedArray) {
                    // If it's a nested array (like "Product Details"), render the full table and stop.
                    rowsHtml += renderNestedTable(key, nestedArray);
                    return; // Skip the rest of the loop for this key
                }
                // -----------------------------------------------------------------

                // 2. STANDARD ROW RENDERING (Original Logic Continued)
                const displayValue = value === null || value === undefined || value === '' ? '-' : value;

                // --- Expense Logic Removed: isNotPaid calculation is gone ---
                const valueClass = ''; // No special class needed now

                // Format Date objects for display
                let finalDisplayValue = displayValue;

                if (displayValue && typeof displayValue === "string") {
                    finalDisplayValue = formatIfUrl(displayValue);
                }

                if (key === 'Date' && displayValue !== '-') {
                    try {
                        finalDisplayValue = new Date(displayValue).toLocaleDateString('en-GB', {
                            day: '2-digit', month: 'short', year: 'numeric'
                        });
                    } catch (e) {
                        finalDisplayValue = displayValue; // Fallback
                    }
                }

                // Append the standard row HTML
                rowsHtml += `
                <div class="data-row">
                    <span class="data-label">${formattedKey}:</span>
                    <span class="data-value ${valueClass}">${finalDisplayValue}</span>
                </div>
            `;
            });

            return `<div class="data-card">${rowsHtml}</div>`;
        }).join('');

        // Combine cards (Expense total footer is removed from here)
        return `<div class="data-table-card-view">${cardsHtml}</div>`;
    };

    /**
     * NEW: Function to handle dropdown sheet switching.
     */
    const switchSheet = (sheetKey) => {
        // Deactivate all sheets
        document.querySelectorAll('.sheet-content').forEach(content => content.classList.add('hidden'));

        // Activate the selected sheet
        const targetSheet = document.getElementById(`sheet-${sheetKey}`);
        if (targetSheet) {
            targetSheet.classList.remove('hidden');
        }
    }

    // --- MAIN API AND CONTROL LOGIC ---

    /**
     * NEW: STEP 3: Fetch the Final View Data.
     * API ENDPOINT UPDATED: 'common/view-dates' -> 'common/view-data'
     */
    const fetchViewData = async (exId, fromDate, toDate) => {
        const userDetails = getUserDetails();
        if (!userDetails || !userDetails.id) return;

        showDataModalState('data-loading-state');
        document.querySelector('#data-loading-state p').textContent = 'Fetching detailed reports...';
        showValidationMessage(null);

        try {
            // 🚀 API CALL WITH CORRECTED ENDPOINT
            const response = await apiFetch('common/view-data', 'POST', {
                empId: userDetails.id,
                exId: exId,
                fromDate: fromDate,
                toDate: toDate
            });

            if (response.success) {
                allSheetData = response.data;
                console.log(allSheetData);
                sheetSelect.innerHTML = '';
                dataSheetsContainer.innerHTML = '';
                let firstSheetKey = null;

                const sheetKeys = Object.keys(allSheetData);
                if (sheetKeys.length === 0 || sheetKeys.every(key => allSheetData[key].length === 0)) {
                    dataErrorMessage.textContent = 'No data found for the selected extension and date range.';
                    return showDataModalState('data-error-state');
                }

                sheetKeys.forEach(sheetKey => {
                    const sheetData = allSheetData[sheetKey];
                    const friendlyName = sheetNameMap[sheetKey] || sheetKey;

                    if (sheetData.length > 0) {
                        if (!firstSheetKey || sheetKey === 'tourplan') firstSheetKey = sheetKey;
                    }

                    // 1. Create Dropdown Option
                    const option = document.createElement('option');
                    option.value = sheetKey;
                    option.textContent = friendlyName;
                    sheetSelect.appendChild(option);

                    // 2. Create Sheet Content (Mobile-Optimized Cards)
                    const sheetContent = document.createElement('div');
                    sheetContent.id = `sheet-${sheetKey}`;
                    sheetContent.className = 'sheet-content hidden';
                    sheetContent.innerHTML = renderDataCards(sheetKey, sheetData);
                    dataSheetsContainer.appendChild(sheetContent);
                });

                showDataModalState('data-display-state');

                if (firstSheetKey) {
                    sheetSelect.value = firstSheetKey;
                    switchSheet(firstSheetKey);
                } else if (sheetKeys.length > 0) {
                    sheetSelect.value = sheetKeys[0];
                    switchSheet(sheetKeys[0]);
                }

            } else {
                dataErrorMessage.textContent = response.message || 'Failed to fetch detailed reports.';
                showDataModalState('data-error-state');
            }

        } catch (error) {
            console.error('API Error during view data check:', error);
            dataErrorMessage.textContent = 'A network error occurred while fetching reports.';
            showDataModalState('data-error-state');
        }
    };

    /**
  * Checks if the Extension and AT LEAST the From Date are selected.
  * Enables/Disables the Apply button accordingly.
  */
    const checkFilterValidity = () => {
        // Check 1: Extension must be selected.
        const isExtensionSelected = extensionSelect && extensionSelect.value;
        // Check 2: From Date MUST be selected (using the hidden ISO field).
        const isFromDateSelected = fromDateIsoInput && fromDateIsoInput.value;

        // Button is enabled if an extension and AT LEAST the From Date are selected.
        if (isExtensionSelected && isFromDateSelected) {
            applyDataBtn.disabled = false;
        } else {
            applyDataBtn.disabled = true;
        }
    };
    /**
 * Attaches all necessary listeners to the filter controls.
 */
    const setupFilterListeners = () => {
        // Attach validation listener to all relevant change events.
        // The datepicker's 'onSelect' should trigger the 'change' event on these inputs.
        if (fromDateInput) fromDateInput.addEventListener('change', checkFilterValidity);
        if (toDateInput) toDateInput.addEventListener('change', checkFilterValidity);
        if (extensionSelect) extensionSelect.addEventListener('change', checkFilterValidity);

        // Final click listener for the APPLY button
        if (applyDataBtn) {
            applyDataBtn.addEventListener('click', (e) => {
                e.preventDefault();

                // Re-run validation just in case
                checkFilterValidity();

                if (!applyDataBtn.disabled) {
                    // Read values from the ISO fields for the API call
                    const extensionId = extensionSelect.value;
                    const fromDateISO = fromDateIsoInput.value;
                    const toDateISO = toDateIsoInput.value;

                    // -----------------------------------------------------------
                    // 1. DATE COMPARISON VALIDATION (NEW LOGIC) 🛑
                    // -----------------------------------------------------------
                    if (toDateISO) {
                        // If the user selected a To Date, we must check the order.
                        // Since ISO dates (YYYY-MM-DD) are alphabetically sortable, 
                        // a simple string comparison works perfectly.
                        if (fromDateISO > toDateISO) {
                            // Assuming showValidationMessage is defined elsewhere
                            showValidationMessage("Error: The 'From Date' cannot be after the 'To Date'. Please correct your date range.");
                            return; // STOP the request
                        }
                    }

                    // CRITICAL CHECK: Handles the "No Tour Plan Data" scenario
                    if (validTourDates.length === 0) {
                        // Assuming showValidationMessage is defined elsewhere
                        showValidationMessage("The current extension has no tour dates available in the system. Please select a different extension.");
                        return;
                    }

                    // Final Check: Ensure the ISO fields are populated
                    if (!fromDateISO) {
                        showValidationMessage("Please select valid dates from the tour plan calendar.");
                        return;
                    }

                    // Conditional: Only add 'toDate' if the user selected a value.
                    if (toDateISO) {
                        fetchViewData(extensionId, fromDateISO, toDateISO);
                        console.log('APPLY CLICKED: Fetching data for Range:', fromDateISO, 'to', toDateISO);
                    } else {
                        fetchViewData(extensionId, fromDateISO);
                        console.log('APPLY CLICKED: Fetching data for Single Day:', fromDateISO);
                    }
                }
            });
        }

        // Initialize the button state on page load/modal open
        checkFilterValidity();
    };
    /**
 * NEW: Disables all dates in the calendar EXCEPT those found in the tour plan.
 * @param {Array<string>} dates - Array of valid tour plan dates (e.g., ['2025-10-22', '2025-10-25']).
 */
    const initializeDatepickers = (dates) => {
        // 1. Convert YYYY-MM-DD strings to a faster-lookup Set of strings
        const validDateSet = new Set(dates);

        // 2. Define the callback function required by jQuery UI
        const enableTourDates = (date) => {
            // Use a function to format the Date object into a clean YYYY-MM-DD string
            const year = date.getFullYear();
            // JavaScript months are 0-indexed (0=Jan, 11=Dec). Add 1 and pad.
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');

            // This MUST match the format of the validTourDates array
            const formattedDate = `${year}-${month}-${day}`;

            // Check if the formatted date exists in our set
            const isEnabled = validDateSet.has(formattedDate);

            // Return [is_enabled, css_class_name, tooltip_text]
            return [isEnabled, isEnabled ? 'tour-date-available' : 'tour-date-unavailable', ''];
        };

        // 3. Initialize Datepickers with Alt Fields
        $("#from-date-input, #to-date-input").datepicker("destroy");

        const commonDatepickerOptions = {
            // VISIBLE FORMAT: DD-MM-YYYY
            dateFormat: "dd-mm-yy",
            // INTERNAL/API FORMAT: YYYY-MM-DD (stored in hidden fields)
            altFormat: "yy-mm-dd",

            changeMonth: true,
            changeYear: true,
            minDate: dates.length > 0 ? new Date(dates[0]) : null,
            maxDate: dates.length > 0 ? new Date(dates[dates.length - 1]) : null,
            beforeShowDay: enableTourDates,
            onSelect: function (dateText, inst) {
                $(this).trigger('change');
                checkFilterValidity();
            }
        };

        $("#from-date-input").datepicker({
            ...commonDatepickerOptions,
            altField: "#from-date-iso" // Links to your hidden ISO field
        });

        $("#to-date-input").datepicker({
            ...commonDatepickerOptions,
            altField: "#to-date-iso"   // Links to your hidden ISO field
        });

        // Re-enable the inputs after initialization
        fromDateInput.disabled = false;
        toDateInput.disabled = false;
    };

    /**
     * NEW: STEP 2: Fetch Valid Tour Dates for the selected extension.
     */
    const fetchTourDates = async (exId) => {
        // Clear previous state
        fromDateInput.value = '';
        toDateInput.value = '';
        fromDateInput.disabled = true;
        toDateInput.disabled = true;
        applyDataBtn.disabled = true;
        showValidationMessage(null);

        document.querySelector('#data-loading-state p').textContent = 'Fetching available dates...';
        showDataModalState('data-loading-state');

        try {
            const response = await apiFetch('common/fetch-tour-plan-dates', 'POST', { exId: exId });

            dataLoadingState.classList.add('hidden');

            if (response.success && response.data && Array.isArray(response.data.tourDates)) {
                // Sort dates to ensure min/max works correctly
                validTourDates = response.data.tourDates.sort();

                if (validTourDates.length > 0) {
                    // Call the new initialization function
                    initializeDatepickers(validTourDates);

                } else {
                    showValidationMessage('No tour plan dates found for this extension. Please select another extension.');
                }
            } else {
                showValidationMessage(response.message || 'Failed to fetch tour dates. Try again.');
            }
        } catch (error) {
            console.error('API Error during date check:', error);
            showValidationMessage('A network error occurred while fetching dates.');
            dataLoadingState.classList.add('hidden');
        }
    };

    /**
     * STEP 1: Fetch and Populate Extensions.
     * API ENDPOINT UPDATED: 'employee/fetchFormDependencies' -> 'employee/fetch-form-dependencies'
     */
    const fetchExtensions = async () => {
        const userDetails = getUserDetails();
        if (!userDetails || !userDetails.hqId) {
            dataErrorMessage.textContent = 'User HQ ID is missing. Cannot fetch extensions.';
            return showDataModalState('data-error-state');
        }

        // Reset controls
        extensionSelect.innerHTML = '<option value="" disabled selected>Loading Extensions...</option>';
        extensionSelect.disabled = true;
        fromDateInput.disabled = true;
        toDateInput.disabled = true;
        applyDataBtn.disabled = true;
        showValidationMessage(null);

        document.querySelector('#data-loading-state p').textContent = 'Fetching extensions and dependencies...';
        showDataModalState('data-loading-state');

        try {
            // 🚀 API CALL WITH CORRECTED ENDPOINT
            const response = await apiFetch('employee/fetch-form-dependencies', 'POST', {
                formName: 'tourplan',
                hqId: userDetails.hqId
            });

            // Stop the loading state after API call completes (Fix for Point 1)
            dataLoadingState.classList.add('hidden');

            if (response.success && response.data && Array.isArray(response.data.extensions)) {

                extensionSelect.innerHTML = '<option value="" disabled selected>Select Extension Name</option>';
                response.data.extensions.forEach(ext => {
                    const option = document.createElement('option');
                    option.value = ext.exId;
                    option.textContent = ext.extensionName;
                    option.setAttribute('data-exid', ext.exId);
                    extensionSelect.appendChild(option);
                });
                extensionSelect.disabled = false;

            } else {
                dataErrorMessage.textContent = response.message || 'No extensions found for your HQ.';
                showDataModalState('data-error-state');
            }
        } catch (error) {
            console.error('API Error during extension fetch:', error);
            dataErrorMessage.textContent = 'A network error occurred while fetching extensions.';
            showDataModalState('data-error-state');
        }
    };

    // --- EVENT LISTENERS ---

    // 1. View Data Button Click (Initiates the process)
    if (viewDataBtn) {
        viewDataBtn.addEventListener('click', openDataViewerModal);
    }

    // 2. Extension Selection Change (Triggers date fetch)
    extensionSelect.addEventListener('change', (e) => {
        const selectedExId = e.target.value;
        // Reset date inputs before fetching new dates
        fromDateInput.value = '';
        toDateInput.value = '';
        if (selectedExId) {
            fetchTourDates(selectedExId);
        }
        validateDates(); // Run validation to update button state
    });

    /**
     * Date Input Validation and Apply Button Control (Handles validation messages).
     */
    const validateDates = () => {
        const fromDate = fromDateInput.value;
        const toDate = toDateInput.value;
        const isValidTourDate = (date) => validTourDates.includes(date);

        applyDataBtn.disabled = true;
        showValidationMessage(null); // Clear previous message

        if (!extensionSelect.value) {
            showValidationMessage('Selection Required: Please select an Extension Name first.');
            return;
        }

        if (fromDate && !isValidTourDate(fromDate)) {
            showValidationMessage('Invalid Date: "From Date" is not a recorded Tour Plan date.');
            return;
        }

        if (toDate) {
            if (!isValidTourDate(toDate)) {
                showValidationMessage('Invalid Date: "To Date" is not a recorded Tour Plan date.');
                return;
            }
            if (new Date(toDate) < new Date(fromDate)) {
                showValidationMessage('Date Range Error: "To Date" cannot be before "From Date".');
                return;
            }
        }

        // If From Date is selected and valid (single day or start of range)
        if (fromDate && isValidTourDate(fromDate)) {
            applyDataBtn.disabled = false;
        } else if (!fromDate && extensionSelect.value && !fromDateInput.disabled) {
            // Show error if extension is picked but date is missing
            showValidationMessage('Selection Required: Please select a "From Date".');
        }
    };

    fromDateInput.addEventListener('change', validateDates);
    toDateInput.addEventListener('change', validateDates);

    // 5. Sheet Dropdown Change 
    sheetSelect.addEventListener('change', (e) => {
        const selectedSheetKey = e.target.value;
        switchSheet(selectedSheetKey);
    });

    // 6. Data Modal Close
    dataViewerCloseBtn.addEventListener('click', closeDataModal);
    dataViewerModal.addEventListener('click', (e) => {
        if (e.target === dataViewerModal) {
            closeDataModal();
        }
    });

    // 7. Data Error Retry Button (Resets and attempts to fetch extensions again)
    dataRetryBtn.addEventListener('click', fetchExtensions);

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

            try {

                document.cookie = "jwt=; Expires=Thu, 01 Jan 1970 00:00:00 UTC; Path=/; SameSite=Lax";
                console.log('Client-side JWT cookie cleared.');

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

    const menuTrigger = document.getElementById('header-menu-trigger');
    const menu = document.getElementById('header-dropdown-menu');

    if (menuTrigger && menu) {
        // Function to toggle the menu state
        const toggleMenu = (e) => {
            // Stop propagation to prevent immediate document click listener from firing
            if (e) e.stopPropagation();
            const isExpanded = menuTrigger.getAttribute('aria-expanded') === 'true';

            menuTrigger.setAttribute('aria-expanded', !isExpanded);
            menu.classList.toggle('hidden', isExpanded); // Toggle 'hidden' class to show/hide

            // Accessibility focus management: focus on the first item when opening
            if (!isExpanded) {
                // Find the first focusable element (first link/button)
                const firstMenuItem = menu.querySelector('.menu-item');
                if (firstMenuItem) {
                    firstMenuItem.focus();
                }
            }
        };

        // 1. Toggle the menu visibility on button click
        menuTrigger.addEventListener('click', toggleMenu);

        // 2. Close menu when clicking anywhere else on the document (Outside Click)
        document.addEventListener('click', (e) => {
            // Check if menu is open AND the click target is NOT the menu AND NOT the trigger button
            if (!menu.classList.contains('hidden') && !menu.contains(e.target) && e.target !== menuTrigger) {
                // If true, close the menu
                menu.classList.add('hidden');
                menuTrigger.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // Initialize the dashboard on load
    loadUserDetails();
});