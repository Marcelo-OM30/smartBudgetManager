// transactions.js - Registro, edição e exclusão de transações

const categories = [
    "Comida", "Transporte", "Entretenimento", "Compras Parceladas", "Dívidas", "Investimento", "Contas Fixas", "Despesas Imprevistas"
];

// Função global para forçar atualização do resumo (para debug)
window.forceUpdateSummary = function () {
    const transactions = getUserTransactions();
    const totalIncome = transactions.filter(tx => tx.type === 'income').reduce((sum, tx) => sum + tx.value, 0);
    const totalExpense = transactions.filter(tx => tx.type === 'expense').reduce((sum, tx) => sum + tx.value, 0);

    document.getElementById('totalIncome').innerHTML = `R$ ${totalIncome.toFixed(2)}`;
    document.getElementById('totalExpense').innerHTML = `R$ ${totalExpense.toFixed(2)}`;
    document.getElementById('currentBalance').innerHTML = `R$ ${(totalIncome - totalExpense).toFixed(2)}`;

    console.log('Forçou atualização:', { totalIncome, totalExpense, balance: totalIncome - totalExpense });
};

function getUserTransactions() {
    let user = localStorage.getItem('loggedUser');

    // TEMPORÁRIO: Se não houver usuário logado, usar um usuário de teste
    if (!user) {
        console.warn('Nenhum usuário logado! Usando usuário de teste...');
        user = 'teste@usuario.com';
        localStorage.setItem('loggedUser', user);
    }

    console.log('Usuário logado:', user);
    const key = `transactions_${user}`;
    const data = localStorage.getItem(key);
    console.log('Dados do localStorage para chave', key, ':', data);
    const transactions = JSON.parse(data || '[]');
    console.log('Transações recuperadas:', transactions);
    return transactions;
}

function saveUserTransactions(transactions) {
    let user = localStorage.getItem('loggedUser');

    // TEMPORÁRIO: Se não houver usuário logado, usar um usuário de teste
    if (!user) {
        console.warn('Nenhum usuário logado! Usando usuário de teste...');
        user = 'teste@usuario.com';
        localStorage.setItem('loggedUser', user);
    }

    console.log('Salvando transações para usuário:', user);
    const key = `transactions_${user}`;
    const data = JSON.stringify(transactions);
    localStorage.setItem(key, data);
    console.log('Dados salvos no localStorage:', key, data);

    // Verificar se foi salvo corretamente
    const saved = localStorage.getItem(key);
    console.log('Verificação pós-salvamento:', saved);
}

// Adicionar receita
if (document.getElementById('incomeForm')) {
    document.getElementById('incomeForm').addEventListener('submit', function (e) {
        e.preventDefault();
        const value = parseFloat(document.getElementById('incomeValue').value);
        const date = document.getElementById('incomeDate').value;
        const desc = document.getElementById('incomeDesc').value;
        const category = document.getElementById('incomeCategory').value || null;
        const transactions = getUserTransactions();
        transactions.push({
            type: 'income', value, date, desc, category, id: Date.now()
        });
        saveUserTransactions(transactions);
        console.log('Receita adicionada:', value, date, desc, category); // log para depuração
        console.log('Transações atuais:', transactions);

        // Verificar se os elementos existem antes de atualizar
        const totalIncomeElement = document.getElementById('totalIncome');
        const totalExpenseElement = document.getElementById('totalExpense');
        const currentBalanceElement = document.getElementById('currentBalance');

        console.log('Elementos encontrados:', {
            totalIncome: !!totalIncomeElement,
            totalExpense: !!totalExpenseElement,
            currentBalance: !!currentBalanceElement
        });

        if (totalIncomeElement && totalExpenseElement && currentBalanceElement) {
            // Forçar atualização do resumo imediatamente
            const totalIncome = transactions.filter(tx => tx.type === 'income').reduce((sum, tx) => sum + tx.value, 0);
            const totalExpense = transactions.filter(tx => tx.type === 'expense').reduce((sum, tx) => sum + tx.value, 0);

            // Usar innerHTML para forçar atualização visual
            totalIncomeElement.innerHTML = `R$ ${totalIncome.toFixed(2)}`;
            totalExpenseElement.innerHTML = `R$ ${totalExpense.toFixed(2)}`;
            currentBalanceElement.innerHTML = `R$ ${(totalIncome - totalExpense).toFixed(2)}`;

            // Forçar repaint do navegador
            totalIncomeElement.style.display = 'none';
            totalIncomeElement.offsetHeight; // trigger reflow
            totalIncomeElement.style.display = 'inline';

            console.log('Resumo atualizado:', { totalIncome, totalExpense, balance: totalIncome - totalExpense });
            console.log('Conteúdo dos elementos:', {
                totalIncome: totalIncomeElement.innerHTML,
                totalExpense: totalExpenseElement.innerHTML,
                currentBalance: currentBalanceElement.innerHTML
            });
        } else {
            console.error('Elementos do resumo não encontrados!');
        }

        renderTransactions();
        if (typeof window.updateSummary === 'function') {
            window.updateSummary();
        }
        document.getElementById('incomeForm').reset();
    });
}

