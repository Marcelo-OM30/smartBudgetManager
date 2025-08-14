// goals.js - Metas de orçamento

function getUserGoal() {
    const user = localStorage.getItem('loggedUser');
    return parseFloat(localStorage.getItem(`goal_${user}`) || '0');
}

function setUserGoal(value) {
    const user = localStorage.getItem('loggedUser');
    localStorage.setItem(`goal_${user}`, value);
}

function checkGoalAlert() {
    const goal = getUserGoal();
    const transactions = JSON.parse(localStorage.getItem(`transactions_${localStorage.getItem('loggedUser')}`) || '[]');
    let totalExpense = 0;
    transactions.forEach(tx => {
        if (tx.type === 'expense') totalExpense += tx.value;
    });
    const alert = document.getElementById('goalAlert');
    const goalDisplay = document.getElementById('goalValueDisplay');
    if (goalDisplay) {
        if (goal > 0) {
            goalDisplay.textContent = `Meta mensal definida: R$ ${goal.toFixed(2)}`;
        } else {
            goalDisplay.textContent = '';
        }
    }
    if (!alert) return;
    if (goal > 0) {
        if (totalExpense >= goal) {
            alert.textContent = 'Atenção: Você ultrapassou o limite mensal de despesas!';
            alert.style.color = 'red';
        } else if (totalExpense >= goal * 0.9) {
            alert.textContent = 'Alerta: Você está próximo do limite mensal de despesas.';
            alert.style.color = 'orange';
        } else {
            alert.textContent = '';
        }
    } else {
        alert.textContent = '';
    }
}

if (document.getElementById('goalForm')) {
    document.getElementById('goalForm').addEventListener('submit', function (e) {
        e.preventDefault();
        const value = parseFloat(document.getElementById('goalValue').value);
        setUserGoal(value);
        checkGoalAlert();
        document.getElementById('goalForm').reset();
    });
    checkGoalAlert();
    window.addEventListener('storage', checkGoalAlert);
}
