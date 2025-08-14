// export.js - Exportação CSV, PDF e backup

function exportCSV() {
    const transactions = JSON.parse(localStorage.getItem(`transactions_${localStorage.getItem('loggedUser')}`) || '[]');
    const loggedUser = localStorage.getItem('loggedUser') || 'Usuario';
    const currentDate = new Date().toLocaleDateString('pt-BR');

    // Usar ponto e vírgula como separador (padrão brasileiro)
    let csv = '';

    // Cabeçalho informativo com escape correto
    csv += `Smart Budget Manager - Relatório de Transações;;;;;\n`;
    csv += `Usuário: "${loggedUser}";;;;;\n`;
    csv += `Data de Exportação: "${currentDate}";;;;;\n`;
    csv += `Total de Transações: ${transactions.length};;;;;\n`;
    csv += `;;;;;\n`; // Linha em branco

    // Cabeçalhos das colunas
    csv += `Tipo;Valor (R$);Data;Descrição;Categoria;ID\n`;

    // Ordenar transações por data
    const sortedTransactions = transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Dados das transações
    sortedTransactions.forEach(tx => {
        const tipo = tx.type === 'income' ? 'RECEITA' : 'DESPESA';
        const valor = tx.value.toFixed(2).replace('.', ',');
        const data = new Date(tx.date).toLocaleDateString('pt-BR');
        // Preservar acentuações e caracteres especiais, apenas escapar ponto e vírgula e aspas
        const descricao = (tx.desc || 'Sem descrição').replace(/"/g, '""');
        const categoria = (tx.category || 'Sem categoria').replace(/"/g, '""');
        const id = tx.id || '';

        // Usar aspas para campos que podem conter caracteres especiais
        csv += `"${tipo}";"R$ ${valor}";"${data}";"${descricao}";"${categoria}";"${id}"\n`;
    });

    // Resumo financeiro
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.value, 0);
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.value, 0);
    const balance = totalIncome - totalExpense;

    csv += `;;;;;\n`; // Linha em branco
    csv += `"RESUMO FINANCEIRO";;;;;\n`;
    csv += `"Total de Receitas";"R$ ${totalIncome.toFixed(2).replace('.', ',')}";;;;\n`;
    csv += `"Total de Despesas";"R$ ${totalExpense.toFixed(2).replace('.', ',')}";;;;\n`;
    csv += `"Saldo Atual";"R$ ${balance.toFixed(2).replace('.', ',')}";;;;\n`;

    // Adicionar BOM para UTF-8 (garante que o Excel abra corretamente com acentuações)
    const BOM = '\uFEFF';
    const csvContent = BOM + csv;

    // Criar blob com encoding UTF-8 explícito e configuração específica para acentuação
    const encoder = new TextEncoder('utf-8');
    const csvBytes = encoder.encode(csvContent);
    const blob = new Blob([csvBytes], {
        type: 'text/csv;charset=utf-8'
    });

    // Download com tratamento específico para diferentes navegadores
    const link = document.createElement('a');
    if (window.navigator.msSaveOrOpenBlob) {
        // Para Internet Explorer
        window.navigator.msSaveBlob(blob, `smart-budget-relatorio-${new Date().toISOString().slice(0, 10)}.csv`);
    } else {
        // Para outros navegadores
        link.href = URL.createObjectURL(blob);
        link.download = `smart-budget-relatorio-${new Date().toISOString().slice(0, 10)}.csv`;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    }

    alert('CSV exportado com sucesso! Arquivo preparado para preservar acentuações.\n\nDicas:\n• Abra no Excel usando "Dados > Obter Dados > Do Arquivo"\n• Selecione codificação UTF-8 se solicitado\n• Use ponto e vírgula como separador');
}

