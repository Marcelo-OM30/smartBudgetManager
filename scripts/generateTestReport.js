// Script para gerar relatório customizado de testes Cypress
const fs = require('fs');
const path = require('path');
const mochawesomeJson = path.join(__dirname, '../cypress/reports/mochawesome.json');
const templateHtml = path.join(__dirname, '../cypress/reports/custom_report_template.html');
const outputHtml = path.join(__dirname, '../cypress/reports/custom_report.html');
const execSync = require('child_process').execSync;

function getGitInfo() {
    try {
        const branch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
        const commit = execSync('git rev-parse HEAD').toString().trim();
        const executor = execSync('git config user.name').toString().trim();
        return { branch, commit, executor };
    } catch (e) {
        return { branch: '', commit: '', executor: '' };
    }
}

function formatDuration(ms) {
    const sec = Math.floor(ms / 1000);
    const min = Math.floor(sec / 60);
    return `${min}m ${sec % 60}s`;
}

function generateReport() {
    if (!fs.existsSync(mochawesomeJson)) {
        console.error('Arquivo mochawesome.json não encontrado! Rode os testes Cypress com o reporter.');
        return;
    }
    const data = JSON.parse(fs.readFileSync(mochawesomeJson, 'utf8'));
    const stats = data.stats;
    const git = getGitInfo();
    const now = new Date().toLocaleString('pt-BR');

    let html = fs.readFileSync(templateHtml, 'utf8');
    html = html.replace('<!-- insira dinamicamente -->', now)
        .replace('<!-- insira dinamicamente -->', git.branch)
        .replace('<!-- insira dinamicamente -->', git.executor)
        .replace('<!-- insira dinamicamente -->', stats.tests)
        .replace('<!-- insira dinamicamente -->', stats.passes)
        .replace('<!-- insira dinamicamente -->', stats.failures)
        .replace('<!-- insira dinamicamente -->', formatDuration(stats.duration))
        .replace('<!-- insira dinamicamente -->', `${((stats.passes / stats.tests) * 100).toFixed(2)}%`);

    fs.writeFileSync(outputHtml, html);
    console.log('Relatório customizado gerado em:', outputHtml);
}

generateReport();
