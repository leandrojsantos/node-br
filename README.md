# 🚀 API Strategy Pattern

> **API Node.js** demonstrando o padrão Strategy para alternância entre múltiplos bancos de dados

<div align="center">

[![Node.js](https://img.shields.io/badge/Node.js-22+-green.svg)](https://nodejs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.16+-purple.svg)](https://www.prisma.io/)
[![Jest](https://img.shields.io/badge/Jest-30+-red.svg)](https://jestjs.io/)
[![Podman](https://img.shields.io/badge/Podman-4.0+-orange.svg)](https://podman.io/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

</div>

---

## 📋 Índice

| Seção | Descrição |
|-------|-----------|
| [🎯 Sobre](#-sobre) | Visão geral do projeto |
| [✨ Funcionalidades](#-funcionalidades) | Recursos disponíveis |
| [🏗️ Arquitetura](#️-arquitetura) | Estrutura do projeto |
| [🚀 Início Rápido](#-início-rápido) | Instalação e execução |
| [📚 Documentação](#-documentação) | Links para documentação técnica |
| [🤝 Contribuição](#-contribuição) | Como contribuir |

---

## 🎯 Sobre

Esta API demonstra a implementação do **Strategy Pattern** em Node.js, permitindo alternar entre diferentes bancos de dados (MongoDB, PostgreSQL) de forma transparente.

### 🎨 Características Principais

| Característica | Descrição |
|----------------|-----------|
| 🔄 **Strategy Pattern** | Alternância entre múltiplos bancos de dados |
| 🔐 **Autenticação JWT** | Sistema de autenticação seguro |
| 📖 **Swagger UI** | Documentação automática da API |
| 🧪 **Testes Jest** | Cobertura de testes unitários (149 testes) |
| 🐳 **Containers Podman** | Ambiente de desenvolvimento isolado |
| 🧹 **Clean Code** | Código limpo, DRY e KISS |

---

## ✨ Funcionalidades

### 🔐 Autenticação

| Funcionalidade | Tecnologia | Descrição |
|----------------|------------|-----------|
| **Login** | JWT | Autenticação com tokens seguros |
| **Registro** | bcryptjs | Hash de senhas |
| **Validação** | Joi | Validação de dados de entrada |

### 🗄️ Bancos de Dados

| Banco | Tecnologia | Uso |
|-------|------------|-----|
| **MongoDB** | Mongoose | Dados de heróis |
| **PostgreSQL** | Prisma | Dados de usuários |
| **Strategy** | Pattern | Alternância transparente |

### 📖 Documentação

| Recurso | Descrição |
|---------|-----------|
| **Swagger UI** | Interface interativa |
| **Endpoints** | API RESTful completa |
| **Health Check** | Monitoramento de saúde |

---

## 🏗️ Arquitetura

```
src/
├── app.js                 # 🚀 Aplicação principal
├── config/
│   ├── context.js         # 🔄 Contexto Strategy Pattern
│   └── database.js        # 🗄️ Configuração dos bancos
├── models/
│   ├── schemas/           # 📊 Schemas Mongoose
│   │   └── heroSchema.js
│   └── strategies/        # 🔄 Implementações Strategy Pattern
│       ├── mongoStrategy.js
│       └── prismaStrategy.js
└── routes/
    ├── authRoutes.js      # 🔐 Rotas de autenticação
    └── heroRoutes.js      # 🦸 Rotas de heróis
```

### 🔄 Strategy Pattern

O projeto implementa o Strategy Pattern para alternar entre diferentes bancos de dados:

- **MongoDB Strategy** — Para dados não relacionais
- **Prisma Strategy** — Para ORM moderno

---

## 🚀 Início Rápido

### 📋 Pré-requisitos

- **Node.js** 22+ (LTS)
- **Yarn** 4.0+
- **Podman** 4.0+ (ou Docker)

### ⚡ Instalação

```bash
# Clone o repositório
git clone <repository-url>
cd api-strategy

# Instale dependências
yarn install

# Configure variáveis de ambiente
cp env.example .env

# Inicie containers (opcional)
yarn compose:up

# Execute migrações (se usando containers)
yarn prisma:migrate

# Inicie desenvolvimento
yarn dev
```


### 🌐 Acessos URL

| Serviço | Desenvolvimento | Containers |
|---------|-----------------|------------|
| **API** | http://localhost:5000 | http://localhost:3000 |
| **Swagger** | http://localhost:5000/docs | http://localhost:3000/docs |
| **Health** | http://localhost:5000/health | http://localhost:3000/health |

---

## 📚 Documentação

### 📖 Documentação Técnica

Para informações técnicas detalhadas, consulte:

- **[README-API.md](./README-API.md)** — Documentação técnica completa
- **[Swagger UI](http://localhost:5000/docs)** — Documentação interativa da API
- **[Health Check](http://localhost:5000/health)** — Status da aplicação

### 🔗 Links Úteis

- [Strategy Pattern](https://refactoring.guru/design-patterns/strategy) — Padrão de design
- [Hapi.js](https://hapi.dev/) — Framework web
- [Prisma](https://www.prisma.io/) — ORM moderno
- [Jest](https://jestjs.io/) — Framework de testes

---

## 🤝 Contribuição

### 📋 Como Contribuir

1. **Fork** o projeto
2. **Crie** uma branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. **Push** para a branch (`git push origin feature/AmazingFeature`)
5. **Abra** um Pull Request

### 📋 Padrões de Código

| Princípio | Aplicação |
|-----------|-----------|
| **Clean Code** | Código limpo e legível |
| **DRY** | Don't Repeat Yourself |
| **KISS** | Keep It Simple, Stupid |
| **Strategy Pattern** | Alternância de algoritmos |
| **ESLint + Prettier** | Qualidade e formatação |
| **Jest** | Testes automatizados (149 testes) |

