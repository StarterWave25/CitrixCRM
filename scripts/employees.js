// CHANGELOG: Implemented dynamic tab/column generation and 'Expenses' sheet processing with 'Not Paid Total' calculation.

document.addEventListener('DOMContentLoaded', async () => {
    await getEmployees();

    const employeeCards = document.querySelectorAll('.employee-card');
    const modalOverlay = document.getElementById('employeeModal');
    const modalCloseBtn = document.querySelector('.modal-close-btn');
    const modalEmployeeName = document.getElementById('modalEmployeeName');
    const modalDateInput = document.getElementById('modalDateInput');
    // tabButtons and tabContents are now generated dynamically, so selectors for initial elements are removed/updated
    const loadingOverlay = document.getElementById('loadingOverlay');

    const startMeetingBtn = document.getElementById('startMeetingBtn');
    const joinMeetingBtn = document.getElementById('joinMeetingBtn');
    const meetingModal = document.getElementById('meetingModal');
    const meetingForm = document.getElementById('meetingForm');
    const startTimeInput = document.getElementById('startTime');
    const endTimeInput = document.getElementById('endTime');

    // Meeting modal states
    const meetingFormContainer = document.getElementById('meetingFormContainer');
    const loadingState = document.getElementById('loadingState');
    const successState = document.getElementById('successState');
    const gettingLinkState = document.getElementById('gettingLinkState');
    const noMeetingState = document.getElementById('noMeetingState');
    const meetingReadyState = document.getElementById('meetingReadyState');
    const joinNowBtn = document.getElementById('joinNowBtn');

    const meetingModalCloseBtn = meetingModal.querySelector('.modal-close-btn');

    let allEmployeeData = null; // Variable to store all fetched data

    async function getEmployees() {
        let allEmployeeData = await getEmployeesDetails();
        if (!allEmployeeData) {
            return;
        }
        let employeesHTML = '';
        if (allEmployeeData) {
            allEmployeeData.forEach((employee) => {
                employeesHTML += `<div class="employee-card" data-employee-id="${employee.doc_id}">
                    <p class="employee-name">${employee.username}</p>
                </div>`;
            });
        }
        document.querySelector('.employee-grid').innerHTML = employeesHTML;
    }

    async function getEmployeesDetails() {
        let req = await fetch('../data/get-users.php');
        let res = await req.json();

        if (res == null) {
            document.querySelector('.employee-grid').innerHTML = "<h2>Employees Not Found</h2>";
            return false;
        }
        return res;
    }

    // Function to show and hide loading overlay
    const showLoading = () => {
        loadingOverlay.classList.add('active');
    };

    const hideLoading = () => {
        loadingOverlay.classList.remove('active');
    };

    // Helper function to format date to DD-MM-YYYY
    const formatDate = (dateString) => {
        const [year, month, day] = dateString.split('-');
        return `${day}-${month}-${year}`;
    };

    // Helper function to get current time in ISO 8601 format
    const getCurrentISOTime = (timeString) => {
        const now = new Date();
        const [hours, minutes] = timeString.split(':');
        now.setHours(hours, minutes, 0, 0);

        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const milliseconds = String(now.getMilliseconds()).padStart(3, '0');
        const timezoneOffset = -now.getTimezoneOffset();
        const offsetHours = String(Math.floor(Math.abs(timezoneOffset) / 60)).padStart(2, '0');
        const offsetMinutes = String(Math.abs(timezoneOffset) % 60).padStart(2, '0');
        const offsetSign = timezoneOffset >= 0 ? '+' : '-';
        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}${offsetSign}${offsetHours}:${offsetMinutes}`;
    };

    // Helper to coerce value to a number safely
    const coerceToNumber = (value) => {
        // Stringify, remove non-numeric chars except digits, period, and leading minus sign, then parse.
        const n = Number(String(value).replace(/[^\d.-]+/g, ''));
        return Number.isFinite(n) ? n : 0;
    };

    // Helper to generate human-friendly labels from object keys
    const normalizeLabel = (key) => {
        // Replace underscores/camelCase with space and convert to Title Case
        const spaced = key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ');
        // Capitalize the first letter of each word
        return spaced.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ').trim();
    };

    // Function to calculate 'Not Paid Total' for Expenses sheet
    const calculateExpensesTotal = (expensesData) => {
        let notPaidTotal = 0;
        let finalData = [...expensesData];

        // Check if the last element is the summary object and remove it before calculation
        const lastItem = finalData[finalData.length - 1];
        if (lastItem && Object.keys(lastItem)[0] === 'Not Paid Total') {
            finalData.pop();
        }

        finalData.forEach(row => {
            if (row['Payment Status'] && String(row['Payment Status']).trim().toLowerCase() === 'not paid') {
                const total = row['Total'];
                notPaidTotal += coerceToNumber(total);
            }
        });

        // Append or replace the summary object
        finalData.push({ 'Not Paid Total': notPaidTotal });

        return finalData;
    };


    const populateTable = (tableBody, data) => {
        tableBody.innerHTML = '';

        // Check if data is an array and if any of its items are not empty objects
        const hasData = data && data.length > 0 && data.some(item => Object.keys(item).length > 0);

        if (hasData) {
            // Determine keys from the first non-summary row
            const standardRows = data.filter(item => Object.keys(item)[0] !== 'Not Paid Total');
            const keys = standardRows.length > 0
                ? Object.keys(standardRows[0]).filter(key => key !== 'row_number' && key !== 'Date')
                : [];

            data.forEach(item => {
                const isSummaryRow = Object.keys(item)[0] === 'Not Paid Total';

                const tr = document.createElement('tr');
                if (isSummaryRow) {
                    // Special styling for the summary row
                    tr.classList.add('summary-row');
                }

                if (isSummaryRow) {
                    // Summary Row Logic
                    const tdKey = document.createElement('td');
                    // Span across all columns minus the two we are using (key label + total value)
                    // keys.length is the number of standard data columns
                    tdKey.colSpan = keys.length > 0 ? keys.length - 1 : 1;
                    tdKey.textContent = normalizeLabel(Object.keys(item)[0]);
                    tdKey.style.fontWeight = 'bold';
                    tdKey.style.textAlign = 'right';
                    tr.appendChild(tdKey);

                    const tdValue = document.createElement('td');
                    tdValue.textContent = item['Not Paid Total'].toFixed(2); // Display total with 2 decimal places
                    tdValue.style.fontWeight = 'bold';
                    tr.appendChild(tdValue);

                } else {
                    // Standard Row Logic
                    keys.forEach(key => {
                        const cellData = item[key];
                        const td = document.createElement('td');

                        if (key === 'DL Copy' || key === 'Prescription Copy') {
                            // Create an anchor tag for DL Copy and Prescription Copy
                            if (cellData) {
                                const a = document.createElement('a');
                                a.href = cellData;
                                a.textContent = 'Click to View';
                                a.target = '_blank';
                                td.appendChild(a);
                            } else {
                                td.textContent = 'N/A';
                            }
                        } else {
                            td.textContent = cellData;
                            td.title = cellData;
                            td.classList.add('ellipsis');
                        }
                        tr.appendChild(td);
                    });
                }
                tableBody.appendChild(tr);
            });
        } else {
            // Fallback for no data
            tableBody.innerHTML = `<tr><td colspan="100%" style="text-align: center; color: var(--gray-text);">No data available.</td></tr>`;
        }
    };

    const updateTableHeaders = (table, data) => {
        const thead = table.querySelector('thead tr');
        thead.innerHTML = '';

        if (data && data.length > 0) {
            // Use keys from the first row to determine headers
            const keys = Object.keys(data[0]).filter(key => key !== 'row_number' && key !== 'Date');

            keys.forEach(key => {
                const th = document.createElement('th');
                th.textContent = normalizeLabel(key);
                thead.appendChild(th);
            });
            // If it's the Expenses tab (checked via active tab later), we need two extra headers for the summary row.
            // However, since we cannot easily know the tab here, we rely on the logic in updateTabContent to handle the summary row structure.
            // The populateTable function handles the dynamic column count for the summary row via colspan.
        }
    };


    const updateTabContent = () => {
        const activeTab = document.querySelector('.tab-btn.active').dataset.tab;
        let dataForTab = null;
        let tabIndex = -1;

        if (!allEmployeeData) {
            return;
        }

        // Find the data object corresponding to the active tab key
        allEmployeeData.forEach((sheetObj, index) => {
            const sheetKey = Object.keys(sheetObj)[0];
            if (sheetKey === activeTab) {
                dataForTab = sheetObj[sheetKey];
                tabIndex = index;
            }
        });

        if (!dataForTab) {
            dataForTab = [];
        }

        // Processing for the "Expenses" sheet
        if (activeTab === 'Expenses') {
            dataForTab = calculateExpensesTotal(dataForTab);
            // Update the original data array with the calculated total for persistence
            allEmployeeData[tabIndex]['Expenses'] = dataForTab;
        }

        const table = document.querySelector(`#${activeTab} .data-table`);
        const tableBody = table.querySelector('tbody');

        // Headers are now derived from the data itself, excluding the summary row
        const standardData = dataForTab.filter(item => Object.keys(item)[0] !== 'Not Paid Total');

        // We use the standard data for header generation
        if (standardData.length > 0) {
            updateTableHeaders(table, standardData);
        } else {
            // If the sheet is empty, but we calculated a 'Not Paid Total' (only element),
            // we should show headers based on a possible empty row's structure if available,
            // or just clear them. Here we clear if there's no standard data.
            updateTableHeaders(table, []);
        }

        // The populateTable function handles the dynamic column rendering including the final summary row
        populateTable(tableBody, dataForTab);
    };

    // Function to dynamically generate tabs and tab content containers
    const renderTabsAndContent = () => {
        const modalTabsContainer = document.querySelector('.modal-tabs');
        const tabContentContainer = document.querySelector('.tab-content-container');

        // Clear existing tabs and content (if any hardcoded ones remain)
        modalTabsContainer.innerHTML = '';
        tabContentContainer.innerHTML = '';

        if (!allEmployeeData || allEmployeeData.length === 0) {
            return;
        }

        allEmployeeData.forEach((sheetObj, index) => {
            const sheetKey = Object.keys(sheetObj)[0];
            const sheetLabel = normalizeLabel(sheetKey);
            const isActive = index === 0;

            // 1. Create Tab Button
            const tabButton = document.createElement('button');
            tabButton.classList.add('tab-btn');
            if (isActive) tabButton.classList.add('active');
            tabButton.dataset.tab = sheetKey;
            tabButton.textContent = sheetLabel;
            modalTabsContainer.appendChild(tabButton);

            // 2. Create Tab Content Container
            const tabContent = document.createElement('div');
            tabContent.id = sheetKey;
            tabContent.classList.add('tab-content');
            if (isActive) tabContent.classList.add('active');

            // 3. Create Table structure inside content
            // The second TH in the header row is added/removed dynamically in updateTableHeaders/populateTable
            // to align with the colspan logic in the summary row.
            tabContent.innerHTML = `
                <table class="data-table">
                    <thead>
                        <tr></tr>
                    </thead>
                    <tbody></tbody>
                </table>
            `;
            tabContentContainer.appendChild(tabContent);
        });

        // Re-attach event listeners to the new tab buttons
        const newTabButtons = document.querySelectorAll('.tab-btn');
        newTabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                newTabButtons.forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
                document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
                document.getElementById(e.target.dataset.tab).classList.add('active');

                if (allEmployeeData) {
                    updateTabContent();
                }
            });
        });
    };


    const fetchData = async (employeeId, date) => {
        showLoading();
        modalOverlay.classList.add('active');

        try {
            const webhookUrl = 'https://citrix.app.n8n.cloud/webhook/citrix-admin';
            const requestBody = {
                id: employeeId,
                date: formatDate(date)
            };

            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            allEmployeeData = await response.json();
            // Call renderTabsAndContent before updateTabContent
            renderTabsAndContent();
            updateTabContent();

        } catch (error) {
            // Find the active tab content or just the main container for error message
            const mainContainer = document.querySelector('.tab-content-container');
            mainContainer.innerHTML = `<p style="text-align: center; color: red; padding: 40px;">Failed to load data. Please try again. Error: ${error.message}</p>`;
        } finally {
            hideLoading();
        }
    };

    // Function to show a specific modal state for the meeting modal
    const showMeetingModalState = (stateId) => {
        // Hide all states first
        meetingFormContainer.style.display = 'none';
        loadingState.classList.remove('active');
        successState.classList.remove('active');
        gettingLinkState.classList.remove('active');
        noMeetingState.classList.remove('active');
        meetingReadyState.classList.remove('active');

        // Show the requested state
        const targetElement = document.getElementById(stateId);
        if (targetElement) {
            if (stateId === 'meetingFormContainer') {
                targetElement.style.display = 'block';
            } else {
                targetElement.classList.add('active');
            }
        }
    };


    // Start Meeting button logic
    startMeetingBtn.addEventListener('click', () => {
        const now = new Date();
        const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        startTimeInput.value = currentTime;
        startTimeInput.min = currentTime;

        meetingModal.classList.add('active');
        showMeetingModalState('meetingFormContainer');
    });

    // Join Meeting button logic
    joinMeetingBtn.addEventListener('click', async () => {
        meetingModal.classList.add('active');
        showMeetingModalState('gettingLinkState');

        try {
            const webhookUrl = 'https://citrix.app.n8n.cloud/webhook/meeting';
            const response = await fetch(webhookUrl);
            const data = await response.json();

            if (!response.ok) {
                // Treat non-200 responses as an error leading to 'No Meetings Found' unless it's a specific error we want to display
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            if (data.status === true) {
                joinNowBtn.href = data.meetingLink;
                showMeetingModalState('meetingReadyState');
            } else {
                showMeetingModalState('noMeetingState');
            }
        } catch (error) {
            console.error('Error fetching meeting link:', error);
            // Optionally update the noMeetingState message for a more specific error
            noMeetingState.querySelector('.modal-title').textContent = 'Error fetching link. Please try again.';
            noMeetingState.querySelector('p').textContent = 'An error occurred while connecting to the server.';
            showMeetingModalState('noMeetingState');
        }
    });

    // Enforce time validation on user input
    startTimeInput.addEventListener('input', () => {
        const now = new Date();
        const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        if (startTimeInput.value < currentTime) {
            startTimeInput.value = currentTime;
        }
        if (startTimeInput.value && endTimeInput.value && startTimeInput.value > endTimeInput.value) {
            startTimeInput.value = endTimeInput.value;
        }
    });

    endTimeInput.addEventListener('input', () => {
        if (endTimeInput.value < startTimeInput.value) {
            endTimeInput.value = startTimeInput.value;
        }
    });

    meetingModalCloseBtn.addEventListener('click', () => {
        meetingModal.classList.remove('active');
    });

    meetingForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        showMeetingModalState('loadingState');

        const startingTimeISO = getCurrentISOTime(startTimeInput.value);
        const endingTimeISO = getCurrentISOTime(endTimeInput.value);

        try {
            const webhookUrl = 'https://citrix.app.n8n.cloud/webhook/create-meeting';
            const requestBody = {
                startingTime: startingTimeISO,
                endingTime: endingTimeISO,
            };

            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseData = await response.json();
            if (responseData) {
                document.querySelector('#successState .join-btn').href = responseData.link;
                showMeetingModalState('successState');
            }

        } catch (error) {
            console.error('Error creating meeting:', error);
            // Reset to form or show an error state
            alert('Failed to create meeting. Please check console for details.');
            showMeetingModalState('meetingFormContainer');
        }
    });

    // Event listener for employee cards is updated to handle dynamic tab generation
    // We must ensure this listener is attached only after getEmployees has run.
    document.querySelector('.employee-grid').addEventListener('click', (e) => {
        const card = e.target.closest('.employee-card');
        if (card) {
            const employeeId = card.dataset.employeeId;
            const employeeName = card.querySelector('.employee-name').textContent;

            modalEmployeeName.textContent = employeeName;

            document.querySelectorAll('.employee-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');

            // Tabs and content will be generated/updated in fetchData
            // Clear existing data/tabs to prevent confusion while loading
            document.querySelector('.modal-tabs').innerHTML = '';
            document.querySelector('.tab-content-container').innerHTML = '';

            const selectedDate = modalDateInput.value;
            fetchData(employeeId, selectedDate);
        }
    });

    modalCloseBtn.addEventListener('click', () => {
        modalOverlay.classList.remove('active');
        document.querySelector('.employee-card.selected')?.classList.remove('selected');
    });

    modalDateInput.addEventListener('change', () => {
        const employeeId = document.querySelector('.employee-card.selected')?.dataset.employeeId;
        if (employeeId) {
            fetchData(employeeId, modalDateInput.value);
        }
    });

    const today = new Date().toISOString().split('T')[0];
    modalDateInput.value = today;
});