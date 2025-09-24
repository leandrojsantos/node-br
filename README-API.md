# 🚀 Node BR API - Strategy Pattern 2025

> **API Node.js moderna** com padrões arquiteturais avançados, Strategy Pattern, múltiplos bancos de dados, autenticação JWT, documentação Swagger e testes automatizados.

[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org/)
[![Yarn](https://img.shields.io/badge/Yarn-1.22+-blue.svg)](https://yarnpkg.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.16.2-purple.svg)](https://prisma.io/)
[![Jest](https://img.shields.io/badge/Jest-30.1.3-red.svg)](https://jestjs.io/)
[![Swagger](https://img.shields.io/badge/Swagger-15.0.0-green.svg)](https://swagger.io/)

## 📋 Índice

- [🚀 Início Rápido](#-início-rápido)
- [⚙️ Configuração](#️-configuração)
- [🐳 Containers](#-containers)
- [📚 Documentação Swagger](#-documentação-swagger)
- [🧪 Testes](#-testes)
- [🔧 Scripts Disponíveis](#-scripts-disponíveis)
- [❌ Erros Comuns](#-erros-comuns)
- [🏗️ Arquitetura](#️-arquitetura)
- [📊 Endpoints](#-endpoints)

## 🚀 Início Rápido

### Pré-requisitos

- **Node.js** >= 20.0.0
- **Yarn** >= 1.22.0
- **Podman** ou **Docker** (para containers)
- **PostgreSQL** e **MongoDB** (via containers)

### 1. Clone e Instale

```bash
git clone <repository-url>
cd api-strategy
yarn install
```

### 2. Configure o Ambiente

```bash
# Copie o arquivo de exemplo
cp env.example .env

# O arquivo .env já está configurado com:
# - DATABASE_URL para PostgreSQL
# - MONGODB_URI para MongoDB
# - JWT_SECRET para autenticação
```

### 3. Inicie os Containers

```bash
# Opção 1: Usando yarn (Recomendado)
yarn podman:compose

# Opção 2: Usando script direto
./scripts/compose.sh
```

### 4. Execute as Migrações

```bash
yarn prisma:migrate
```

### 5. Inicie a Aplicação

```bash
# Desenvolvimento
yarn dev

# Produção
yarn start
```

### 6. Acesse a API

- **API Base:** http://localhost:3000
- **Swagger UI:** http://localhost:3000/docs
- **Health Check:** http://localhost:3000/health

## ⚙️ Configuração

### Variáveis de Ambiente

O arquivo `.env` contém todas as configurações necessárias:

```env
# Aplicação
NODE_ENV=development
PORT=3000
HOST=localhost

# PostgreSQL (Prisma)
DATABASE_URL="postgresql://postgres:postgres123@localhost:5432/nodebr"

# MongoDB (Mongoose)
MONGODB_URI=mongodb://nodebr:nodebr123@node-br-mongo:27017/nodebr

# JWT
JWT_SECRET=minha-chave-secreta-super-segura-2025

# Redis (Opcional)
REDIS_URL=redis://localhost:6379

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Estrutura do Projeto

```
src/
├── app.js                 # Aplicação principal
├── config/
│   ├── context.js         # Contexto de configuração
│   └── database.js        # Configuração dos bancos
├── middleware/
│   ├── errorHandler.js    # Tratamento de erros
│   └── rateLimiter.js     # Rate limiting
├── models/
│   ├── schemas/           # Schemas Mongoose
│   └── strategies/        # Strategy Pattern implementations
├── routes/
│   ├── authRoutes.js      # Rotas de autenticação
│   ├── heroRoutes.js      # Rotas de heróis
│   └── userRoutes.js      # Rotas de usuários
└── services/              # Serviços de negócio
```

## 🐳 Containers

### Serviços Disponíveis

| Serviço | Porta | Descrição |
|---------|-------|-----------|
| **app** | 3000 | Aplicação Node.js |
| **postgres** | 5432 | Banco PostgreSQL |
| **mongo** | 27017 | Banco MongoDB |
| **redis** | 6379 | Cache Redis |
| **nginx** | 80 | Proxy reverso |

### Comandos de Container

```bash
# Iniciar todos os serviços
yarn podman:compose

# Parar todos os serviços
yarn podman:stop

# Limpar containers e volumes
yarn podman:clean

# Ver logs da aplicação
podman logs api-strategy_app_1

# Ver logs do PostgreSQL
podman logs api-strategy_postgres_1

# Ver logs do MongoDB
podman logs api-strategy_mongo_1
```

## 📚 Documentação Swagger

### Acessando a Documentação

1. **Swagger UI:** http://localhost:3000/docs
2. **JSON Schema:** http://localhost:3000/swagger.json

### Funcionalidades do Swagger

- ✅ **Interface Interativa** - Teste endpoints diretamente
- ✅ **Autenticação JWT** - Login integrado
- ✅ **Validação de Schema** - Documentação automática
- ✅ **Exemplos de Request/Response** - Modelos completos
- ✅ **Códigos de Status** - Documentação de erros

### Como Usar o Swagger

1. **Acesse:** http://localhost:3000/docs
2. **Faça Login:** Use o endpoint `/auth/login`
3. **Copie o Token:** Da resposta do login
4. **Autorize:** Clique em "Authorize" e cole o token
5. **Teste:** Execute os endpoints protegidos

### Exemplo de Login

```json
POST /auth/login
{
  "email": "admin@example.com",
  "password": "123456"
}
```

**Resposta:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "nome": "Admin",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

## 🧪 Testes

### Executando Testes

```bash
# Todos os testes
yarn test

# Testes em modo watch
yarn test:watch

# Testes com coverage
yarn test:coverage

# Testes para CI/CD
yarn test:ci
```

### Estrutura de Testes

```
tests/
├── setup.js              # Configuração global
├── e2e/                  # Testes end-to-end
│   ├── auth.e2e.test.js
│   ├── health.e2e.test.js
│   └── heroes.e2e.test.js
├── integration/          # Testes de integração
├── unit/                 # Testes unitários
└── utils/
    └── waitFor.js        # Utilitários de teste
```

### Exemplo de Teste

```javascript
// tests/e2e/auth.e2e.test.js
import { describe, test, expect } from '@jest/globals';
import request from 'supertest';

describe('Auth Endpoints', () => {
  test('POST /auth/login - Deve fazer login com sucesso', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({
        email: 'admin@example.com',
        password: '123456'
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.token).toBeDefined();
  });
});
```

### Coverage Report

Após executar `yarn test:coverage`, acesse:
- **HTML Report:** `coverage/lcov-report/index.html`
- **Terminal:** Cobertura exibida no console

## 🔧 Scripts Disponíveis

### Desenvolvimento

```bash
yarn dev              # Inicia em modo desenvolvimento
yarn start            # Inicia em modo produção
yarn tsc              # Compila TypeScript
```

### Testes

```bash
yarn test             # Executa todos os testes
yarn test:watch       # Testes em modo watch
yarn test:coverage    # Testes com cobertura
yarn test:ci          # Testes para CI/CD
```

### Qualidade de Código

```bash
yarn lint             # Verifica linting
yarn lint:fix         # Corrige problemas de linting
yarn format           # Formata código com Prettier
```

### Containers

```bash
yarn podman:build     # Build da imagem
yarn podman:run       # Executa container
yarn podman:start     # Inicia todos os serviços
yarn podman:stop      # Para todos os serviços
yarn podman:clean     # Limpa containers e volumes
yarn podman:compose   # Compose completo (recomendado)
```

### Banco de Dados

```bash
yarn prisma:generate  # Gera Prisma Client
yarn prisma:migrate   # Executa migrações
```

## ❌ Erros Comuns

### 1. Erro de Conexão com MongoDB

```bash
❌ Erro ao conectar MongoDB: getaddrinfo ENOTFOUND node-br-mongo
```

**Solução:**
```bash
# Inicie os containers primeiro
yarn podman:compose

# Aguarde todos os serviços subirem
# Depois execute:
yarn dev
```

### 2. Erro de DATABASE_URL

```bash
❌ Environment variable not found: DATABASE_URL
```

**Solução:**
```bash
# Copie o arquivo de exemplo
cp env.example .env

# Verifique se DATABASE_URL está definida
cat .env | grep DATABASE_URL
```

### 3. Erro de Migração

```bash
❌ Drift detected: Your database schema is not in sync
```

**Solução:**
```bash
# Reset o banco (CUIDADO: apaga dados)
npx prisma migrate reset --force

# Ou execute migrações
yarn prisma:migrate
```

### 4. Erro de Porta em Uso

```bash
❌ Error: listen EADDRINUSE: address already in use :::3000
```

**Solução:**
```bash
# Pare containers existentes
yarn podman:stop

# Ou use outra porta
PORT=3001 yarn dev
```

### 5. Erro de Permissão

```bash
❌ Permission denied: ./scripts/compose.sh
```

**Solução:**
```bash
# Dê permissão de execução
chmod +x scripts/*.sh

# Execute novamente
yarn podman:compose
```

## 🏗️ Arquitetura

### Strategy Pattern

O projeto implementa o **Strategy Pattern** para diferentes tipos de banco de dados:

```javascript
// Estratégias disponíveis
- MongoStrategy     // MongoDB com Mongoose
- PostgresStrategy  // PostgreSQL com Prisma
- PrismaStrategy    // PostgreSQL com Prisma ORM
```

### Padrões Utilizados

- ✅ **Strategy Pattern** - Múltiplos bancos de dados
- ✅ **Repository Pattern** - Abstração de dados
- ✅ **Middleware Pattern** - Interceptação de requests
- ✅ **JWT Authentication** - Autenticação stateless
- ✅ **Rate Limiting** - Controle de requisições
- ✅ **Error Handling** - Tratamento centralizado

### Fluxo de Dados

```
Request → Middleware → Routes → Services → Strategies → Database
   ↓
Response ← Middleware ← Routes ← Services ← Strategies ← Database
```

## 📊 Endpoints

### Autenticação

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/auth/login` | Login de usuário | ❌ |
| POST | `/auth/register` | Registro de usuário | ❌ |
| POST | `/auth/logout` | Logout de usuário | ✅ |
| GET | `/auth/profile` | Perfil do usuário | ✅ |

### Heróis

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/heroes` | Lista heróis | ✅ |
| GET | `/heroes/{id}` | Busca herói por ID | ✅ |
| POST | `/heroes` | Cria novo herói | ✅ |
| PUT | `/heroes/{id}` | Atualiza herói | ✅ |
| DELETE | `/heroes/{id}` | Remove herói | ✅ |

### Sistema

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/health` | Health check | ❌ |
| GET | `/test` | Teste de conexão | ❌ |
| GET | `/docs` | Documentação Swagger | ❌ |

### Exemplos de Uso

#### 1. Login e Obter Token

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "123456"}'
```

#### 2. Listar Heróis (com Token)

```bash
curl -X GET http://localhost:3000/heroes \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

#### 3. Health Check

```bash
curl http://localhost:3000/health
```

---

## 📞 Suporte

Para dúvidas ou problemas:

1. **Verifique os logs:** `podman logs api-strategy_app_1`
2. **Execute os testes:** `yarn test`
3. **Verifique a documentação:** http://localhost:3000/docs
4. **Consulte este README** para soluções comuns

---

**Desenvolvido com ❤️ por Leandro Santos**

*API Node.js moderna com padrões arquiteturais avançados - 2025*
