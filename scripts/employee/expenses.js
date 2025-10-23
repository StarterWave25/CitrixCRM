/* ------------------------------------------------------------------------- */
/* EXPENSES PAGE LOGIC - expenses.js (CALENDAR FIX) */
/* Fixes: Datepicker showing previous day due to UTC/Timezone conversion. */
/* ------------------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const expensesContainer = document.getElementById('expenses-container');
    const noDataState = document.getElementById('no-data-state');
    const totalSummaryFixedCard = document.getElementById('total-summary-card'); 
    const unpaidTotalAmount = document.getElementById('unpaid-total-amount');

    // Filter Controls
    const fromDateInput = document.getElementById('from-date-input');
    const fromDateIsoInput = document.getElementById('from-date-iso');
    const applyFilterBtn = document.getElementById('apply-filter-btn');
    const clearFilterBtn = document.getElementById('clear-filter-btn');
    const dateValidationMessageBox = document.getElementById('date-validation-message');

    // --- Global State ---
    let allExpensesData = []; // Stores all fetched expenses

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

    /**
     * Helper function to display/hide validation messages.
     */
    const showValidationMessage = (message) => {
        dateValidationMessageBox.textContent = message || '';
    };

    /**
     * Converts a UTC timestamp string to a local date string (DD Mon, YYYY).
     */
    const formatDisplayDate = (isoDate) => {
        if (!isoDate) return '-';
        try {
            const date = new Date(isoDate);
            return date.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            });
        } catch (e) {
            return isoDate;
        }
    };

    /**
     * Calculates the total amount for expenses marked 'Not Paid' and controls the visibility of the fixed card.
     */
    const updateExpensesSummary = (expenses) => {
        if (!expenses || expenses.length === 0) {
            unpaidTotalAmount.textContent = '₹ 0.00';
            totalSummaryFixedCard.classList.add('hidden');
            return;
        }

        let totalUnpaid = 0;
        expenses.forEach(expense => {
            if (expense['Paid Status'] === 'Not Paid') {
                totalUnpaid += parseFloat(expense['Total Expense'] || 0);
            }
        });

        unpaidTotalAmount.textContent = `₹ ${totalUnpaid.toFixed(2)}`;
        totalSummaryFixedCard.classList.remove('hidden');
    };

    /**
     * Renders the expense data into the card-grid.
     */
    const renderExpensesCards = (data) => {
        expensesContainer.innerHTML = '';
        updateExpensesSummary(data);

        if (!data || data.length === 0) {
            noDataState.classList.remove('hidden');
            return;
        }
        noDataState.classList.add('hidden');

        const cardsHtml = data.map(item => {
            const formatBillLink = (value, fallbackText = 'N/A') => {
                const urlPattern = /^(https?:\/\/[^\s/$.?#].[^\s]*)$/i;
                if (typeof value === 'string' && value.length > 0 && urlPattern.test(value)) {
                    return `<a href="${value}" target="_blank" rel="noopener noreferrer">View Bill <i class="fa-solid fa-external-link-alt"></i></a>`;
                }
                return fallbackText;
            };

            const statusClass = item['Paid Status'] === 'Not Paid' ? 'paid-status--not-paid' : 'paid-status--paid';
            const stayBillLink = item['Stay Bill'] ? formatBillLink(item['Stay Bill'], 'Not Applicable') : 'Not Applicable';

            return `
                <div class="expense-card card">
                    <div class="data-row">
                        <span class="data-label">Date:</span>
                        <span class="data-value">${formatDisplayDate(item['Date'])}</span>
                    </div>
                    <div class="data-row">
                        <span class="data-label">Extension Name:</span>
                        <span class="data-value">${item.extensionName || '-'}</span>
                    </div>
                    <div class="data-row">
                        <span class="data-label">Normal Expenses:</span>
                        <span class="data-value">₹ ${item['Normal Expense']?.toFixed(2) || '0.00'}</span>
                    </div>
                    <div class="data-row">
                        <span class="data-label">Extension Expenses:</span>
                        <span class="data-value">₹ ${item['Extension Expense']?.toFixed(2) || '0.00'}</span>
                    </div>
                    <div class="data-row">
                        <span class="data-label">Travel Bill:</span>
                        <span class="data-value">${formatBillLink(item['Travel Bill'])}</span>
                    </div>
                    <div class="data-row">
                        <span class="data-label">Stay Bill:</span>
                        <span class="data-value">${stayBillLink}</span>
                    </div>
                    <div class="data-row">
                        <span class="data-label">Paid Status:</span>
                        <span class="data-value ${statusClass}">${item['Paid Status'] || '-'}</span>
                    </div>
                    <div class="data-row data-row--total">
                        <span class="data-label">Total Expense:</span>
                        <span class="data-value">₹ ${item['Total Expense']?.toFixed(2) || '0.00'}</span>
                    </div>
                </div>
            `;
        }).join('');

        expensesContainer.innerHTML = cardsHtml;
    };


    /**
     * Filters and sorts the global expense data based on the single selected date (from only).
     */
    const filterAndSortExpenses = () => {
        const fromDateISO = fromDateIsoInput.value;
        let filteredData = [...allExpensesData];

        showValidationMessage(null);

        if (!fromDateISO) {
            filteredData.sort((a, b) => new Date(b.Date) - new Date(a.Date));
            renderExpensesCards(filteredData);
            clearFilterBtn.disabled = true;
            return;
        }

        const fromDate = new Date(fromDateISO);
        fromDate.setHours(0, 0, 0, 0); // Start of the selected day

        filteredData = filteredData.filter(expense => {
            // FIX: Convert expense date to start-of-day for a true date-only comparison
            const expenseDate = new Date(expense.Date);
            expenseDate.setHours(0, 0, 0, 0); 
            
            return expenseDate.getTime() >= fromDate.getTime();
        });

        filteredData.sort((a, b) => new Date(b.Date) - new Date(a.Date));

        renderExpensesCards(filteredData);
        clearFilterBtn.disabled = false;
    };
    
    /**
     * Resets the date filter inputs and re-renders all data.
     */
    const clearDateFilter = () => {
        fromDateInput.value = '';
        fromDateIsoInput.value = '';
        applyFilterBtn.disabled = true;
        clearFilterBtn.disabled = true;
        filterAndSortExpenses();
    };

    /**
     * Checks validity and enables/disables the filter button.
     */
    const checkFilterValidity = () => {
        if (fromDateIsoInput.value) {
            applyFilterBtn.disabled = false;
        } else {
            applyFilterBtn.disabled = true;
        }
    };


    /**
     * Initializes the jQuery UI datepicker (FIXED).
     */
    const initializeDatepickers = (expenseDates) => {
        if (expenseDates.length === 0) {
            fromDateInput.disabled = true;
            applyFilterBtn.disabled = true;
            clearFilterBtn.disabled = true;
            return;
        }

        const minDate = new Date(expenseDates[0]);
        // FIX: Ensure maxDate includes the entire day to prevent timezone shift issue
        const maxDate = new Date(expenseDates[expenseDates.length - 1]);
        maxDate.setHours(23, 59, 59, 999); // Set to the very end of the day

        $("#from-date-input").datepicker("destroy");

        const commonDatepickerOptions = {
            dateFormat: "dd-mm-yy",
            altFormat: "yy-mm-dd",
            changeMonth: true,
            changeYear: true,
            minDate: minDate,
            maxDate: maxDate,
            onSelect: function (dateText, inst) {
                $(this).trigger('change'); 
                checkFilterValidity();
            }
        };

        $("#from-date-input").datepicker({
            ...commonDatepickerOptions,
            altField: "#from-date-iso"
        });
        
        fromDateInput.disabled = false;
    };


    /**
     * CORE: Fetches all expenses for the employee.
     */
    const fetchExpensesData = async () => {
        const userDetails = getUserDetails();
        if (!userDetails || !userDetails.id) {
            console.error('Employee ID not found. Redirecting...');
            return;
        }

        try {
            // Assuming apiFetch is available via api-fetch.js
            const response = await apiFetch('common/get-expenses', 'POST', {
                empId: userDetails.id
            });

            if (response.success && response.expenses && Array.isArray(response.expenses)) {
                allExpensesData = response.expenses.map(expense => {
                    expense['Normal Expense'] = parseFloat(expense['Normal Expense'] || 0);
                    expense['Extension Expense'] = parseFloat(expense['Extension Expense'] || 0);
                    expense['Total Expense'] = parseFloat(expense['Total Expense'] || 0);
                    return expense;
                });

                // Get unique dates (YYYY-MM-DD format)
                const uniqueDates = Array.from(new Set(
                    allExpensesData.map(e => e.Date.substring(0, 10))
                )).sort();

                initializeDatepickers(uniqueDates);
                filterAndSortExpenses();

            } else {
                console.warn('API returned no expense data.');
                allExpensesData = [];
                renderExpensesCards([]);
                initializeDatepickers([]);
            }

        } catch (error) {
            noDataState.classList.remove('hidden');
            noDataState.querySelector('.message').textContent = 'A network error occurred while fetching expenses. Please try again.';
            console.error('API Error during expense fetch:', error);
        }
    };


    // --- Event Listeners ---
    
    applyFilterBtn.addEventListener('click', (e) => {
        e.preventDefault();
        filterAndSortExpenses();
    });
    
    clearFilterBtn.addEventListener('click', (e) => {
        e.preventDefault();
        clearDateFilter();
    });

    // --- Initialization ---
    fetchExpensesData();
});