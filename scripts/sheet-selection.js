const joinMeetingBtn = document.getElementById('joinMeetingBtn');
const meetingModal = document.querySelector('#meetingModal'); // Changed to ID for clarity
const meetingModalCloseBtn = meetingModal.querySelector('.meeting-modal-close-btn'); // New selector
const gettingLinkState = document.getElementById('gettingLinkState');
const noMeetingState = document.getElementById('noMeetingState');
const meetingReadyState = document.getElementById('meetingReadyState');
const joinNowBtn = document.getElementById('joinNowBtn');


//Greet User
const greetHeading = document.querySelector('.heading-primary');
greetHeading.innerHTML=`Hello ${username}!<br>Select your Portal`

// Function to show a specific modal state (for meeting modal)
const showMeetingModalState = (stateId) => {
    gettingLinkState.classList.remove('active');
    noMeetingState.classList.remove('active');
    meetingReadyState.classList.remove('active');

    document.getElementById(stateId).classList.add('active');
};

// Handle button click to show the modal and fetch the link (Existing Code)
joinMeetingBtn.addEventListener('click', async () => {
    meetingModal.classList.add('active');
    showMeetingModalState('gettingLinkState');

    try {
        // Replace with your actual webhook URL
        const webhookUrl = 'https://citrix.app.n8n.cloud/webhook/meeting';
        const response = await fetch(webhookUrl);
        const data = await response.json();
        if (data.status === true) {
            joinNowBtn.href = data.meetingLink;
            showMeetingModalState('meetingReadyState');
        } else {
            showMeetingModalState('noMeetingState');
        }
    } catch (error) {
        console.error('Error fetching meeting link:', error);
        noMeetingState.querySelector('.modal-title').textContent = 'Error fetching link. Please try again.';
        showMeetingModalState('noMeetingState');
    }
});

// Handle meeting modal close button click
meetingModalCloseBtn.addEventListener('click', () => {
    meetingModal.classList.remove('active');
});

// Close meeting modal when clicking outside of it
meetingModal.addEventListener('click', (e) => {
    if (e.target === meetingModal) {
        meetingModal.classList.remove('active');
    }
});


// -------------------------------------------------------------------
// NEW CODE FOR DATA VIEWER MODAL - REVISED
// -------------------------------------------------------------------

const showDataBtn = document.getElementById('showDataBtn');
const dataViewerModal = document.getElementById('dataViewerModal');
const dataViewerCloseBtn = document.querySelector('.data-viewer-close-btn');
const dataLoadingState = document.getElementById('dataLoadingState');
const dataDisplayState = document.getElementById('dataDisplayState');
const dataErrorState = document.getElementById('dataErrorState');
const dataDateInput = document.getElementById('dataDate');
const sheetSelect = document.getElementById('sheetSelect');
const dataSheetsContainer = document.querySelector('.data-sheets-container');

// Map JSON keys to user-friendly sheet names - UPDATED
const sheetNameMap = {
    'tourPlan': 'Tour Plan',
    'doctorDetails': 'Doctor List',
    'targetDoctors': 'Targeted Doctors',
    'conversionDetails': 'Conversion Details',
    'orders': 'Orders',
    'Expenses': 'Expenses' // ADDED NEW SHEET
};

// Storage for the fetched data
let allSheetData = {};
// Function to format YYYY-MM-DD to DD-MM-YYYY for webhook
const formatWebhookDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
}

// Function to show a specific data modal state
const showDataModalState = (stateId) => {
    dataLoadingState.classList.remove('active');
    dataDisplayState.classList.remove('active');
    dataErrorState.classList.remove('active');
    document.getElementById(stateId).classList.add('active');
}

// Function to handle dropdown sheet switching
const switchSheet = (sheetKey) => {
    // Deactivate all sheets
    document.querySelectorAll('.sheet-content').forEach(content => content.classList.remove('active'));

    // Activate the selected sheet
    const targetSheet = document.getElementById(`sheet-${sheetKey}`);
    if (targetSheet) {
        targetSheet.classList.add('active');
    }
}

