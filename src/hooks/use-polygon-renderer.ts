export function usePolygonRenderer() {
    const getPolygonColor = (fincaData: any, specificLandNames: string[], specificSeason: string[]) => {
      let fillColor
      if (specificLandNames.includes(fincaData.name)) {
        switch (specificSeason[specificLandNames.indexOf(fincaData.name)]) {
          case "PREPARATION":
            fillColor = "#FFD700" // Dorado
            break
          case "PLANTING":
            fillColor = "#FFA500" // Naranja
            break
          case "GROWTH":
            fillColor = "#FF4500" // Rojo
            break
          case "HARVEST":
            fillColor = "#00FF00" // Verde brillante
            break
          default:
            fillColor = "#F5DEB3" // Default
        }
      } else {
        switch (fincaData.kind) {
          case "road":
            fillColor = "#708090" // Coral
            break
          case "water":
            fillColor = "#00B4D8" // Azul brillante
            break
          case "forest":
            fillColor = "#4CAF50" // Verde vibrante
            break
          case "land":
            fillColor = "#F5DEB3" // Color por defecto para "land"
            break
          default:
            fillColor = "#F5DEB3" // Dorado (para casos no especificados)
        }
      }
      return fillColor
    }
  
    return { getPolygonColor }
  }
  