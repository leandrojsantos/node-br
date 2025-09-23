# API Strategy Pattern 2025 🚀

API em Node.js com padrões 2025, Strategy Pattern, TypeScript, Prisma, Jest, Swagger e Podman rootless.

## 📋 Sobre o Projeto

- **Strategy Pattern** para flexibilidade de banco de dados
- **TypeScript** para type-safety e melhor DX
- **Prisma** como ORM moderno para PostgreSQL
- **Mongoose** para MongoDB (ODM estável)
- **Jest** para testes unitários, integração e E2E
- **Swagger** para documentação automática da API
- **Podman rootless** para containerização segura
- **Clean Code** e princípios SOLID
- **ES Modules** e async/await

## 🏗️ Arquitetura

### Padrão Strategy
O projeto utiliza o padrão Strategy para permitir troca de estratégias de banco de dados em tempo de execução:

```
src/
├── config/
│   ├── context.js          # Contexto base do Strategy
│   └── database.js         # Configuração dos bancos
├── models/
│   └── strategies/
│       ├── mongoStrategy.js    # Estratégia MongoDB (Mongoose)
│       └── prismaStrategy.ts   # Estratégia PostgreSQL (Prisma)
└── routes/
    ├── heroRoutes.ts       # Rotas de heróis (MongoDB)
    ├── userRoutes.ts       # Rotas de usuários (PostgreSQL)
    └── authRoutes.ts       # Rotas de autenticação
```

### Tecnologias Utilizadas

- **Node.js 20+** (LTS)
- **TypeScript** - Type-safety e melhor DX
- **Hapi.js** - Framework web robusto
- **Prisma** - ORM moderno para PostgreSQL
- **Mongoose** - ODM para MongoDB
- **Jest** - Framework de testes completo
- **Swagger** - Documentação da API
- **Podman** - Containerização rootless
- **ESLint + Prettier** - Qualidade de código

## 🚀 Como Executar

### Pré-requisitos

- Node.js 20+ (LTS)
- Yarn 1.22+
- Podman e Podman Compose
- MongoDB 7.0+
- PostgreSQL 15+

### Instalação

1. **Clone o repositório**
```bash
git clone <repository-url>
cd api-strategy
```

2. **Instale as dependências**
```bash
yarn install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

4. **Execute com Podman (Recomendado)**
```bash
# Subir todos os serviços (rootless, force recreate)
yarn podman:compose

# Parar todos os serviços
yarn podman:stop

# Limpar containers, imagens, volumes e redes
yarn podman:clean

# Comandos alternativos
yarn start:containers  # Subir containers
yarn stop:containers   # Parar containers
```

5. **Execute localmente (Desenvolvimento)**
```bash
# Gerar client Prisma
yarn prisma:generate

# Executar migrações (se necessário)
yarn prisma:migrate

# Executar em desenvolvimento
yarn dev

# Executar em produção
yarn start
```

### Acessar a API

- **API (direta)**: http://localhost:3000
- **Documentação Swagger (direta)**: http://localhost:3000/docs
- **Health Check**: http://localhost:3000/health
- **Via Nginx (rootless)**: http://localhost:8080
- **Docs via Nginx**: http://localhost:8080/docs

## 🧪 Testes

### Executar Testes

```bash
# Todos os testes (unit + e2e)
yarn test

# Testes em modo watch
yarn test:watch

# Testes com cobertura
yarn test:coverage

# Testes para CI
yarn test:ci
```

### Tipos de Testes

O projeto mantém alta cobertura de testes:
- **Testes Unitários**: Estratégias de banco e utilitários
- **Testes de Integração**: Rotas e fluxos completos
- **Testes E2E**: Health check e endpoints principais
- **Cobertura mínima**: 80%

## 📚 Documentação da API

A documentação completa está disponível via Swagger em `/docs`:

### Endpoints Principais

#### Heróis (MongoDB)
- `GET /heroes` - Listar heróis (público)
- `GET /heroes/{id}` - Buscar herói por ID (público)
- `POST /heroes` - Criar herói (autenticado)
- `PATCH /heroes/{id}` - Atualizar herói (autenticado)
- `DELETE /heroes/{id}` - Remover herói (autenticado)

#### Usuários (PostgreSQL + Prisma)
- `GET /users` - Listar usuários (admin)
- `GET /users/{id}` - Buscar usuário por ID (próprio ou admin)
- `PATCH /users/{id}` - Atualizar usuário (próprio ou admin)
- `DELETE /users/{id}` - Remover usuário (admin)

#### Autenticação
- `POST /auth/register` - Registrar usuário (público)
- `POST /auth/login` - Login (público)
- `POST /auth/refresh` - Renovar token (autenticado)
- `POST /auth/logout` - Logout (autenticado)

#### Sistema
- `GET /health` - Health check (público)
- `GET /test` - Teste de conexão (público)

## 🐳 Podman Rootless

### Comandos Podman

```bash
# Build da imagem
yarn podman:build

