// Script para testar acentuação nas exportações
// Execute este script no console do navegador

// Primeiro, fazer login se necessário
if (!localStorage.getItem('loggedUser')) {
    localStorage.setItem('loggedUser', 'teste');
}

// Criar algumas transações com acentuação para teste
const transacoesComAcentuacao = [
    {
        id: 'test-1',
        type: 'income',
        value: 2500.50,
        date: '2025-01-15',
        desc: 'Salário mensal - pagamento de janeiro',
        category: 'Trabalho e Educação'
    },
    {
        id: 'test-2',
        type: 'expense',
        value: 450.75,
        date: '2025-01-10',
        desc: 'Supermercado - compras básicas para alimentação',
        category: 'Alimentação'
    },
    {
        id: 'test-3',
        type: 'expense',
        value: 1200.00,
        date: '2025-01-05',
        desc: 'Prestação da casa - financiamento habitacional',
        category: 'Habitação'
    },
    {
        id: 'test-4',
        type: 'income',
        value: 800.25,
        date: '2025-01-12',
        desc: 'Freelance - desenvolvimento de aplicação web',
        category: 'Trabalho e Educação'
    },
    {
        id: 'test-5',
        type: 'expense',
        value: 85.30,
        date: '2025-01-08',
        desc: 'Farmácia - medicação para gripe e vitaminas',
        category: 'Saúde'
    },
    {
        id: 'test-6',
        type: 'expense',
        value: 320.00,
        date: '2025-01-06',
        desc: 'Combustível - gasolina para o mês de janeiro',
        category: 'Transporte'
    },
    {
        id: 'test-7',
        type: 'income',
        value: 150.00,
        date: '2025-01-14',
        desc: 'Venda de itens usados - móveis antigos da garagem',
        category: 'Vendas'
    },
    {
        id: 'test-8',
        type: 'expense',
        value: 95.60,
        date: '2025-01-11',
        desc: 'Assinatura de streaming - Netflix e Spotify',
        category: 'Entretenimento'
    }
];

// Salvar no localStorage
const user = localStorage.getItem('loggedUser');
const existingTransactions = JSON.parse(localStorage.getItem(`transactions_${user}`) || '[]');

// Adicionar apenas se não existirem transações de teste
const hasTestData = existingTransactions.some(t => t.id && t.id.startsWith('test-'));

if (!hasTestData) {
    const allTransactions = [...existingTransactions, ...transacoesComAcentuacao];
    localStorage.setItem(`transactions_${user}`, JSON.stringify(allTransactions));
    console.log('✅ Transações com acentuação adicionadas para teste!');
    console.log('Total de transações:', allTransactions.length);

    // Recarregar a página para mostrar os dados
    if (typeof updateSummary === 'function') {
        updateSummary();
    }
    if (typeof renderTransactions === 'function') {
        renderTransactions();
    }
} else {
    console.log('ℹ️ Dados de teste já existem no localStorage');
}

console.log('🔧 Para testar a exportação:');
console.log('1. Use o botão "Exportar CSV" na interface');
console.log('2. Use o botão "Exportar Excel" na interface');
console.log('3. Verifique se as acentuações aparecem corretamente');
