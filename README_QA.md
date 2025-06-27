# 🧪 GUIA QA - API PRODUTOS

## 🎯 VISÃO GERAL

Este guia é destinado a QAs que precisam validar a API de produtos. A API gerencia produtos, usuários e movimentações de estoque com autenticação JWT.

## 🚀 COMO COMEÇAR

### Pré-requisitos
- Docker instalado e rodando
- Node.js 18+ instalado
- Postman (opcional, mas recomendado)

### Setup Inicial
```bash
# 1. Clonar o projeto
git clone <repository-url>
cd api-produtos

# 2. Instalar dependências
npm install

# 3. Iniciar ambiente
docker-compose up -d

# 4. Executar migrações
npm run migrate
npm run migrateUser

# 5. Iniciar servidor
npm run dev
```

### Verificar se está funcionando
```bash
# Testar se o servidor está rodando
curl http://localhost:4200/api/products
# Deve retornar 401 (não autorizado) - isso é esperado!
```

## 📋 ESTRUTURA DA API

### Endpoints Principais

#### 🔐 Autenticação
- `POST /api/register` - Registrar usuário
- `POST /api/login` - Fazer login

#### 📦 Produtos (requer autenticação)
- `POST /api/product` - Criar produto
- `GET /api/products` - Listar produtos
- `GET /api/products/:id` - Buscar produto por ID
- `GET /api/products/category/:category` - Buscar por categoria
- `PUT /api/products/:id` - Atualizar produto
- `DELETE /api/products/:id` - Deletar produto

#### 📊 Movimentação de Estoque
- `POST /api/stock-movements` - Criar movimentação
- `GET /api/stock-movements` - Listar movimentações
- `GET /api/stock-movements/product/:product_id` - Buscar por produto

## 🧪 ESTRATÉGIAS DE TESTE

### 1. Testes Manuais com Postman

#### Importar Collection
1. Abra o Postman
2. Importe o arquivo `api-produtos.postman_collection.json`
3. Configure variável de ambiente `baseUrl` como `http://localhost:4200`

#### Fluxo de Teste Recomendado
1. **Registrar usuário** → `POST /api/register`
2. **Fazer login** → `POST /api/login`
3. **Copiar token** da resposta do login
4. **Configurar Authorization** nos headers: `Bearer <token>`
5. **Testar endpoints de produtos** com autenticação

### 2. Testes Automatizados

#### Executar Todos os Testes
```bash
# Executar script completo
chmod +x scripts/run-tests.sh
./scripts/run-tests.sh
```

#### Executar Testes Específicos
```bash
# Testes unitários
npm run test

# Testes com cobertura
npm run test:coverage

# Testes em modo watch
npm run test:watch
```

### 3. Testes de Performance

#### Com Artillery
```bash
# Instalar Artillery
npm install -g artillery

# Executar teste de performance
artillery run performance-test.yml
```

#### Com k6 (alternativa)
```bash
# Instalar k6
# https://k6.io/docs/getting-started/installation/

# Executar teste
k6 run performance-test.js
```

## 🔍 CENÁRIOS CRÍTICOS PARA TESTAR

### ✅ Cenários Positivos (Happy Path)

#### 1. Fluxo Completo de Usuário
```bash
# 1. Registrar
curl -X POST http://localhost:4200/api/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"senha123"}'

# 2. Login
curl -X POST http://localhost:4200/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"senha123"}'

# 3. Usar token para acessar produtos
curl -X GET http://localhost:4200/api/products \
  -H "Authorization: Bearer <TOKEN_AQUI>"
```

#### 2. Fluxo Completo de Produto
```bash
# 1. Criar produto
curl -X POST http://localhost:4200/api/product \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Notebook","description":"Dell i5","price":3500,"category":"Informática","stock":10}'

# 2. Listar produtos
curl -X GET http://localhost:4200/api/products \
  -H "Authorization: Bearer <TOKEN>"

# 3. Buscar por ID
curl -X GET http://localhost:4200/api/products/1 \
  -H "Authorization: Bearer <TOKEN>"

# 4. Atualizar produto
curl -X PUT http://localhost:4200/api/products/1 \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Notebook Atualizado","description":"Novo modelo","price":4000,"category":"Informática","stock":15}'

# 5. Deletar produto
curl -X DELETE http://localhost:4200/api/products/1 \
  -H "Authorization: Bearer <TOKEN>"
```

#### 3. Fluxo de Movimentação de Estoque
```bash
# 1. Criar produto primeiro
curl -X POST http://localhost:4200/api/product \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Produto Teste","description":"Para teste de estoque","price":100,"category":"Teste","stock":50}'

# 2. Entrada de estoque
curl -X POST http://localhost:4200/api/stock-movements \
  -H "Content-Type: application/json" \
  -d '{"product_id":1,"quantity":25,"movement_type":"entrada"}'

# 3. Verificar estoque atualizado
curl -X GET http://localhost:4200/api/products/1 \
  -H "Authorization: Bearer <TOKEN>"

# 4. Saída de estoque
curl -X POST http://localhost:4200/api/stock-movements \
  -H "Content-Type: application/json" \
  -d '{"product_id":1,"quantity":-10,"movement_type":"saida"}'

# 5. Listar movimentações
curl -X GET http://localhost:4200/api/stock-movements
```

