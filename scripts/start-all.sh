#!/bin/bash

# Script para iniciar todos os serviços com Podman
echo "🚀 Iniciando Node BR API com Podman..."

# Criar rede se não existir
echo "🌐 Criando rede..."
podman network create node-br-network 2>/dev/null || echo "Rede já existe"

# Iniciar MongoDB
echo "📦 Iniciando MongoDB..."
podman run -d --replace \
  --name node-br-mongo \
  --network node-br-network \
  -p 27017:27017 \
  -v node-br-mongo-data:/data/db \
  mongo:7.0 --noauth

# Aguardar MongoDB inicializar
echo "⏳ Aguardando MongoDB inicializar..."
sleep 10

# Iniciar PostgreSQL
echo "🐘 Iniciando PostgreSQL..."
podman run -d --replace \
  --name node-br-postgres \
  --network node-br-network \
  -p 5432:5432 \
  -e POSTGRES_DB=nodebr \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres123 \
  -v node-br-postgres-data:/var/lib/postgresql/data \
  postgres:15-alpine

# Aguardar PostgreSQL inicializar
echo "⏳ Aguardando PostgreSQL inicializar..."
sleep 10

# Iniciar Redis
echo "🔴 Iniciando Redis..."
podman run -d --replace \
  --name node-br-redis \
  --network node-br-network \
  -p 6379:6379 \
  -v node-br-redis-data:/data \
  redis:7-alpine redis-server --appendonly yes

# Aguardar Redis inicializar
echo "⏳ Aguardando Redis inicializar..."
sleep 5

# Build da aplicação
echo "🔨 Construindo aplicação..."
podman build -t node-br-refactored .

# Iniciar aplicação
echo "🚀 Iniciando aplicação..."
podman run -d --replace \
  --name node-br-app \
  --network node-br-network \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e PORT=3000 \
  -e HOST=0.0.0.0 \
  -e MONGODB_URI=mongodb://node-br-mongo:27017/nodebr \
  -e POSTGRES_HOST=node-br-postgres \
  -e POSTGRES_PORT=5432 \
  -e POSTGRES_DB=nodebr \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres123 \
  -e JWT_SECRET=minha-chave-secreta-super-segura-2025 \
  node-br-refactored

echo "✅ Todos os serviços iniciados!"
echo ""
echo "📊 Serviços disponíveis:"
echo "- API: http://localhost:3000"
echo "- Documentação: http://localhost:3000/docs"
echo "- MongoDB: localhost:27017"
echo "- PostgreSQL: localhost:5432"
echo "- Redis: localhost:6379"
echo ""
echo "🔧 Para parar todos os serviços:"
echo "./scripts/stop-all.sh"
