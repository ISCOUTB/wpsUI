import { driver } from "driver.js";
import "driver.js/dist/driver.css";

const startDownloadTour = () => {
  // Verificar si los elementos existen
  const checkElementsReady = () => {
    const elements = [
      "download-title", 
      "view-preview-button", 
      "download-csv-button"
    ];
    
    // No incluir data-preview que podría no estar presente inicialmente
    
    const missingElements = elements.filter(id => !document.getElementById(id));
    if (missingElements.length > 0) {
      console.log("Elementos faltantes:", missingElements);
      return false;
    }
    
    return true;
  };
  
  const tryStartTour = () => {
    if (!checkElementsReady()) {
      console.log("Esperando a que los elementos estén listos...");
      setTimeout(tryStartTour, 500);
      return;
    }
    
    console.log("Elementos listos, iniciando tour...");
    
    const driverObj = driver({
      showProgress: true,
      steps: [
        {
          element: "#download-title",
          popover: {
            title: "Export Simulation Data",
            description: "This section allows you to export simulation results.",
            side: "top",
          },
        },
        {
          element: "#view-preview-button",
          popover: {
            title: "View Preview",
            description: "Click here to load a preview of the simulation data.",
            side: "top",
          },
        },
        {
          element: "#download-csv-button",
          popover: {
            title: "Download CSV",
            description: "Click here to download all simulation data in CSV format.",
            side: "top",
          },
        },
        // Hacer opcional este paso (solo mostrar si existe)
        {
          element: "#data-preview",
          popover: {
            title: "Data Preview",
            description: "This section shows a preview of the first 5 rows of the data.",
            side: "top",
          },
          onDeselected: (element) => {
            if (!element) {
              console.log("Elemento data-preview no encontrado, saltando paso");
              return true; // Saltar al siguiente paso si no existe
            }
            return false;
          }
        },
        {
          element: "#back-to-simulator-button",
          popover: {
            title: "Back to Simulator",
            description: "Click here to return to the simulator page.",
            side: "top",
          },
        },
      ],
    });

    try {
      driverObj.drive();
      console.log("Tour iniciado correctamente");
    } catch (error) {
      console.error("Error al iniciar el tour:", error);
    }
  };
  
  // Iniciar el proceso de verificación
  tryStartTour();
};

export default startDownloadTour;