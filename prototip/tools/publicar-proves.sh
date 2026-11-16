#!/bin/bash
# Publica la versió de PROVES del joc a GitHub Pages:
#   https://perenalez.github.io/bruna-aprenta-de-bruixa/proves/
# Munta el joc, copia dist/ a la carpeta proves/ de la branca gh-pages i la puja.
# (Quan hi hagi versió estable, anirà a l'arrel o a estable/ de la mateixa branca.)
# Ús: bash prototip/tools/publicar-proves.sh   (des de l'arrel del repositori)
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
GH="$ROOT/.eines/gh"
HELPER="!\"$GH\" auth git-credential"
REMOTE="$(git -C "$ROOT" remote get-url origin)"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

echo "· Muntant el joc…"
node "$ROOT/prototip/tools/build.mjs"

echo "· Preparant la branca gh-pages…"
if git -c credential.helper= -c "credential.helper=$HELPER" ls-remote --exit-code --heads "$REMOTE" gh-pages >/dev/null 2>&1; then
  git -c credential.helper= -c "credential.helper=$HELPER" clone -q --branch gh-pages --depth 1 "$REMOTE" "$TMP/site"
else
  mkdir -p "$TMP/site" && git -C "$TMP/site" init -q && git -C "$TMP/site" checkout -q -b gh-pages
  git -C "$TMP/site" remote add origin "$REMOTE"
fi
cd "$TMP/site"
rm -rf proves && mkdir -p proves
cp "$ROOT/prototip/dist/index.html" "$ROOT/prototip/dist/vuelo.html" "$ROOT/prototip/dist/turbo.html" proves/
[ -d "$ROOT/prototip/dist/img" ] && cp -R "$ROOT/prototip/dist/img" proves/ || true
touch .nojekyll
# portada de l'adreça arrel: porta a la versió de proves
cat > index.html <<'HTML'
<!doctype html><html lang="ca"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta http-equiv="refresh" content="0; url=proves/"><title>Bruna, l'aprenenta de bruixa</title></head>
<body style="font-family:system-ui;background:#40398f;color:#fff;text-align:center;padding:40px"><a style="color:#ffd84a" href="proves/">Juga a la versió de proves</a></body></html>
HTML
git add -A
git -c user.name="$(git -C "$ROOT" config user.name)" -c user.email="$(git -C "$ROOT" config user.email)" commit -q -m "Versió de proves · $(git -C "$ROOT" log -1 --format=%h) · $(date '+%Y-%m-%d %H:%M')" || { echo "· No hi ha canvis per publicar"; exit 0; }
git -c credential.helper= -c "credential.helper=$HELPER" push -q origin gh-pages
echo "✓ Publicat: https://perenalez.github.io/bruna-aprenta-de-bruixa/proves/"
