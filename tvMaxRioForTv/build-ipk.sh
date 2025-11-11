#!/bin/bash
# === build-ipk.sh ===
# Gera manualmente o arquivo .ipk de um app webOS

APP_ID="tvmaxrionew"
VERSION="1.0.0"
TMPDIR=$(mktemp -d /tmp/${APP_ID}-build-XXXX)
OUTDIR=$(pwd)

echo "📦 Empacotando app $APP_ID versão $VERSION..."
echo "📁 Diretório temporário: $TMPDIR"

# Estrutura padrão
mkdir -p $TMPDIR/data/usr/palm/applications/$APP_ID
mkdir -p $TMPDIR/ctrl

# Copia o app para dentro da estrutura
cp -r * $TMPDIR/data/usr/palm/applications/$APP_ID

# Cria o arquivo de controle
cat > $TMPDIR/ctrl/control <<EOF
Package: $APP_ID
Version: $VERSION
Section: misc
Priority: optional
Architecture: all
Maintainer: Dev
Description: $APP_ID webOS app
EOF

# Compacta e monta o IPK
cd $TMPDIR
tar -czf control.tar.gz -C ctrl .
tar -czf data.tar.gz -C data .
echo 2.0 > debian-binary
ar r ${APP_ID}_${VERSION}_all.ipk debian-binary control.tar.gz data.tar.gz

# Move o IPK para o diretório do projeto
mv ${APP_ID}_${VERSION}_all.ipk $OUTDIR/

echo "✅ IPK gerado com sucesso!"
echo "📦 Arquivo: $OUTDIR/${APP_ID}_${VERSION}_all.ipk"

