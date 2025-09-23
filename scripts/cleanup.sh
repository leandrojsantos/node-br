#!/bin/bash

# Script de limpeza para evitar conflitos
echo "🧹 Limpando containers e imagens antigas..."

# Parar todos os containers relacionados ao projeto
echo "🛑 Parando containers..."
podman stop node-br-refactored_app node-br-mongo node-br-postgres node-br-redis node-br-nginx 2>/dev/null || true

# Remover containers
echo "🗑️  Removendo containers..."
podman rm node-br-refactored_app node-br-mongo node-br-postgres node-br-redis node-br-nginx 2>/dev/null || true

# Remover imagens do projeto
echo "🗑️  Removendo imagens do projeto..."
podman rmi localhost/node-br-refactored_app:latest 2>/dev/null || true

# Remover volumes órfãos
echo "🗑️  Removendo volumes órfãos..."
podman volume prune -f 2>/dev/null || true

# Remover redes órfãs
echo "🗑️  Removendo redes órfãs..."
podman network prune -f 2>/dev/null || true

echo "✅ Limpeza concluída!"
echo ""
echo "🚀 Agora você pode executar:"
echo "yarn podman:compose"