### ❌ Cenários Negativos (Edge Cases)

#### 1. Autenticação
```bash
# Tentar acessar sem token
curl -X GET http://localhost:4200/api/products
# Esperado: 401 Unauthorized

# Token inválido
curl -X GET http://localhost:4200/api/products \
  -H "Authorization: Bearer invalid-token"
# Esperado: 401 Unauthorized
```

#### 2. Validações de Dados
```bash
# Produto com preço negativo
curl -X POST http://localhost:4200/api/product \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Produto","description":"Teste","price":-100,"category":"Teste","stock":10}'
# Esperado: 400 Bad Request

# Email duplicado no registro
curl -X POST http://localhost:4200/api/register \
  -H "Content-Type: application/json" \
  -d '{"name":"User","email":"test@example.com","password":"senha123"}'
# Esperado: 400 Bad Request
```

#### 3. Regras de Negócio
```bash
# Tentar sair mais estoque que disponível
curl -X POST http://localhost:4200/api/stock-movements \
  -H "Content-Type: application/json" \
  -d '{"product_id":1,"quantity":-1000,"movement_type":"saida"}'
# Esperado: 400 Bad Request

# Produto inexistente
curl -X GET http://localhost:4200/api/products/99999 \
  -H "Authorization: Bearer <TOKEN>"
# Esperado: 404 Not Found
```

## 🔒 TESTES DE SEGURANÇA

### 1. Validação de Entrada
```bash
# SQL Injection
curl -X POST http://localhost:4200/api/product \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"name":"'; DROP TABLE products; --","description":"Test","price":100,"category":"Test","stock":10}'

# XSS
curl -X POST http://localhost:4200/api/product \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"name":"<script>alert(\"XSS\")</script>","description":"Test","price":100,"category":"Test","stock":10}'
```

### 2. Headers de Segurança
```bash
# Verificar headers
curl -I http://localhost:4200/api/products
# Verificar se há headers como X-Frame-Options, X-Content-Type-Options, etc.
```

## 📊 MÉTRICAS E MONITORAMENTO

### 1. Performance
```bash
# Teste de tempo de resposta
time curl -X GET http://localhost:4200/api/products \
  -H "Authorization: Bearer <TOKEN>"

# Teste de concorrência
for i in {1..10}; do
  curl -X GET http://localhost:4200/api/products \
    -H "Authorization: Bearer <TOKEN>" &
done
wait
```

### 2. Logs
```bash
# Monitorar logs do servidor
npm run dev

# Em outro terminal, fazer requests e observar logs
```

## 🐛 DEBUGGING

### 1. Verificar Banco de Dados
```bash
# Conectar ao PostgreSQL
docker exec -it postgres-api-produtos psql -U admin -d api_produtos

# Verificar tabelas
\dt

# Verificar dados
SELECT * FROM products;
SELECT * FROM users;
SELECT * FROM stock_movements;
```

### 2. Verificar Logs
```bash
# Logs do Docker
docker-compose logs postgres

# Logs da aplicação
npm run dev
```

### 3. Testar Conexão
```bash
# Testar se o banco está acessível
docker exec -it postgres-api-produtos psql -U admin -d api_produtos -c "SELECT 1;"
```

## 📝 RELATÓRIOS

### 1. Relatório de Testes
Após executar os testes, verifique:
- `test-report.txt` - Relatório geral
- `coverage/` - Cobertura de código
- `performance-results.txt` - Resultados de performance
- `postman-results.json` - Resultados do Postman

### 2. Checklist de Validação
Use o arquivo `QA_CHECKLIST.md` para marcar os itens testados.

## 🚨 PROBLEMAS COMUNS

### 1. "Connection refused"
- Verificar se o Docker está rodando
- Verificar se a porta 4200 está livre
- Verificar se o PostgreSQL iniciou corretamente

### 2. "Database connection failed"
- Verificar se as migrações foram executadas
- Verificar credenciais do banco
- Verificar se o container PostgreSQL está rodando

### 3. "Token invalid"
- Verificar se o token está sendo enviado corretamente
- Verificar se o token não expirou
- Verificar formato: `Bearer <token>`

## 📞 SUPORTE

### Logs Úteis
- Logs da aplicação: `npm run dev`
- Logs do banco: `docker-compose logs postgres`
- Logs do Docker: `docker-compose logs`

### Comandos de Diagnóstico
```bash
# Status dos containers
docker-compose ps

# Logs em tempo real
docker-compose logs -f

# Reiniciar ambiente
docker-compose down && docker-compose up -d
```

---

## 🎯 PRÓXIMOS PASSOS

1. **Executar checklist completo** do `QA_CHECKLIST.md`
2. **Documentar bugs encontrados** com steps to reproduce
3. **Validar métricas de performance** estabelecidas
4. **Aprovar ou reprovar** para produção
5. **Gerar relatório final** de validação

**Boa sorte nos testes! 🧪✨** 