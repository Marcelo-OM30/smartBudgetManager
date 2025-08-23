// Dashboard Page Object para Cypress

class DashboardPage {
    visit() {
        cy.visit('/dashboard.html');
    }

    preencherReceita(valor, data, descricao, categoria) {
        this.getIncomeValue().clear().type(valor);
        this.getIncomeDate().clear().type(data);
        this.getIncomeDesc().clear().type(descricao);
        this.getIncomeCategory().select(categoria);
    }

    registrarReceita(valor, data, descricao, categoria) {
        this.preencherReceita(valor, data, descricao, categoria);
        this.submitIncome();
    }

    preencherDespesa(valor, data, descricao, categoria) {
        this.getExpenseValue().clear().type(valor);
        this.getExpenseDate().clear().type(data);
        this.getExpenseDesc().clear().type(descricao);
        this.getExpenseCategory().select(categoria);
    }

    registrarDespesa(valor, data, descricao, categoria) {
        this.preencherDespesa(valor, data, descricao, categoria);
        this.submitExpense();
    }

    exportarCSV() {
        this.clickExportCSV();
    }

    exportarExcel() {
        this.clickExportExcel();
    }

    exportarPDF() {
        this.clickExportPDF();
    }

    validarToastReceita() {
        this.getToastReceita().should('be.visible').and('contain', 'Receita registrada com sucesso');
    }

    validarToastDespesa() {
        this.getToastDespesa().should('be.visible').and('contain', 'Despesa registrada com sucesso');
    }

    validarToastExportCSV() {
        this.getToastExportCSV().should('be.visible').and('contain', 'Exportação CSV realizada com sucesso');
    }

    validarToastExportExcel() {
        this.getToastExportExcel().should('be.visible').and('contain', 'Exportação Excel realizada com sucesso');
    }

    validarToastExportPDF() {
        this.getToastExportPDF().should('be.visible').and('contain', 'Exportação PDF realizada com sucesso');
    }

    getIncomeValue() {
        return cy.get('#incomeValue');
    }

    getIncomeDate() {
        return cy.get('#incomeDate');
    }

    getIncomeDesc() {
        return cy.get('#incomeDesc');
    }

    getIncomeCategory() {
        return cy.get('#incomeCategory');
    }

    submitIncome() {
        return cy.get('#incomeForm').submit();
    }

    getExpenseValue() {
        return cy.get('#expenseValue');
    }

    getExpenseDate() {
        return cy.get('#expenseDate');
    }

    getExpenseDesc() {
        return cy.get('#expenseDesc');
    }

    getExpenseCategory() {
        return cy.get('#expenseCategory');
    }

    submitExpense() {
        return cy.get('#expenseForm').submit();
    }

    getToastReceita() {
        return cy.get('#toastReceita');
    }

    getToastDespesa() {
        return cy.get('#toastDespesa');
    }

    getToastExportCSV() {
        return cy.get('#toastExportCSV');
    }

    getToastExportExcel() {
        return cy.get('#toastExportExcel');
    }

    getToastExportPDF() {
        return cy.get('#toastExportPDF');
    }

    clickExportCSV() {
        return cy.get('#exportCSV').click();
    }

    clickExportExcel() {
        return cy.get('#exportExcel').click();
    }

    clickExportPDF() {
        return cy.get('#exportPDF').click();
    }
}

export default new DashboardPage();
