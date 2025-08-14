// Script de debug para verificar se os botões estão funcionando
// Execute este código no console do navegador

console.log('🔍 Verificando elementos de exportação...');

// Verificar se os botões existem
const exportCSV = document.getElementById('exportCSV');
const exportExcel = document.getElementById('exportExcel');
const exportPDF = document.getElementById('exportPDF');
const backupData = document.getElementById('backupData');

console.log('Botão CSV:', exportCSV ? '✅ Encontrado' : '❌ Não encontrado');
console.log('Botão Excel:', exportExcel ? '✅ Encontrado' : '❌ Não encontrado');
console.log('Botão PDF:', exportPDF ? '✅ Encontrado' : '❌ Não encontrado');
console.log('Botão Backup:', backupData ? '✅ Encontrado' : '❌ Não encontrado');

// Verificar se as funções existem
console.log('Função exportCSV:', typeof exportCSV !== 'undefined' ? '✅ Definida' : '❌ Não definida');
console.log('Função exportExcel:', typeof exportExcel !== 'undefined' ? '✅ Definida' : '❌ Não definida');
console.log('Função exportPDF:', typeof exportPDF !== 'undefined' ? '✅ Definida' : '❌ Não definida');
console.log('Função backupData:', typeof backupData !== 'undefined' ? '✅ Definida' : '❌ Não definida');

// Verificar event listeners
if (exportPDF) {
    console.log('Event listener do PDF:', exportPDF.onclick ? '✅ Configurado' : '❌ Não configurado');

    // Adicionar listener de teste
    exportPDF.addEventListener('click', function () {
        console.log('🖱️ Botão PDF clicado!');
    });
}

// Verificar se há usuário logado
const loggedUser = localStorage.getItem('loggedUser');
console.log('Usuário logado:', loggedUser ? `✅ ${loggedUser}` : '❌ Nenhum usuário');

// Verificar se há transações
const transactions = JSON.parse(localStorage.getItem(`transactions_${loggedUser}`) || '[]');
console.log('Transações:', transactions.length > 0 ? `✅ ${transactions.length} transações` : '❌ Nenhuma transação');

// Testar função exportPDF diretamente
console.log('🧪 Testando função exportPDF diretamente...');
if (typeof exportPDF === 'function') {
    console.log('Clique no botão PDF ou execute: exportPDF()');
} else {
    console.log('❌ Função exportPDF não está disponível');
}