// Adicionar despesa
if (document.getElementById('expenseForm')) {
    document.getElementById('expenseForm').addEventListener('submit', function (e) {
        e.preventDefault();
        const value = parseFloat(document.getElementById('expenseValue').value);
        const date = document.getElementById('expenseDate').value;
        const desc = document.getElementById('expenseDesc').value;
        const category = document.getElementById('expenseCategory').value;
        if (!category) {
            alert('Selecione uma categoria!');
            return;
        }
        const transactions = getUserTransactions();
        transactions.push({
            type: 'expense', value, date, desc, category, id: Date.now()
        });
        saveUserTransactions(transactions);

        // Forçar atualização do resumo imediatamente
        const totalIncome = transactions.filter(tx => tx.type === 'income').reduce((sum, tx) => sum + tx.value, 0);
        const totalExpense = transactions.filter(tx => tx.type === 'expense').reduce((sum, tx) => sum + tx.value, 0);
        document.getElementById('totalIncome').textContent = `R$ ${totalIncome.toFixed(2)}`;
        document.getElementById('totalExpense').textContent = `R$ ${totalExpense.toFixed(2)}`;
        document.getElementById('currentBalance').textContent = `R$ ${(totalIncome - totalExpense).toFixed(2)}`;

        renderTransactions();
        document.getElementById('expenseForm').reset();
    });
}

// Renderizar lista de transações
function renderTransactions() {
    const transactions = getUserTransactions();
    const list = document.getElementById('transactionList');
    if (!list) return;
    list.innerHTML = '';
    transactions.forEach(tx => {
        const div = document.createElement('div');
        div.className = 'transaction-item';
        div.setAttribute('data-type', tx.type);

        const typeLabel = tx.type === 'income' ? 'Receita' : 'Despesa';
        const typeIcon = tx.type === 'income' ? 'fa-arrow-up' : 'fa-arrow-down';

        div.innerHTML = `
            <div class="transaction-content">
                <div class="transaction-type">
                    <i class="fa-solid ${typeIcon}"></i> ${typeLabel}
                </div>
                <div class="transaction-details">
                    <strong>R$ ${tx.value.toFixed(2)}</strong> - ${tx.date} - ${tx.desc || ''} ${tx.category ? `- ${tx.category}` : ''}
                </div>
            </div>
            <div class="transaction-actions">
                <button onclick="editTransaction(${tx.id})">
                    <i class="fa-solid fa-edit"></i> Editar
                </button>
                <button onclick="deleteTransaction(${tx.id})">
                    <i class="fa-solid fa-trash"></i> Excluir
                </button>
            </div>
        `;
        list.appendChild(div);
    });

    // Forçar atualização do resumo imediatamente
    const totalIncome = transactions.filter(tx => tx.type === 'income').reduce((sum, tx) => sum + tx.value, 0);
    const totalExpense = transactions.filter(tx => tx.type === 'expense').reduce((sum, tx) => sum + tx.value, 0);
    document.getElementById('totalIncome').textContent = `R$ ${totalIncome.toFixed(2)}`;
    document.getElementById('totalExpense').textContent = `R$ ${totalExpense.toFixed(2)}`;
    document.getElementById('currentBalance').textContent = `R$ ${(totalIncome - totalExpense).toFixed(2)}`;

    // Atualiza gráficos após renderizar transações
    if (typeof renderCharts === 'function') {
        renderCharts();
    }
}// Editar transação
function editTransaction(id) {
    const transactions = getUserTransactions();
    const tx = transactions.find(t => t.id === id);
    if (!tx) return;
    const value = prompt('Novo valor:', tx.value);
    if (value === null) return;
    tx.value = parseFloat(value);
    tx.desc = prompt('Nova descrição:', tx.desc);
    tx.date = prompt('Nova data:', tx.date);
    if (tx.type === 'expense') {
        tx.category = prompt('Nova categoria:', tx.category);
    }
    saveUserTransactions(transactions);
    renderTransactions();
}

// Excluir transação
function deleteTransaction(id) {
    let transactions = getUserTransactions();
    transactions = transactions.filter(t => t.id !== id);
    saveUserTransactions(transactions);
    renderTransactions();
}

// Inicializar lista ao carregar
if (document.getElementById('transactionList')) {
    renderTransactions();
}
