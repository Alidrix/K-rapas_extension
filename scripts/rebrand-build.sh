#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC="$ROOT/branding/source/logo"
BUILD="$ROOT/build/all"
IMG="$BUILD/webAccessibleResources/img"
LOGO_DIR="$IMG/logo"
ICONS_DIR="$IMG/icons"

mkdir -p "$LOGO_DIR" "$ICONS_DIR"

echo "[1/9] Vérification des fichiers source..."
for f in \
  "$SRC/logo.png" \
  "$SRC/logo@2x.png" \
  "$SRC/logo.svg" \
  "$SRC/logo_white.png" \
  "$SRC/logo_white.svg" \
  "$SRC/icon-48.png"
do
  if [ ! -f "$f" ]; then
    echo "[ERREUR] Fichier manquant : $f"
    exit 1
  fi
done

echo "[2/9] Injection du manifest Firefox..."
cp -f "$ROOT/src/firefox/manifest.json" "$BUILD/manifest.json"

echo "[3/9] Remplacement complet des logos..."
cp -f "$SRC/logo.png"        "$LOGO_DIR/logo.png"
cp -f "$SRC/logo@2x.png"     "$LOGO_DIR/logo@2x.png"
cp -f "$SRC/logo.svg"        "$LOGO_DIR/logo.svg"
cp -f "$SRC/logo_white.png"  "$LOGO_DIR/logo_white.png"
cp -f "$SRC/logo_white.svg"  "$LOGO_DIR/logo_white.svg"
cp -f "$SRC/icon-48.png"     "$LOGO_DIR/icon-48.png"

echo "[4/9] Génération des icônes Firefox..."
convert "$SRC/icon-48.png" -resize 16x16   "$ICONS_DIR/icon-16.png"
convert "$SRC/icon-48.png" -resize 32x32   "$ICONS_DIR/icon-32.png"
convert "$SRC/icon-48.png" -resize 48x48   "$ICONS_DIR/icon-48.png"
convert "$SRC/icon-48.png" -resize 128x128 "$ICONS_DIR/icon-128.png"

echo "[5/9] Variantes PNG..."
cp -f "$ICONS_DIR/icon-32.png" "$ICONS_DIR/icon-32-signout.png"
cp -f "$ICONS_DIR/icon-32.png" "$ICONS_DIR/icon-32-badge-1.png"
cp -f "$ICONS_DIR/icon-32.png" "$ICONS_DIR/icon-32-badge-2.png"
cp -f "$ICONS_DIR/icon-32.png" "$ICONS_DIR/icon-32-badge-3.png"
cp -f "$ICONS_DIR/icon-32.png" "$ICONS_DIR/icon-32-badge-4.png"
cp -f "$ICONS_DIR/icon-32.png" "$ICONS_DIR/icon-32-badge-5.png"
cp -f "$ICONS_DIR/icon-32.png" "$ICONS_DIR/icon-32-badge-5+.png"

echo "[6/9] Variantes SVG..."
cat > "$LOGO_DIR/icon-without-badge.svg" <<'SVG'
<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
  <image href="icon-48.png" width="48" height="48"/>
</svg>
SVG

cp -f "$LOGO_DIR/icon-without-badge.svg" "$LOGO_DIR/icon-inactive.svg"
cp -f "$LOGO_DIR/icon-without-badge.svg" "$LOGO_DIR/icon-badge-1.svg"
cp -f "$LOGO_DIR/icon-without-badge.svg" "$LOGO_DIR/icon-badge-2.svg"
cp -f "$LOGO_DIR/icon-without-badge.svg" "$LOGO_DIR/icon-badge-3.svg"
cp -f "$LOGO_DIR/icon-without-badge.svg" "$LOGO_DIR/icon-badge-4.svg"
cp -f "$LOGO_DIR/icon-without-badge.svg" "$LOGO_DIR/icon-badge-5.svg"
cp -f "$LOGO_DIR/icon-without-badge.svg" "$LOGO_DIR/icon-badge-5+.svg"

echo "[7/9] Vérification du manifest final..."
grep -nE '"manifest_version"|"background"|"service_worker"|"page"|"scripts"' "$BUILD/manifest.json" || true

echo "[8/9] Vérification des logos finaux..."
ls -la "$LOGO_DIR"
ls -la "$ICONS_DIR"

echo "[9/9] OK"