function exportExcel() {
    const transactions = JSON.parse(localStorage.getItem(`transactions_${localStorage.getItem('loggedUser')}`) || '[]');
    const loggedUser = localStorage.getItem('loggedUser') || 'Usuario';

    // Criar dados estruturados para a tabela
    const data = [];

    // Cabeçalho informativo
    data.push(['Smart Budget Manager - Relatório de Transações', '', '', '', '', '']);
    data.push([`Usuário: ${loggedUser}`, '', '', '', '', '']);
    data.push([`Data: ${new Date().toLocaleDateString('pt-BR')}`, '', '', '', '', '']);
    data.push([`Total: ${transactions.length} transações`, '', '', '', '', '']);
    data.push(['', '', '', '', '', '']); // Linha vazia

    // Cabeçalhos das colunas
    data.push(['Tipo', 'Valor (R$)', 'Data', 'Descrição', 'Categoria', 'ID']);

    // Ordenar e adicionar transações
    const sortedTransactions = transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    sortedTransactions.forEach(tx => {
        data.push([
            tx.type === 'income' ? 'RECEITA' : 'DESPESA',
            `R$ ${tx.value.toFixed(2).replace('.', ',')}`,
            new Date(tx.date).toLocaleDateString('pt-BR'),
            tx.desc || 'Sem descrição',
            tx.category || 'Sem categoria',
            tx.id || ''
        ]);
    });

    // Resumo
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.value, 0);
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.value, 0);
    const balance = totalIncome - totalExpense;

    data.push(['', '', '', '', '', '']); // Linha vazia
    data.push(['RESUMO FINANCEIRO', '', '', '', '', '']);
    data.push(['Total de Receitas', `R$ ${totalIncome.toFixed(2).replace('.', ',')}`, '', '', '', '']);
    data.push(['Total de Despesas', `R$ ${totalExpense.toFixed(2).replace('.', ',')}`, '', '', '', '']);
    data.push(['Saldo Atual', `R$ ${balance.toFixed(2).replace('.', ',')}`, '', '', '', '']);

    // Converter para HTML table e baixar
    let tableHTML = '<table border="1" style="border-collapse: collapse;">';
    data.forEach((row, index) => {
        tableHTML += '<tr>';
        row.forEach(cell => {
            const style = index < 5 ? 'font-weight: bold; background-color: #f0f0f0;' :
                index === 5 ? 'font-weight: bold; background-color: #e0e0e0;' : '';
            // Escapar caracteres especiais para HTML
            const escapedCell = String(cell)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
            tableHTML += `<td style="${style}">${escapedCell}</td>`;
        });
        tableHTML += '</tr>';
    });
    tableHTML += '</table>';

    // Adicionar encoding UTF-8 explícito no HTML
    const htmlContent = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Transações</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
    </head>
    <body>
        ${tableHTML}
    </body>
    </html>`;

    // Criar arquivo Excel com BOM para UTF-8 e encoding explícito
    const BOM = '\uFEFF';
    const fullContent = BOM + htmlContent;

    // Usar TextEncoder para garantir UTF-8
    const encoder = new TextEncoder('utf-8');
    const contentBytes = encoder.encode(fullContent);
    const blob = new Blob([contentBytes], {
        type: 'application/vnd.ms-excel;charset=utf-8'
    });

    const link = document.createElement('a');
    if (window.navigator.msSaveOrOpenBlob) {
        // Para Internet Explorer
        window.navigator.msSaveBlob(blob, `smart-budget-relatorio-${new Date().toISOString().slice(0, 10)}.xls`);
    } else {
        // Para outros navegadores
        link.href = URL.createObjectURL(blob);
        link.download = `smart-budget-relatorio-${new Date().toISOString().slice(0, 10)}.xls`;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    }

    alert('Arquivo Excel exportado com sucesso!\n\nAs acentuações devem aparecer corretamente.\nSe houver problemas, tente abrir com LibreOffice Calc.');
}

function exportPDF() {
    console.log('🔍 Iniciando exportPDF...');

    // Verificar se jsPDF está disponível (pode estar em window.jspdf ou window.jsPDF)
    const hasjsPDF = typeof jsPDF !== 'undefined' || (window.jspdf && window.jspdf.jsPDF);

    if (!hasjsPDF) {
        console.log('📚 jsPDF não encontrado, carregando biblioteca...');

        // Mostrar loading
        const originalButton = document.getElementById('exportPDF');
        if (!originalButton) {
            console.error('❌ Botão exportPDF não encontrado');
            return;
        }

        const originalText = originalButton.innerHTML;
        originalButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Carregando...';
        originalButton.disabled = true;

        // Carregar jsPDF
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';

        script.onload = function () {
            console.log('✅ jsPDF carregado com sucesso');
            // Restaurar botão
            originalButton.innerHTML = originalText;
            originalButton.disabled = false;
            // Aguardar um pouco para garantir que a biblioteca está disponível
            setTimeout(() => {
                console.log('🔄 Reexecutando exportPDF...');
                exportPDF();
            }, 200);
        };

        script.onerror = function () {
            console.error('❌ Erro ao carregar jsPDF');
            originalButton.innerHTML = originalText;
            originalButton.disabled = false;
            alert('Erro ao carregar biblioteca PDF. Verifique sua conexão com a internet.');
        };

        document.head.appendChild(script);
        return;
    }

    try {
        console.log('📄 Gerando PDF...');

        const transactions = JSON.parse(localStorage.getItem(`transactions_${localStorage.getItem('loggedUser')}`) || '[]');
        const loggedUser = localStorage.getItem('loggedUser') || 'Usuario';

        console.log(`📊 Encontradas ${transactions.length} transações para ${loggedUser}`);

        // Criar novo documento PDF - usar a referência correta
        const PDFLib = window.jspdf ? window.jspdf.jsPDF : jsPDF;
        const doc = new PDFLib();

        console.log('📋 Documento PDF criado');

        // Configurar fonte para suportar acentuação
        doc.setFont('helvetica');
        doc.setFontSize(16);

        // Título
        doc.text('Smart Budget Manager - Relatorio', 20, 20);
        doc.setFontSize(12);
        doc.text(`Usuario: ${loggedUser}`, 20, 30);
        doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, 20, 40);

        // Resumo financeiro
        const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.value, 0);
        const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.value, 0);
        const balance = totalIncome - totalExpense;

        doc.setFontSize(14);
        doc.text('Resumo Financeiro:', 20, 60);
        doc.setFontSize(10);
        doc.text(`Total de Receitas: R$ ${totalIncome.toFixed(2).replace('.', ',')}`, 20, 70);
        doc.text(`Total de Despesas: R$ ${totalExpense.toFixed(2).replace('.', ',')}`, 20, 80);
        doc.text(`Saldo Atual: R$ ${balance.toFixed(2).replace('.', ',')}`, 20, 90);

        // Transações
        if (transactions.length > 0) {
            doc.setFontSize(14);
            doc.text('Transacoes:', 20, 110);
            doc.setFontSize(8);

            let y = 120;
            const pageHeight = doc.internal.pageSize.height;

            // Ordenar transações por data
            const sortedTransactions = transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

            sortedTransactions.forEach((tx, index) => {
                if (y > pageHeight - 20) {
                    doc.addPage();
                    y = 20;
                }

                const tipo = tx.type === 'income' ? 'RECEITA' : 'DESPESA';
                const valor = `R$ ${tx.value.toFixed(2).replace('.', ',')}`;
                const data = new Date(tx.date).toLocaleDateString('pt-BR');
                // Remover acentos para evitar problemas no PDF
                const desc = (tx.desc || 'Sem descricao').substring(0, 25).replace(/[àáâãäå]/g, 'a').replace(/[èéêë]/g, 'e').replace(/[ìíîï]/g, 'i').replace(/[òóôõö]/g, 'o').replace(/[ùúûü]/g, 'u').replace(/[ç]/g, 'c');
                const categoria = (tx.category || 'Sem categoria').replace(/[àáâãäå]/g, 'a').replace(/[èéêë]/g, 'e').replace(/[ìíîï]/g, 'i').replace(/[òóôõö]/g, 'o').replace(/[ùúûü]/g, 'u').replace(/[ç]/g, 'c');

                doc.text(`${tipo}`, 20, y);
                doc.text(`${valor}`, 60, y);
                doc.text(`${data}`, 100, y);
                doc.text(`${desc}`, 130, y);

                y += 10;
            });
        } else {
            doc.setFontSize(12);
            doc.text('Nenhuma transacao encontrada.', 20, 120);
        }

        console.log('💾 Salvando PDF...');

        // Salvar arquivo
        doc.save(`smart-budget-relatorio-${new Date().toISOString().slice(0, 10)}.pdf`);

        console.log('✅ PDF gerado com sucesso!');
        alert('PDF exportado com sucesso!');

    } catch (error) {
        console.error('❌ Erro ao gerar PDF:', error);
        alert(`Erro ao gerar PDF: ${error.message}\n\nTente novamente ou use outro formato de exportação.`);

        // Restaurar botão se houver erro
        const button = document.getElementById('exportPDF');
        if (button) {
            button.disabled = false;
            button.innerHTML = '<i class="fa-solid fa-file-pdf"></i> Exportar PDF';
        }
    }
}

// Função alternativa simples para PDF (usando window.print)
function exportPDFSimple() {
    const transactions = JSON.parse(localStorage.getItem(`transactions_${localStorage.getItem('loggedUser')}`) || '[]');
    const loggedUser = localStorage.getItem('loggedUser') || 'Usuario';

    // Criar HTML para impressão
    const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Smart Budget Manager - Relatório</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                h1 { color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px; }
                h2 { color: #666; margin-top: 30px; }
                .info { background: #f8f9fa; padding: 10px; border-radius: 5px; margin: 10px 0; }
                table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #007bff; color: white; }
                .income { color: #28a745; }
                .expense { color: #dc3545; }
                @media print {
                    body { margin: 0; }
                    button { display: none; }
                }
            </style>
        </head>
        <body>
            <h1>Smart Budget Manager - Relatório</h1>
            <div class="info">
                <strong>Usuário:</strong> ${loggedUser}<br>
                <strong>Data:</strong> ${new Date().toLocaleDateString('pt-BR')}<br>
                <strong>Total de Transações:</strong> ${transactions.length}
            </div>
            
            <h2>Resumo Financeiro</h2>
            <table>
                <tr>
                    <td><strong>Total de Receitas</strong></td>
                    <td class="income">R$ ${transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.value, 0).toFixed(2).replace('.', ',')}</td>
                </tr>
                <tr>
                    <td><strong>Total de Despesas</strong></td>
                    <td class="expense">R$ ${transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.value, 0).toFixed(2).replace('.', ',')}</td>
                </tr>
                <tr>
                    <td><strong>Saldo Atual</strong></td>
                    <td><strong>R$ ${(transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.value, 0) - transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.value, 0)).toFixed(2).replace('.', ',')}</strong></td>
                </tr>
            </table>
            
            <h2>Transações</h2>
            <table>
                <thead>
                    <tr>
                        <th>Tipo</th>
                        <th>Valor</th>
                        <th>Data</th>
                        <th>Descrição</th>
                        <th>Categoria</th>
                    </tr>
                </thead>
                <tbody>
                    ${transactions.sort((a, b) => new Date(b.date) - new Date(a.date)).map(tx => `
                        <tr>
                            <td class="${tx.type}">${tx.type === 'income' ? 'RECEITA' : 'DESPESA'}</td>
                            <td>R$ ${tx.value.toFixed(2).replace('.', ',')}</td>
                            <td>${new Date(tx.date).toLocaleDateString('pt-BR')}</td>
                            <td>${tx.desc || 'Sem descrição'}</td>
                            <td>${tx.category || 'Sem categoria'}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            
            <script>
                window.onload = function() {
                    window.print();
                    window.onafterprint = function() {
                        window.close();
                    };
                };
            </script>
        </body>
        </html>
    `;

    // Abrir nova janela e imprimir
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
}

function backupData() {
    const user = localStorage.getItem('loggedUser');
    const data = {
        transactions: JSON.parse(localStorage.getItem(`transactions_${user}`) || '[]'),
        goal: localStorage.getItem(`goal_${user}`) || ''
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'backup_smart_budget.json';
    link.click();
}

// Configurar event listeners quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function () {
    console.log('🔧 Configurando event listeners de exportação...');

    const exportCSVBtn = document.getElementById('exportCSV');
    const exportExcelBtn = document.getElementById('exportExcel');
    const exportPDFBtn = document.getElementById('exportPDF');
    const backupDataBtn = document.getElementById('backupData');

    if (exportCSVBtn) {
        exportCSVBtn.addEventListener('click', exportCSV);
        console.log('✅ Event listener CSV configurado');
    }

    if (exportExcelBtn) {
        exportExcelBtn.addEventListener('click', exportExcel);
        console.log('✅ Event listener Excel configurado');
    }

    if (exportPDFBtn) {
        exportPDFBtn.addEventListener('click', function (e) {
            e.preventDefault();
            console.log('🖱️ Botão PDF clicado!');

            // Oferecer escolha entre PDF com biblioteca ou impressão
            const choice = confirm('Escolha o método de geração do PDF:\n\nOK = PDF com biblioteca (recomendado)\nCancelar = Abrir para impressão/salvar como PDF');

            if (choice) {
                exportPDF();
            } else {
                exportPDFSimple();
            }
        });
        console.log('✅ Event listener PDF configurado');
    }

    if (backupDataBtn) {
        backupDataBtn.addEventListener('click', backupData);
        console.log('✅ Event listener Backup configurado');
    }
});

// Fallback para caso o script seja carregado após o DOM
if (document.readyState === 'loading') {
    // DOM ainda está carregando, aguardar evento
    console.log('⏳ Aguardando DOM carregar...');
} else {
    // DOM já carregado, configurar listeners imediatamente
    console.log('🚀 DOM já carregado, configurando listeners...');
    setTimeout(() => {
        const exportCSVBtn = document.getElementById('exportCSV');
        const exportExcelBtn = document.getElementById('exportExcel');
        const exportPDFBtn = document.getElementById('exportPDF');
        const backupDataBtn = document.getElementById('backupData');

        if (exportCSVBtn && !exportCSVBtn.onclick) {
            exportCSVBtn.addEventListener('click', exportCSV);
        }
        if (exportExcelBtn && !exportExcelBtn.onclick) {
            exportExcelBtn.addEventListener('click', exportExcel);
        }
        if (exportPDFBtn && !exportPDFBtn.onclick) {
            exportPDFBtn.addEventListener('click', function (e) {
                e.preventDefault();
                const choice = confirm('Escolha o método de geração do PDF:\n\nOK = PDF com biblioteca (recomendado)\nCancelar = Abrir para impressão/salvar como PDF');
                if (choice) {
                    exportPDF();
                } else {
                    exportPDFSimple();
                }
            });
        }
        if (backupDataBtn && !backupDataBtn.onclick) {
            backupDataBtn.addEventListener('click', backupData);
        }
    }, 100);
}
