let expenses = [];
let totalAmount = 0;
let spendingLimit = null;

const categorySelect = document.getElementById('category-select');
const amountInput = document.getElementById('amount-input');
const dateInput = document.getElementById('date-input');
const addBtn = document.getElementById('add-btn');
const printButton = document.getElementById('print-btn');
const exportButton = document.getElementById('export-btn');
const expensesTableBody = document.getElementById('expense-table-body');
const totalAmountCell = document.getElementById('total-amount');
const limitInput = document.getElementById('limit-input');
const setLimitBtn = document.getElementById('set-limit-btn');
const searchInput = document.getElementById('search-input');
const summaryTableBody = document.getElementById('summary-table-body');
const reportMonthInput = document.getElementById('report-month-input');
const generateReportBtn = document.getElementById('generate-report-btn');
const reportTableBody = document.getElementById('report-table-body');

setLimitBtn.addEventListener('click', function() {
    spendingLimit = Number(limitInput.value);
    alert(`Spending limit set to ₹${spendingLimit}`);
});

addBtn.addEventListener('click', function() {
    const category = categorySelect.value;
    const amount = Number(amountInput.value);
    const date = dateInput.value;

    if (category === '') {
        alert('Please select a category');
        return;
    }
    if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount');
        return;
    }
    if (date === '') {
        alert('Please select a date');
        return;
    }

    const editMode = addBtn.dataset.editMode;

    if (editMode === 'true') {
        const editedIndex = addBtn.dataset.editIndex;
        const editedExpense = expenses[editedIndex];
        totalAmount -= editedExpense.amount;
        totalAmountCell.textContent = totalAmount;

        editedExpense.category = category;
        editedExpense.amount = amount;
        editedExpense.date = date;

        addBtn.dataset.editMode = 'false';
        addBtn.textContent = 'Add';
        addBtn.removeAttribute('data-edit-index');
    } else {
        if (spendingLimit !== null && (totalAmount + amount) > spendingLimit) {
            alert('Limit exceeded! You cannot spend more.');
            return;
        }
        expenses.push({ category, amount, date });

        totalAmount += amount;
        totalAmountCell.textContent = totalAmount;
    }

    renderExpensesTable();
    renderSummaryTable();
});

function renderExpensesTable(searchTerm = '') {
    expensesTableBody.innerHTML = '';

    let filteredExpenses = expenses;
    if (searchTerm) {
        filteredExpenses = expenses.filter(expense =>
            expense.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
            expense.date.includes(searchTerm)
        );
    }

    for (let i = 0; i < filteredExpenses.length; i++) {
        const expense = filteredExpenses[i];

        const newRow = expensesTableBody.insertRow();

        const categoryCell = newRow.insertCell();
        const amountCell = newRow.insertCell();
        const dateCell = newRow.insertCell();
        const editCell = newRow.insertCell();
        const deleteCell = newRow.insertCell();

        categoryCell.textContent = expense.category;
        amountCell.textContent = expense.amount;
        dateCell.textContent = expense.date;

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.addEventListener('click', function() {
            expenses.splice(i, 1);
            totalAmount -= expense.amount;
            totalAmountCell.textContent = totalAmount;
            renderExpensesTable(searchTerm);
            renderSummaryTable();
        });
        deleteCell.appendChild(deleteBtn);

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.classList.add('edit-btn');
        editBtn.addEventListener('click', function() {
            editExpense(i);
        });
        editCell.appendChild(editBtn);
    }
}

function editExpense(index) {
    const expense = expenses[index];
    categorySelect.value = expense.category;
    amountInput.value = expense.amount;
    dateInput.value = expense.date;

    addBtn.dataset.editMode = 'true';
    addBtn.dataset.editIndex = index;
    addBtn.textContent = 'Update';
}

function renderSummaryTable() {
    const categoryTotals = expenses.reduce((totals, expense) => {
        totals[expense.category] = (totals[expense.category] || 0) + expense.amount;
        return totals;
    }, {});

    summaryTableBody.innerHTML = '';

    for (const category in categoryTotals) {
        const newRow = summaryTableBody.insertRow();
        const categoryCell = newRow.insertCell();
        const amountCell = newRow.insertCell();

        categoryCell.textContent = category;
        amountCell.textContent = categoryTotals[category];
    }
}

searchInput.addEventListener('input', function() {
    const searchTerm = searchInput.value;
    renderExpensesTable(searchTerm);
});

generateReportBtn.addEventListener('click', function() {
    const selectedMonth = reportMonthInput.value;
    if (selectedMonth === '') {
        alert('Please select a month');
        return;
    }

    const filteredExpenses = expenses.filter(expense =>
        expense.date.startsWith(selectedMonth)
    );

    reportTableBody.innerHTML = '';

    for (const expense of filteredExpenses) {
        const newRow = reportTableBody.insertRow();
        const categoryCell = newRow.insertCell();
        const amountCell = newRow.insertCell();
        const dateCell = newRow.insertCell();

        categoryCell.textContent = expense.category;
        amountCell.textContent = expense.amount;
        dateCell.textContent = expense.date;
    }
});

printButton.addEventListener('click', function() {
    window.print();
});

exportButton.addEventListener('click', function() {
    const csvContent = "data:text/csv;charset=utf-8,"
        + expenses.map(e => `${e.category},${e.amount},${e.date}`).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "expenses.csv");
    document.body.appendChild(link);
    link.click();
});
