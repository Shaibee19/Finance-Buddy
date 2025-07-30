/* =====================
    PART 1 JS (Kat) - DATA & STORAGE
    ===================== */

let transactions = []; // 1. Start with the data structure

// 2. Storage (How we save/load data)
function saveTransactions() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

function loadTransactions() {
  const saved = localStorage.getItem("transactions");
  if (saved) transactions = JSON.parse(saved);
}

// 3. Core Operations (What we can do with data)
function addTransactions(type, description, amount) {
  if (!description || amount <= 0) return false;

  transactions.push({
    id: Date.now(),
    type,
    description,
    amount: +amount,
    date: new Date().toLocaleDateString(),
  });

  saveTransactions();
  return true;
}

function removeTransactions(id) {
  transactions = transactions.filter((t) => t.id !== id);
  saveTransactions();
}

// 4. Calculations (How we process the data)
function getTotalTransactions() {
  const income = transactions.filter((t) => t.type === "income");
  const expenses = transactions.filter((t) => t.type === "expense");

  return {
    income,
    expenses,
    incomeTotal: income.reduce((sum, t) => sum + t.amount, 0),
    expenseTotal: expenses.reduce((sum, t) => sum + t.amount, 0),
    get balance() {
      return this.incomeTotal - this.expenseTotal;
    },
  };
}

// 5. Utilities (Helper functions)
function moneyFormat(amount) {
  return `$${(+amount).toFixed(2)}`;
}