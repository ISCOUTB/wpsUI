import { driver } from "driver.js"
import "driver.js/dist/driver.css"

export const startSettingsTour = () => {
  // Verificar que estamos en el proceso de renderizado de Electron
  if (typeof window === "undefined" || !document.getElementById("config-agents")) {
    console.log("DOM no está listo o no estamos en el navegador")
    return
  }

  // Función para verificar si los elementos del DOM están listos
  const checkElementsReady = () => {
    const elements = [
      "config-agents",
      "config-money",
      "config-land",
      "config-personality",
      "config-tools",
      "config-seeds",
      "config-water",
      "config-irrigation",
      "config-emotions",
      "config-years",
    ]

    return elements.every((id) => document.getElementById(id))
  }

  // Intentar iniciar el tour cuando los elementos estén listos
  const tryStartTour = () => {
    if (!checkElementsReady()) {
      console.log("Esperando a que los elementos estén listos...")
      setTimeout(tryStartTour, 500)
      return
    }

    console.log("Elementos listos, iniciando tour...")

    const driverObj = driver({
  showProgress: true,
  steps: [
    {
      element: "#config-agents",
      popover: {
        title: "Number of Agents",
        description:
          "Define how many farmer agents will participate in the simulation. More agents mean more complex interactions.",
        side: "right",
        align: "start",
      },
    },
    {
      element: "#config-money",
      popover: {
        title: "Initial Money",
        description:
          "Define the initial capital for each agent. This affects their initial investment capabilities.",
        side: "left",
        align: "start",
      },
    },
    {
      element: "#config-land",
      popover: {
        title: "Land",
        description:
          "Define the amount of land available for cultivation. More land allows for planting more crops.",
        side: "right",
        align: "start",
      },
    },
    {
      element: "#config-personality",
      popover: {
        title: "Personality",
        description:
          "Define personality traits for each agent. This affects their decision-making and interactions.",
        side: "left",
        align: "start",
      },
    },
    {
      element: "#config-tools",
      popover: {
        title: "Tools",
        description:
          "Define the amount of agricultural tools available. More tools allow for faster and more efficient farming.",
        side: "left",
        align: "start",
      },
    },
    {
      element: "#config-seeds",
      popover: {
        title: "Seeds",
        description:
          "Define the amount of seeds available for planting. More seeds allow for planting more crops.",
        side: "left",
        align: "start",
      },
    },
    {
      element: "#config-water",
      popover: {
        title: "Water",
        description:
          "Define the amount of water available for irrigation. More water allows for better crop growth.",
        side: "left",
        align: "start",
      },
    },
    {
      element: "#config-irrigation",
      popover: {
        title: "Irrigation",
        description:
          "Define the level of irrigation available. Better irrigation allows for more efficient water usage.",
        side: "left",
        align: "start",
      },
    },
    {
      element: "#config-emotions",
      popover: {
        title: "Emotions",
        description:
          "Define the emotional state of each agent. This affects their decision-making and interactions.",
        side: "left",
        align: "start",
      },
    },
    {
      element: "#config-years",
      popover: {
        title: "Years",
        description:
          "Define the number of years the simulation will run. More years allow for developing long-term strategies.",
        side: "left",
        align: "start",
      },
    },
  ],
})

    try {
      driverObj.drive()
      console.log("Tour iniciado correctamente")
    } catch (error) {
      console.error("Error al iniciar el tour:", error)
    }
  }

  // Iniciar el proceso de verificación
  tryStartTour()
}
