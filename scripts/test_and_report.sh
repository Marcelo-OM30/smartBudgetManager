#!/bin/bash
# Script para rodar testes Cypress e gerar relatório customizado

npx cypress run --reporter mochawesome --reporter-options reportDir=cypress/reports,overwrite=false,html=true,json=true
node scripts/generateTestReport.js
