#!/bin/bash

# Script de configuração inicial do projeto
echo "🚀 Configurando Node BR API Refatorada..."

# Verificar se o Yarn está instalado
if ! command -v yarn &> /dev/null; then
    echo "❌ Yarn não encontrado. Instalando..."
    npm install -g yarn
fi

# Verificar versão do Node.js
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo "❌ Node.js versão 20+ é necessária. Versão atual: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detectado"

# Instalar dependências
echo "📦 Instalando dependências..."
yarn install

# Copiar arquivo de ambiente
if [ ! -f .env ]; then
    echo "📝 Criando arquivo .env..."
    cp env.example .env
    echo "⚠️  Configure as variáveis no arquivo .env antes de continuar"
fi

# Verificar se Podman está instalado
if command -v podman &> /dev/null; then
    echo "🐳 Podman detectado"

    # Verificar se Podman Compose está disponível
    if command -v podman-compose &> /dev/null; then
        echo "🐳 Podman Compose detectado"
        echo "💡 Para iniciar com Podman: yarn podman:compose"
    else
        echo "⚠️  Podman Compose não encontrado. Instalando..."
        # Instalar podman-compose se não estiver disponível
        if command -v pip3 &> /dev/null; then
            pip3 install podman-compose
            echo "✅ Podman Compose instalado via pip3"
        else
            echo "❌ pip3 não encontrado. Instale podman-compose manualmente"
        fi
    fi
else
    echo "⚠️  Podman não encontrado. Instale para usar containers"
fi

# Executar testes
echo "🧪 Executando testes..."
yarn test:ci

if [ $? -eq 0 ]; then
    echo "✅ Todos os testes passaram!"
else
    echo "❌ Alguns testes falharam. Verifique os logs acima."
fi

# Executar lint
echo "🔍 Verificando qualidade do código..."
yarn lint

if [ $? -eq 0 ]; then
    echo "✅ Código passou na verificação de qualidade!"
else
    echo "⚠️  Alguns problemas de qualidade encontrados. Execute 'yarn lint:fix' para corrigir."
fi

echo ""
echo "🎉 Configuração concluída!"
echo ""
echo "📚 Próximos passos:"
echo "1. Configure as variáveis no arquivo .env"
echo "2. Para desenvolvimento: yarn dev"
echo "3. Para produção com Podman: yarn podman:compose"
echo "4. Acesse a documentação: http://localhost:3000/docs"
echo ""
echo "📖 Leia o README.md para mais informações"
