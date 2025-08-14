// charts.js - Gráficos de categoria e evolução mensal
// Requer Chart.js (pode ser adicionado via CDN)

function getChartData() {
    const transactions = JSON.parse(localStorage.getItem(`transactions_${localStorage.getItem('loggedUser')}`) || '[]');
    const categoryData = {};
    const monthlyIncomeData = {};
    const monthlyExpenseData = {};

    transactions.forEach(tx => {
        if (tx.type === 'expense') {
            categoryData[tx.category] = (categoryData[tx.category] || 0) + tx.value;
        }

        const month = tx.date ? tx.date.slice(0, 7) : '';
        if (tx.type === 'income') {
            monthlyIncomeData[month] = (monthlyIncomeData[month] || 0) + tx.value;
        } else if (tx.type === 'expense') {
            monthlyExpenseData[month] = (monthlyExpenseData[month] || 0) + tx.value;
        }
    });

    // Obter todos os meses únicos e ordená-los
    const allMonths = [...new Set([...Object.keys(monthlyIncomeData), ...Object.keys(monthlyExpenseData)])].sort();

    return {
        categoryData,
        monthlyIncomeData,
        monthlyExpenseData,
        allMonths
    };
}

let categoryChartInstance = null;
let monthlyChartInstance = null;

function isMobileChart() {
    return window.innerWidth < 700;
}

function renderCharts() {
    if (typeof Chart === 'undefined') return;
    const { categoryData, monthlyIncomeData, monthlyExpenseData, allMonths } = getChartData();
    const mobile = isMobileChart();

    // Categoria (colunas verticais)
    const ctxCat = document.getElementById('categoryChart').getContext('2d');
    if (categoryChartInstance) {
        categoryChartInstance.destroy();
    }
    categoryChartInstance = new Chart(ctxCat, {
        type: 'bar',
        data: {
            labels: Object.keys(categoryData),
            datasets: [{
                label: 'Despesas por Categoria',
                data: Object.values(categoryData),
                backgroundColor: [
                    '#ffb6b9', '#a18aff', '#3936b2', '#232946', '#f9f871', '#ff6f91', '#6a4c93', '#1a1a2e'
                ],
                borderRadius: 12,
                maxBarThickness: 28
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: !mobile,
                    text: 'Spending Trends by Category',
                    font: { size: 20, weight: 'bold' },
                    color: '#e0e7ef',
                    padding: { top: 10, bottom: 20 }
                },
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: !mobile,
                    backgroundColor: '#232946',
                    titleColor: '#ffb6b9',
                    bodyColor: '#e0e7ef',
                    borderColor: '#3936b2',
                    borderWidth: 1
                }
            },
            layout: {
                padding: mobile ? 4 : 20
            },
            scales: {
                x: {
                    grid: { color: '#232946' },
                    ticks: mobile ? { display: false } : { color: '#e0e7ef', font: { size: 14 } }
                },
                y: {
                    grid: { color: '#232946' },
                    ticks: mobile ? { display: false } : { color: '#e0e7ef', font: { size: 14 } }
                }
            }
        }
    });

    // Gráfico Combinado (Receitas vs Despesas)
    const ctxMonth = document.getElementById('monthlyChart').getContext('2d');
    if (monthlyChartInstance) {
        monthlyChartInstance.destroy();
    }

    // Preparar dados para o gráfico combinado
    const incomeData = allMonths.map(month => monthlyIncomeData[month] || 0);
    const expenseData = allMonths.map(month => monthlyExpenseData[month] || 0);

    monthlyChartInstance = new Chart(ctxMonth, {
        type: 'bar',
        data: {
            labels: allMonths,
            datasets: [
                {
                    label: 'Receitas',
                    data: incomeData,
                    backgroundColor: '#4caf50',
                    borderColor: '#388e3c',
                    borderWidth: 2,
                    borderRadius: 8,
                    maxBarThickness: 40
                },
                {
                    label: 'Despesas',
                    data: expenseData,
                    backgroundColor: '#f44336',
                    borderColor: '#d32f2f',
                    borderWidth: 2,
                    borderRadius: 8,
                    maxBarThickness: 40
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: !mobile,
                    text: 'Receitas vs Despesas por Mês',
                    font: { size: 20, weight: 'bold' },
                    color: '#e0e7ef',
                    padding: { top: 10, bottom: 20 }
                },
                legend: {
                    display: !mobile,
                    labels: {
                        color: '#e0e7ef',
                        font: { size: 14 }
                    }
                },
                tooltip: {
                    enabled: !mobile,
                    backgroundColor: '#232946',
                    titleColor: '#ffb6b9',
                    bodyColor: '#e0e7ef',
                    borderColor: '#3936b2',
                    borderWidth: 1,
                    callbacks: {
                        label: function (context) {
                            return context.dataset.label + ': R$ ' + context.parsed.y.toFixed(2);
                        }
                    }
                }
            },
            layout: {
                padding: mobile ? 4 : 20
            },
            scales: {
                x: {
                    grid: { color: '#232946' },
                    ticks: mobile ? { display: false } : { color: '#e0e7ef', font: { size: 14 } }
                },
                y: {
                    grid: { color: '#232946' },
                    ticks: mobile ? { display: false } : {
                        color: '#e0e7ef',
                        font: { size: 14 },
                        callback: function (value) {
                            return 'R$ ' + value.toFixed(0);
                        }
                    }
                }
            }
        }
    });
}

if (document.getElementById('categoryChart') && document.getElementById('monthlyChart')) {
    // Adiciona Chart.js via CDN se não existir
    if (typeof Chart === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
        script.onload = renderCharts;
        document.body.appendChild(script);
    } else {
        renderCharts();
    }
}

window.addEventListener('resize', function() {
    renderCharts();
});
