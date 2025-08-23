# Testes de Integração - Smart Budget Manager (Formato Gherkin)

## Cenário: Registrar receita

```gherkin
Scenario Outline: Registrar receita
  Given que o usuário está logado
  And informa o valor "<valor>"
  And informa a data "<data>"
  And informa a descrição "<descricao>"
  And informa a categoria "<categoria>"
  When registra a receita
  Then o resultado deve ser "<resultado>"

Examples:
  | valor | data       | descricao     | categoria    | resultado                                         |
  | 100   | 2025-08-20 | Salario       | Investimento | Receita registrada                                |
  | -50   | 2025-08-20 | Salario       | Investimento | O valor da receita deve ser positivo.             |
  | 100   | 1920-08-20 | Salario       | Outros       | Receita registrada                                |
  | 100   | 2025-08-20 | Salario123    | Investimento | Descrição deve ter até 200 caracteres e conter apenas letras. |
```

## Cenário: Registrar despesa

```gherkin
Scenario: Registrar despesa válida
  Given que o usuário está logado
  And informa o valor "50"
  And informa a data "2025-08-22"
  And informa a descrição "Mercado"
  And informa a categoria "Alimentação"
  When registra a despesa
  Then o resultado deve ser "Despesa registrada com sucesso"
```

## Cenário: Validações de campos obrigatórios

```gherkin
Scenario: Não permitir receita com valor negativo
  Given que o usuário está logado
  And informa o valor "-10"
  And informa a data "2025-08-22"
  And informa a descrição "Teste"
  When registra a receita
  Then o resultado deve ser "O valor da receita deve ser positivo."

Scenario: Não permitir despesa sem categoria
  Given que o usuário está logado
  And informa o valor "50"
  And informa a data "2025-08-22"
  And informa a descrição "Teste"
  And não informa a categoria
  When registra a despesa
  Then o resultado deve ser "O campo \"Categoria\" não pode ficar em branco."
```
