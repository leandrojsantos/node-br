#!/bin/bash

# Script para parar todos os serviços
echo "🛑 Parando todos os serviços..."

# Parar aplicação
echo "🛑 Parando aplicação..."
podman stop node-br-app 2>/dev/null || true
podman rm node-br-app 2>/dev/null || true

# Parar bancos de dados
echo "🛑 Parando bancos de dados..."
podman stop node-br-mongo node-br-postgres node-br-redis 2>/dev/null || true
podman rm node-br-mongo node-br-postgres node-br-redis 2>/dev/null || true

# Remover rede
echo "🛑 Removendo rede..."
podman network rm node-br-network 2>/dev/null || true

echo "✅ Todos os serviços parados!"
