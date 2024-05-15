let expenses = [];
let totalAmount = 0;

const categorySelect = document.getElementById('category-select');
const amountInput = document.getElementById('amount-input');
const dateInput = document.getElementById('date-input');
const addBtn = document.getElementById('add-btn');
const printButton = document.getElementById('print-btn');
const exportButton = document.getElementById('export-btn');
const expensesTableBody = document.getElementById('expense-table-body');
const totalAmountCell = document.getElementById('total-amount');

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
        expenses.push({category, amount, date});

        totalAmount += amount;
        totalAmountCell.textContent = totalAmount;
    }

    renderExpensesTable();
});

function renderExpensesTable() {
    expensesTableBody.innerHTML = '';

    for (let i = 0; i < expenses.length; i++) {
        const expense = expenses[i];

        const newRow = expensesTableBody.insertRow();

        const categoryCell = newRow.insertCell();
        const amountCell = newRow.insertCell();
        const dateCell = newRow.insertCell();
        const editCell = newRow.insertCell();
        const deleteCell = newRow.insertCell();
        const deleteBtn = document.createElement('button');

        deleteBtn.textContent = 'Delete';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.addEventListener('click', function() {
            expenses.splice(i, 1);
            totalAmount -= expense.amount;
            totalAmountCell.textContent = totalAmount;
            renderExpensesTable();
        });

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.classList.add('edit-btn');
        editBtn.addEventListener('click', function() {
            editExpense(i);
        });

        categoryCell.textContent = expense.category;
        amountCell.textContent = expense.amount;
        dateCell.textContent = expense.date;
        editCell.appendChild(editBtn);
        deleteCell.appendChild(deleteBtn);
    }
}

function editExpense(index) {
    const expense = expenses[index];
    categorySelect.value = expense.category;
    amountInput.value = expense.amount;
    dateInput.value = expense.date;

    addBtn.textContent = 'Update';
    addBtn.dataset.editMode = 'true';
    addBtn.dataset.editIndex = index;
}

printButton.addEventListener('click', () => {
    window.print();
});

exportButton.addEventListener('click', () => {
    exportData();
});

function exportData() {
    const csvContent = "data:text/csv;charset=utf-8," 
        + expenses.map(expense => Object.values(expense).join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'expenses.csv');
    document.body.appendChild(link); // Required for Firefox
    link.click();
}
