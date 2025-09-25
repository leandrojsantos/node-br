# 📚 Documentação Técnica - API Strategy Pattern

> **Documentação técnica completa** da API Node.js com Strategy Pattern, múltiplos bancos de dados e autenticação JWT.

## 📋 Índice Técnico

<a href="#configuração">🔧 Configuração</a> •
<a href="#estrutura-do-projeto">🏗️ Estrutura do Projeto</a> •
<a href="#bancos-de-dados">🗄️ Bancos de Dados</a> •
<a href="#autenticação">🔐 Autenticação</a> •
<a href="#endpoints">🛣️ Endpoints</a> •
<a href="#testes">🧪 Testes</a> •
<a href="#containers">🐳 Containers</a> •
<a href="#monitoramento">📊 Monitoramento</a> •
<a href="#deploy">🚀 Deploy</a> •
<a href="#troubleshooting">🔍 Troubleshooting</a>

## 🔧 Configuração

### 📋 Pré-requisitos

- **Node.js** >= 20.0.0
- **Yarn** >= 1.22.0
- **Podman** >= 4.0.0 (ou Docker)
- **PostgreSQL** 15+
- **MongoDB** 7.0+
- **Redis** 7.0+

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

# Redis
REDIS_URL=redis://localhost:6379

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
LOG_FORMAT=combined
```

### 🚀 Instalação

```bash
# Clone e instale
git clone <repository-url>
cd api-strategy
yarn install

# Configure ambiente
cp env.example .env

# Inicie containers
yarn podman:compose

# Execute migrações caso necessário
yarn prisma:migrate

# Inicie desenvolvimento
yarn dev
```

### 🔧 Configuração de Portas

O projeto usa **duas configurações de porta** para evitar conflitos:

| Modo | Comando | Porta | Descrição |
|------|---------|-------|-----------|
| **Desenvolvimento** | `yarn dev` | **5000** | Aplicação local com nodemon |
| **Containers** | `yarn podman:compose` | **3000** | Aplicação em containers |

**Benefícios:**
- ✅ **Sem conflitos** de porta
- ✅ **Desenvolvimento** e **produção** simultâneos
- ✅ **Flexibilidade** para diferentes ambientes

## 🏗️ Estrutura do Projeto

### 📁 Organização de Arquivos

```
src/
├── app.js                 # Aplicação principal
├── config/
│   ├── context.js         # Contexto de configuração
│   └── database.js        # Configuração dos bancos
├── controllers/           # Controladores da API
├── middleware/
│   ├── errorHandler.js    # Tratamento de erros
│   └── rateLimiter.js     # Rate limiting
├── models/
│   ├── schemas/           # Schemas Mongoose
│   │   ├── heroSchema.js
│   │   └── userSchema.js
│   └── strategies/        # Strategy Pattern implementations
│       ├── mongoStrategy.js
│       ├── postgresStrategy.js
│       └── prismaStrategy.js
├── routes/
│   ├── authRoutes.js      # Rotas de autenticação
│   ├── heroRoutes.js      # Rotas de heróis
│   └── userRoutes.js      # Rotas de usuários
├── services/              # Serviços de negócio
└── utils/                 # Utilitários
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
    return await User.findById(id);
  }
}

class PrismaStrategy {
  async findById(id) {
    return await prisma.user.findUnique({ where: { id } });
  }
}
```

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
- `UserSchema` - Usuários do sistema
- `HeroSchema` - Heróis da aplicação

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
yarn prisma:migrate:reset  # Reset completo
```

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

- **bcrypt** para hash de senhas
- **Helmet** para headers de segurança
- **Rate limiting** via middleware
- **Validação** com Joi
- **CORS** configurado

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

## 🧪 Testes

### 📋 Estrutura de Testes

```
tests/
├── unit/              # Testes unitários
├── integration/       # Testes de integração
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
# Todos os testes
yarn test

# Testes unitários
yarn test:unit

# Testes de integração
yarn test:integration

# Testes E2E
yarn test:e2e

# Com cobertura
yarn test:coverage

# Modo watch
yarn test:watch
```

### 📊 Cobertura de Testes

- **Unitários**: Funções isoladas
- **Integração**: Componentes interagindo
- **E2E**: Fluxos completos
- **Cobertura**: > 80% esperada

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
yarn podman:compose   # Sobe todos os serviços
yarn podman:stop      # Para containers
yarn podman:clean     # Limpa containers e volumes
```

### 📊 Portas

| Serviço | Porta Interna | Porta Externa | Descrição |
|---------|---------------|---------------|-----------|
| **app (containers)** | 3000 | 3000 | Aplicação em containers |
| **app (desenvolvimento)** | 5000 | 5000 | Aplicação local (yarn dev) |
| **postgres** | 5432 | 5432 | Banco PostgreSQL |
| **mongo** | 27017 | 27017 | Banco MongoDB |
| **redis** | 6379 | 6379 | Cache Redis |
| **nginx** | 80 | 8080 | Proxy reverso |

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

### 📈 Logs Estruturados

```json
{
  "timestamp": "2025-01-27T10:00:00.000Z",
  "level": "info",
  "message": "Servidor iniciado",
  "port": 3000,
  "environment": "development"
}
```

### 📊 Métricas

- **Uptime** do servidor
- **Conexões** de banco
- **Requests** por minuto
- **Erros** e exceções

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

**Pipeline:**
1. **Lint** e formatação
2. **Testes** unitários e integração
3. **Testes E2E**
4. **Build** de containers
5. **Análise** de segurança
6. **Deploy** automático

## 🔍 Troubleshooting

### ❌ Problemas Comuns

#### 1. Erro de Conexão MongoDB
```
❌ Erro ao conectar MongoDB: getaddrinfo ENOTFOUND node-br-mongo
```

**Solução:**
- Verifique se o container MongoDB está rodando
- Confirme as credenciais no `.env`
- Teste conectividade: `yarn podman:compose`

#### 2. Erro de Migração Prisma
```
❌ Drift detected: Your database schema is not in sync
```

**Solução:**
```bash
yarn prisma:migrate:reset
yarn prisma:migrate
```

#### 3. Porta em Uso
```
❌ Error: listen EADDRINUSE: address already in use ::1:5000
```

**Solução:**
```bash
podman stop api-strategy_app_1
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
podman logs api-strategy_app_1

# Logs do MongoDB
podman logs api-strategy_mongo_1

# Logs do PostgreSQL
podman logs api-strategy_postgres_1

# Teste de conectividade
curl http://localhost:5000/health
```
