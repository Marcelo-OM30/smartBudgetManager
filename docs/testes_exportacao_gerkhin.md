# Testes de Exportação - Smart Budget Manager (Formato Gherkin)

## Cenário: Exportar dados financeiros

```gherkin
Scenario: Exportar para CSV
  Given que o usuário está na dashboard
  When clica no botão "Exportar CSV"
  Then deve ver a mensagem "Exportação CSV realizada com sucesso"

Scenario: Exportar para Excel
  Given que o usuário está na dashboard
  When clica no botão "Exportar Excel"
  Then deve ver a mensagem "Exportação Excel realizada com sucesso"

Scenario: Exportar para PDF
  Given que o usuário está na dashboard
  When clica no botão "Exportar PDF"
  Then deve ver a mensagem "Exportação PDF realizada com sucesso"
```
