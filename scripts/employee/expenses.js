/* ------------------------------------------------------------------------- */
/* EXPENSES PAGE JAVASCRIPT LOGIC (Client-Side Filtering) */
/* ------------------------------------------------------------------------- */

// Global variable to store all fetched expenses for client-side filtering
let allExpenses = [];
const expensesGrid = document.getElementById('expensesGrid');
const dateFilter = document.getElementById('dateFilter'); // Text input for datepicker
const applyFilterBtn = document.getElementById('applyFilter');
const resetFilterBtn = document.getElementById('resetFilter');
const loadingMessage = document.getElementById('loadingMessage');
const notPaidValueElement = document.getElementById('notPaidValue');

// Array to store available expense dates in 'MM/DD/YYYY' format for Datepicker
let availableDates = [];

/**
     * 1. Authentication and Personalization Check
     */
const loadUserDetails = () => {
    const userDetails = localStorage.getItem('userDetails');

    if (!userDetails) {
        console.warn('User details not found. Redirecting to login.');
        window.location.href = './employee-login.html';
        return;
    }
    return;
};

/**
 * Helper function to format date string to the display format (06 Oct 2025).
 */
function formatDateForDisplay(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
}

/**
 * Helper function to format date string to the date picker's required format (MM/DD/YYYY).
 */
