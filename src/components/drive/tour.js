import { driver } from "driver.js";
import "driver.js/dist/driver.css";

// Constants for localStorage keys
const TOUR_KEYS = {
  SETTINGS: "settings_tour_completed",
  SIMULATION: "simulation_tour_completed",
};

// Variables to control if tours have been shown in this session
let settingsTourShownThisSession = false;
let simulationTourShownThisSession = false;

// Function to check if a tour has been completed
const isTourCompleted = (tourKey) => {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(tourKey) === "true";
};

// Function to mark a tour as completed
const markTourAsCompleted = (tourKey) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(tourKey, "true");
  }
};

// Function to reset a tour state (useful for development or if the user wants to see it again)
export const resetTour = (tourType) => {
  if (typeof window !== "undefined") {
    const tourKey =
      tourType === "settings" ? TOUR_KEYS.SETTINGS : TOUR_KEYS.SIMULATION;
    localStorage.removeItem(tourKey);
    console.log(`${tourType} tour reset`);

    // Reset the corresponding session variable
    if (tourType === "settings") {
      settingsTourShownThisSession = false;
    } else if (tourType === "simulation") {
      simulationTourShownThisSession = false;
    }
  }
};

export const startSettingsTour = (forceStart = false) => {
  // If start is forced (manual button), always show
  if (forceStart) {
    console.log("Settings tour started manually");
    executeSettingsTour();
    return;
  }

  // Check if already shown in this session
  if (settingsTourShownThisSession) {
    console.log("Settings tour already shown in this session");
    return;
  }

  // Check if the tour was already completed permanently
  if (isTourCompleted(TOUR_KEYS.SETTINGS)) {
    console.log("Settings tour was previously completed");
    return;
  }

  // If we reach here, it's the first time in this session and tour hasn't been completed
  console.log("First visit to settings in this session - starting tour");
  settingsTourShownThisSession = true;
  executeSettingsTour();
};

// Helper function to execute the settings tour
const executeSettingsTour = () => {
  // Verify that we are in the Electron rendering process
  if (
    typeof window === "undefined" ||
    !document.getElementById("config-agents")
  ) {
    console.log("DOM not ready or we are not in the browser");
    return;
  }

  // Function to check if DOM elements are ready
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
    ];

    return elements.every((id) => document.getElementById(id));
  };

  // Try to start the tour when elements are ready
  const tryStartTour = () => {
    if (!checkElementsReady()) {
      console.log("Waiting for elements to be ready...");
      setTimeout(tryStartTour, 500);
      return;
    }

    console.log("Elements ready, starting tour...");

    const driverObj = driver({
      showProgress: true,
      onDestroyed: () => {
        // Mark the tour as completed when it ends
        markTourAsCompleted(TOUR_KEYS.SETTINGS);
        console.log("Configuration tour completed and saved");
      },
      steps: [
        {
          element: "#config-agents",
          popover: {
            title: "Agents",
            description: 
              "Configure the number of autonomous entities, each running their own BDI (Beliefs, Desires, Intentions) cycle with emotional components. These agents model farming families, ecosystems, market operations, and more.",
            side: "right",
            align: "start",
          },
        },
        {
          element: "#config-money",
          popover: {
            title: "Money",
            description: 
              "Set the initial financial capital for farm families. This resource increases when crops are sold and decreases with input purchases, loan repayments, and living costs coverage.",
            side: "left",
            align: "start",
          },
        },
        {
          element: "#config-land",
          popover: {
            title: "Land",
            description: 
              "Define available land as a cellular grid within the AgroEcosystem, where each cell represents a farm plot. Multiple environmental data layers affect crop growth on this land.",
            side: "right",
            align: "start",
          },
        },
        {
          element: "#config-personality",
          popover: {
            title: "Personality",
            description: 
              "Set personality traits through four affinity parameters that influence goal selection and cooperative behavior: social affinity, family affinity, leisure affinity, and friends affinity.",
            side: "left",
            align: "start",
          },
        },
        {
          element: "#config-tools",
          popover: {
            title: "Tools",
            description: 
              "Specify the number of agricultural tools available to agents. Tools are consumed during land preparation, planting, and crop maintenance tasks.",
            side: "left",
            align: "start",
          },
        },
        {
          element: "#config-seeds",
          popover: {
            title: "Seeds",
            description: 
              "Set the count of seed packets in inventory. Seeds are required for sowing operations within the AgroEcosystem.",
            side: "left",
            align: "start",
          },
        },
        {
          element: "#config-water",
          popover: {
            title: "Water",
            description: 
              "Define available water for irrigation in liters. The model includes a water-stress component requiring minimum soil-moisture threshold of 30% to prevent crop damage.",
            side: "left",
            align: "start",
          },
        },
        {
          element: "#config-irrigation",
          popover: {
            title: "Irrigation",
            description: 
              "Configure the irrigation mechanism that delivers water to plots, relieving water stress and supporting plant growth. This consumes from the available water supply.",
            side: "left",
            align: "start",
          },
        },
        {
          element: "#config-emotions",
          popover: {
            title: "Emotions",
            description: 
              "Enable emotional modeling across three axes: Happiness-Sadness, Security-Insecurity, and Hope-Uncertainty. Events like successful sales or price setbacks adjust these values, affecting goal prioritization.",
            side: "left",
            align: "start",
          },
        },
        {
          element: "#config-years",
          popover: {
            title: "Years",
            description: 
              "Set the total duration of the simulation in annual cycles, determining how long the model will iterate through farming, market, and environmental processes.",
            side: "left",
            align: "start",
          },
        },
      ],
    });

    try {
      driverObj.drive();
      console.log("Tour started successfully");
    } catch (error) {
      console.error("Error starting tour:", error);
    }
  };

  // Start the verification process
  tryStartTour();
};

