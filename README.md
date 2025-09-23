# Node BR API strategy pattern Refatorada em 2025 🚀

API Node.js moderna com padrões 2025, Strategy Pattern, Jest, Swagger e Podman.

## 📋 Sobre o Projeto

- **Strategy Pattern** para flexibilidade de banco de dados
- **Jest** para testes unitários e de integração
- **Swagger** para documentação automática da API
- **Podman** para containerização e deploy
- **CI/CD** com GitHub Actions
- **Clean Code** e princípios SOLID
- **ES Modules** e async/await
- **Yarn** como gerenciador de pacotes

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
│       ├── mongoStrategy.js    # Estratégia MongoDB
│       └── postgresStrategy.js # Estratégia PostgreSQL
└── routes/
    ├── heroRoutes.js       # Rotas de heróis (MongoDB)
    ├── userRoutes.js       # Rotas de usuários (PostgreSQL)
    └── authRoutes.js       # Rotas de autenticação
```

### Tecnologias Utilizadas

- **Node.js 20+** (LTS)
- **Hapi.js** - Framework web
- **MongoDB** - Banco NoSQL para heróis
- **PostgreSQL** - Banco SQL para usuários
- **Jest** - Framework de testes
- **Swagger** - Documentação da API
- **Podman** - Containerização
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

```

2. **Instale as dependências**
```bash
yarn install

```

3. **Configure as variáveis de ambiente**
```bash
cp env.example .env
# Edite o arquivo .env com suas configurações
```

4. **Execute com Podman**
```bash
# Subir todos os serviços (recomendado)
yarn podman:start

# Parar todos os serviços
yarn podman:stop

# Limpar containers e imagens antigas
yarn podman:clean

# Comandos alternativos
yarn start:containers  # Subir containers
yarn stop:containers   # Parar containers
```

5. **Execute localmente**
```bash
# Iniciar MongoDB e PostgreSQL
# (use Podman Compose ou instale localmente)

# Executar em desenvolvimento
yarn dev

# Executar em produção
yarn start
```

### Acessar a API

- **API**: http://localhost:3000
- **Documentação Swagger**: http://localhost:3000/docs
- **Health Check**: http://localhost:3000/health

## 🧪 Testes

### Executar Testes

```bash
# Todos os testes
yarn test

# Testes em modo watch
yarn test:watch

# Testes com cobertura
yarn test:coverage

# Testes para CI
yarn test:ci
```

### Cobertura de Testes

O projeto mantém alta cobertura de testes:
- **Testes Unitários**: Estratégias de banco e utilitários
- **Testes de Integração**: Rotas e fluxos completos
- **Cobertura mínima**: 80%

## 📚 Documentação da API

A documentação completa está disponível via Swagger em `/docs`:

### Endpoints Principais

#### Heróis (MongoDB)
- `GET /heroes` - Listar heróis
- `GET /heroes/{id}` - Buscar herói por ID
- `POST /heroes` - Criar herói
- `PATCH /heroes/{id}` - Atualizar herói
- `DELETE /heroes/{id}` - Remover herói

#### Usuários (PostgreSQL)
- `GET /users` - Listar usuários (admin)
- `GET /users/{id}` - Buscar usuário por ID
- `PATCH /users/{id}` - Atualizar usuário
- `DELETE /users/{id}` - Remover usuário (admin)

#### Autenticação
- `POST /auth/register` - Registrar usuário
- `POST /auth/login` - Login
- `POST /auth/refresh` - Renovar token
- `POST /auth/logout` - Logout

## 🐳 Podman

### Comandos Podman

```bash
# Build da imagem
yarn podman:build

# Executar container
yarn podman:run

# Subir todos os serviços
yarn podman:compose

# Parar serviços
yarn podman:down

# Comandos alternativos
yarn start:containers  # Subir containers
yarn stop:containers   # Parar containers

# Scripts úteis
./scripts/cleanup.sh      # Limpar containers e imagens antigas
./scripts/start-databases.sh  # Iniciar apenas os bancos de dados
```

### Estrutura de Containers

- **app**: Aplicação Node.js
- **mongo**: MongoDB 7.0
- **postgres**: PostgreSQL 15
- **redis**: Redis 7 (cache)
- **nginx**: Proxy reverso

## 🔧 Desenvolvimento

### Scripts Disponíveis

```bash
yarn start          # Iniciar em produção
yarn dev            # Iniciar em desenvolvimento
yarn test           # Executar testes
yarn test:watch     # Testes em modo watch
yarn test:coverage  # Testes com cobertura
yarn lint           # Verificar código
yarn lint:fix       # Corrigir problemas de lint
yarn format         # Formatar código
```

### Qualidade de Código

- **ESLint**: Análise estática
- **Prettier**: Formatação automática
- **Jest**: Testes automatizados
- **Husky**: Git hooks (opcional)

## 🚀 Deploy

### CI/CD

O projeto inclui pipeline CI/CD completo:

1. **Lint e Formatação**
2. **Testes Unitários e Integração**
3. **Build Podman**
4. **Análise de Segurança**
5. **Deploy Automático**

### Variáveis de Ambiente

Configure as seguintes variáveis para produção:

```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb://mongo:27017/nodebr
POSTGRES_DB=nodebr
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your-secure-password
JWT_SECRET=your-super-secret-jwt-key
```

## 📊 Monitoramento

### Health Check

```bash
curl http://localhost:3000/health
```

### Logs

Os logs são estruturados em JSON para facilitar análise:

```json
{
  "timestamp": "2025-01-27T10:00:00.000Z",
  "level": "info",
  "message": "Servidor iniciado",
  "port": 3000,
  "environment": "production"
}
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.
