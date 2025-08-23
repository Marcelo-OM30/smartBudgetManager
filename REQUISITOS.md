# Requisitos do Smart Budget Manager

| ID   | Requisito                       | Descrição                                                                                       |
|------|----------------------------------|-------------------------------------------------------------------------------------------------|
| RQ01 | Autenticação de Usuário          | O sistema deve permitir que o usuário crie uma conta, faça login e logout de forma segura, com criptografia de senha. |
| RQ02 | Autenticação de Usuário          | O sistema deve trazer uma mnsagem de validação quando a entrada dos dados de login forem inválidas. a mensagem deve ter os dizeres "Credenciais inválidas", erro 400 ou 401 |
| RQ03 | Registro de Receitas (Income Tracker) | O sistema deve permitir o registro de receitas, incluindo valor, data, descrição e categoria opcional. |
| RQ04 | Registro de Receitas (Income Tracker) | O valor inserido no input de receitas não pode ser negativo. o campo data deve ter um limite de preenchimento ou seja, no usuario não pode preencher o campo data com 00/00/000, não pode conter uma data invalida como 30/02, e não pode ter unma data anterior a 50 anos atrás. A descrição não deve passar de 200 caracteres e não pode ser preenchido com numeros, apenas com letras. |
| RQ04A | Validação de Campos em Branco (Receitas) | Os campos valor e data não podem ficar em branco ao adicionar uma receita. |
| RQ05 | Registro de Despesas (Expense Tracker) | O sistema deve permitir o registro de despesas, incluindo valor, data, descrição e categoria obrigatória. |
| RQ06 | Registro de Despesas (Expense Tracker) | O registro de despesas não pode ser negativo, a data não pode seer 00/00/0000 e não pode ser inválida. exemplo, 30/02 e deve ter um limite de até 50 anos atrás. a descrição deve ter nop máximo 200 caracteres e só pode ser preenchida com letras. |
| RQ06A | Validação de Campos em Branco (Despesas) | Os campos valor e categoria não podem ficar em branco ao adicionar uma despesa. |
| RQ07 | Categorias de Transações         | As categorias disponíveis devem incluir: Comida, Transporte, Entretenimento, Compras Parceladas, Dívidas, Investimento, Contas Fixas e Despesas Imprevistas. |
| RQ08 | Edição e Exclusão de Transações  | O sistema deve permitir que o usuário edite ou exclua transações já registradas.                 |
| RQ08A| Autorização de Transações        | Só é possível realizar, editar ou excluir transações se o usuário estiver autenticado (logado no sistema). |
| RQ09 | Resumo Financeiro                | O sistema deve apresentar um resumo com total de receitas, despesas e saldo atual.               |
| RQ10 | Gráficos e Análises              | O sistema deve gerar gráficos de distribuição por categoria e evolução mensal das finanças.      |
| RQ11 | Metas de Orçamento               | O usuário deve poder definir um limite mensal de despesas e receber alertas quando estiver próximo ou acima do limite. |
| RQ12 | Exportação de Dados              | O sistema deve permitir exportar as transações em formato CSV e PDF.                            |
| RQ13 | Backup de Dados                  | O sistema deve oferecer opção de download de todos os dados para backup.                        |
