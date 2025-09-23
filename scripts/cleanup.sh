#!/bin/bash

# Script de limpeza para evitar conflitos
echo "🧹 Limpando containers, imagens, volumes e redes do projeto..."

# Parar todos os containers relacionados ao projeto
echo "🛑 Parando containers..."
podman stop node-br-refactored_app node-br-mongo node-br-postgres node-br-redis node-br-nginx 2>/dev/null || true
podman-compose -f podman-compose.yml down 2>/dev/null || true

# Remover containers
echo "🗑️  Removendo containers..."
podman rm node-br-refactored_app node-br-mongo node-br-postgres node-br-redis node-br-nginx 2>/dev/null || true
podman rm -f $(podman ps -aq --filter name=api-strategy_) 2>/dev/null || true

# Remover imagens do projeto
echo "🗑️  Removendo imagens do projeto..."
podman rmi localhost/node-br-refactored_app:latest 2>/dev/null || true
podman rmi -f $(podman images -q "localhost/api-strategy_*") 2>/dev/null || true

# Remover volumes órfãos
echo "🗑️  Removendo volumes órfãos..."
podman volume prune -f 2>/dev/null || true
podman volume rm -f mongo_data postgres_data redis_data 2>/dev/null || true

# Remover redes órfãs
echo "🗑️  Removendo redes órfãs..."
podman network prune -f 2>/dev/null || true
podman network rm api-strategy_app-network 2>/dev/null || true

echo "✅ Limpeza concluída!"
echo ""
echo "🚀 Agora você pode executar:"
echo "yarn podman:compose"