# Executar container
yarn podman:run

# Subir todos os serviços (rootless, force recreate)
yarn podman:compose

# Parar serviços
yarn podman:stop

# Limpar containers, imagens, volumes e redes
yarn podman:clean

# Scripts úteis
./scripts/cleanup.sh      # Limpar containers, imagens, volumes e redes
./scripts/start-databases.sh  # Iniciar apenas os bancos de dados
```

### Estrutura de Containers

- **app**: Aplicação Node.js (porta 3000)
- **mongo**: MongoDB 7.0 (porta 27017)
- **postgres**: PostgreSQL 15 (porta 5432)
- **redis**: Redis 7 (porta 6379)
- **nginx**: Proxy reverso (portas 8080/8443)

### Configuração Rootless

O projeto está configurado para funcionar em modo rootless:
- Portas não privilegiadas (8080/8443 para Nginx)
- Binds com rótulos SELinux (:Z)
- Volumes persistentes para dados

## 🔧 Desenvolvimento

### Scripts Disponíveis

```bash
# Aplicação
yarn start          # Iniciar em produção
yarn dev            # Iniciar em desenvolvimento

# TypeScript
yarn tsc            # Compilar TypeScript

# Prisma
yarn prisma:generate    # Gerar client Prisma
yarn prisma:migrate     # Aplicar migrações

# Testes
yarn test           # Executar testes
yarn test:watch     # Testes em modo watch
yarn test:coverage  # Testes com cobertura

# Qualidade
yarn lint           # Verificar código
yarn lint:fix       # Corrigir problemas de lint
yarn format         # Formatar código
```

### TypeScript

O projeto usa TypeScript gradualmente:
- Arquivos `.ts` para novas implementações
- Arquivos `.js` mantêm compatibilidade via re-export
- `tsconfig.json` configurado para ES2020/ESNext
- Tipagem completa em estratégias e rotas

### Prisma

ORM moderno para PostgreSQL:
- Schema em `prisma/schema.prisma`
- Migrações automáticas
- Type-safety completo
- Client gerado automaticamente

## 🚀 Deploy

### Variáveis de Ambiente

Configure as seguintes variáveis para produção:

```env
NODE_ENV=production
PORT=3000
HOST=0.0.0.0

# MongoDB
MONGODB_URI=mongodb://admin:admin123@mongo:27017/nodebr?authSource=admin

# PostgreSQL + Prisma
DATABASE_URL=postgresql://postgres:postgres123@postgres:5432/nodebr?schema=public
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_DB=nodebr
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres123

# JWT
JWT_SECRET=your-super-secret-jwt-key
```

### CI/CD

O projeto inclui pipeline CI/CD completo:
1. **Lint e Formatação**
2. **Testes Unitários e Integração**
3. **Testes E2E**
4. **Build Podman**
5. **Análise de Segurança**
6. **Deploy Automático**

## 📊 Monitoramento

### Health Check

```bash
curl http://localhost:3000/health
# ou via Nginx
curl http://localhost:8080/health
```

### Logs

Os logs são estruturados para facilitar análise:

```json
{
  "timestamp": "2025-01-27T10:00:00.000Z",
  "level": "info",
  "message": "Servidor iniciado",
  "port": 3000,
  "environment": "production"
}
```

## 🔒 Segurança

- **JWT** para autenticação
- **bcrypt** para hash de senhas
- **Helmet** para headers de segurança
- **Rate limiting** via Nginx
- **Validação** com Joi
- **CORS** configurado
- **Rootless** containers

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

