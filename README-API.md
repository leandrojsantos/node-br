# 📚 Documentação Técnica - API Strategy Pattern

> **Documentação técnica completa** da API Node.js com Strategy Pattern para múltiplos bancos de dados

<div align="center">

[![Node.js](https://img.shields.io/badge/Node.js-22+-green.svg)](https://nodejs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.16+-purple.svg)](https://www.prisma.io/)
[![Jest](https://img.shields.io/badge/Jest-30+-red.svg)](https://jestjs.io/)
[![Podman](https://img.shields.io/badge/Podman-4.0+-orange.svg)](https://podman.io/)

</div>

---

## 📋 Índice Técnico

| Seção | Descrição |
|-------|-----------|
| [🔧 Configuração](#-configuração) | Pré-requisitos e instalação |
| [🏗️ Estrutura do Projeto](#️-estrutura-do-projeto) | Organização de arquivos |
| [🗄️ Bancos de Dados](#️-bancos-de-dados) | MongoDB e PostgreSQL |
| [🔐 Autenticação](#-autenticação) | JWT e segurança |
| [🛣️ Endpoints](#️-endpoints) | API RESTful |
| [🧪 Testes](#-testes) | E2E e cobertura |
| [🐳 Containers](#-containers) | Podman Compose |
| [🚀 Deploy](#-deploy) | Produção e CI/CD |
| [🔍 Troubleshooting](#-troubleshooting) | Solução de problemas |

---

## 🔧 Configuração

### 📋 Pré-requisitos

| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| **Node.js** | >= 22.0.0 (LTS) | Runtime JavaScript |
| **Yarn** | >= 4.0.0 | Gerenciador de pacotes |
| **Podman** | >= 4.0.0 | Containers (ou Docker) |
| **PostgreSQL** | 15+ | Banco relacional |
| **MongoDB** | 7.0+ | Banco NoSQL |

### ⚙️ Variáveis de Ambiente

```env
# Aplicação
NODE_ENV=development
PORT=5000
HOST=localhost

# MongoDB
MONGODB_URI=mongodb://admin:admin123@localhost:27017/nodebr?authSource=admin

# PostgreSQL + Prisma
DATABASE_URL="postgresql://postgres:postgres123@localhost:5432/nodebr?schema=public"
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=nodebr
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres123

# JWT
JWT_SECRET=minha-chave-secreta-super-segura-2025

# Logging
LOG_LEVEL=info
```

### 🚀 Instalação

```bash
# Clone e instale
git clone <repository-url>
cd api-strategy
yarn install

# Configure ambiente
cp env.example .env

# Inicie containers (opcional)
yarn compose:up

# Execute migrações (se usando containers)
yarn prisma:migrate

# Inicie desenvolvimento
yarn dev
```

### 🔧 Configuração de Portas

O projeto usa **duas configurações de porta** para evitar conflitos:

| Modo | Comando | Porta | Descrição |
|------|---------|-------|-----------|
| **Desenvolvimento** | `yarn dev` | **5000** | Aplicação local com nodemon |
| **Containers** | `yarn compose:up` | **3000** | Aplicação em containers |

#### ✅ Benefícios

| Benefício | Descrição |
|-----------|-----------|
| **Sem conflitos** | Portas diferentes evitam problemas |
| **Simultâneo** | Desenvolvimento e produção juntos |
| **Flexibilidade** | Diferentes ambientes configuráveis |

---

## 🏗️ Estrutura do Projeto

### 📁 Organização Simplificada

```
src/
├── app.js                 # Aplicação principal
├── config/
│   ├── context.js         # Contexto Strategy Pattern
│   └── database.js        # Configuração dos bancos
├── models/
│   ├── schemas/           # Schemas Mongoose
│   │   └── heroSchema.js
│   └── strategies/        # Strategy Pattern implementations
│       ├── mongoStrategy.js
│       └── prismaStrategy.js
└── routes/
    ├── authRoutes.js      # Rotas de autenticação
    └── heroRoutes.js      # Rotas de heróis
```

### 🎯 Strategy Pattern

O projeto implementa o Strategy Pattern para alternar entre diferentes bancos de dados:

```javascript
// Contexto base
class DatabaseContext {
  constructor(strategy) {
    this.strategy = strategy;
  }

  async findById(id) {
    return this.strategy.findById(id);
  }
}

// Estratégias específicas
class MongoStrategy {
  async findById(id) {
    return await Hero.findById(id);
  }
}

class PrismaStrategy {
  async findById(id) {
    return await prisma.user.findUnique({ where: { id } });
  }
}
```

---

## 🗄️ Bancos de Dados

### 🍃 MongoDB

**Configuração:**
```javascript
const mongoUri = process.env.MONGODB_URI;
await mongoose.connect(mongoUri, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
});
```

**Schemas:**
- `HeroSchema` — Heróis da aplicação

### 🐘 PostgreSQL

**Configuração Prisma:**
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id              Int       @id @default(autoincrement())
  nome            String
  email           String    @unique
  password        String
  role            Role      @default(user)
  status          Status    @default(ativo)
  ultimoLogin     DateTime?
  tentativasLogin Int       @default(0)
  bloqueadoAte    DateTime?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  deletedAt       DateTime?

  @@map("User")
}
```

**Migrações:**
```bash
yarn prisma:migrate        # Executa migrações
yarn prisma:generate       # Gera cliente
yarn prisma:reset          # Reset completo
```

---

## 🔐 Autenticação

### 🔑 JWT Implementation

**Login:**
```javascript
const token = jwt.sign(
  { id: user.id, email: user.email },
  process.env.JWT_SECRET,
  { expiresIn: '1h' }
);
```

**Middleware de Autenticação:**
```javascript
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Token necessário' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token inválido' });
    req.user = user;
    next();
  });
};
```

### 🛡️ Segurança

| Tecnologia | Uso | Descrição |
|------------|-----|-----------|
| **bcrypt** | Hash de senhas | Criptografia segura |
| **Joi** | Validação | Validação de entrada |
| **CORS** | Headers | Controle de origem |
| **JWT** | Autenticação | Tokens seguros |

---

## 🛣️ Endpoints

### 🔐 Autenticação

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/auth/login` | Login de usuário |
| `POST` | `/auth/register` | Registro de usuário |
| `POST` | `/auth/refresh` | Refresh token |
| `POST` | `/auth/logout` | Logout |

### 👤 Usuários

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/users` | Listar usuários |
| `GET` | `/users/:id` | Buscar usuário |
| `PUT` | `/users/:id` | Atualizar usuário |
| `DELETE` | `/users/:id` | Deletar usuário |

### 🦸 Heróis

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/heroes` | Listar heróis |
| `GET` | `/heroes/:id` | Buscar herói |
| `POST` | `/heroes` | Criar herói |
| `PUT` | `/heroes/:id` | Atualizar herói |
| `DELETE` | `/heroes/:id` | Deletar herói |

### 📊 Sistema

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/health` | Health check |
| `GET` | `/docs` | Documentação Swagger |

---

## 🧪 Testes

### 📋 Estrutura de Testes

```
tests/
├── e2e/              # Testes end-to-end
│   ├── auth.e2e.test.js
│   ├── health.e2e.test.js
│   └── heroes.e2e.test.js
├── setup.js          # Configuração dos testes
└── utils/
    └── waitFor.js    # Utilitários de teste
```

### 🚀 Executar Testes

```bash
# Todos os testes unitários
yarn test

# Com cobertura
yarn test:coverage

# Modo watch
yarn test:watch
```

### 📊 Cobertura de Testes

| Tipo | Descrição | Status |
|------|-----------|--------|
| **Unitários** | Testes isolados | ✅ 149 testes passando |
| **Strategy Pattern** | Testes do padrão | ✅ 100% cobertura |
| **Clean Code** | Qualidade do código | ✅ ESLint + Prettier |

---

## 🐳 Containers

### 🚀 Podman Compose

**Serviços:**
```yaml
services:
  app:          # Aplicação Node.js
  postgres:     # Banco PostgreSQL
  mongo:        # Banco MongoDB
  redis:        # Cache Redis
  nginx:        # Proxy reverso
```

**Comandos:**
```bash
yarn compose:up       # Sobe todos os serviços
yarn compose:down     # Para containers
yarn compose:clean    # Limpa containers e volumes
```

### 📊 Portas

| Serviço | Porta Interna | Porta Externa | Descrição |
|---------|---------------|---------------|-----------|
| **app (containers)** | 3000 | 3000 | Aplicação em containers |
| **app (desenvolvimento)** | 5000 | 5000 | Aplicação local (yarn dev) |
| **postgres** | 5432 | 5432 | Banco PostgreSQL |
| **mongo** | 27017 | 27017 | Banco MongoDB |

---

## 📊 Monitoramento

### 🔍 Health Checks

**Endpoint básico (desenvolvimento):**
```bash
curl http://localhost:5000/health
```

**Endpoint básico (containers):**
```bash
curl http://localhost:5000/health
```

**Resposta:**
```json
{
  "status": "ok",
  "timestamp": "2025-01-27T10:00:00.000Z",
  "uptime": 3600,
  "database": "connected",
  "version": "3.0.0"
}
```

### 📈 Logs

- **Console** para desenvolvimento
- **Estruturados** para produção
- **Níveis**: info, warn, error

---

## 🚀 Deploy

### 🌐 Produção

**Variáveis de ambiente:**
```env
NODE_ENV=production
PORT=3000
HOST=0.0.0.0

# Bancos de dados
MONGODB_URI=mongodb://admin:admin123@mongo:27017/nodebr?authSource=admin
DATABASE_URL=postgresql://postgres:postgres123@postgres:5432/nodebr?schema=public

# Segurança
JWT_SECRET=your-super-secret-jwt-key
```

### 🐳 Docker/Podman

**Build:**
```bash
podman build -t api-strategy .
```

**Run:**
```bash
podman run -p 3000:3000 api-strategy
```

### ☁️ CI/CD

| Etapa | Descrição | Ferramenta |
|-------|-----------|------------|
| **1. Lint** | Formatação e qualidade | ESLint + Prettier |
| **2. Testes** | Validação E2E | Jest |
| **3. Build** | Containers | Podman |
| **4. Deploy** | Publicação automática | GitHub Actions |

---

## 🔍 Troubleshooting

### ❌ Problemas Comuns

#### 1. Erro de Conexão MongoDB
```
❌ Erro ao conectar MongoDB: getaddrinfo ENOTFOUND node-br-mongo
```

**Solução:**
- Verifique se o container MongoDB está rodando
- Confirme as credenciais no `.env`
- Teste conectividade: `yarn compose:up`

#### 2. Erro de Migração Prisma
```
❌ Drift detected: Your database schema is not in sync
```

**Solução:**
```bash
yarn prisma:reset
yarn prisma:migrate
```

#### 3. Porta em Uso
```
❌ Error: listen EADDRINUSE: address already in use ::1:5000
```

**Solução:**
```bash
yarn compose:down
yarn dev
```

#### 4. Erro de Autenticação
```
❌ Token inválido
```

**Solução:**
- Verifique `JWT_SECRET` no `.env`
- Confirme formato do token: `Bearer <token>`

### 🔧 Comandos de Diagnóstico

```bash
# Status dos containers
podman ps

# Logs da aplicação
podman-compose -f podman-compose.yml logs

# Logs do MongoDB
podman logs api-strategy_mongo_1

# Logs do PostgreSQL
podman logs api-strategy_postgres_1

# Teste de conectividade
curl http://localhost:5000/health
```
