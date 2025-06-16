// Set max date to today
document.addEventListener("DOMContentLoaded", () => {
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("date").setAttribute("max", today);
});

const form = document.getElementById('expense-form');
const list = document.getElementById('expense-list');
const balanceEl = document.getElementById('balance');

let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let filteredExpenses = [...expenses];

function saveToLocalStorage() {
  localStorage.setItem('expenses', JSON.stringify(expenses));
}

function updateBalance() {
  const total = filteredExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
  balanceEl.textContent = total.toFixed(2);
}

function renderExpenses() {
  list.innerHTML = '';
  filteredExpenses.forEach((exp, index) => {
    const li = document.createElement('li');
    li.className = `expense-item ${exp.amount >= 0 ? 'income' : 'expense'}`;
    li.innerHTML = `
      ${exp.date} - ${exp.description}: ${exp.amount} 
      <span>
        <button onclick="editExpense(${expenses.indexOf(exp)})">✏️</button>
        <button onclick="deleteExpense(${expenses.indexOf(exp)})">🗑️</button>
      </span>
    `;
    list.appendChild(li);
  });
  updateBalance();
  saveToLocalStorage();
}

function addExpense(e) {
  e.preventDefault();
  const desc = document.getElementById('description').value;
  const amt = parseFloat(document.getElementById('amount').value);
  const date = document.getElementById('date').value;

  if (!desc || isNaN(amt) || amt < 0 || !date) {
    alert("Please fill all fields with valid data.");
    return;
  }

  const selectedDate = new Date(date);
  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);

  if (selectedDate > todayDate) {
    alert("Future dates are not allowed.");
    return;
  }

  expenses.push({ description: desc, amount: amt, date });
  filteredExpenses = [...expenses];
  form.reset();
  renderExpenses();
}

function deleteExpense(index) {
  expenses.splice(index, 1);
  filteredExpenses = [...expenses];
  renderExpenses();
}

function editExpense(index) {
  const exp = expenses[index];
  document.getElementById('description').value = exp.description;
  document.getElementById('amount').value = exp.amount;
  document.getElementById('date').value = exp.date;
  deleteExpense(index);
}

function applyFilters() {
  const min = parseFloat(document.getElementById('filter-min').value);
  const max = parseFloat(document.getElementById('filter-max').value);

  filteredExpenses = expenses.filter(exp => {
    const inAmountRange = (!min || exp.amount >= min) && (!max || exp.amount <= max);
    return inAmountRange;
  });

  renderExpenses();
}

function resetFilters() {
  document.getElementById('filter-min').value = '';
  document.getElementById('filter-max').value = '';
  filteredExpenses = [...expenses];
  renderExpenses();
}

form.addEventListener('submit', addExpense);
renderExpenses();