// Function to check the status of the settings tour in the current session
export const shouldShowSettingsTourThisSession = () => {
  return !settingsTourShownThisSession && !isTourCompleted(TOUR_KEYS.SETTINGS);
};

// New function for simulation tour with session control
export const startSimulationTour = (forceStart = false) => {
  // If start is forced (manual button), always show
  if (forceStart) {
    console.log("Simulation tour started manually");
    executeSimulationTour();
    return;
  }

  // Check if already shown in this session
  if (simulationTourShownThisSession) {
    console.log("Simulation tour already shown in this session");
    return;
  }

  // Check if the tour was already completed permanently
  if (isTourCompleted(TOUR_KEYS.SIMULATION)) {
    console.log("Simulation tour was previously completed");
    return;
  }

  // If we reach here, it's the first time in this session and tour hasn't been completed
  console.log("First visit to simulation.tsx in this session - starting tour");
  simulationTourShownThisSession = true;
  executeSimulationTour();
};

// Helper function to execute the simulation tour
const executeSimulationTour = () => {
  // Verify that we are in the Electron rendering process
  if (typeof window === "undefined") {
    console.log("DOM not ready or we are not in the browser");
    return;
  }

  const checkElementsReady = () => {
    const elements = [
      "sidebar",
      "sidebar-home-page",
      "sidebar-analytics",
      "sidebar-settings", 
      "sidebar-contact-us",
      "sidebar-download",
      "farm-info",
      "simulation-map",
      "stop-button",
      "tab-content",
    ];
    return elements.every((id) => document.getElementById(id));
  };

  // Try to start the tour when elements are ready
  const tryStartTour = () => {
    if (!checkElementsReady()) {
      console.log("Waiting for elements to be ready...");
      setTimeout(tryStartTour, 500);
      return;
    }

    console.log("Elements ready, starting simulation tour...");

    const driverObj = driver({
      showProgress: true,
      onDestroyed: () => {
        // Mark the tour as completed when it ends
        markTourAsCompleted(TOUR_KEYS.SIMULATION);
        console.log("Simulation tour completed and saved");
      },
      steps: [
        {
          element: "#sidebar",
          popover: {
            title: "Navigation Panel",
            description: 
              "This sidebar provides access to all main sections of the application. Let's explore each option.",
            side: "right",
            align: "start",
          },
        },
        {
          element: "#sidebar-home-page",
          popover: {
            title: "Home Page",
            description: 
              "Access the main simulation view where you can monitor the agents' behavior and environmental conditions in real-time.",
            side: "right",
            align: "start",
          },
        },
        {
          element: "#sidebar-analytics",
          popover: {
            title: "Analytics Dashboard",
            description: 
              "Access comprehensive visualization tools for in-depth analysis of simulation data, including time series, correlations, and agent performance metrics.",
            side: "right",
            align: "start",
          },
        },
        {
          element: "#sidebar-settings",
          popover: {
            title: "Settings",
            description: 
              "Configure simulation parameters including agent properties, environmental conditions, and simulation duration.",
            side: "right",
            align: "start",
          },
        },
        {
          element: "#sidebar-contact-us",
          popover: {
            title: "Contact Support",
            description: 
              "Access contact information for technical support or feedback on the simulation platform.",
            side: "right",
            align: "start",
          },
        },
        {
          element: "#sidebar-download",
          popover: {
            title: "Data Export",
            description: 
              "Export complete simulation datasets in CSV format for further analysis in external tools. All metrics and agent states are available for comprehensive external processing and analysis.",
            side: "right",
            align: "start",
          },
        },
        {
          element: "#farm-info",
          popover: {
            title: "Farm Information",
            description: 
              "View detailed information about the farms, including resource levels, agent states, and production data.",
            side: "left",
            align: "center",
          },
        },
        {
          element: "#simulation-map",
          popover: {
            title: "Simulation Map",
            description:
              "Visual representation of the farm simulation showing the land, crops, and agents. The map updates in real-time to reflect changes in the environment and agent activities.",
            side: "left",
            align: "start",
          },
        },
        {
          element: "#stop-button",
          popover: {
            title: "Stop Simulation",
            description:
              "Click this button to stop the current simulation and the underlying computational processes. You can restart a new simulation with different parameters after stopping.",
            side: "top",
            align: "center",
          },
        },
        {
          element: "#tab-content",
          popover: {
            title: "Data Visualization",
            description:
              "View interactive charts and real-time data visualizations about the simulation progress and results. These visualizations help you understand agent behaviors and system dynamics.",
            side: "top",
            align: "center",
          },
        },
      ],
    });

    try {
      driverObj.drive();
      console.log("Simulation tour started successfully");
    } catch (error) {
      console.error("Error starting simulation tour:", error);
    }
  };

  // Start the verification process
  tryStartTour();
};

