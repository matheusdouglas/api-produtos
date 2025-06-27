# ✅ CHECKLIST DE VALIDAÇÃO QA - API PRODUTOS

## 🎯 OBJETIVO
Checklist abrangente para validação manual da API de produtos, cobrindo todos os cenários críticos de negócio.

## 📋 CHECKLIST GERAL

### ✅ **AMBIENTE E CONFIGURAÇÃO**
- [ ] Docker está rodando
- [ ] PostgreSQL iniciado corretamente
- [ ] Migrações executadas sem erro
- [ ] Servidor iniciando na porta 4200
- [ ] Logs sem erros críticos
- [ ] Conexão com banco estabelecida

### ✅ **AUTENTICAÇÃO E AUTORIZAÇÃO**

#### Registro de Usuário (`POST /api/register`)
- [ ] **Cenário Positivo**: Registrar usuário com dados válidos
  - [ ] Nome: "João Silva"
  - [ ] Email: "joao@email.com"
  - [ ] Senha: "senha123"
  - [ ] Status: 201
  - [ ] Mensagem de sucesso retornada

- [ ] **Cenário Negativo**: Email duplicado
  - [ ] Tentar registrar mesmo email
  - [ ] Status: 400
  - [ ] Mensagem de erro apropriada

- [ ] **Cenário Negativo**: Dados inválidos
  - [ ] Nome vazio
  - [ ] Email inválido
  - [ ] Senha muito curta
  - [ ] Status: 400

#### Login (`POST /api/login`)
- [ ] **Cenário Positivo**: Login com credenciais corretas
  - [ ] Email: "joao@email.com"
  - [ ] Senha: "senha123"
  - [ ] Status: 200
  - [ ] Token JWT retornado

- [ ] **Cenário Negativo**: Credenciais incorretas
  - [ ] Email correto, senha errada
  - [ ] Email inexistente
  - [ ] Status: 401

### ✅ **GESTÃO DE PRODUTOS**

#### Criar Produto (`POST /api/product`)
- [ ] **Cenário Positivo**: Produto válido com autenticação
  - [ ] Nome: "Notebook Dell"
  - [ ] Descrição: "Notebook i5 8GB"
  - [ ] Preço: 3500.00
  - [ ] Categoria: "Informática"
  - [ ] Estoque: 10
  - [ ] Token JWT no header
  - [ ] Status: 201
  - [ ] ID retornado

- [ ] **Cenário Negativo**: Sem autenticação
  - [ ] Request sem token
  - [ ] Status: 401

- [ ] **Cenário Negativo**: Dados inválidos
  - [ ] Preço negativo
  - [ ] Estoque negativo
  - [ ] Nome vazio
  - [ ] Status: 400

#### Listar Produtos (`GET /api/products`)
- [ ] **Cenário Positivo**: Listar todos os produtos
  - [ ] Com autenticação
  - [ ] Status: 200
  - [ ] Array de produtos retornado

- [ ] **Cenário Negativo**: Sem autenticação
  - [ ] Status: 401

#### Buscar Produto por ID (`GET /api/products/:id`)
- [ ] **Cenário Positivo**: Produto existente
  - [ ] ID válido
  - [ ] Status: 200
  - [ ] Dados completos do produto

- [ ] **Cenário Negativo**: Produto inexistente
  - [ ] ID inválido
  - [ ] Status: 404

#### Buscar por Categoria (`GET /api/products/category/:category`)
- [ ] **Cenário Positivo**: Categoria com produtos
  - [ ] Categoria existente
  - [ ] Status: 200
  - [ ] Produtos da categoria retornados

- [ ] **Cenário Negativo**: Categoria vazia
  - [ ] Categoria sem produtos
  - [ ] Array vazio retornado

#### Atualizar Produto (`PUT /api/products/:id`)
- [ ] **Cenário Positivo**: Atualização válida
  - [ ] Dados atualizados
  - [ ] Status: 200
  - [ ] Produto atualizado no banco

- [ ] **Cenário Negativo**: Produto inexistente
  - [ ] ID inválido
  - [ ] Status: 404

#### Deletar Produto (`DELETE /api/products/:id`)
- [ ] **Cenário Positivo**: Produto existente
  - [ ] ID válido
  - [ ] Status: 200
  - [ ] Produto removido do banco

- [ ] **Cenário Negativo**: Produto inexistente
  - [ ] ID inválido
  - [ ] Status: 404

### ✅ **MOVIMENTAÇÃO DE ESTOQUE**

#### Criar Movimentação (`POST /api/stock-movements`)
- [ ] **Cenário Positivo**: Entrada de estoque
  - [ ] Product ID válido
  - [ ] Quantidade: 25
  - [ ] Tipo: "entrada"
  - [ ] Status: 201
  - [ ] Estoque do produto atualizado (+25)

- [ ] **Cenário Positivo**: Saída de estoque
  - [ ] Product ID válido
  - [ ] Quantidade: -15
  - [ ] Tipo: "saida"
  - [ ] Status: 201
  - [ ] Estoque do produto atualizado (-15)

- [ ] **Cenário Negativo**: Produto inexistente
  - [ ] Product ID inválido
  - [ ] Status: 404

- [ ] **Cenário Negativo**: Estoque insuficiente
  - [ ] Tentar sair mais que disponível
  - [ ] Status: 400
  - [ ] Estoque não alterado

#### Listar Movimentações (`GET /api/stock-movements`)
- [ ] **Cenário Positivo**: Listar todas
  - [ ] Status: 200
  - [ ] Array de movimentações