// Function to render the data into mobile-friendly cards
const renderDataCards = (sheetKey, data) => {
    // --- FIX: Robust check for empty data array or an array containing only an empty object [{}] ---
    const isEmpty = data.length === 0 || (data.length === 1 && Object.keys(data[0]).length === 0);

    if (isEmpty) {
        return `<p class="no-data-message">No Data Found for ${sheetNameMap[sheetKey]}.</p>`;
    }
    // ------------------------------------------------------------------------------------------------

    // 1. Calculate Not Paid Total for 'Expenses' sheet only
    let notPaidTotalHtml = '';
    if (sheetKey === 'Expenses') {
        const total = data.reduce((sum, item) => {
            // Check if Payment Status is 'Not Paid' and Total is a valid number
            if (item['Payment Status'] === 'Not Paid') {
                const totalValue = parseFloat(item['Total']);
                // Use isFinite for a robust check against NaN, Infinity, etc.
                if (isFinite(totalValue)) {
                    return sum + totalValue;
                }
            }
            return sum;
        }, 0);

        // Format total to two decimal places
        const formattedTotal = total.toFixed(2);

        notPaidTotalHtml = `
            <div class="expense-total-footer">
                <span class="expense-total-label">Not Paid Total:</span>
                <span class="expense-total-amount">₹ ${formattedTotal}</span>
            </div>
        `;
    }

    // Filter out row_number and Date fields
    const dataWithoutMeta = data.map(item => {
        const newItem = { ...item };
        delete newItem['row_number'];
        delete newItem['Date'];
        return newItem;
    });

    // Use keys from the first object to generate card labels
    const keys = Object.keys(dataWithoutMeta[0]);

    const cardsHtml = dataWithoutMeta.map((item, index) => {
        // Create an array of key-value rows for each item/row
        const rows = keys.map(key => {
            const formattedKey = key.replace(/_/g, ' ');
            const value = item[key] === null || item[key] === undefined || item[key] === '' ? '-' : item[key];

            // Check for file links (simple check for 'Copy' in key name and 'link' in value)
            const isLink = (key === 'Prescription Copy' || key === 'DL Copy');

            const displayValue = isLink
                ? `<a href="${value}" target="_blank" class="data-link-value">Click to View</a>`
                : value;

            // Highlight 'Not Paid' status
            const valueClass = (sheetKey === 'Expenses' && key === 'Payment Status' && value === 'Not Paid') ? 'data-value-highlight' : '';

            return `
                <div class="data-row">
                    <span class="data-label">${formattedKey}:</span>
                    <span class="data-value ${valueClass}">${displayValue}</span>
                </div>
            `;
        }).join('');

        return `<div class="data-card">
            ${rows}
        </div>`;
    }).join('');

    // Combine cards and the optional total footer
    return `<div class="data-table-card-view">${cardsHtml}</div> ${notPaidTotalHtml}`;
}


// Main data fetching function
const fetchDataAndRender = async (dateISO) => {
    dataViewerModal.classList.add('active');
    showDataModalState('dataLoadingState');

    const formattedDate = formatWebhookDate(dateISO); // DD-MM-YYYY format for backend

    const webhookUrl = 'https://citrix.app.n8n.cloud/webhook/citrix-admin'; // Replace with your actual URL

    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                date: formattedDate,
                docId: docId
            })
        });

        const data = await response.json();

        if (!data || data.length === 0) {
            return showDataModalState('dataErrorState');
        }

        // Store data globally and reset UI
        allSheetData = {};
        sheetSelect.innerHTML = '';
        dataSheetsContainer.innerHTML = '';
        let firstSheetKey = null;

        // Populate global data storage and the dropdown
        data.forEach(sheetObject => {
            const sheetKey = Object.keys(sheetObject)[0];
            const sheetData = sheetObject[sheetKey];
            const friendlyName = sheetNameMap[sheetKey] || sheetKey;

            allSheetData[sheetKey] = sheetData;
            // Prioritize Expenses to be the first displayed if present
            if (!firstSheetKey || sheetKey === 'Expenses') firstSheetKey = sheetKey;

            // 1. Create Dropdown Option
            const option = document.createElement('option');
            option.value = sheetKey;
            option.textContent = friendlyName;
            sheetSelect.appendChild(option);

            // 2. Create Sheet Content (Mobile-Optimized Cards)
            const sheetContent = document.createElement('div');
            sheetContent.id = `sheet-${sheetKey}`;
            sheetContent.className = 'sheet-content';
            sheetContent.innerHTML = renderDataCards(sheetKey, sheetData);
            dataSheetsContainer.appendChild(sheetContent);
        });

        // This sorting step ensures 'Expenses' is the first option in the dropdown if available
        const options = Array.from(sheetSelect.options);
        options.sort((a, b) => {
            if (a.value === 'Expenses') return -1;
            if (b.value === 'Expenses') return 1;
            return 0;
        });
        sheetSelect.innerHTML = '';
        options.forEach(option => sheetSelect.appendChild(option));

        showDataModalState('dataDisplayState');

        // Select the determined first sheet and display its content
        if (firstSheetKey) {
            sheetSelect.value = firstSheetKey;
            switchSheet(firstSheetKey);
        }

    } catch (error) {
        console.error('Error fetching data:', error);
        dataErrorState.querySelector('.error-message').textContent = 'An error occurred while fetching data. Please try again.';
        showDataModalState('dataErrorState');
    }
}

// 1. Initial date setup: Today's date
const today = new Date();
const todayISO = today.toISOString().split('T')[0]; // YYYY-MM-DD for input value
dataDateInput.value = todayISO;

// 2. Event Listener for 'Show my Data' button click
showDataBtn.addEventListener('click', () => {
    // Fetch data for the currently selected date in the input field
    const selectedDateISO = dataDateInput.value;
    fetchDataAndRender(selectedDateISO);
});

// 3. Event Listener for date input change (auto-fetch)
dataDateInput.addEventListener('change', (e) => {
    const newSelectedDateISO = e.target.value;
    fetchDataAndRender(newSelectedDateISO);
});

// 4. Event Listener for sheet dropdown change
sheetSelect.addEventListener('change', (e) => {
    const selectedSheetKey = e.target.value;
    switchSheet(selectedSheetKey);
});

// 5. Close Data Viewer Modal
dataViewerCloseBtn.addEventListener('click', () => {
    dataViewerModal.classList.remove('active');
});

// Close modal when clicking outside of it
dataViewerModal.addEventListener('click', (e) => {
    if (e.target === dataViewerModal) {
        dataViewerModal.classList.remove('active');
    }
});