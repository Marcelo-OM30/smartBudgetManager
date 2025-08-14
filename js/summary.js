// summary.js - Resumo financeiro

window.updateSummary = function updateSummary() {
    const transactions = JSON.parse(localStorage.getItem(`transactions_${localStorage.getItem('loggedUser')}`) || '[]');
    let totalIncome = 0, totalExpense = 0;
    transactions.forEach(tx => {
        if (tx.type === 'income') totalIncome += tx.value;
        else if (tx.type === 'expense') totalExpense += tx.value;
    });
    document.getElementById('totalIncome').textContent = `R$ ${totalIncome.toFixed(2)}`;
    document.getElementById('totalExpense').textContent = `R$ ${totalExpense.toFixed(2)}`;
    document.getElementById('currentBalance').textContent = `R$ ${(totalIncome - totalExpense).toFixed(2)}`;
}

document.addEventListener('DOMContentLoaded', function () {
    if (document.getElementById('summaryData')) {
        window.updateSummary();
        // Atualizar resumo ao adicionar/editar/excluir transação
        window.addEventListener('storage', window.updateSummary);
        console.log('Resumo financeiro atualizado (DOMContentLoaded)');
    }
});
