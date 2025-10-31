document.addEventListener('DOMContentLoaded', () => {
    const greetingElement = document.getElementById('manager-greeting');
    const employeeCardsContainer = document.getElementById('employee-cards-container');
    const logoutBtn = document.getElementById('logout-btn');
    const employeeSearchInput = document.getElementById('employee-search');
    const joinMeetingBtn = document.getElementById('join-meeting-btn');
    const createMeetingBtn = document.getElementById('create-meeting-btn');

    // Modal Elements for Join Meeting feature
    const meetingModal = document.getElementById('meeting-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalLoadingState = document.getElementById('modal-loading-state');
    const modalResultState = document.getElementById('modal-result-state');

    // Modal Elements for Create Meeting feature
    const createMeetingModal = document.getElementById('create-meeting-modal');
    const createMeetingModalCloseBtn = document.getElementById('create-meeting-modal-close-btn');
    const createMeetingForm = document.getElementById('create-meeting-form');
    const startTimeInput = document.getElementById('start-time-input');
    const endTimeInput = document.getElementById('end-time-input');
    const meetingValidationMessage = document.getElementById('meeting-validation-message');
    const createMeetingSubmitBtn = document.getElementById('create-meeting-submit-btn');
    const meetingLinkContainer = document.getElementById('meeting-link-container');
    const joinMeetingLink = document.getElementById('join-meeting-link');

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
    const fromDateIsoInput = document.getElementById('from-date-iso');
    const toDateIsoInput = document.getElementById('to-date-iso');
    const applyDataBtn = document.getElementById('apply-data-btn');
    const sheetSelect = document.getElementById('sheet-select');
    const dataSheetsContainer = document.getElementById('data-sheets-container');

    // Validation Message Element
    const dateValidationMessageBox = document.getElementById('date-validation-message');

    let allEmployees = []; // To store the original list of employees
    let currentEmpId = null; // To store the empId for the data viewer

    // --- Global State Variables ---
    let allSheetData = {}; // Stores fetched data for all sheets for the selected date range
    let validTourDates = []; // Stores dates fetched from API in YYYY-MM-DD format
    // Map API keys to user-friendly sheet names
    const sheetNameMap = {
        'tourplan': 'Tour Plan',
        'doctorsList': 'Doctors List',
        'orders': 'Orders'
    };

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

    const loadUserDetails = () => {
        const userDetails = getUserDetails();
        if (!userDetails) {
            window.location.href = './manager-login.html';
            return;
        }
        if (userDetails.name) {
            greetingElement.innerHTML = `Hello <span class="placeholder-name">${userDetails.name}!</span>`;
        }
    };

    const fetchEmployees = async () => {
        const response = await apiFetch('md/view-entity', 'POST', { entity: 'employees' });
        if (response.success) {
            allEmployees = response.data.employeesList; // Store the fetched employees
            displayEmployeeCards(allEmployees);
        } else {
            employeeCardsContainer.innerHTML = '<p>Could not fetch employee data.</p>';
        }
    };

    const displayEmployeeCards = (employees) => {
        if (!employees || employees.length === 0) {
            employeeCardsContainer.innerHTML = '<p class="no-results-message">No employee records or headquarters match your search criteria. Please refine your search.</p>';
            return;
        }

        const cardsHtml = employees.map(emp => `
            <div class="action-card card" data-employee-name="${emp.empName.value.toLowerCase()}">
                <div class="card-details">
                    <h2 class="card-title">${emp.empName.value}</h2>
                    <p class="card-description"><i class="fa-solid fa-location-dot"></i> ${emp.hqName.value}</p>
                </div>
                <div class="card-actions">
                    <button class="btn-primary view-data-btn" data-empid="${emp.empId.value}" data-hqid="${emp.hqId.value}"><i class="fa-solid fa-book-medical"></i> View Data</button>
                    <a href="expenses.html?empId=${emp.empId.value}" class="btn-secondary"><i class="fa-solid fa-indian-rupee-sign"></i> Expenses</a>
                </div>
            </div>
        `).join('');

        employeeCardsContainer.innerHTML = cardsHtml;

        // Add event listeners to the new buttons
        document.querySelectorAll('.view-data-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                currentEmpId = e.currentTarget.dataset.empid;
                const hqId = e.currentTarget.dataset.hqid;
                openDataViewerModal(currentEmpId, hqId);
            });
        });
    };

    const filterEmployeeCards = () => {
        const searchTerm = employeeSearchInput.value.toLowerCase();
        const filteredEmployees = allEmployees.filter(emp =>
            emp.empName.value.toLowerCase().includes(searchTerm) ||
            emp.hqName.value.toLowerCase().includes(searchTerm)
        );
        displayEmployeeCards(filteredEmployees);
    };

    if (employeeSearchInput) {
        employeeSearchInput.addEventListener('input', filterEmployeeCards);
    }

    const closeModal = () => {
        meetingModal.classList.remove('active');
        modalLoadingState.classList.remove('hidden');
        modalLoadingState.style.opacity = '1';
        modalResultState.classList.add('hidden');
        modalResultState.innerHTML = '';
    };
    const validateMeetingTimes = () => {
        const startTimeValue = startTimeInput.value;
        const endTimeValue = endTimeInput.value;

        if (!startTimeValue || !endTimeValue) {
            showMeetingValidationMessage('Please select both a start and end time.');
            return false;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset to start of today for consistent date part

        const [startHours, startMinutes] = startTimeValue.split(':').map(Number);
        const startTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), startHours, startMinutes);

        const [endHours, endMinutes] = endTimeValue.split(':').map(Number);
        const endTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), endHours, endMinutes);

        const now = new Date();
        const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60000);
        const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

        if (startTime < fiveMinutesFromNow) {
            showMeetingValidationMessage('Start time must be at least 5 minutes from now.');
            return false;
        }

        if (endTime <= startTime) {
            showMeetingValidationMessage('End time must be after the start time.');
            return false;
        }

        if (startTime > endOfToday || endTime > endOfToday) {
            showMeetingValidationMessage('Meeting times can only be scheduled for today.');
            return false;
        }

        meetingValidationMessage.classList.remove('active');
        return true;
    };
    
    const handleJoinMeeting = async () => {
        closeModal();
        meetingModal.classList.add('active');

        try {
            const response = await apiFetch('common/join-meeting', 'GET');
            modalLoadingState.classList.add('hidden');
            modalLoadingState.style.opacity = '0';
            modalResultState.classList.remove('hidden');
            modalResultState.style.opacity = '1';

            if (response.success && response.meetingLink) {
                modalResultState.innerHTML = `
                    <h3 class="success-title">Your Meeting Link is Ready!</h3>
                    <p class="message">Click 'Join Now' to connect to your scheduled high-priority meeting.</p>
                    <a href="${response.meetingLink}" target="_blank" class="btn-primary join-btn" onclick="closeModal()">
                        <i class="fa-solid fa-video"></i> JOIN NOW
                    </a>
                `;
            } else {
                const message = response.message || 'We could not find a scheduled high-priority meeting for you today.';
                modalResultState.innerHTML = `
                    <h3 class="error-title">No Meetings Found</h3>
                    <p class="message">${message}</p>
                `;
            }
        } catch (error) {
            console.error('API Error during join meeting check:', error);
            modalLoadingState.classList.add('hidden');
            modalLoadingState.style.opacity = '0';
            modalResultState.classList.remove('hidden');
            modalResultState.style.opacity = '1';
            modalResultState.innerHTML = `
                <h3 class="error-title">Connection Error</h3>
                <p class="message">Failed to connect to the meeting scheduler API. Please check your network.</p>
                <button class="btn-primary" style="background-color: var(--error-red);" id="modal-retry-btn">
                    <i class="fa-solid fa-rotate-right"></i> Retry
                </button>
            `;
            document.getElementById('modal-retry-btn').addEventListener('click', () => {
                modalResultState.classList.add('hidden');
                modalLoadingState.style.opacity = '1';
                handleJoinMeeting();
            });
        }
    };

    if (joinMeetingBtn) {
        joinMeetingBtn.addEventListener('click', (e) => {
            e.preventDefault();
            handleJoinMeeting();
        });
    }

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeModal);
    }

    meetingModal.addEventListener('click', (e) => {
        if (e.target === meetingModal) {
            closeModal();
        }
    });

    const createMeetingTitle = document.getElementById('create-meeting-title');
    const createMeetingLoadingState = document.getElementById('create-meeting-loading-state');

    // --- Create Meeting Functions ---
    const openCreateMeetingModal = () => {
        createMeetingModal.classList.add('active');
        createMeetingForm.classList.remove('hidden');
        meetingLinkContainer.classList.add('hidden');
        meetingValidationMessage.classList.remove('active');
        createMeetingTitle.classList.remove('hidden');
        createMeetingLoadingState.classList.add('hidden');

        const now = new Date();
        const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60000);

        const formatTime = (date) => {
            return String(date.getHours()).padStart(2, '0') + ':' + String(date.getMinutes()).padStart(2, '0');
        };

        startTimeInput.min = formatTime(fiveMinutesFromNow);
        startTimeInput.value = '';
        endTimeInput.value = '';
        endTimeInput.min = formatTime(fiveMinutesFromNow);
    };

    if (startTimeInput) {
        startTimeInput.addEventListener('input', () => {
            if (startTimeInput.value) {
                endTimeInput.min = startTimeInput.value;
            }
            validateMeetingTimes();
        });
    }

    if (endTimeInput) {
        endTimeInput.addEventListener('input', validateMeetingTimes);
    }

    const closeCreateMeetingModal = () => {
        createMeetingModal.classList.remove('active');
    };

    const showMeetingValidationMessage = (message) => {
        meetingValidationMessage.textContent = message;
        meetingValidationMessage.classList.add('active');
    };

    const handleCreateMeeting = async () => {
        if (!validateMeetingTimes()) {
            return;
        }

        createMeetingForm.classList.add('hidden');
        createMeetingLoadingState.classList.remove('hidden');

        const startTimeValue = startTimeInput.value;
        const endTimeValue = endTimeInput.value;

        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset to start of today for consistent date part

        const [startHours, startMinutes] = startTimeValue.split(':').map(Number);
        const startTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), startHours, startMinutes);

        const [endHours, endMinutes] = endTimeValue.split(':').map(Number);
        const endTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), endHours, endMinutes);

        const formatToIsoString = (date) => {
            const offset = -date.getTimezoneOffset();
            const offsetHours = String(Math.floor(Math.abs(offset) / 60)).padStart(2, '0');
            const offsetMinutes = String(Math.abs(offset) % 60).padStart(2, '0');
            const sign = offset >= 0 ? '+' : '-';

            return date.getFullYear() + '-' +
                String(date.getMonth() + 1).padStart(2, '0') + '-' +
                String(date.getDate()).padStart(2, '0') + 'T' +
                String(date.getHours()).padStart(2, '0') + ':' +
                String(date.getMinutes()).padStart(2, '0') + ':' +
                String(date.getSeconds()).padStart(2, '0') + sign + offsetHours + ':' + offsetMinutes;
        };

        const data = {
            startTime: formatToIsoString(startTime),
            endTime: formatToIsoString(endTime)
        };

        try {
            const response = await apiFetch('common/create-meeting', 'POST', data);
            createMeetingLoadingState.classList.add('hidden');
            if (response.success) {
                createMeetingTitle.classList.add('hidden');
                meetingLinkContainer.classList.remove('hidden');
                joinMeetingLink.href = response.meetingLink;
            } else {
                createMeetingForm.classList.remove('hidden');
                showMeetingValidationMessage(response.message || 'Failed to create meeting.');
            }
        } catch (error) {
            createMeetingLoadingState.classList.add('hidden');
            createMeetingForm.classList.remove('hidden');
            showMeetingValidationMessage('An error occurred while creating the meeting.');
        }
    };

    if (createMeetingBtn) {
        createMeetingBtn.addEventListener('click', openCreateMeetingModal);
    }

    if (createMeetingModalCloseBtn) {
        createMeetingModalCloseBtn.addEventListener('click', closeCreateMeetingModal);
    }

    if (createMeetingModal) {
        createMeetingModal.addEventListener('click', (e) => {
            if (e.target === createMeetingModal) {
                closeCreateMeetingModal();
            }
        });
    }

    if (createMeetingSubmitBtn) {
        createMeetingSubmitBtn.addEventListener('click', handleCreateMeeting);
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                document.cookie = "jwt=; Expires=Thu, 01 Jan 1970 00:00:00 UTC; Path=/; SameSite=Lax";
                console.log('Client-side JWT cookie cleared.');
            } catch (error) {
                console.error('Logout API call failed, but proceeding to clear local session:', error);
            }
            localStorage.removeItem('userDetails');
            console.log('Client session cleared. Redirecting to manager login.');
            setTimeout(() => {
                window.location.href = './manager-login.html';
            }, 100);
        });
    }

    const menuTrigger = document.getElementById('header-menu-trigger');
    const menu = document.getElementById('header-dropdown-menu');

    if (menuTrigger && menu) {
        const toggleMenu = (e) => {
            if (e) e.stopPropagation();
            const isExpanded = menuTrigger.getAttribute('aria-expanded') === 'true';
            menuTrigger.setAttribute('aria-expanded', !isExpanded);
            menu.classList.toggle('hidden', isExpanded);
            if (!isExpanded) {
                const firstMenuItem = menu.querySelector('.menu-item');
                if (firstMenuItem) {
                    firstMenuItem.focus();
                }
            }
        };
        menuTrigger.addEventListener('click', toggleMenu);
        document.addEventListener('click', (e) => {
            if (!menu.classList.contains('hidden') && !menu.contains(e.target) && e.target !== menuTrigger) {
                menu.classList.add('hidden');
                menuTrigger.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // --- DATA VIEWER FUNCTIONS ---

    function openDataViewerModal(empId, hqId) {
        currentEmpId = empId;
        document.body.classList.add('modal-open');
        dataViewerModal.classList.add('active');
        fetchExtensions(hqId);
        setupFilterListeners();
    }

    const closeDataModal = () => {
        document.body.classList.remove('modal-open');
        dataViewerModal.classList.remove('active');
        extensionSelect.innerHTML = '<option value="" disabled selected>Loading Extensions...</option>';
        extensionSelect.disabled = true;
        fromDateInput.value = '';
        toDateInput.value = '';
        fromDateInput.disabled = true;
        toDateInput.disabled = true;
        applyDataBtn.disabled = true;
        dataDisplayState.classList.add('hidden');
        dataErrorState.classList.add('hidden');
        dataSheetsContainer.innerHTML = '';
        showValidationMessage(null);
        currentEmpId = null;
    };

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
        if (stateId === 'data-display-state') {
            dataLoadingState.classList.add('hidden');
        }
    };

    const renderNestedTable = (key, nestedArray) => {
        if (!nestedArray || nestedArray.length === 0) return '';
        let allKeys = new Set();
        nestedArray.forEach(obj => {
            Object.keys(obj).forEach(k => allKeys.add(k));
        });
        const headers = Array.from(allKeys);
        const headerRow = headers.map(h => `<th>${h}</th>`).join('');
        const tableHeader = `<thead><tr>${headerRow}</tr></thead>`;
        const tableBodyRows = nestedArray.map(item => {
            const cells = headers.map(header => {
                const value = item[header] !== undefined ? item[header] : '-';
                const cellClass = typeof value === 'number' ? 'data-numeric' : '';
                return `<td class="${cellClass}">${value}</td>`;
            }).join('');
            return `<tr>${cells}</tr>`;
        }).join('');
        const tableBody = `<tbody>${tableBodyRows}</tbody>`;
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

    function formatIfUrl(value) {
        const urlPattern = /^(https?:\/\/[^\s/$.?#].[^\s]*)$/i;
        if (typeof value === 'string' && urlPattern.test(value)) {
            return `<a href="${value}" target="_blank" rel="noopener noreferrer">Click to Open</a>`;
        }
        return value;
    }

    const renderDataCards = (sheetKey, data) => {
        if (!Array.isArray(data) || data.length === 0) {
            return `<p class="no-data-message">No Data Found for ${sheetNameMap[sheetKey] || sheetKey}.</p>`;
        }
        const keys = Object.keys(data[0] || {}).filter(key => key !== 'tId' && key !== 'docId');
        const cardsHtml = data.map((item) => {
            let rowsHtml = '';
            keys.forEach(key => {
                const formattedKey = key.replace(/_/g, ' ');
                let rawValue = item[key];
                const value = rawValue && typeof rawValue === 'object' && 'value' in rawValue ? rawValue.value : rawValue;
                const nestedArray = Array.isArray(value) ? value : null;
                if (nestedArray) {
                    rowsHtml += renderNestedTable(key, nestedArray);
                    return;
                }
                const displayValue = value === null || value === undefined || value === '' ? '-' : value;
                const valueClass = '';
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
                        finalDisplayValue = displayValue;
                    }
                }
                rowsHtml += `
                <div class="data-row">
                    <span class="data-label">${formattedKey}:</span>
                    <span class="data-value ${valueClass}">${finalDisplayValue}</span>
                </div>
            `;
            });
            let cardBackgroundColor = '';
            let cardBorderColor = '';
            let stageValue = '';
            if (item.Stage && typeof item.Stage === 'object' && item.Stage.value) {
                stageValue = item.Stage.value;
            } else if (typeof item.Stage === 'string') {
                stageValue = item.Stage;
            }
            if (stageValue) {
                switch (stageValue) {
                    case 'Converted':
                        cardBackgroundColor = 'rgba(0, 84, 93, 0.25)';
                        cardBorderColor = '#00535d';
                        break;
                    case 'Targeted':
                        cardBackgroundColor = 'rgba(255, 144, 9, 0.1)';
                        cardBorderColor = '#ff9009';
                        break;
                    case 'None':
                        cardBackgroundColor = 'var(--llblue)';
                        cardBorderColor = 'var(--lblue)';
                        break;
                }
            }
            const cardStyle = `background-color: ${cardBackgroundColor}; border: 2px solid ${cardBorderColor};`;
            const finalCardStyle = cardBackgroundColor || cardBorderColor ? cardStyle : '';
            return `<div class="data-card" style="${finalCardStyle}">${rowsHtml}</div>`;
        }).join('');
        return `<div class="data-table-card-view">${cardsHtml}</div>`;
    };

    const switchSheet = (sheetKey) => {
        document.querySelectorAll('.sheet-content').forEach(content => content.classList.add('hidden'));
        const targetSheet = document.getElementById(`sheet-${sheetKey}`);
        if (targetSheet) {
            targetSheet.classList.remove('hidden');
        }
    }

    const fetchViewData = async (exId, fromDate, toDate) => {
        if (!currentEmpId) return;
        showDataModalState('data-loading-state');
        document.querySelector('#data-loading-state p').textContent = 'Fetching detailed reports...';
        showValidationMessage(null);
        try {
            const response = await apiFetch('common/view-data', 'POST', {
                empId: currentEmpId,
                exId: exId,
                fromDate: fromDate,
                toDate: toDate
            });
            if (response.success) {
                allSheetData = response.data;
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
                    const option = document.createElement('option');
                    option.value = sheetKey;
                    option.textContent = friendlyName;
                    sheetSelect.appendChild(option);
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

    const checkFilterValidity = () => {
        const isExtensionSelected = extensionSelect && extensionSelect.value;
        const isFromDateSelected = fromDateIsoInput && fromDateIsoInput.value;
        if (isExtensionSelected && isFromDateSelected) {
            applyDataBtn.disabled = false;
        } else {
            applyDataBtn.disabled = true;
        }
    };

    const setupFilterListeners = () => {
        if (fromDateInput) fromDateInput.addEventListener('change', checkFilterValidity);
        if (toDateInput) toDateInput.addEventListener('change', checkFilterValidity);
        if (extensionSelect) extensionSelect.addEventListener('change', checkFilterValidity);
        if (applyDataBtn) {
            applyDataBtn.addEventListener('click', (e) => {
                e.preventDefault();
                checkFilterValidity();
                if (!applyDataBtn.disabled) {
                    const extensionId = extensionSelect.value;
                    const fromDateISO = fromDateIsoInput.value;
                    const toDateISO = toDateIsoInput.value;
                    if (toDateISO) {
                        if (fromDateISO > toDateISO) {
                            showValidationMessage("Error: The 'From Date' cannot be after the 'To Date'. Please correct your date range.");
                            return;
                        }
                    }
                    if (validTourDates.length === 0) {
                        showValidationMessage("The current extension has no tour dates available in the system. Please select a different extension.");
                        return;
                    }
                    if (!fromDateISO) {
                        showValidationMessage("Please select valid dates from the tour plan calendar.");
                        return;
                    }
                    if (toDateISO) {
                        fetchViewData(extensionId, fromDateISO, toDateISO);
                    } else {
                        fetchViewData(extensionId, fromDateISO);
                    }
                }
            });
        }
        checkFilterValidity();
    };

    const initializeDatepickers = (dates) => {
        const validDateSet = new Set(dates);
        const enableTourDates = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const formattedDate = `${year}-${month}-${day}`;
            const isEnabled = validDateSet.has(formattedDate);
            return [isEnabled, isEnabled ? 'tour-date-available' : 'tour-date-unavailable', ''];
        };
        $("#from-date-input, #to-date-input").datepicker("destroy");
        const commonDatepickerOptions = {
            dateFormat: "dd-mm-yy",
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
            altField: "#from-date-iso"
        });
        $("#to-date-input").datepicker({
            ...commonDatepickerOptions,
            altField: "#to-date-iso"
        });
        fromDateInput.disabled = false;
        toDateInput.disabled = false;
    };

    const fetchTourDates = async (exId) => {
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
                validTourDates = response.data.tourDates.sort();
                if (validTourDates.length > 0) {
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

    const fetchExtensions = async (hqId) => {
        if (!hqId) {
            dataErrorMessage.textContent = 'Employee HQ ID is missing. Cannot fetch extensions.';
            return showDataModalState('data-error-state');
        }
        extensionSelect.innerHTML = '<option value="" disabled selected>Loading Extensions...</option>';
        extensionSelect.disabled = true;
        fromDateInput.disabled = true;
        toDateInput.disabled = true;
        applyDataBtn.disabled = true;
        showValidationMessage(null);
        document.querySelector('#data-loading-state p').textContent = 'Fetching extensions and dependencies...';
        showDataModalState('data-loading-state');
        try {
            const response = await apiFetch('employee/fetch-form-dependencies', 'POST', {
                formName: 'tourplan',
                hqId: hqId
            });
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
                dataErrorMessage.textContent = response.message || 'No extensions found for this employee\'s HQ.';
                showDataModalState('data-error-state');
            }
        } catch (error) {
            console.error('API Error during extension fetch:', error);
            dataErrorMessage.textContent = 'A network error occurred while fetching extensions.';
            showDataModalState('data-error-state');
        }
    };

    const showValidationMessage = (message) => {
        if (message) {
            dateValidationMessageBox.textContent = message;
            dateValidationMessageBox.classList.add('active');
        } else {
            dateValidationMessageBox.textContent = '';
            dateValidationMessageBox.classList.remove('active');
        }
    };

    if (dataViewerCloseBtn) {
        dataViewerCloseBtn.addEventListener('click', closeDataModal);
    }
    if (dataViewerModal) {
        dataViewerModal.addEventListener('click', (e) => {
            if (e.target === dataViewerModal) {
                closeDataModal();
            }
        });
    }
    if (dataRetryBtn) {
        dataRetryBtn.addEventListener('click', () => {
            const employee = allEmployees.find(emp => emp.empId.value === currentEmpId);
            if (employee) {
                fetchExtensions(employee.hqId.value);
            }
        });
    }
    if (extensionSelect) {
        extensionSelect.addEventListener('change', (e) => {
            const selectedExId = e.target.value;
            fromDateInput.value = '';
            toDateInput.value = '';
            if (selectedExId) {
                fetchTourDates(selectedExId);
            }
            checkFilterValidity();
        });
    }
    if (sheetSelect) {
        sheetSelect.addEventListener('change', (e) => {
            const selectedSheetKey = e.target.value;
            switchSheet(selectedSheetKey);
        });
    }

    loadUserDetails();
    fetchEmployees();
});
