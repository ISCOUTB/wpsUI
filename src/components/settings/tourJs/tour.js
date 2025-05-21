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
            title: "Número de Agentes",
            description:
              "Define cuántos agentes campesinos participarán en la simulación. Más agentes significa interacciones más complejas.",
            side: "right",
            align: "start",
          },
        },
        {
          element: "#config-money",
          popover: {
            title: "Dinero Inicial",
            description:
              "Define el capital inicial para cada agente. Esto afecta sus capacidades iniciales de inversión.",
            side: "left",
            align: "start",
          },
        },
        {
          element: "#config-land",
          popover: {
            title: "Tierra",
            description:
              "Define la cantidad de tierra disponible para cultivar. Más tierra permite plantar más cultivos.",
            side: "right",
            align: "start",
          },
        },
        {
          element: "#config-personality",
          popover: {
            title: "Personalidad",
            description:
              "Define los rasgos de personalidad para cada agente. Esto afecta su toma de decisiones e interacciones.",
            side: "left",
            align: "start",
          },
        },
        {
          element: "#config-tools",
          popover: {
            title: "Herramientas",
            description:
              "Define la cantidad de herramientas agrícolas disponibles. Más herramientas permiten una agricultura más rápida y eficiente.",
            side: "left",
            align: "start",
          },
        },
        {
          element: "#config-seeds",
          popover: {
            title: "Semillas",
            description:
              "Define la cantidad de semillas disponibles para plantar. Más semillas permiten plantar más cultivos.",
            side: "left",
            align: "start",
          },
        },
        {
          element: "#config-water",
          popover: {
            title: "Agua",
            description:
              "Define la cantidad de agua disponible para riego. Más agua permite un mejor crecimiento de los cultivos.",
            side: "left",
            align: "start",
          },
        },
        {
          element: "#config-irrigation",
          popover: {
            title: "Irrigación",
            description:
              "Define el nivel de irrigación disponible. Una mejor irrigación permite un uso más eficiente del agua.",
            side: "left",
            align: "start",
          },
        },
        {
          element: "#config-emotions",
          popover: {
            title: "Emociones",
            description:
              "Define el estado emocional de cada agente. Esto afecta su toma de decisiones e interacciones.",
            side: "left",
            align: "start",
          },
        },
        {
          element: "#config-years",
          popover: {
            title: "Años",
            description:
              "Define el número de años que durará la simulación. Más años permiten desarrollar estrategias a largo plazo.",
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
