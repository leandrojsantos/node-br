# 🚀 API Strategy Pattern

> **API Node.js moderna** com Strategy Pattern, múltiplos bancos de dados, autenticação JWT e documentação Swagger completa.

[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9+-blue.svg)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.16+-purple.svg)](https://www.prisma.io/)
[![Jest](https://img.shields.io/badge/Jest-30+-red.svg)](https://jestjs.io/)
[![Podman](https://img.shields.io/badge/Podman-4.0+-orange.svg)](https://podman.io/)

## 📋 Índice

<a href="#visão-geral">🎯 Visão Geral</a> •
<a href="#funcionalidades">✨ Funcionalidades</a> •
<a href="#arquitetura">🏗️ Arquitetura</a> •
<a href="#início-rápido">🚀 Início Rápido</a> •
<a href="#documentação">📚 Documentação</a> •
<a href="#contribuição">🤝 Contribuição</a>

## 🎯 Visão Geral

Esta API demonstra a implementação do **Strategy Pattern** em Node.js, permitindo alternar entre diferentes bancos de dados (MongoDB, PostgreSQL) de forma transparente. Ideal para projetos que precisam de flexibilidade e escalabilidade.

### 🎨 Características Principais

- **Strategy Pattern** para múltiplos bancos de dados
- **Autenticação JWT** com refresh tokens
- **Documentação Swagger** automática
- **Testes completos** (unitários, integração, E2E)
- **Containers Podman** para desenvolvimento
- **TypeScript** com tipagem gradual
- **Rate Limiting** e segurança avançada

## ✨ Funcionalidades

### 🔐 Autenticação & Autorização
- [Login com JWT](#-autenticação)
- [Refresh tokens](#-refresh-tokens)
- [Middleware de autorização](#-middleware)
- [Rate limiting](#-rate-limiting)

### 🗄️ Bancos de Dados
- [MongoDB com Mongoose](#-mongodb)
- [PostgreSQL com Prisma](#-postgresql)
- [Strategy Pattern](#-strategy-pattern)
- [Migrações automáticas](#-migrações)

### 📖 Documentação
- [Técnica Completa](#-técnica-completa)
👉 **[README-API.md](./README-API.md)** - Documentação técnica detalhada
- [Swagger UI](#-swagger-ui)
- [Endpoints RESTful](#-endpoints)
- [Validação com Joi](#-validação)
- [Health checks](#-health-checks)

## 🏗️ Arquitetura

```
src/
├── 📁 config/          # Configurações e contexto
├── 📁 controllers/     # Controladores da API
├── 📁 middleware/      # Middlewares customizados
├── 📁 models/          # Modelos e estratégias
│   ├── schemas/        # Schemas Mongoose
│   └── strategies/     # Implementações Strategy Pattern
├── 📁 routes/          # Definição de rotas
├── 📁 services/        # Lógica de negócio
└── 📁 utils/           # Utilitários
```


### 📋 Pré-requisitos

- **Node.js** 20+
- **Yarn** 1.22+
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

# Inicie containers
yarn podman:compose

# Execute migrações caso necessário
yarn prisma:migrate

# Inicie desenvolvimento
yarn dev
```

### 🌐 Acessos URL

- **API (Desenvolvimento)**: http://localhost:5000
- **API (Containers)**: http://localhost:3000
- **Swagger (Desenvolvimento)**: http://localhost:5000/docs
- **Swagger (Containers)**: http://localhost:3000/docs
- **Health Check (Desenvolvimento)**: http://localhost:5000/health
- **Health Check (Containers)**: http://localhost:3000/health


## 🤝 Contribuição

1. **Fork** o projeto
2. **Crie** uma branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. **Push** para a branch (`git push origin feature/AmazingFeature`)
5. **Abra** um Pull Request

### 📋 Padrões de Código

- **ESLint** para qualidade
- **Prettier** para formatação
- **Jest** para testes
- **TypeScript** para tipagem

---