#### Buscar por Produto (`GET /api/stock-movements/product/:product_id`)
- [ ] **Cenário Positivo**: Produto com movimentações
  - [ ] Product ID válido
  - [ ] Status: 200
  - [ ] Movimentações do produto

- [ ] **Cenário Negativo**: Produto sem movimentações
  - [ ] Array vazio retornado

### ✅ **VALIDAÇÕES DE NEGÓCIO**

#### Regras de Estoque
- [ ] **Estoque não pode ficar negativo**
  - [ ] Tentar sair mais que disponível
  - [ ] Operação deve ser rejeitada
  - [ ] Estoque permanece inalterado

- [ ] **Movimentações devem atualizar produto**
  - [ ] Entrada aumenta estoque
  - [ ] Saída diminui estoque
  - [ ] Ajuste modifica estoque

#### Validações de Dados
- [ ] **Produtos**
  - [ ] Nome obrigatório
  - [ ] Preço deve ser positivo
  - [ ] Estoque deve ser >= 0
  - [ ] Categoria obrigatória

- [ ] **Usuários**
  - [ ] Email único
  - [ ] Senha com tamanho mínimo
  - [ ] Email válido

- [ ] **Movimentações**
  - [ ] Product ID obrigatório
  - [ ] Quantidade obrigatória
  - [ ] Tipo válido (entrada/saida/ajuste)

### ✅ **PERFORMANCE E CONCORRÊNCIA**

#### Testes de Performance
- [ ] **Tempo de resposta**
  - [ ] GET /api/products < 200ms
  - [ ] POST /api/product < 500ms
  - [ ] POST /api/stock-movements < 300ms

- [ ] **Concorrência**
  - [ ] 10 requests simultâneos
  - [ ] 50 requests simultâneos
  - [ ] 100 requests simultâneos

#### Testes de Carga
- [ ] **Load Testing**
  - [ ] 100 req/s por 1 minuto
  - [ ] Sem falhas
  - [ ] Tempo de resposta estável

### ✅ **SEGURANÇA**

#### Autenticação
- [ ] **Token JWT**
  - [ ] Token válido permite acesso
  - [ ] Token inválido rejeita acesso
  - [ ] Token expirado rejeita acesso

- [ ] **Senhas**
  - [ ] Senhas criptografadas no banco
  - [ ] Senha não retornada nas respostas

#### Validação de Entrada
- [ ] **SQL Injection**
  - [ ] Tentar injeção em campos de texto
  - [ ] Tentar injeção em IDs

- [ ] **XSS**
  - [ ] Scripts em campos de texto
  - [ ] HTML malicioso

### ✅ **TRATAMENTO DE ERROS**

#### Status Codes
- [ ] **200**: Sucesso
- [ ] **201**: Criado
- [ ] **400**: Dados inválidos
- [ ] **401**: Não autorizado
- [ ] **404**: Não encontrado
- [ ] **500**: Erro interno

#### Mensagens de Erro
- [ ] **Mensagens claras**
  - [ ] Erro de validação
  - [ ] Erro de autenticação
  - [ ] Erro de recurso não encontrado

### ✅ **LOGS E MONITORAMENTO**

#### Logs
- [ ] **Logs estruturados**
  - [ ] Requests recebidos
  - [ ] Erros registrados
  - [ ] Performance metrics

#### Monitoramento
- [ ] **Métricas básicas**
  - [ ] Requests por segundo
  - [ ] Tempo de resposta
  - [ ] Taxa de erro

### ✅ **DOCUMENTAÇÃO**

#### API Documentation
- [ ] **Endpoints documentados**
  - [ ] Métodos HTTP
  - [ ] Parâmetros
  - [ ] Respostas
  - [ ] Exemplos

#### Postman Collection
- [ ] **Collection atualizada**
  - [ ] Todos os endpoints
  - [ ] Exemplos de dados
  - [ ] Variáveis de ambiente

## 📊 MÉTRICAS DE ACEITAÇÃO

### Funcional
- [ ] **100% dos endpoints funcionais**
- [ ] **0% de falhas em cenários positivos**
- [ ] **Validações de negócio implementadas**

### Não-Funcional
- [ ] **Tempo de resposta < 200ms (média)**
- [ ] **Disponibilidade > 99.9%**
- [ ] **Cobertura de testes > 80%**

### Segurança
- [ ] **0 vulnerabilidades críticas**
- [ ] **Autenticação obrigatória**
- [ ] **Validação de entrada**

## 🚀 CHECKLIST DE DEPLOY

### Pré-Deploy
- [ ] Todos os testes passando
- [ ] Cobertura de código adequada
- [ ] Documentação atualizada
- [ ] Ambiente de staging testado

### Deploy
- [ ] Migrações executadas
- [ ] Servidor iniciado
- [ ] Health check passando
- [ ] Logs sem erros

### Pós-Deploy
- [ ] Smoke tests passando
- [ ] Monitoramento configurado
- [ ] Backup configurado
- [ ] Rollback plan ready

## 📝 NOTAS DO QA

### Data da Validação: _______________
### QA Responsável: _______________
### Versão Testada: _______________

### Observações:
- [ ] Problemas encontrados
- [ ] Melhorias sugeridas
- [ ] Bugs reportados
- [ ] Aprovação para produção

### Status Final:
- [ ] ✅ APROVADO
- [ ] ❌ REPROVADO
- [ ] ⚠️ APROVADO COM RESSALVAS

### Próximos Passos:
- [ ] Correções necessárias
- [ ] Reteste após correções
- [ ] Deploy em produção 