import dashboardPage from '../support/pageObjects/dashboardPage';

describe('Smart Budget Manager', () => {
    const baseUrl = Cypress.config('baseUrl');

    let localStorageBackup = {};

    before(() => {
        cy.visit(`${baseUrl}/register.html`);
        cy.get('#registerName').type(Cypress.env('userName'));
        cy.get('#registerEmail').type(Cypress.env('loginEmail'));
        cy.get('#registerPassword').type(Cypress.env('loginPassword'));
        cy.get('#registerPasswordConfirm').type(Cypress.env('loginPassword'));
        cy.get('button[type=submit]').click();
        // Salvar localStorage após registro
        cy.window().then(win => {
            localStorageBackup = { ...win.localStorage };
        });
    });

    beforeEach(() => {
        cy.visit(`${baseUrl}/index.html`);
        // Restaurar localStorage antes do login
        cy.window().then(win => {
            Object.keys(localStorageBackup).forEach(key => {
                win.localStorage.setItem(key, localStorageBackup[key]);
            });
        });
        cy.get('#loginEmail').type(Cypress.env('loginEmail'));
        cy.get('#loginPassword').type(Cypress.env('loginPassword'));
        cy.get('button[type=submit]').click();
        cy.contains(`Olá, ${Cypress.env('userName')}!`).should('be.visible');
    });

    it('não deve permitir receita com valor negativo', () => {
        cy.visit('/dashboard.html');
        cy.get('#incomeValue').type('-10');
        cy.get('#incomeDate').type('2025-08-22');
        cy.get('#incomeDesc').type('Teste');
        cy.get('#incomeForm').submit();
        cy.contains('O valor da receita deve ser positivo.').should('be.visible');
    });

    it('não deve permitir despesa sem categoria', () => {
        cy.visit('/dashboard.html');
        cy.get('#expenseValue').type('50');
        cy.get('#expenseDate').type('2025-08-22');
        cy.get('#expenseDesc').type('Teste');
        cy.get('#expenseCategory').select('');
        cy.get('#expenseForm').submit();
        cy.contains('O campo "Categoria" não pode ficar em branco.').should('be.visible');
    });

    const receitaExamples = [
        { valor: '100', data: '2025-08-20', descricao: 'Salario', categoria: 'Investimento', resultado: 'Receita registrada' },
        { valor: '-50', data: '2025-08-20', descricao: 'Salario', categoria: 'Investimento', resultado: 'O valor da receita deve ser positivo.' },
        { valor: '100', data: '2025-08-22', descricao: 'Salario', categoria: 'Outros', resultado: 'Receita registrada' },
        { valor: '100', data: '2025-08-20', descricao: 'Salario123', categoria: 'Investimento', resultado: 'Descrição deve ter até 200 caracteres e conter apenas letras.' }
    ];

    describe('Registrar receita', () => {
        receitaExamples.forEach(ex => {
            it(`valor: ${ex.valor}, data: ${ex.data}, descricao: ${ex.descricao}, categoria: ${ex.categoria} => ${ex.resultado}`, () => {
                dashboardPage.visit();
                dashboardPage.registrarReceita(ex.valor, ex.data, ex.descricao, ex.categoria);
                if (ex.resultado === 'Receita registrada') {
                    cy.wait(500);
                    dashboardPage.validarToastReceita();
                } else {
                    cy.contains(ex.resultado).should('be.visible');
                }
            });
        });
    });

    describe('Registrar despesa', () => {
        it('deve registrar despesa válida e exibir toast de sucesso', () => {
            dashboardPage.visit();
            dashboardPage.registrarDespesa('50', '2025-08-22', 'Mercado', 'Comida');
            cy.wait(500);
            dashboardPage.validarToastDespesa();
        });
    });

    describe('Mensagens de sucesso de exportação', () => {
        it('deve exibir toast de sucesso ao exportar CSV', () => {
            dashboardPage.visit();
            dashboardPage.exportarCSV();
            dashboardPage.validarToastExportCSV();
        });

        it('deve exibir toast de sucesso ao exportar Excel', () => {
            dashboardPage.visit();
            dashboardPage.exportarExcel();
            dashboardPage.validarToastExportExcel();
        });

        it('deve exibir toast de sucesso ao exportar PDF', () => {
            dashboardPage.visit();
            dashboardPage.exportarPDF();
            dashboardPage.validarToastExportPDF();
        });
    });
});
