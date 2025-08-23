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

function showExportToast(id, message) {
    const toast = document.getElementById(id);
    if (toast) {
        toast.textContent = message;
        toast.style.display = 'block';
        setTimeout(() => {
            toast.style.display = 'none';
        }, 3000);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    if (document.getElementById('summaryData')) {
        window.updateSummary();
        // Atualizar resumo ao adicionar/editar/excluir transação
        window.addEventListener('storage', window.updateSummary);
        console.log('Resumo financeiro atualizado (DOMContentLoaded)');
    }
    const toast = document.getElementById('toast');
    if (localStorage.getItem('showLoginSuccess') === 'true') {
        toast.textContent = 'Login realizado com sucesso';
        toast.style.display = 'block';
        setTimeout(() => {
            toast.style.display = 'none';
            localStorage.removeItem('showLoginSuccess');
        }, 3000);
    }
    const toastReceita = document.getElementById('toastReceita');
    if (localStorage.getItem('showReceitaSuccess') === 'true') {
        toastReceita.textContent = 'Receita registrada com sucesso';
        toastReceita.style.display = 'block';
        setTimeout(() => {
            toastReceita.style.display = 'none';
            localStorage.removeItem('showReceitaSuccess');
        }, 3000);
    }
    const toastDespesa = document.getElementById('toastDespesa');
    if (localStorage.getItem('showDespesaSuccess') === 'true') {
        toastDespesa.textContent = 'Despesa registrada com sucesso';
        toastDespesa.style.display = 'block';
        setTimeout(() => {
            toastDespesa.style.display = 'none';
            localStorage.removeItem('showDespesaSuccess');
        }, 3000);
    }
    document.getElementById('exportCSV')?.addEventListener('click', function () {
        setTimeout(() => {
            showExportToast('toastExportCSV', 'Exportação CSV realizada com sucesso');
        }, 500);
    });
    document.getElementById('exportExcel')?.addEventListener('click', function () {
        setTimeout(() => {
            showExportToast('toastExportExcel', 'Exportação Excel realizada com sucesso');
        }, 500);
    });
    document.getElementById('exportPDF')?.addEventListener('click', function () {
        setTimeout(() => {
            showExportToast('toastExportPDF', 'Exportação PDF realizada com sucesso');
        }, 500);
    });
});
