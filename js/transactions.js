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

// Funções de validação
function isValidDate(dateStr) {
    // Aceita formato yyyy-mm-dd
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return false;
    // Não pode ser 00/00/0000 ou datas impossíveis
    if (/^0{4}-0{2}-0{2}$/.test(dateStr)) return false;
    // Não pode ser anterior a 50 anos atrás
    const minDate = new Date();
    minDate.setFullYear(minDate.getFullYear() - 50);
    if (date < minDate) return false;
    // Não pode ser futura
    if (date > new Date()) return false;
    // Verifica datas impossíveis (ex: 30/02)
    const [year, month, day] = dateStr.split('-').map(Number);
    if (month < 1 || month > 12 || day < 1 || day > 31) return false;
    if ([4, 6, 9, 11].includes(month) && day > 30) return false;
    if (month === 2) {
        const isLeap = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
        if (day > (isLeap ? 29 : 28)) return false;
    }
    return true;
}

function isValidDesc(desc) {
    // Aceita até 200 caracteres, apenas letras (com acentuação) e espaços, não aceita números
    return desc.length <= 200 && /^[A-Za-zÀ-ÿ\s]+$/.test(desc) && !/[0-9]/.test(desc);
}

// Banner de erro personalizado
function showErrorBanner(message) {
    let banner = document.getElementById('errorBanner');
    if (!banner) {
        banner = document.createElement('div');
        banner.id = 'errorBanner';
        banner.style.position = 'fixed';
        banner.style.top = '0';
        banner.style.left = '0';
        banner.style.width = '100%';
        banner.style.background = '#ff4d4d';
        banner.style.color = '#fff';
        banner.style.padding = '16px';
        banner.style.textAlign = 'center';
        banner.style.zIndex = '9999';
        banner.style.fontWeight = 'bold';
        banner.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
        banner.innerHTML = `<span id="errorBannerMsg"></span> <button id="closeErrorBanner" style="margin-left:16px;background:#fff;color:#ff4d4d;border:none;padding:4px 8px;cursor:pointer;font-weight:bold;">X</button>`;
        document.body.appendChild(banner);
        document.getElementById('closeErrorBanner').onclick = function () {
            banner.remove();
        };
    }
    document.getElementById('errorBannerMsg').textContent = message;
    banner.style.display = 'block';
    setTimeout(() => {
        if (banner) banner.style.display = 'none';
    }, 5000);
}

// Função para exibir toast
function showToast(id, message) {
    const toast = document.getElementById(id);
    if (toast) {
        toast.textContent = message;
        toast.style.display = 'block';
        setTimeout(() => {
            toast.style.display = 'none';
        }, 3000);
    }
}

// Adicionar receita
if (document.getElementById('incomeForm')) {
    document.getElementById('incomeForm').addEventListener('submit', function (e) {
        e.preventDefault();
        const value = parseFloat(document.getElementById('incomeValue').value);
        let date = document.getElementById('incomeDate').value;
        const desc = document.getElementById('incomeDesc').value;
        const category = document.getElementById('incomeCategory').value || null;

        // Validações de campos obrigatórios
        if (!document.getElementById('incomeValue').value) {
            showErrorBanner('O campo "Valor" não pode ficar em branco.');
            return;
        }
        if (!document.getElementById('incomeDate').value) {
            showErrorBanner('O campo "Data" não pode ficar em branco.');
            return;
        }
        // Validações
        if (isNaN(value) || value <= 0) {
            showErrorBanner('O valor da receita deve ser positivo.');
            return;
        }
        if (!isValidDate(date)) {
            showErrorBanner('Data inválida.');
            return;
        }
        if (!isValidDesc(desc)) {
            showErrorBanner('Descrição deve ter até 200 caracteres e conter apenas letras.');
            return;
        }

        // Converter data para formato ISO (YYYY-MM-DD) se estiver no formato brasileiro (DD/MM/YYYY)
        if (/^\d{2}\/\d{2}\/\d{4}$/.test(date)) {
            const [day, month, year] = date.split('/');
            date = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
            document.getElementById('incomeDate').value = date;
        }

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

        // Registrar flag de sucesso
        localStorage.setItem('showReceitaSuccess', 'true');

        // Exibir toast de sucesso
        showToast('toastReceita', 'Receita registrada com sucesso');
    });
}

// Adicionar despesa
if (document.getElementById('expenseForm')) {
    document.getElementById('expenseForm').addEventListener('submit', function (e) {
        e.preventDefault();
        const value = parseFloat(document.getElementById('expenseValue').value);
        let date = document.getElementById('expenseDate').value;
        const desc = document.getElementById('expenseDesc').value;
        const category = document.getElementById('expenseCategory').value;

        // Validações de campos obrigatórios
        if (!document.getElementById('expenseValue').value) {
            showErrorBanner('O campo "Valor" não pode ficar em branco.');
            return;
        }
        if (!document.getElementById('expenseDate').value) {
            showErrorBanner('O campo "Data" não pode ficar em branco.');
            return;
        }
        if (!document.getElementById('expenseCategory').value) {
            showErrorBanner('O campo "Categoria" não pode ficar em branco.');
            return;
        }
        // Validações
        if (isNaN(value) || value <= 0) {
            showErrorBanner('O valor da despesa deve ser positivo.');
            return;
        }
        if (!isValidDate(date)) {
            showErrorBanner('Data inválida.');
            return;
        }
        if (!isValidDesc(desc)) {
            showErrorBanner('Descrição deve ter até 200 caracteres e conter apenas letras.');
            return;
        }
        const transactions = getUserTransactions();
        transactions.push({
            type: 'expense', value, date, desc, category, id: Date.now()
        });
        saveUserTransactions(transactions);

        // Converter data para formato ISO (YYYY-MM-DD) se estiver no formato brasileiro (DD/MM/YYYY)
        if (/^\d{2}\/\d{2}\/\d{4}$/.test(date)) {
            const [day, month, year] = date.split('/');
            date = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
            document.getElementById('expenseDate').value = date;
        }

        // Forçar atualização do resumo imediatamente
        const totalIncome = transactions.filter(tx => tx.type === 'income').reduce((sum, tx) => sum + tx.value, 0);
        const totalExpense = transactions.filter(tx => tx.type === 'expense').reduce((sum, tx) => sum + tx.value, 0);
        document.getElementById('totalIncome').textContent = `R$ ${totalIncome.toFixed(2)}`;
        document.getElementById('totalExpense').textContent = `R$ ${totalExpense.toFixed(2)}`;
        document.getElementById('currentBalance').textContent = `R$ ${(totalIncome - totalExpense).toFixed(2)}`;

        renderTransactions();
        document.getElementById('expenseForm').reset();

        // Registrar flag de sucesso
        localStorage.setItem('showDespesaSuccess', 'true');

        // Exibir toast de sucesso
        showToast('toastDespesa', 'Despesa registrada com sucesso');
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
