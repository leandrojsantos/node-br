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

# Liberar portas 3000 e 5000 se estiverem em uso
for PORT in 3000 5000; do
  echo "🧹 Verificando se a porta $PORT está em uso..."
  if ss -ltn 2>/dev/null | grep -q ":$PORT\\s"; then
    echo "🔪 Encerrando processo(s) na porta $PORT..."
    fuser -k $PORT/tcp 2>/dev/null || true
    lsof -ti tcp:$PORT 2>/dev/null | xargs -r kill -9 2>/dev/null || true
  fi
done

# Parar container da app se estiver ativo e ocupando as portas
if podman ps --format '{{.Names}}' | grep -q '^api-strategy_app_1$'; then
  echo "⛔ Parando container api-strategy_app_1 para evitar conflito de portas..."
  podman stop api-strategy_app_1 >/dev/null 2>&1 || true
fi

# Verificar se podman-compose está instalado
if ! command -v podman-compose >/dev/null 2>&1; then
  echo "❌ podman-compose não encontrado. Instale com: pipx install podman-compose (ou pacote da sua distro)." >&2
  exit 1
fi

# Executar podman-compose apontando para podman-compose.yml do projeto
podman-compose -f podman-compose.yml up -d --force-recreate --renew-anon-volumes

echo "✅ podman-compose está no ar."

# Verificar e resolver drift/erros do Prisma após subir containers
echo "🔍 Verificando status do Prisma..."

# Aguardar banco ficar pronto (tenta por até ~30s)
echo "⏳ Aguardando banco ficar pronto..."
for i in {1..10}; do
  if timeout 10 yarn prisma db pull --print >/dev/null 2>&1; then
    echo "✅ Banco está pronto!"
    break
  fi
  echo "⏳ Aguardando banco ficar pronto... ($i/10)"
  sleep 3
done

# Executa migração e captura saída e código de saída
echo "🔄 Executando migração Prisma..."
set +e  # Desabilitar exit on error temporariamente
PRISMA_OUTPUT=$(yarn prisma migrate dev 2>&1)
PRISMA_STATUS=$?
set -e  # Reabilitar exit on error
echo "$PRISMA_OUTPUT"

# Se houve drift OU erro na migração, pergunta se quer refazer o banco
if echo "$PRISMA_OUTPUT" | grep -q "Drift detected" || [ $PRISMA_STATUS -ne 0 ]; then
  echo "⚠️  Drift ou erro detectado no Prisma!"
  echo "📋 Status do comando: $PRISMA_STATUS"
  echo "📋 Últimas linhas do output:"
  echo "$PRISMA_OUTPUT" | tail -10

  # Perguntar se quer refazer o banco
  echo ""
  echo "❓ Deseja refazer o banco de dados? (y/N)"
  read -r response

  if [[ "$response" =~ ^[Yy]$ ]]; then
    echo "🔄 Executando prisma migrate reset..."
    set +e
    yarn prisma migrate reset --force
    set -e
    echo "🔁 Rodando migração novamente..."
    set +e
    yarn prisma migrate dev
    set -e
    echo "✅ Banco refeito e migrações sincronizadas!"
  else
    echo "⏭️  Pulando reset. Execute manualmente: yarn prisma:migrate:reset"
  fi
else
  echo "✅ Schema do Prisma está sincronizado."
fi
