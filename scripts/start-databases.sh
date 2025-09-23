#!/bin/bash

# Script para iniciar apenas os bancos de dados com Podman
echo "🗄️  Iniciando bancos de dados..."

# Criar rede se não existir
podman network create node-br-network 2>/dev/null || echo "Rede já existe"

# Iniciar MongoDB
echo "📦 Iniciando MongoDB..."
podman run -d --replace \
  --name node-br-mongo \
  --network node-br-network \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=admin123 \
  -e MONGO_INITDB_DATABASE=nodebr \
  -v node-br-mongo-data:/data/db \
  docker.io/library/mongo:7.0

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
  docker.io/library/postgres:15-alpine

# Iniciar Redis
echo "🔴 Iniciando Redis..."
podman run -d --replace \
  --name node-br-redis \
  --network node-br-network \
  -p 6379:6379 \
  -v node-br-redis-data:/data \
  docker.io/library/redis:7-alpine redis-server --appendonly yes

echo "✅ Bancos de dados iniciados!"
echo ""
echo "📊 Serviços disponíveis:"
echo "- MongoDB: localhost:27017"
echo "- PostgreSQL: localhost:5432"
echo "- Redis: localhost:6379"
echo ""
echo "🔧 Para parar os serviços:"
echo "podman stop node-br-mongo node-br-postgres node-br-redis"
echo "podman rm node-br-mongo node-br-postgres node-br-redis"
