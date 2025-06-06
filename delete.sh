#!/bin/bash
# filepath: /Users/pipee/wpsUI/delete.sh

echo "Limpiando entorno de construcción..."

# Eliminar carpetas de construcción
if [ -d "dist" ]; then
  echo "Eliminando carpeta dist..."
  rm -rf dist
fi

if [ -d ".next" ]; then
  echo "Eliminando carpeta .next..."
  rm -rf .next
fi

# Eliminar instaladores
if [ -f "./WellProdSim-*.dmg" ]; then
  echo "Eliminando instaladores DMG..."
  rm -f ./WellProdSim-*.dmg
fi

if [ -f "./WellProdSim-*.pkg" ]; then
  echo "Eliminando instaladores PKG..."
  rm -f ./WellProdSim-*.pkg
fi

echo "Limpieza completada."

# Asegurar permisos correctos para scripts
chmod +x ./modules.sh