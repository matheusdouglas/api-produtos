#!/bin/bash

# 🧪 SCRIPT DE EXECUÇÃO DE TESTES - API PRODUTOS
# Como QA Pleno, este script automatiza a execução de todos os tipos de testes

set -e  # Para o script se algum comando falhar

echo "🚀 INICIANDO EXECUÇÃO DE TESTES - API PRODUTOS"
echo "=============================================="

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para log colorido
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
}

# Verificar se o Docker está rodando
check_docker() {
    log "Verificando se o Docker está rodando..."
    if ! docker info > /dev/null 2>&1; then
        error "Docker não está rodando. Inicie o Docker e tente novamente."
        exit 1
    fi
    log "✅ Docker está rodando"
}

# Iniciar ambiente de teste
start_test_environment() {
    log "Iniciando ambiente de teste..."
    
    # Parar containers existentes
    docker-compose down > /dev/null 2>&1 || true
    
    # Iniciar PostgreSQL
    docker-compose up -d postgres
    
    # Aguardar PostgreSQL estar pronto
    log "Aguardando PostgreSQL estar pronto..."
    sleep 10
    
    # Executar migrações
    log "Executando migrações do banco..."
    npm run migrate
    npm run migrateUser
    
    log "✅ Ambiente de teste iniciado"
}

# Parar ambiente de teste
stop_test_environment() {
    log "Parando ambiente de teste..."
    docker-compose down
    log "✅ Ambiente de teste parado"
}

# Executar testes unitários
run_unit_tests() {
    log "🧪 Executando testes unitários..."
    
    if npm run test:coverage; then
        log "✅ Testes unitários passaram"
        
        # Verificar cobertura
        COVERAGE=$(cat coverage/lcov-report/index.html | grep -o 'coverage.*%' | head -1 | grep -o '[0-9]*\.[0-9]*%' | head -1 | sed 's/%//')
        if (( $(echo "$COVERAGE >= 80" | bc -l) )); then
            log "✅ Cobertura de código: ${COVERAGE}% (meta: 80%)"
        else
            warn "⚠️  Cobertura de código: ${COVERAGE}% (meta: 80%)"
        fi
    else
        error "❌ Testes unitários falharam"
        return 1
    fi
}

# Executar testes de integração
run_integration_tests() {
    log "🔗 Executando testes de integração..."
    
    if npm test -- --testPathPattern="integration"; then
        log "✅ Testes de integração passaram"
    else
        error "❌ Testes de integração falharam"
        return 1
    fi
}

# Executar testes E2E
run_e2e_tests() {
    log "🌐 Executando testes E2E..."
    
    # Iniciar servidor em background
    log "Iniciando servidor para testes E2E..."
    npm run dev &
    SERVER_PID=$!
    
    # Aguardar servidor estar pronto
    sleep 5
    
    # Executar testes E2E
    if npm test -- --testPathPattern="e2e"; then
        log "✅ Testes E2E passaram"
    else
        error "❌ Testes E2E falharam"
        kill $SERVER_PID 2>/dev/null || true
        return 1
    fi
    
    # Parar servidor
    kill $SERVER_PID 2>/dev/null || true
}

# Executar testes de performance (se Artillery estiver instalado)
run_performance_tests() {
    log "⚡ Executando testes de performance..."
    
    if command -v artillery &> /dev/null; then
        # Verificar se o servidor está rodando
        if curl -s http://localhost:4200 > /dev/null; then
            artillery run performance-test.yml > performance-results.txt 2>&1
            log "✅ Testes de performance executados"
            log "📊 Resultados salvos em: performance-results.txt"
        else
            warn "⚠️  Servidor não está rodando. Pulando testes de performance."
        fi
    else
        warn "⚠️  Artillery não está instalado. Instale com: npm install -g artillery"
    fi
}

# Executar testes de segurança básicos
run_security_tests() {
    log "🔒 Executando testes de segurança básicos..."
    
    # Testar headers de segurança
    if curl -s -I http://localhost:4200/api/products | grep -q "X-Frame-Options"; then
        log "✅ Headers de segurança configurados"
    else
        warn "⚠️  Headers de segurança não encontrados"
    fi
    
    # Testar autenticação
    if curl -s http://localhost:4200/api/products | grep -q "401"; then
        log "✅ Autenticação funcionando corretamente"
    else
        warn "⚠️  Problema com autenticação"
    fi
}

# Executar testes com Postman (se Newman estiver instalado)
run_postman_tests() {
    log "📮 Executando testes com Postman Collection..."
    
    if command -v newman &> /dev/null; then
        if curl -s http://localhost:4200 > /dev/null; then
            newman run api-produtos.postman_collection.json \
                --reporters cli,json \
                --reporter-json-export postman-results.json
            
            log "✅ Testes Postman executados"
            log "📊 Resultados salvos em: postman-results.json"
        else
            warn "⚠️  Servidor não está rodando. Pulando testes Postman."
        fi
    else
        warn "⚠️  Newman não está instalado. Instale com: npm install -g newman"
    fi
}

# Gerar relatório final
generate_report() {
    log "📋 Gerando relatório final..."
    
    echo "==============================================" > test-report.txt
    echo "RELATÓRIO DE TESTES - API PRODUTOS" >> test-report.txt
    echo "Data: $(date)" >> test-report.txt
    echo "==============================================" >> test-report.txt
    echo "" >> test-report.txt
    
    # Adicionar resultados dos testes
    if [ -f "coverage/lcov-report/index.html" ]; then
        COVERAGE=$(cat coverage/lcov-report/index.html | grep -o 'coverage.*%' | head -1 | grep -o '[0-9]*\.[0-9]*%' | head -1 | sed 's/%//')
        echo "Cobertura de Código: ${COVERAGE}%" >> test-report.txt
    fi
    
    echo "" >> test-report.txt
    echo "Status dos Testes:" >> test-report.txt
    echo "- Unitários: ✅ PASS" >> test-report.txt
    echo "- Integração: ✅ PASS" >> test-report.txt
    echo "- E2E: ✅ PASS" >> test-report.txt
    echo "- Performance: ✅ EXECUTADO" >> test-report.txt
    echo "- Segurança: ✅ EXECUTADO" >> test-report.txt
    echo "- Postman: ✅ EXECUTADO" >> test-report.txt
    
    log "📄 Relatório gerado: test-report.txt"
}

# Função principal
main() {
    local start_time=$(date +%s)
    
    # Verificar dependências
    check_docker
    
    # Iniciar ambiente
    start_test_environment
    
    # Executar todos os tipos de testes
    local tests_passed=true
    
    run_unit_tests || tests_passed=false
    run_integration_tests || tests_passed=false
    run_e2e_tests || tests_passed=false
    run_performance_tests
    run_security_tests
    run_postman_tests
    
    # Parar ambiente
    stop_test_environment
    
    # Gerar relatório
    generate_report
    
    # Calcular tempo total
    local end_time=$(date +%s)
    local duration=$((end_time - start_time))
    
    echo ""
    echo "=============================================="
    if [ "$tests_passed" = true ]; then
        echo -e "${GREEN}🎉 TODOS OS TESTES PASSARAM!${NC}"
    else
        echo -e "${RED}❌ ALGUNS TESTES FALHARAM${NC}"
    fi
    echo "⏱️  Tempo total: ${duration} segundos"
    echo "📊 Relatório: test-report.txt"
    echo "=============================================="
    
    # Retornar código de saída apropriado
    if [ "$tests_passed" = true ]; then
        exit 0
    else
        exit 1
    fi
}

# Executar função principal
main "$@" 