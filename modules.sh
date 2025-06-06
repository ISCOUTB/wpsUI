#!/bin/bash
# filepath: /Users/pipee/wpsUI/modules.sh

echo "Configurando aplicación para macOS..."

# Crear estructura de directorios necesaria
mkdir -p "./dist/mac/WellProdSim.app/Contents/Resources/logs"
mkdir -p "./dist/mac/WellProdSim.app/Contents/Resources/src/wps"
mkdir -p "./dist/mac/WellProdSim.app/Contents/Resources/node_modules/electron-serve"

# Copiar el JAR y otros recursos necesarios
if [ -f "./src/wps/wpsSimulator-1.0.jar" ]; then
  echo "Copiando JAR al paquete..."
  cp "./src/wps/wpsSimulator-1.0.jar" "./dist/mac/WellProdSim.app/Contents/Resources/src/wps/"
else
  echo "ADVERTENCIA: No se encontró el archivo JAR"
fi

# Copiar módulos necesarios
echo "Copiando electron-serve..."
cp -R "./node_modules/electron-serve" "./dist/mac/WellProdSim.app/Contents/Resources/node_modules/"

# Crear archivo CSV vacío si no existe
touch "./dist/mac/WellProdSim.app/Contents/Resources/logs/wpsSimulator.csv"

echo "Configuración completada."