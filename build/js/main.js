import { StorageManager } from "./storage.js";
// ---------- Utilities ----------
const formatObj = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
});
const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);
// ---------- DOM refs ----------
const form = document.getElementById("expense-form");
const expenseInput = document.getElementById("expense");
const amountInput = document.getElementById("amount");
const categorySelect = document.getElementById("category");
const dateInput = document.getElementById("date");
const paymentSelect = document.getElementById("payment-method");
const paidToInput = document.getElementById("paid-to");
const noteInput = document.getElementById("note");
const clearBtn = document.getElementById("clear-btn");
const filterCategory = document.getElementById("filter-category");
const filterMonth = document.getElementById("filter-month");
const tbody = document.getElementById("expense-tbody");
const summary = document.getElementById("summary");
// ---------- State ----------
const store = new StorageManager("ts-expenses");
let expenses = store.load([]);
let filters = { category: "all" };
dateInput.valueAsDate = new Date();
// ---------- Derived / selectors ----------
function filteredExpenses() {
    return expenses.filter((e) => {
        const byCategory = filters.category === "all" || e.category === filters.category;
        const byMonth = !filters.monthISO || e.dateISO.startsWith(filters.monthISO);
        return byCategory && byMonth;
    });
}
function totalAmount(list) {
    return list.reduce((sum, e) => sum + e.amount, 0);
}
// ---------- Render ----------
function render() {
    const list = filteredExpenses();
    tbody.innerHTML = "";
    for (const e of list) {
        const tr = document.createElement("tr");
        const tdDate = document.createElement("td");
        tdDate.textContent = e.dateISO;
        const tdExpense = document.createElement("td");
        tdExpense.textContent = e.expense;
        const tdCategory = document.createElement("td");
        tdCategory.textContent = e.category;
        const tdPayMethod = document.createElement("td");
        tdPayMethod.textContent = paymentType(e.paymentMethod);
        const tdPaidTo = document.createElement("td");
        tdPaidTo.textContent = e.paidTo ?? "";
        const tdAmountPaid = document.createElement("td");
        tdAmountPaid.textContent = formatObj.format(e.amount);
        const tdNote = document.createElement("td");
        tdNote.textContent = e.note ?? "";
        const tdActions = document.createElement("td");
        const delBtn = document.createElement("button");
        delBtn.textContent = "Delete";
        delBtn.className = "btn-delete";
        delBtn.addEventListener("click", () => removeExpense(e.id));
        tdActions.appendChild(delBtn);
        tr.append(tdDate, tdExpense, tdCategory, tdPayMethod, tdPaidTo, tdAmountPaid, tdNote, tdActions);
        tbody.appendChild(tr);
    }
    const total = totalAmount(list);
    summary.textContent = `Total Expenses: ${formatObj.format(total)}`;
    disableClearBtn();
}
function paymentType(p) {
    switch (p) {
        case "cash":
            return "Cash";
        case "credit":
            return "Credit Card";
        case "debit":
            return "Debit Card";
        case "bank":
            return "Bank Transfer";
        case "mobile":
            return "Mobile Payment";
        case "check":
            return "Check";
        case "other":
            return "Other";
    }
}
// ---------- Mutations ----------
function addExpense(data) {
    const paidTo = data.paidTo?.trim();
    const note = data.note?.trim();
    const item = {
        id: uid(),
        expense: data.expense.trim(),
        amount: data.amount,
        category: data.category,
        paymentMethod: data.paymentMethod,
        dateISO: data.dateISO,
        createdAt: Date.now(),
        ...(paidTo ? { paidTo } : {}),
        ...(note ? { note } : {}),
    };
    expenses = [item, ...expenses];
    store.save(expenses);
    render();
}
function removeExpense(id) {
    expenses = expenses.filter((e) => e.id !== id);
    store.save(expenses);
    render();
}
function clearAll() {
    if (!confirm("Are you sure you want to delete all expenses? This action can't be undone."))
        return;
    expenses = [];
    store.save(expenses);
    render();
}
function disableClearBtn() {
    if (!clearBtn || !tbody)
        return;
    clearBtn.disabled = tbody.rows.length === 0;
}
// ---------- Events ----------
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const expense = expenseInput.value;
    if (!expense.trim()) {
        alert("Please enter an expense name.");
        return;
    }
    const amount = Number(amountInput.value);
    if (!Number.isFinite(amount) || amount <= 0) {
        alert("Please enter a valid number greater than 0.");
        return;
    }
    const category = categorySelect.value;
    const paymentMethod = paymentSelect.value;
    const dateISO = dateInput.value;
    if (!dateISO) {
        alert("Please select a date.");
        return;
    }
    addExpense({
        expense,
        amount,
        category,
        dateISO,
        paymentMethod,
        paidTo: paidToInput.value,
        note: noteInput.value,
    });
    form.reset();
    dateInput.valueAsDate = new Date();
});
clearBtn.addEventListener("click", clearAll);
filterCategory.addEventListener("change", () => {
    filters.category = filterCategory.value;
    render();
});
filterMonth.addEventListener("change", () => {
    if (filterMonth.value)
        filters.monthISO = filterMonth.value;
    else
        delete filters.monthISO;
    render();
});
// ---------- Init ----------
render();
