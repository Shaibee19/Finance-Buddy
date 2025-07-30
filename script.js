// Start with the data structure
let transactions = [];

// Storage (How we save/load data)
function saveTransactions() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

function loadTransactions() {
  const saved = localStorage.getItem("transactions");
  if (saved) transactions = JSON.parse(saved);
}

// Core operations (What we can do with data)
function addTransactions(type, description, amount) {
  if (!description || amount <= 0) return false; // validations (if there is no description OR the amount is less than 0 then the form doesn't work)

  transactions.push({
    id: Date.now(), // necessary for only calling one unique transaction
    type,
    description,
    amount: +amount,
    date: new Date().toLocaleDateString(),
  });

  saveTransactions(); // calling this function to work before finishing the function
  return true;
}

function removeTransactions(id) {
  transactions = transactions.filter((t) => t.id !== id); // finding the first element that matches the id and filtering it out
  saveTransactions();
}

// Calculations (How we process the data)
function getTotalTransactions() {
  const income = transactions.filter((t) => t.type === "income"); // filtering the elements equal to income
  const expenses = transactions.filter((t) => t.type === "expense"); // filtering the elements equal to expenses

  return {
    income,
    expenses,
    incomeTotal: income.reduce((sum, t) => sum + t.amount, 0), // adding all elements in the array
    expenseTotal: expenses.reduce((sum, t) => sum + t.amount, 0),
    get balance() {
      return this.incomeTotal - this.expenseTotal; // returning the correct balance
    },
  };
}

// Utilities (Helper functions)
function moneyFormat(amount) {
  return `$${(+amount).toFixed(2)}`; // converting our numbers to money
}

// console.log(transactions)

// Create Transaction
function createTransationsHTML(t) {
  // t = transaction, which is an object
  const sign = t.type === "income" ? "+" : "-";
  return `
    <div class="transaction__item ${t.type}">
        <div class="transaction__info">
            <div class="transaction__description">${t.description}</div>
            <div class="transaction__date">${t.date}</div>
            <div class="transaction__category">${
              t.type === "income" ? "Income" : "Expense"
            }</div>
        </div>
        <div class="transaction__amount ${t.type}">
            ${sign}${moneyFormat(t.amount)}
        </div>
        <button class="transaction__item--delete" onclick="handleRemoveTransaction(${
          t.id
        })">x</button>
    </div>
    `;
}

// Render Transaction
function renderTransactions() {
  const totals = getTotalTransactions();

  // Show transactions
  document.getElementById("income__items").innerHTML = totals.income.length // does this exist ? Truthy ternary operator
    ? totals.income // if it's true
        .map((transaction) => createTransationsHTML(transaction))
        .join("")
    : '<div class="transaction__item--placeholder">No income recorded</div>'; // if it's false

  document.getElementById("expense__items").innerHTML = totals.expenses.length
    ? totals.expenses
        .map((transaction) => createTransationsHTML(transaction))
        .join("")
    : '<div class="transaction__item--placeholder">No expenses recorded</div>';

  // Show balance
  const balanceEl = document.getElementById("balance__amount"); // grabbing the amount element
  balanceEl.textContent = moneyFormat(totals.balance); // changing it to the total
  balanceEl.style.color = totals.balance >= 0 ? "#4ad469" : "#dc3545"; // if it's positive = green, if it's negative = red

  // Show summary
  const count = transactions.length;
  document.getElementById("balance__change").textContent = count // if count is > 0 = truthy we actually have a transaction
    ? `${count} transaction${count > 1 ? "s" : ""} • Income: ${moneyFormat(
        totals.incomeTotal
      )} • Expenses: ${moneyFormat(totals.expenseTotal)}`
    : "No transactions yet!";
}


// console.log(getTotalTransactions())

// console.log(transactions.map((transaction) => createTransationsHTML(transaction)).join(""))

//  console.log(testIncomeTransaction)
//  console.log(testExpenseTransaction)

// Show notification
function showNotification(message) {
  const div = document.createElement("div"); // creating this div
  div.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 1000;
    background: #28a745;
    color: white;
    padding: 12px 20px;
    border-radius: 6px;
    `; // styling it
  div.textContent = message; // make the content equal the message that is being passed in the function
  document.body.appendChild(div); // insert this div into the body
  setTimeout(() => div.remove(), 3000); // remove the div after 3 seconds
}

// Handle add transaction
function handleAddTransactions() {
  const desc = document.getElementById("quick__description--input").value;
  const amount = document.getElementById("quick__amount--input").value;
  const type = document.getElementById("quick__transaction--type").value;

  if (addTransactions(type, desc, amount)) {
    document.getElementById("quick__description--input").value = ""; // going to reset them back to empty
    document.getElementById("quick__amount--input").value = ""; // ^
    showNotification(`Added ${moneyFormat(amount)} of ${type}`); // tell you that it has been added
    renderTransactions();
  } else {
    showNotification("Please fill all fields correctly", "error");
  }
}

function handleRemoveTransaction(id) {
  removeTransactions(id);
  showNotification("Transaction removed");
  renderTransactions();
}

document.addEventListener("DOMContentLoaded", () => {
  // Load existing data
  loadTransactions();
  renderTransactions();

  // Connect buttons to functions
  document.getElementById("quick__add--btn").onclick = handleAddTransactions;

  // Handle the "Add Income" and "Add Expense" buttons
  document.querySelectorAll(".add__transaction--btn").forEach((btn) => {
    btn.onclick = () => {
      const type = btn.dataset.type; // btn = DOM Element, dataset = special object from DOM Element, that contains all data, type = property name (from data-TYPE)
      const desc = prompt(`Enter ${type} description:`);
      const amount = prompt("Enter amount ($):");

      if (desc && amount && addTransactions(type, desc, amount)) {
        showNotification(`Added ${type}!`);
        renderTransactions();
      } else {
        showNotification("Invalid input");
      }
    };
  });
});

document
  .getElementById("quick__add--btn")
  .addEventListener("click", handleAddTransactions);

renderTransactions();