function formatDateForDatepicker(dateString) {
    // We convert the ISO part to a Date object, ensuring it's treated consistently (e.g., midnight UTC)
    const date = new Date(dateString.split('T')[0]);
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${mm}/${dd}/${yyyy}`;
}

/**
 * Calculates the total of all expenses marked as "Not Paid" and updates the fixed card.
 * This is CRITICAL for financial visibility and should run only once after fetch.
 * @param {Array<object>} expenses - The array of ALL fetched expenses (not filtered).
 */
function updateNotPaidTotal(expenses) {
    let totalNotPaid = 0;

    expenses.forEach(expense => {
        if (expense['Paid Status'] === 'Not Paid') {
            // Sum up the 'Total Expense' field for unpaid items
            totalNotPaid += expense['Total Expense'];
        }
    });

    // Helper function to format currency
    const formatCurrency = (amount) => `₹${Number(amount).toFixed(2)}`;

    // Update the DOM element
    if (notPaidValueElement) {
        notPaidValueElement.textContent = formatCurrency(totalNotPaid);
    }
}

/**
 * Creates the HTML markup for a single expense card.
 */
function createExpenseCard(expense) {
    const formatCurrency = (amount) => `₹${Number(amount).toFixed(2)}`;
    const statusText = expense['Paid Status'];
    const statusStyle = statusText === 'Paid' ? 'background-color: #5cb85c; color: white;' : 'background-color: #f0ad4e; color: white;';
    const displayDate = formatDateForDisplay(expense.Date);

    return `
        <div class="expense-card">
            <div class="card-header">
                <p class="extension-name">${expense.extensionName}</p>
                <span class="paid-status" style="${statusStyle}">${statusText}</span>
            </div>
            
            <div class="data-row">
                <span class="data-label">Date:</span>
                <span class="data-value">${displayDate}</span>
            </div>

            <div class="data-row">
                <span class="data-label">Normal Expense:</span>
                <span class="data-value">${formatCurrency(expense['Normal Expense'])}</span>
            </div>

            <div class="data-row">
                <span class="data-label">Extension Expense:</span>
                <span class="data-value">${formatCurrency(expense['Extension Expense'])}</span>
            </div>
            
            <div class="data-row">
                <span class="data-label">Travel Bill:</span>
                <span class="data-value">
                    ${expense['Travel Bill'] ?
            `<a href="${expense['Travel Bill']}" target="_blank" class="bill-link">Click to View</i></a>` :
            `N/A`
        }
                </span>
            </div>

            ${expense['Stay Bill'] ? `
            <div class="data-row">
                <span class="data-label">Stay Bill:</span>
                <span class="data-value">
                    <a href="${expense['Stay Bill']}" target="_blank" class="bill-link">Click to View</a>
                </span>
            </div>
            ` : ''}
            
            <div class="data-row data-row--total">
                <span class="data-label">TOTAL:</span>
                <span class="data-value">${formatCurrency(expense['Total Expense'])}</span>
            </div>
        </div>
    `;
}

/**
 * Renders the expense cards to the DOM.
 */
function renderExpenseCards(expenses) {
    expensesGrid.innerHTML = ''; // Clear existing cards

    if (expenses.length === 0) {
        expensesGrid.innerHTML = `<p class="loading-message">No expenses found for this date. Try resetting the filter.</p>`;
        return;
    }

    const cardsHtml = expenses.map(createExpenseCard).join('');
    expensesGrid.innerHTML = cardsHtml;
}

/**
 * Initializes the jQuery UI Datepicker and sets available dates.
 */
function initializeDatepicker() {
    // 1. Collect all unique expense dates and format them for the datepicker check
    const uniqueDates = new Set(allExpenses.map(expense => {
        // Date part only (e.g., "2025-10-21")
        const datePart = expense.Date.split('T')[0];
        return formatDateForDatepicker(datePart);
    }));

    availableDates = Array.from(uniqueDates);

    // 2. Initialize the datepicker on the input field
    $('#dateFilter').datepicker({
        dateFormat: 'dd M yy', // Display format: 06 Oct 2025
        showAnim: 'fadeIn',
        changeMonth: true,
        changeYear: true,
        constrainInput: true,

        // 3. CRITICAL function to enable/disable days
        beforeShowDay: function (date) {
            // date is a native Date object provided by jQuery UI
            // Format it to MM/DD/YYYY for internal comparison
            const dateString = formatDateForDatepicker(date.toISOString());

            if (availableDates.includes(dateString)) {
                return [true, "selectable-date", "Expense available on this date"];
            } else {
                return [false, "ui-state-disabled", "No expense data for this date"];
            }
        }
    });
}


/**
 * Fetches data from the API and initializes the page.
 */
async function initializePage() {
    loadUserDetails();
    loadingMessage.style.display = 'block';
    expensesGrid.style.display = 'grid';

    try {
        // 1. Get user details from localStorage (using 'userdetails' and 'id' as specified)
        const userDetails = JSON.parse(localStorage.getItem('userDetails') || '{}');
        const empIdValue = userDetails.id;

        if (!empIdValue) {
            expensesGrid.innerHTML = `<p class="loading-message" style="color: var(--error-red);">Error: Employee ID ('id') not found in local storage ('userdetails'). Cannot fetch data.</p>`;
            return;
        }

        // 2. Fetch data
        const response = await apiFetch('common/get-expenses', 'POST', { empId: empIdValue });

        if (response.success && response.expenses) {
            allExpenses = response.expenses;

            initializeDatepicker();
            renderExpenseCards(allExpenses);

            // 💡 NEW STEP: Calculate and update the fixed "Total Not Paid" card
            updateNotPaidTotal(allExpenses);

        } else {
            expensesGrid.innerHTML = `<p class="loading-message">Failed to load expenses: ${response.message || 'Unknown error'}</p>`;
        }

    } catch (error) {
        console.error("Initialization failed:", error);
        expensesGrid.innerHTML = `<p class="loading-message" style="color: var(--error-red);">An error occurred while fetching data. Please check the console.</p>`;
    } finally {
        loadingMessage.style.display = 'none';
    }
}


/**
 * Event handler for the Apply button. (Client-side filter for selected date)
 */
function handleApplyFilter() {
    // Get date object from jQuery UI datepicker
    const selectedDate = $('#dateFilter').datepicker('getDate');

    if (!selectedDate) {
        // If the date is reset or not selected, show all expenses
        renderExpenseCards(allExpenses);
        return;
    }

    // Convert selectedDate object to the required comparison format (YYYY-MM-DD)
    const filterDateString = selectedDate.toISOString().split('T')[0];

    // Filter the global array (client-side filter)
    const filteredExpenses = allExpenses.filter(expense => {
        // Get the date part of the expense's Date string
        const expenseDateString = new Date(expense.Date).toISOString().split('T')[0];
        return expenseDateString === filterDateString;
    });

    // RENDER: Show only the cards for the filtered date
    renderExpenseCards(filteredExpenses);
}

/**
 * Event handler for the Reset button. (Removes filter, shows all)
 */
function handleResetFilter() {
    // Clear the input field using jQuery UI method
    $('#dateFilter').datepicker('setDate', null);

    // RENDER: Show all data without a new API call
    renderExpenseCards(allExpenses);
}

// 4. Attach Event Listeners
applyFilterBtn.addEventListener('click', handleApplyFilter);
resetFilterBtn.addEventListener('click', handleResetFilter);

// Initialize data fetching on page load
document.addEventListener('DOMContentLoaded', initializePage);