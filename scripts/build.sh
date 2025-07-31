#!/bin/bash

# Script para build do projeto xAPI
# Uso: ./scripts/build.sh

echo "🔨 Buildando projeto xAPI..."

# Nome do arquivo ZIP
PACKAGE_NAME="xapi-comunicacao-efetiva.zip"

# Remover arquivo ZIP existente se houver
if [ -f "dist/$PACKAGE_NAME" ]; then
    rm "dist/$PACKAGE_NAME"
    echo "🗑️  Arquivo ZIP anterior removido"
fi

# Criar diretório dist se não existir
mkdir -p dist

# Criar novo arquivo ZIP com todos os arquivos necessários
zip -r "dist/$PACKAGE_NAME" \
    index.html \
    src/styles/main.css \
    src/js/app.js \
    src/js/xapi.js \
    src/xapi/manifest.json \
    docs/xapi-player-simulation.html \
    README.md

# Verificar se o ZIP foi criado com sucesso
if [ -f "dist/$PACKAGE_NAME" ]; then
    echo "✅ Build concluído com sucesso: dist/$PACKAGE_NAME"
    echo "📦 Tamanho do arquivo: $(du -h "dist/$PACKAGE_NAME" | cut -f1)"
    echo ""
    echo "📋 Arquivos incluídos:"
    unzip -l "dist/$PACKAGE_NAME" | grep -E "\.(html|css|js|md)$"
    echo ""
    echo "🎯 Próximos passos:"
    echo "1. Faça upload do arquivo 'dist/$PACKAGE_NAME' na sua plataforma LMS"
    echo "2. Configure o endpoint xAPI no seu LRS"
    echo "3. Teste a simulação: open docs/xapi-player-simulation.html"
    echo ""
    echo "🔧 Para testar localmente:"
    echo "   open index.html"
    echo "   open docs/xapi-player-simulation.html"
else
    echo "❌ Erro ao criar o build"
    exit 1
fi 