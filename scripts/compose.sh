#!/bin/bash

# Subir serviços usando exclusivamente podman-compose (rootless-friendly)
set -euo pipefail

# Detectar rootless e exportar DOCKER_HOST do usuário, se possível
if [ -z "${DOCKER_HOST:-}" ]; then
  USER_SOCK="/run/user/$(id -u)/podman/podman.sock"
  if [ -S "$USER_SOCK" ]; then
    export DOCKER_HOST="unix://$USER_SOCK"
  fi
fi

echo "🧩 Subindo serviços com podman-compose (force recreate)..."

# Verificar se podman-compose está instalado
if ! command -v podman-compose >/dev/null 2>&1; then
  echo "❌ podman-compose não encontrado. Instale com: pipx install podman-compose (ou pacote da sua distro)." >&2
  exit 1
fi

# Executar podman-compose apontando para podman-compose.yml do projeto
podman-compose -f podman-compose.yml up -d --force-recreate --renew-anon-volumes

echo "✅ podman-compose está no ar."