// Function to check if it's the first time the user visits the simulation
export const isFirstTimeUser = () => {
  return !isTourCompleted(TOUR_KEYS.SIMULATION);
};

// Function to check the status of the tour in the current session
export const shouldShowTourThisSession = () => {
  return (
    !simulationTourShownThisSession && !isTourCompleted(TOUR_KEYS.SIMULATION)
  );
};

// Navigation tour function
export const startNavigationTour = () => {
  const checkElementsReady = () => {
    const elements = [
      "sidebar-home-page",
      "sidebar-analytics",
      "sidebar-settings",
      "sidebar-contact-us",
      "sidebar-download"
    ];
    return elements.every((id) => document.getElementById(id));
  };

  const tryStartTour = () => {
    if (!checkElementsReady()) {
      console.log("Waiting for navigation elements to be ready...");
      setTimeout(tryStartTour, 500);
      return;
    }

    console.log("Navigation elements ready, starting tour...");

    const driverObj = driver({
      showProgress: true,
      steps: [
        {
          element: "#sidebar-home-page",
          popover: {
            title: "Home Page",
            description: "Access the main simulation view where you can monitor the agents' behavior and environmental conditions in real-time.",
            side: "right",
            align: "start",
          },
        },
        {
          element: "#sidebar-analytics",
          popover: {
            title: "Analytics Dashboard",
            description: "Access comprehensive visualization tools for in-depth analysis of simulation data, including time series, correlations, and agent performance metrics.",
            side: "right",
            align: "start",
          },
        },
        {
          element: "#sidebar-settings",
          popover: {
            title: "Settings",
            description: "Configure simulation parameters including agent properties, environmental conditions, and simulation duration.",
            side: "right",
            align: "start",
          },
        },
        {
          element: "#sidebar-contact-us",
          popover: {
            title: "Contact Support",
            description: "Access contact information for technical support or feedback on the simulation platform.",
            side: "right",
            align: "start",
          },
        },
        {
          element: "#sidebar-download",
          popover: {
            title: "Data Export",
            description: "Export complete simulation datasets in CSV format for further analysis in external tools. All metrics and agent states are available for comprehensive external processing and analysis.",
            side: "right",
            align: "start",
          },
        },
      ],
    });

    try {
      driverObj.drive();
      console.log("Navigation tour started successfully");
    } catch (error) {
      console.error("Error starting navigation tour:", error);
    }
  };

  tryStartTour();
};