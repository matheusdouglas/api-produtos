# 📋 PLANO DE TESTES - API PRODUTOS

## 🎯 OBJETIVO
Validar a qualidade, funcionalidade e robustez da API de produtos através de testes estruturados e abrangentes.

## 🏗️ ARQUITETURA DO PROJETO
- **Backend**: Node.js + TypeScript + Express
- **Database**: PostgreSQL
- **Autenticação**: JWT + bcrypt
- **Padrão**: MVC + Repository Pattern
- **Containerização**: Docker

## 📊 ESTRATÉGIA DE TESTES

### 1. TESTES UNITÁRIOS (Jest)
**Cobertura Alvo**: 90%+

#### 1.1 Controllers
- [ ] `AuthControllers.spec.ts`
- [ ] `CreateUserControllers.spec.ts` 
- [ ] `ProductControllers.spec.ts` ✅ (existente)
- [ ] `StockMovementController.spec.ts`

#### 1.2 Services
- [ ] `ProductService.spec.ts` ✅ (existente)
- [ ] `StockMovementService.spec.ts` ✅ (existente)
- [ ] `UserService.spec.ts`

#### 1.3 Repositories
- [ ] `ProductRepository.spec.ts`
- [ ] `StockMovementRepository.spec.ts`
- [ ] `UserRepository.spec.ts`

#### 1.4 Middleware
- [ ] `middleware.spec.ts` (autenticação JWT)

### 2. TESTES DE INTEGRAÇÃO
**Foco**: Fluxos completos e relacionamentos

#### 2.1 Fluxos de Autenticação
- [ ] Registro → Login → Acesso protegido
- [ ] Token expiração
- [ ] Refresh token (se implementado)

#### 2.2 Fluxos de Produtos
- [ ] CRUD completo com autenticação
- [ ] Validações de negócio
- [ ] Relacionamento com estoque

#### 2.3 Fluxos de Estoque
- [ ] Movimentação → Atualização de produto
- [ ] Validações de estoque negativo
- [ ] Histórico de movimentações

### 3. TESTES DE API (E2E)
**Ferramenta**: Postman + Newman (CI/CD)

#### 3.1 Cenários Positivos
- [ ] Todos os endpoints funcionais
- [ ] Respostas corretas
- [ ] Status codes adequados

#### 3.2 Cenários Negativos
- [ ] Dados inválidos
- [ ] Autenticação falhada
- [ ] Recursos não encontrados
- [ ] Validações de entrada

#### 3.3 Cenários de Segurança
- [ ] Injeção SQL
- [ ] XSS
- [ ] Rate limiting
- [ ] Headers de segurança

### 4. TESTES DE PERFORMANCE
**Ferramenta**: Artillery ou k6

- [ ] Load testing (100-1000 req/s)
- [ ] Stress testing
- [ ] Endurance testing
- [ ] Spike testing

### 5. TESTES DE SEGURANÇA
**Ferramenta**: OWASP ZAP ou similar

- [ ] Vulnerabilidades OWASP Top 10
- [ ] Autenticação e autorização
- [ ] Validação de entrada
- [ ] Exposição de dados sensíveis

## 🧪 CENÁRIOS DE TESTE DETALHADOS

### AUTENTICAÇÃO

#### POST /api/register
```json
// ✅ Sucesso
{
  "name": "João Silva",
  "email": "joao@email.com", 
  "password": "senha123"
}
// Status: 201, Body: { "message": "Usuário criado com sucesso" }

// ❌ Erro - Email duplicado
// Status: 400, Body: { "error": "Email já cadastrado" }

// ❌ Erro - Dados inválidos
// Status: 400, Body: { "error": "Dados inválidos" }
```

#### POST /api/login
```json
// ✅ Sucesso
{
  "email": "joao@email.com",
  "password": "senha123"
}
// Status: 200, Body: { "token": "jwt_token" }

// ❌ Erro - Credenciais inválidas
// Status: 401, Body: { "error": "Credenciais inválidas" }
```

### PRODUTOS

#### POST /api/product (com auth)
```json
// ✅ Sucesso
{
  "name": "Notebook Dell",
  "description": "Notebook i5 8GB",
  "price": 3500.00,
  "category": "Informática",
  "stock": 10
}
// Status: 201, Body: { "id": 1, ... }

// ❌ Erro - Sem autenticação
// Status: 401, Body: { "error": "Token não fornecido" }

// ❌ Erro - Dados inválidos
// Status: 400, Body: { "error": "Preço deve ser positivo" }
```

#### GET /api/products (com auth)
```json
// ✅ Sucesso
// Status: 200, Body: [{ "id": 1, "name": "Notebook", ... }]

// ❌ Erro - Sem autenticação
// Status: 401
```

### MOVIMENTAÇÃO DE ESTOQUE

#### POST /api/stock-movements
```json
// ✅ Entrada
{
  "product_id": 1,
  "quantity": 5,
  "movement_type": "entrada"
}
// Status: 201, Verificar: produto.stock += 5

// ✅ Saída
{
  "product_id": 1,
  "quantity": -2,
  "movement_type": "saida"
}
// Status: 201, Verificar: produto.stock -= 2

// ❌ Erro - Produto inexistente
// Status: 404, Body: { "error": "Produto não encontrado" }

// ❌ Erro - Estoque insuficiente
// Status: 400, Body: { "error": "Estoque insuficiente" }
```

## 🚀 IMPLEMENTAÇÃO

### Fase 1: Testes Unitários (Semana 1)
1. Expandir testes existentes
2. Criar testes para Services e Repositories
3. Implementar mocks para database

### Fase 2: Testes de Integração (Semana 2)
1. Configurar ambiente de teste
2. Implementar testes de fluxo completo
3. Validar relacionamentos

### Fase 3: Testes E2E (Semana 3)
1. Expandir Postman Collection
2. Implementar testes automatizados
3. Configurar CI/CD

### Fase 4: Performance e Segurança (Semana 4)
1. Implementar load testing
2. Executar testes de segurança
3. Otimizações baseadas em resultados

## 📈 MÉTRICAS DE QUALIDADE

- **Cobertura de Código**: > 90%
- **Taxa de Falha**: < 2%
- **Tempo de Resposta**: < 200ms (média)
- **Disponibilidade**: > 99.9%
- **Vulnerabilidades**: 0 críticas/altas

## 🛠️ FERRAMENTAS RECOMENDADAS

- **Testes Unitários**: Jest + ts-jest
- **Testes E2E**: Postman + Newman
- **Performance**: Artillery ou k6
- **Segurança**: OWASP ZAP
- **CI/CD**: GitHub Actions
- **Monitoramento**: Jest coverage reports

## 📝 CHECKLIST DE VALIDAÇÃO

### Funcional
- [ ] Todos os endpoints respondem corretamente
- [ ] Autenticação funciona em todos os recursos protegidos
- [ ] CRUD completo para produtos
- [ ] Movimentação de estoque atualiza produto
- [ ] Validações de negócio funcionam

### Não-Funcional
- [ ] Performance aceitável (< 200ms)
- [ ] Segurança implementada
- [ ] Tratamento de erros adequado
- [ ] Logs estruturados
- [ ] Documentação atualizada

### Técnico
- [ ] Código limpo e bem estruturado
- [ ] Testes automatizados
- [ ] CI/CD configurado
- [ ] Monitoramento implementado
- [ ] Backup e recovery testados 