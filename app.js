const balanceEl= document.getElementById("balance");
const incomeEl = document.getElementById('income');
const expenseEl = document.getElementById('expense');
const listEl = document.getElementById('list');
const formEl = document.getElementById('form');
const textEl = document.getElementById('text');
const amountEl = document.getElementById('amount');

let transactions =JSON.parse(localStorage.getItem('transaction'))||[];

function addTransaction(e){
    e.preventDefault();

    const text =textEl.value.trim();
    const amount = amountEl.value.trim();

    if(!text || isNaN(amount)|| amount ===''){
        alert('Please add a description and amount')

        return;
    }
    const transaction ={
        id:generateID(),
        text:text,
        amount:parseFloat(amount)
    };

    transactions.push(transaction);
    addTransactionDOM(transaction);
    updateValues();

    textEl.value = '';
    amountEl.value = '';

}
// Generate random ID
function generateID() {
    return Math.floor(Math.random() * 1000000000);
}

// Display error message
function displayError(message) {
    const errorEl = document.createElement('p');
    errorEl.classList.add('error');
    errorEl.textContent = message;
    formEl.appendChild(errorEl);
    setTimeout(() => errorEl.remove(), 3000);
}
//Adding the Transaction to the DOM
function addTransactionDOM(transaction){
    const sign = transaction.amount < 0 ? '-':'+';
    const item =document.createElement('li');

    item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');
    item.innerHTML=`${transaction.text}<span>${sign}${Math.abs(transaction.amount).toFixed(2)}</span><button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>`
    listEl.appendChild(item);
}
// Update balance, income and expense
function updateValues() {
    const amounts = transactions.map(transaction => transaction.amount);
    const total = amounts.reduce((acc, item) => acc + item, 0).toFixed(2);
    const income = amounts.filter(item => item > 0).reduce((acc, item) => acc + item, 0).toFixed(2);
    const expense = (amounts.filter(item => item < 0).reduce((acc, item) => acc + item, 0) * -1).toFixed(2);

    balanceEl.innerText = `$${total}`;
    incomeEl.innerText = `$${income}`;
    expenseEl.innerText = `$${expense}`;
}
// Remove transaction by ID
function removeTransaction(id) {
    if (confirm('Are you sure you want to delete this transaction?')) {
        transactions = transactions.filter(transaction => transaction.id !== id);
        updateLocalStorage();
        init();
    }
}

// Update local storage
function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Initialize app
function init() {
    listEl.innerHTML = '';
    transactions.forEach(addTransactionDOM);
    updateValues();
}

// Event listeners
formEl.addEventListener('submit', addTransaction);

// Initialize app
init();