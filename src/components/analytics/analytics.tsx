"use client"

import type React from "react"

import { useState, useEffect, useMemo, useRef } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChartIcon, ChevronRight, Download, Users, LayoutDashboard, Settings, Info, Activity } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { fetchCSVData } from "@/lib/csvUtils"; 

import {
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Line,
  AreaChart,
  Area,
  ReferenceLine,
  ScatterChart,
  Scatter,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Bar,
} from "recharts"

import type { ParameterType } from "@/lib/parameter-config"

import { TimeSeriesAnalysis } from "@/components/analytics/time-series-analysis";
import { AgentDetailView } from "@/components/analytics/agent-detail-view"
const floatVariables = [
  { key: "HappinessSadness", color: "#DA4453" },
  { key: "HopefulUncertainty", color: "#967ADC" },
  { key: "SecureInsecure", color: "#D770AD" },
  { key: "money", color: "#656D78" },
  { key: "peasantFamilyAffinity", color: "#AAB2BD" },
  { key: "peasantLeisureAffinity", color: "#E9573F" },
  { key: "peasantFriendsAffinity", color: "#8CC152" },
  { key: "waterAvailable", color: "#5D9CEC" },
  { key: "totalHarvestedWeight", color: "#CCD1D9" },
  { key: "health", color: "#45B7D1" },
  { key: "robberyAccount", color: "#5D9CEC" },
  { key: "currentDay", color: "#AC92EC" },
  { key: "toPay", color: "#EC87C0" },
  { key: "peasantFamilyMinimalVital", color: "#5D9CEC" },
  { key: "loanAmountToPay", color: "#48CFAD" },
  { key: "tools", color: "#A0D468" },
  { key: "seeds", color: "#ED5565" },
  { key: "pesticidesAvailable", color: "#FC6E51" },
  { key: "HarvestedWeight", color: "#FFCE54" },
  { key: "daysToWorkForOther", color: "#4FC1E9" }
];

const activityData = [
  { name: "Working", value: 183 },
  { name: "Idle", value: 42 },
  { name: "Terminated", value: 22 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"] // Colores para la gráfica de pastel

// Definición mejorada de los elementos de navegación con mejores iconos y descripciones
const navigationItems = [
  {
    id: "home",
    label: "Dashboard",
    description: "Vista general de la simulación",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    id: "statistics",
    label: "Statistics",
    description: "Análisis estadístico avanzado",
    icon: <Activity className="w-5 h-5" />,
  },
  {
    id: "agents",
    label: "Agents",
    description: "Estado actual de los agentes",
    icon: <Users className="w-5 h-5" />,
  },

]

export default function Analytics() {
 
interface AgentState {
  peasantLeisureAffinity?: number;
  peasantFriendsAffinity?: number;
  peasantFamilyAffinity?: number;
  peasantKind?: string;
  contractor?: string;
  pesticidesAvailable?: number;
  initialHealth?: number;
  purpose?: string;
  initialMoney?: number;
  tools?: number;
  health?: number;
  money?: number;
  "Happiness/Sadness"?: number;
  "Secure/Insecure"?: number;
  "Hopeful/Uncertainty"?: number;
  waterAvailable?: number;
  totalHarvestedWeight?: number;
  assignedLands?: any[];
  currentActivity?: string;
  internalCurrentDate?: string;
  // Otras propiedades según sea necesario
}
// Agregar a los estados existentes
const [agentTaskLogs, setAgentTaskLogs] = useState<Record<string, any>>({});
const [loadedAgents, setLoadedAgents] = useState<string[]>([]);
const socketRef = useRef<WebSocket | null>(null);

// Modificar la conexión WebSocket (añadir al useEffect existente)
useEffect(() => {
  const connectWebSocket = () => {
    const url = "ws://localhost:8000/wpsViewer";
    const socket = new WebSocket(url);
    socketRef.current = socket;

    socket.onerror = (event) => {
      console.error("Error en la conexión WebSocket:", url);
      setTimeout(connectWebSocket, 2000);
    };

    socket.onopen = () => {
      console.log("WebSocket conectado");
      socket.send("setup");
    };

    socket.onmessage = (event) => {
  const prefix = event.data.substring(0, 2);
  const data = event.data.substring(2);
  
  switch (prefix) {
    case "j=":
      try {
        console.log("Recibiendo datos j=");
        const jsonData = JSON.parse(data);
        const { name, taskLog, state } = jsonData;
        
        // CORRECCIÓN: Guardar tanto taskLog como state en una estructura anidada
        if (name) {
          console.log(`Recibiendo datos para ${name} con ${Object.keys(taskLog || {}).length} fechas`);
          setAgentTaskLogs(prev => ({
            ...prev,
            [name]: { taskLog, state }  // Esta es la estructura correcta
          }));
          
          // Añadir el agente a la lista si no existe
          setLoadedAgents(prev => {
            if (!prev.includes(name)) {
              return [...prev, name];
            }
            return prev;
          });
        }
      } catch (error) {
        console.error("Error al procesar datos del agente:", error);
      }
      break;
  }
};
    socket.onclose = () => {
      console.log("WebSocket desconectado");
      setTimeout(connectWebSocket, 2000);
    };

    return socket;
  };

  const socket = connectWebSocket();
  
  return () => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.close();
    }
  };
}, []);

// Función de ayuda para formatear nombres de tareas
const formatTaskName = (taskName: string): string => {
  // Eliminar 'Task' del final y separar palabras
  return taskName
    .replace(/Task.*$/, '')  // Elimina 'Task' y cualquier texto después
    .replace(/([A-Z])/g, ' $1') // Inserta espacio antes de cada mayúscula
    .trim(); // Elimina espacios extra
};

const getAgentData = (agentId: string) => {
  const agentIndex = parseInt(agentId) - 1;
  if (agentIndex < 0 || agentIndex >= loadedAgents.length) {
    return {
      name: "Unknown",
      status: "Unknown",
      currentActivity: "Unknown",
      metrics: { efficiency: 0, productivity: 0, happiness: 0, energy: 0, money: 0 },
      lands: [],
      activityLog: [],
      activities: [],
      analysis: [],
      performanceHistory: [],
      interactionInsights: []
    };
  }

  const agentName = loadedAgents[agentIndex];
  console.log("Obteniendo datos para:", agentName);
  
  // Obtener los datos completos del agente (taskLog y state)
  const agentInfo = agentTaskLogs[agentName] || {};
  console.log("AgentInfo para", agentName, ":", JSON.stringify(agentInfo).substring(0, 100) + "...");
  
  const taskLog = agentInfo.taskLog || {};
  console.log("TaskLog a procesar:", JSON.stringify(taskLog).substring(0, 100) + "...");
  console.log("TaskLog keys:", Object.keys(taskLog));
  
  // Procesar el taskLog para ordenarlo cronológicamente
  const activityLog = processTaskLog(taskLog);
  
  // Analizar el state del agente como AgentState
  let agentStateData: AgentState = {};
  try {
    if (agentInfo.state) {
      if (typeof agentInfo.state === 'string') {
        agentStateData = JSON.parse(agentInfo.state);
      } else {
        agentStateData = agentInfo.state;
      }
    }
  } catch (error) {
    console.error("Error parseando state:", error);
  }
  
  // Extraer valores importantes del estado
  const health = agentStateData.health || 70;
  const money = agentStateData.money || 0;
  const happiness = ((agentStateData["Happiness/Sadness"] || 0) + 1) / 2 * 100;
  const waterAvailable = agentStateData.waterAvailable || 0;
  const lands = agentStateData.assignedLands || [];
  
  // Contar tipos de actividades para el gráfico de pie
  const activityCounts: Record<string, number> = {};
  activityLog.forEach(log => {
    const activity = log.activity;
    activityCounts[activity] = (activityCounts[activity] || 0) + 1;
  });
  
  // Convertir a formato para el gráfico de pie
  const activities = Object.entries(activityCounts)
    .map(([key, value]) => ({ name: key, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5); // Top 5 actividades
  
  // Crear historial de rendimiento simulado
  const performanceHistory = Array.from({ length: 5 }, (_, i) => ({
    day: `Día ${i + 1}`,
    efficiency: Math.max(0, Math.min(100, health - (5 - i) * 2)),
    productivity: Math.max(0, Math.min(100, (agentStateData.totalHarvestedWeight || 0) / 100 * 100 + i * 5)),
  }));
  
  // Crear análisis basado en los datos
  const analysis = [
    `Salud actual: ${health}%`,
    `Dinero disponible: $${money.toLocaleString()}`,
    happiness > 70 ? "Estado emocional positivo" : 
      happiness > 40 ? "Estado emocional neutral" : "Estado emocional negativo",
    waterAvailable > 1000 ? "Recursos hídricos abundantes" : "Recursos hídricos limitados"
  ];
  
  // Crear insights de interacción social
  const interactionInsights = [
    `Afinidad familiar: ${((agentStateData.peasantFamilyAffinity || 0) * 100).toFixed(1)}%`,
    `Afinidad con amigos: ${((agentStateData.peasantFriendsAffinity || 0) * 100).toFixed(1)}%`,
    `Afinidad con ocio: ${((agentStateData.peasantLeisureAffinity || 0) * 100).toFixed(1)}%`,
  ];
  
  return {
    name: agentName,
    status: health < 30 ? "Critical" : health < 60 ? "Struggling" : "Active",
    currentActivity: formatCurrentActivity(agentStateData.currentActivity || "Unknown"),
    metrics: {
      efficiency: health,
      productivity: (agentStateData.totalHarvestedWeight || 0) / 100 * 100,
      happiness: happiness,
      energy: waterAvailable > 1000 ? 100 : 50,
      money: money
    },
    lands: lands,
    activityLog,  // Esto contiene el registro de actividades procesado
    activities,
    analysis,
    performanceHistory,
    interactionInsights
  };
};
// Función auxiliar para formatear la actividad actual
const formatCurrentActivity = (activity: string) => {
  return activity
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, l => l.toUpperCase());
};

const processTaskLog = (taskLog: Record<string, string[]>): any[] => {
  // Si no hay taskLog, devolver array vacío
  if (!taskLog || Object.keys(taskLog).length === 0) {
    console.log("TaskLog vacío");
    return [];
  }
  
  console.log("Procesando taskLog con", Object.keys(taskLog).length, "fechas");
  
  // Función auxiliar para convertir fecha DD/MM/YYYY a objeto Date
  const parseDate = (dateStr: string): Date => {
    const [day, month, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day);
  };
  
  // Ordenar las fechas cronológicamente (de más reciente a más antigua)
  const sortedDates = Object.keys(taskLog).sort((a, b) => {
    const dateA = parseDate(a);
    const dateB = parseDate(b);
    return dateB.getTime() - dateA.getTime();
  });
  
  console.log("Fechas ordenadas:", sortedDates.slice(0, 5), "...");
  
  // Crear el array de actividades ordenado por fecha
  const activities = [];
  
  // Tomar hasta 10 fechas recientes para no sobrecargar la vista
  const recentDates = sortedDates.slice(0, 10);
  
  for (const date of recentDates) {
    const tasks = taskLog[date] || [];
    
    for (const task of tasks) {
      activities.push({
        time: date,
        activity: formatTaskName(task),
        type: getTaskType(task)
      });
    }
  }
  
  // CORRECCIÓN: Añadir el return y limitar a un número manejable
  return activities.slice(0, 20);
};

// Determinar el tipo de tarea para asignarle un color
const getTaskType = (task: string): string => {
  if (task.includes('Vital')) return 'rest';
  if (task.includes('Land') || task.includes('Crop') || task.includes('Plant')) return 'work';
  if (task.includes('Family') || task.includes('Religious')) return 'social';
  if (task.includes('Alternative') || task.includes('Price')) return 'work';
  return 'other';
};



const [agentsData, setAgentsData] = useState<any[]>([]); // Add this line to define agentsData state
const agentsLoadedRef = useRef<boolean>(false);

// Reemplazar el useEffect de WebSocket con este nuevo useEffect para cargar desde CSV
useEffect(() => {
  // Solo cargar agentes si no se han cargado previamente
  if (!agentsLoadedRef.current) {
    const loadAgents = async () => {
      try {
        console.log("Cargando agentes desde CSV...");
        const response = await window.electronAPI.readCsv();
        if (!response.success || !response.data) {
          throw new Error(response.error || "Error al leer el archivo CSV");
        }

        const rows = response.data.split("\n").filter((line) => line.trim() !== "");
        const headers = rows[0].split(",");
        const agentIndex = headers.indexOf("Agent");

        if (agentIndex === -1) {
          throw new Error("No se encontró la columna 'Agent'");
        }

        const agentsSet = new Set(
          rows.slice(1).map((row) => row.split(",")[agentIndex].trim())
        );
        
        const uniqueAgents = Array.from(agentsSet);
        setLoadedAgents(uniqueAgents);
        
        // También crear datos para agentsData con el mismo formato que antes
        const formattedAgents = uniqueAgents.map((name, index) => ({
          id: name,
          name: `Familia ${index + 1}`,
          status: "Active"
        }));
        setAgentsData(formattedAgents);
        
        // Marcar que los agentes ya se han cargado
        agentsLoadedRef.current = true;
        console.log("Agentes cargados con éxito:", uniqueAgents.length);
      } catch (error) {
        console.error("Error cargando agentes:", error);
      }
    };

    loadAgents();
  }
}, []); // Array de dependencias vacío, se ejecuta solo al montar
  
const [simulationData, setSimulationData] = useState<any[]>([]);
const [isTimeRangeSet, setIsTimeRangeSet] = useState(false); // Controla si el rango fue configurado manualmente
const [timeRange, setTimeRange] = useState<[number, number]>([0, 100]); // Rango de tiempo inicial

useEffect(() => {
  const loadData = async () => {
    try {
      const csvData = await fetchCSVData(); // Carga los datos del CSV
      const mappedData = csvData.map((row: Record<string, any>) => ({
      name: row.internalCurrentDate || "Unknown Date",
      ...Object.keys(row).reduce((acc, key) => {
        // Intenta convertir todos los valores a números si es posible
        const value = parseFloat(String(row[key]));
        acc[key] = isNaN(value) ? row[key] : value;
        return acc;
      }, {} as Record<string, any>)
      }));
      setSimulationData(mappedData);

      // Solo ajusta el rango de tiempo si no ha sido configurado manualmente
      if (!isTimeRangeSet && mappedData.length > 0) {
        setTimeRange([0, mappedData.length - 1]); // Ajusta el rango al índice de las fechas disponibles
      }
    } catch (error) {
      console.error("Error al cargar los datos del CSV:", error);
    }
  };

  loadData(); 

  const interval = setInterval(loadData, 2000); 

  return () => clearInterval(interval); 
}, [isTimeRangeSet]);


const handleTimeRangeChange = (newRange: [number, number]) => {
  setTimeRange(newRange);
  setIsTimeRangeSet(true); 
};


const [selectedType, setSelectedType] = useState<ParameterType>("integer");
const [selectedParameter, setSelectedParameter] = useState("currentActivity");
const [activeSection, setActiveSection] = useState("home");
const [isMobile, setIsMobile] = useState(false);
const [sidebarOpen, setSidebarOpen] = useState(true);
const router = useRouter();

// Variables para análisis estadístico
const [primaryVariable, setPrimaryVariable] = useState("efficiency");
const [secondaryVariable, setSecondaryVariable] = useState("productivity");
const [analysisType, setAnalysisType] = useState("correlation");
const [showOutliers, setShowOutliers] = useState(true);
const [confidenceInterval, setConfidenceInterval] = useState(95);
const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
const [showRegressionLine, setShowRegressionLine] = useState(true);
const [distributionBins, setDistributionBins] = useState(10);
const [selectedAgentData, setSelectedAgentData] = useState<any>(null);
 // Añade este useEffect después de tus otros useEffects en el componente Analytics
useEffect(() => {
  // Solo iniciar el intervalo cuando haya un agente seleccionado
  if (selectedAgent) {
    console.log("Configurando actualización periódica para el agente:", selectedAgent);
    
    // Función para actualizar los datos del agente
    const updateAgentData = () => {
      const updatedData = getAgentData(selectedAgent);
      setSelectedAgentData(updatedData);
    };

    // Configurar el intervalo para actualizar cada 2 segundos
    const intervalId = setInterval(updateAgentData, 2000);

    // Limpiar el intervalo cuando cambie el agente seleccionado o se desmonte el componente
    return () => {
      console.log("Limpiando intervalo de actualización del agente");
      clearInterval(intervalId);
    };
  }
}, [selectedAgent]); // Dependencia: el efecto se ejecuta cuando cambia el agente seleccionado

  // Detección de dispositivo móvil y manejo del sidebar
  useEffect(() => {
    const checkMobile = () => {
      const isMobileView = window.innerWidth < 768
      setIsMobile(isMobileView)
      setSidebarOpen(!isMobileView) // Cierra por defecto en móvil, abre en escritorio
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])


  // Agrega esta función a tu componente
const calculateTrend = (data: number[]): string => {
  if (data.length < 2) return "Datos insuficientes";
  
  const firstHalf = data.slice(0, Math.floor(data.length / 2));
  const secondHalf = data.slice(Math.floor(data.length / 2));
  
  const firstHalfMean = calculateMean(firstHalf);
  const secondHalfMean = calculateMean(secondHalf);
  
  const percentChange = ((secondHalfMean - firstHalfMean) / firstHalfMean) * 100;
  
  if (percentChange > 5) return `↑ +${percentChange.toFixed(1)}% (mejorando)`;
  if (percentChange < -5) return `↓ ${percentChange.toFixed(1)}% (deteriorando)`;
  return "Estable";
}

const calculateWellbeingIndex = (data: any[]): number => {
  if (data.length === 0) return 0;
  
  const recentData = data.slice(-10);
  
  // Normaliza los valores antes de combinarlos
  const happiness = Math.min(1, Math.max(0, calculateMean(recentData.map(item => item.HappinessSadness || 0))));
  const security = Math.min(1, Math.max(0, calculateMean(recentData.map(item => item.SecureInsecure || 0))));
  const resources = Math.min(1, Math.max(0, calculateMean(recentData.map(item => item.waterAvailable || 0))));
  const health = Math.min(1, Math.max(0, calculateMean(recentData.map(item => item.health || 0)) / 100));
  const social = Math.min(1, Math.max(0, calculateMean(recentData.map(item => 
    (item.peasantFamilyAffinity || 0) * 0.6 + (item.peasantFriendsAffinity || 0) * 0.4
  ))));
  
  // Índice ponderado con 5 factores principales
  return (happiness * 0.25 + security * 0.2 + resources * 0.2 + health * 0.2 + social * 0.15) * 100;
}

  // Datos de ejemplo para gráficos de parámetros
  const getParameterData = () => {
    const dataPoints = 30
    switch (selectedParameter) {
      case "currentActivity":
        return [
          { name: "Working", value: 183 },
          { name: "Eating", value: 37 },
          { name: "Sleeping", value: 20 },
          { name: "Socializing", value: 42 },
          { name: "Learning", value: 15 },
        ]
      case "happiness":
        return Array.from({ length: dataPoints }, (_, i) => ({
          name: `Agent ${i + 1}`,
          value: Math.floor(Math.random() * 100), // Valor aleatorio 0-99
        }))
      case "age": // Ejemplo para un parámetro de tipo 'integer'
        return Array.from({ length: dataPoints }, (_, i) => ({
          name: `Agent ${i + 1}`,
          value: 20 + Math.floor(Math.random() * 40), // Edad entre 20 y 60
        }))
      // Agrega más casos según tus parámetros definidos en parameters.ts
      default:
        // Datos por defecto si el parámetro no coincide
        return Array.from({ length: dataPoints }, (_, i) => ({
          name: `Data ${i + 1}`,
          value: Math.floor(Math.random() * 100),
        }))
    }
  }


  // Alterna la visibilidad del sidebar (usado en móvil)
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  // Calcula el promedio de eficiencia para la ReferenceLine
  const averageEfficiency = simulationData.reduce((sum, entry) => sum + entry.efficiency, 0) / simulationData.length

  // Funciones estadísticas mejoradas
const calculateMean = (data: number[]): number => {
  if (!data.length) return 0;
  const validData = data.filter(n => !isNaN(n));
  if (!validData.length) return 0;
  return validData.reduce((sum, value) => sum + value, 0) / validData.length;
}

const calculateMedian = (data: number[]): number => {
  if (!data.length) return 0;
  const validData = data.filter(n => !isNaN(n));
  if (!validData.length) return 0;
  
  const sorted = [...validData].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[middle - 1] + sorted[middle]) / 2 : sorted[middle];
}

const calculateStandardDeviation = (data: number[]): number => {
  if (!data.length) return 0;
  const validData = data.filter(n => !isNaN(n));
  if (!validData.length) return 0;
  
  const mean = calculateMean(validData);
  const squareDiffs = validData.map((value) => Math.pow(value - mean, 2));
  const variance = calculateMean(squareDiffs);
  return Math.sqrt(variance);
}



const calculateCorrelation = (xData: number[], yData: number[]): number => {
  const validX = xData.filter(n => !isNaN(n));
  const validY = yData.filter(n => !isNaN(n));
  
  // Necesitamos el mismo número de puntos en ambos arrays
  if (validX.length !== validY.length || validX.length === 0) return 0;

  const xMean = calculateMean(validX);
  const yMean = calculateMean(validY);

  let numerator = 0;
  let xDenominator = 0;
  let yDenominator = 0;

  for (let i = 0; i < validX.length; i++) {
    const xDiff = validX[i] - xMean;
    const yDiff = validY[i] - yMean;
    numerator += xDiff * yDiff;
    xDenominator += xDiff * xDiff;
    yDenominator += yDiff * yDiff;
  }

  if (xDenominator === 0 || yDenominator === 0) return 0;
  return numerator / Math.sqrt(xDenominator * yDenominator);
}
  // Filter data based on time range
  const filteredData = useMemo(() => {
    return simulationData.slice(timeRange[0], timeRange[1] + 1)
  }, [timeRange])

// Detectar outliers usando el método IQR
const detectOutliers = (data: number[]): { indices: number[]; lowerBound: number; upperBound: number } => {
  if (data.length < 4) return { indices: [], lowerBound: 0, upperBound: 0 };
  
  const sortedData = [...data].sort((a, b) => a - b);
  
  // Encuentra Q1 y Q3 (cuartiles)
  const q1Index = Math.floor(sortedData.length * 0.25);
  const q3Index = Math.floor(sortedData.length * 0.75);
  
  const q1 = sortedData[q1Index];
  const q3 = sortedData[q3Index];
  
  // Calcula IQR
  const iqr = q3 - q1;
  
  // Define límites para outliers (típicamente 1.5*IQR)
  const lowerBound = q1 - 1.5 * iqr;
  const upperBound = q3 + 1.5 * iqr;
  
  // Encuentra los índices de los outliers
  const indices = data.map((val, idx) => 
    (val < lowerBound || val > upperBound) ? idx : -1
  ).filter(idx => idx !== -1);
  
  return { indices, lowerBound, upperBound };
};

// Calcular parámetros de regresión lineal
const calculateRegressionLine = (xData: number[], yData: number[]): { slope: number; intercept: number } => {
  // Filtramos NaN y aseguramos misma longitud
  const validIndices = xData.map((_, i) => i).filter(i => 
    !isNaN(xData[i]) && !isNaN(yData[i]) && 
    xData[i] !== null && yData[i] !== null
  );
  
  const validX = validIndices.map(i => xData[i]);
  const validY = validIndices.map(i => yData[i]);
  
  if (validX.length < 2) return { slope: 0, intercept: 0 };
  
  const xMean = calculateMean(validX);
  const yMean = calculateMean(validY);
  
  let numerator = 0;
  let denominator = 0;
  
  for (let i = 0; i < validX.length; i++) {
    const xDiff = validX[i] - xMean;
    numerator += xDiff * (validY[i] - yMean);
    denominator += xDiff * xDiff;
  }
  
  // Evitar división por cero
  const slope = denominator !== 0 ? numerator / denominator : 0;
  const intercept = yMean - slope * xMean;
  
  return { slope, intercept };
};

// Dentro del componente Analytics, agrega estos useMemos:

// Extrae los datos primarios y secundarios con manejo de NaN
const primaryData = useMemo(() => {
  return filteredData
    .map((item) => item[primaryVariable as keyof typeof item] as number)
    .filter(value => !isNaN(value) && value !== null && value !== undefined);
}, [filteredData, primaryVariable]);

const secondaryData = useMemo(() => {
  return filteredData
    .map((item) => item[secondaryVariable as keyof typeof item] as number)
    .filter(value => !isNaN(value) && value !== null && value !== undefined);
}, [filteredData, secondaryVariable]);

// Detectar outliers en ambas variables
const primaryOutliers = useMemo(() => {
  return detectOutliers(primaryData);
}, [primaryData]);

const secondaryOutliers = useMemo(() => {
  return detectOutliers(secondaryData);
}, [secondaryData]);

// Filtrar outliers si es necesario
const filteredOutlierData = useMemo(() => {
  if (showOutliers) return filteredData;
  
  // Combinar índices de outliers de ambas variables
  const outlierIndices = new Set([
    ...primaryOutliers.indices,
    ...secondaryOutliers.indices
  ]);
  
  // Filtrar los datos para excluir outliers
  return filteredData.filter((_, index) => !outlierIndices.has(index));
}, [filteredData, showOutliers, primaryOutliers.indices, secondaryOutliers.indices]);

// Calcular datos para la línea de regresión
const regressionParams = useMemo(() => {
  return calculateRegressionLine(
    filteredOutlierData.map(item => item[primaryVariable]),
    filteredOutlierData.map(item => item[secondaryVariable])
  );
}, [filteredOutlierData, primaryVariable, secondaryVariable]);


const regressionLineData = useMemo(() => {
  const { slope, intercept } = regressionParams;
  
  // Si no hay datos válidos, retorna un array vacío
  if (filteredOutlierData.length < 2) return [];
  
  // Obtener valores min/max de X para dibujar la línea
  const xValues = filteredOutlierData.map(d => d[primaryVariable]);
  const validXValues = xValues.filter(x => !isNaN(x));
  
  if (validXValues.length < 2) return [];
  
  const minX = Math.min(...validXValues);
  const maxX = Math.max(...validXValues);
  
  // Crear puntos para la línea de regresión con formato correcto
  return [
    { [primaryVariable]: minX, [secondaryVariable]: intercept + slope * minX },
    { [primaryVariable]: maxX, [secondaryVariable]: intercept + slope * maxX }
  ];
}, [filteredOutlierData, primaryVariable, secondaryVariable, regressionParams]);

  // Calculate statistics
// Modificar el cálculo de estadísticas
const statistics = useMemo(() => {
  // Usar los datos filtrados según la opción de outliers
  const dataToAnalyze = showOutliers ? filteredData : filteredOutlierData;
  
  if (dataToAnalyze.length === 0) {
    return {
      primary: { mean: 0, median: 0, stdDev: 0, min: 0, max: 0 },
      secondary: { mean: 0, median: 0, stdDev: 0, min: 0, max: 0 },
      correlation: 0,
      regression: { slope: 0, intercept: 0, r2: 0 },
      outliers: { 
        primaryCount: primaryOutliers.indices.length,
        secondaryCount: secondaryOutliers.indices.length
      }
    };
  }

  const validPrimaryData = dataToAnalyze.map(item => item[primaryVariable]).filter(n => !isNaN(n));
  const validSecondaryData = dataToAnalyze.map(item => item[secondaryVariable]).filter(n => !isNaN(n));

  const correlation = calculateCorrelation(validPrimaryData, validSecondaryData);
  const { slope, intercept } = regressionParams;
  
  // Calcular R² (coeficiente de determinación)
  const r2 = correlation * correlation;

  return {
    primary: {
      mean: calculateMean(validPrimaryData),
      median: calculateMedian(validPrimaryData),
      stdDev: calculateStandardDeviation(validPrimaryData),
      min: validPrimaryData.length ? Math.min(...validPrimaryData) : 0,
      max: validPrimaryData.length ? Math.max(...validPrimaryData) : 0,
    },
    secondary: {
      mean: calculateMean(validSecondaryData),
      median: calculateMedian(validSecondaryData),
      stdDev: calculateStandardDeviation(validSecondaryData),
      min: validSecondaryData.length ? Math.min(...validSecondaryData) : 0,
      max: validSecondaryData.length ? Math.max(...validSecondaryData) : 0,
    },
    correlation,
    regression: { slope, intercept, r2 },
    outliers: {
      primaryCount: primaryOutliers.indices.length,
      secondaryCount: secondaryOutliers.indices.length
    }
  };
}, [filteredData, filteredOutlierData, showOutliers, primaryVariable, secondaryVariable, regressionParams, primaryOutliers.indices, secondaryOutliers.indices]);

  // Generate automated insights based on statistics
  const generateInsights = useMemo(() => {
    const insights = []

    // Correlation insights
    if (Math.abs(statistics.correlation) > 0.7) {
      insights.push(
        `There is a strong ${statistics.correlation > 0 ? "positive" : "negative"} correlation (${statistics.correlation.toFixed(2)}) between ${primaryVariable} and ${secondaryVariable}.`,
      )
    } else if (Math.abs(statistics.correlation) > 0.3) {
      insights.push(
        `There is a moderate ${statistics.correlation > 0 ? "positive" : "negative"} correlation (${statistics.correlation.toFixed(2)}) between ${primaryVariable} and ${secondaryVariable}.`,
      )
    } else {
      insights.push(
        `There is a weak correlation (${statistics.correlation.toFixed(2)}) between ${primaryVariable} and ${secondaryVariable}.`,
      )
    }

    // Trend insights for primary variable
    const firstHalf = primaryData.slice(0, Math.floor(primaryData.length / 2))
    const secondHalf = primaryData.slice(Math.floor(primaryData.length / 2))
    const firstHalfMean = calculateMean(firstHalf)
    const secondHalfMean = calculateMean(secondHalf)

    if (secondHalfMean > firstHalfMean * 1.1) {
      insights.push(
        `${primaryVariable} shows an increasing trend over time (${(((secondHalfMean - firstHalfMean) / firstHalfMean) * 100).toFixed(1)}% increase).`,
      )
    } else if (firstHalfMean > secondHalfMean * 1.1) {
      insights.push(
        `${primaryVariable} shows a decreasing trend over time (${(((firstHalfMean - secondHalfMean) / firstHalfMean) * 100).toFixed(1)}% decrease).`,
      )
    } else {
      insights.push(`${primaryVariable} remains relatively stable over time.`)
    }

    // Variability insights
    const primaryCoeffVar = statistics.primary.stdDev / statistics.primary.mean
    if (primaryCoeffVar > 0.3) {
      insights.push(`${primaryVariable} shows high variability (CV = ${primaryCoeffVar.toFixed(2)}).`)
    } else if (primaryCoeffVar > 0.1) {
      insights.push(`${primaryVariable} shows moderate variability (CV = ${primaryCoeffVar.toFixed(2)}).`)
    } else {
      insights.push(`${primaryVariable} shows low variability (CV = ${primaryCoeffVar.toFixed(2)}).`)
    }

    return insights
  }, [statistics, primaryVariable, secondaryVariable, primaryData])

  // Available variables for analysis
  const availableVariables = useMemo(() => {
  return floatVariables.map((variable) => ({
    value: variable.key,
    label: variable.key, // Puedes usar un nombre más descriptivo si es necesario
  }));
}, []);


  return (
    // Asegúrate de que el contenedor principal use clases para el tema oscuro si es necesario
    <div className="flex h-screen bg-background overflow-hidden dark:bg-gray-900 dark:text-white">
      {/* Sidebar mejorado con animaciones y mejor estructura */}
      <div
        className={`analytics-sidebar transition-all duration-300 ease-in-out ${
          sidebarOpen ? "w-64" : "w-0 md:w-16"
        } bg-card border-r border-border h-full flex flex-col flex-shrink-0 ${
          !sidebarOpen && isMobile ? "hidden" : ""
        } dark:bg-gray-800 dark:border-gray-700`}
      >
        {/* Encabezado del Sidebar */}
        <div className="p-4 flex items-center justify-between border-b border-border dark:border-gray-700">
          {/* Título del sidebar, ahora blanco en dark mode */}
          <h2
            className={`font-semibold text-lg transition-opacity duration-300 text-foreground dark:text-white ${sidebarOpen ? "opacity-100" : "opacity-0 md:opacity-100"}`}
          >
            Analytics
          </h2>
          {/* Botón para alternar sidebar en móvil */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden dark:text-gray-300 dark:hover:bg-gray-700"
            onClick={toggleSidebar}
          >
            <ChevronRight className={`h-5 w-5 transition-transform ${sidebarOpen ? "" : "rotate-180"}`} />
          </Button>
        </div>

        {/* Elementos de Navegación */}
        <div className="flex-1 py-4 overflow-y-auto">
          <nav className="space-y-1 px-2">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id)
                  if (isMobile) setSidebarOpen(false)
                }}
                className={`w-full flex items-center px-3 py-3 rounded-md transition-all duration-200 hover:bg-muted/80 group ${
                  activeSection === item.id
                    ? "bg-primary/10 text-primary shadow-sm dark:bg-blue-500/20 dark:text-blue-300" // Estilo activo en dark mode
                    : "text-muted-foreground dark:text-gray-400" // Estilo inactivo en dark mode
                }`}
              >
                <span className="flex-shrink-0 group-hover:text-foreground dark:group-hover:text-white">
                  {item.icon}
                </span>
                <div
                  className={`ml-3 flex flex-col transition-opacity duration-300 ${sidebarOpen ? "opacity-100" : "opacity-0 md:opacity-100"}`}
                >
                  <span className="text-sm font-medium text-left text-foreground dark:text-white">{item.label}</span>
                  <span className="text-xs opacity-70 truncate text-left text-muted-foreground dark:text-gray-400">
                    {item.description}
                  </span>
                </div>
              </button>
            ))}
          </nav>
        </div>

        {/* Botón de "Ir al Simulador" */}
        <div
          className={`mt-auto p-4 border-t border-border transition-opacity duration-300 ${sidebarOpen ? "opacity-100" : "opacity-0"} dark:border-gray-700`}
        >
          <Button
            variant="outline"
            size="sm"
            className="w-full flex items-center justify-center gap-2 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:hover:text-white"
            onClick={() => router.push("/pages/simulador")}
          >
            <Settings className="w-4 h-4" />
            <span>Simulador</span>
          </Button>
        </div>
      </div>

      {/* Contenido principal mejorado */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header con información contextual */}
        <header className="bg-background border-b border-border p-4 flex justify-between items-center flex-shrink-0 dark:bg-gray-900 dark:border-gray-700">
          <div>
            <h1 className="text-xl font-semibold text-foreground dark:text-white">
              {navigationItems.find((item) => item.id === activeSection)?.label}
            </h1>
            <p className="text-sm text-muted-foreground dark:text-gray-400">
              {navigationItems.find((item) => item.id === activeSection)?.description}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="dark:text-gray-300 dark:hover:bg-gray-700">
              <Info className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/pages/simulador")}
              className="dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              Go to Simulator
            </Button>
          </div>
        </header>

        {/* Área de Contenido Principal (con scroll) */}
        <main className="flex-1 overflow-y-scroll scrollbar-hide p-6 dark:bg-gray-950">
          <div className="container mx-auto max-w-6xl">
            {/* Dashboard / Home */}
            {activeSection === "home" && (
              <div className="animate-fadeIn space-y-6">
                {/* Estadísticas rápidas arriba */}
                <div className="grid md:grid-cols-3 gap-4">
                  {/* Card for Quick Stats */}
                  <Card className="col-span-3 md:col-span-1 dark:bg-gray-800 dark:border-gray-700">
                    <CardHeader className="pb-2">
                      <CardTitle className="dark:text-white">Quick Stats</CardTitle>
                      <CardDescription className="dark:text-gray-400">Key performance metrics</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Tarjeta 1: Bienestar Emocional */}
    <div className="bg-muted/40 p-5 rounded-lg dark:bg-gray-700/40 min-h-[140px] flex flex-col justify-between">
      <div>
        <p className="text-sm text-muted-foreground dark:text-gray-400 mb-2">Bienestar Emocional</p>
        <h3 className="text-2xl font-bold dark:text-white truncate">
          {(() => {
            // Convertir de -1...1 a porcentaje 0...100
            const rawValues = simulationData.map(item => item.HappinessSadness || 0);
            const value = calculateMean(rawValues);
            const normalized = ((value + 1) / 2) * 100;
            return isNaN(normalized) || !isFinite(normalized) ? "N/A" : `${normalized.toFixed(1)}%`;
          })()}
        </h3>
      </div>
      <p className="text-xs text-muted-foreground dark:text-gray-500 mt-2">
        {calculateTrend(simulationData.map(item => item.HappinessSadness))}
      </p>
    </div>

    {/* Tarjeta 2: Salud Económica */}
    <div className="bg-muted/40 p-5 rounded-lg dark:bg-gray-700/40 min-h-[140px] flex flex-col justify-between">
      <div>
        <p className="text-sm text-muted-foreground dark:text-gray-400 mb-2">Salud Económica</p>
        <h3 className="text-2xl font-bold dark:text-white truncate">
          {(() => {
            // Extraer valores explícitamente
            const moneyValues = simulationData.map(item => Number(item.money) || 0);
            const obligationValues = simulationData.map(item => 
              (Number(item.toPay) || 0) + (Number(item.loanAmountToPay) || 0)
            );
            
            const money = calculateMean(moneyValues);
            const obligations = calculateMean(obligationValues);
            
            // Ajustar la fórmula para evitar siempre 100%
            const ratio = obligations > 0 ? Math.min(100, (money / obligations) * 100) : 
                                          (money > 0 ? 100 : 50); // 50% si no hay dinero ni obligaciones
            
            return isNaN(ratio) || !isFinite(ratio) ? "N/A" : `${ratio.toFixed(1)}%`;
          })()}
        </h3>
      </div>
      <p className="text-xs text-muted-foreground dark:text-gray-500 mt-2">
        Relación entre ingresos y obligaciones financieras
      </p>
    </div>

    {/* Tarjeta 3: Productividad Agrícola */}
    <div className="bg-muted/40 p-5 rounded-lg dark:bg-gray-700/40 min-h-[140px] flex flex-col justify-between">
      <div>
        <p className="text-sm text-muted-foreground dark:text-gray-400 mb-2">Productividad Agrícola</p>
        <h3 className="text-2xl font-bold dark:text-white truncate">
          {(() => {
            // Extraer correctamente y verificar que hay datos
            const harvestValues = simulationData.map(item => Number(item.totalHarvestedWeight) || 0);
            const harvest = calculateMean(harvestValues);
            
            // Ajustar la normalización a un valor más apropiado (100 en lugar de 1000)
            const normalized = Math.min(100, (harvest / 100) * 100);
            
            return isNaN(normalized) || !isFinite(normalized) ? "N/A" : `${normalized.toFixed(1)}%`;
          })()}
        </h3>
      </div>
      <p className="text-xs text-muted-foreground dark:text-gray-500 mt-2">
        {calculateTrend(simulationData.map(item => item.totalHarvestedWeight || 0))}
      </p>
    </div>

    {/* Tarjeta 4: Sostenibilidad de Recursos */}
    <div className="bg-muted/40 p-5 rounded-lg dark:bg-gray-700/40 min-h-[140px] flex flex-col justify-between">
      <div>
        <p className="text-sm text-muted-foreground dark:text-gray-400 mb-2">Sostenibilidad</p>
        <h3 className="text-2xl font-bold dark:text-white truncate">
          {(() => {
            // Obtener el valor promedio de disponibilidad de agua
            const waterValues = simulationData.map(item => Number(item.waterAvailable) || 0);
            let value = calculateMean(waterValues);
            
            // Primero normalizar el valor a un porcentaje si es demasiado grande
            if (value > 10) {
              value = Math.min(value / 100000, 100);
              return `${value.toFixed(1)}%`;
            }
            
            // Si es un valor normal, mostrarlo como porcentaje
            return `${(value * 100).toFixed(1)}%`;
          })()}
        </h3>
      </div>
      <p className="text-xs text-muted-foreground dark:text-gray-500 mt-2">
        Disponibilidad de agua y recursos críticos
      </p>
    </div>
  </div>
</CardContent>
                  </Card>

                  {/* Card for Simulation Overview Chart */}
                  <Card className="md:col-span-2 dark:bg-gray-800 dark:border-gray-700">
                    <CardHeader className="pb-2">
                      <CardTitle className="dark:text-white">Simulation Efficiency Over Time</CardTitle>{" "}
                      {/* Título más específico */}
                      <CardDescription className="dark:text-gray-400">
                        Efficiency metrics over simulation days
                      </CardDescription>{" "}
                      {/* Descripción más específica */}
                    </CardHeader>
                    <CardContent className="pt-0">
                      {/* Gráfico de Área con estilo de la imagen */}
                      <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          {/* Usamos AreaChart para el área rellena */}
                          <AreaChart
                            data={simulationData}
                            margin={{
                              top: 10,
                              right: 30,
                              left: 0,
                              bottom: 0,
                            }}
                          >
                            {/* Personaliza el fondo de la cuadrícula para un tema oscuro */}
                            {/* Desactivamos las líneas verticales y hacemos las horizontales sutiles */}
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                            {/* Eje X estilizado para tema oscuro */}
                            <XAxis dataKey="name" stroke="#888" />
                            {/* Eje Y estilizado para tema oscuro, ajustando el dominio si es necesario */}
                            {/* El dominio [30, 90] se basa en la imagen de ejemplo */}
                            <YAxis stroke="#888" domain={[30, 90]} />
                            {/* Tooltip con estilo por defecto de recharts se adapta al tema */}
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "#333",
                                border: "none",
                                color: "#fff",
                              }} // Estilo básico para el tooltip en dark mode
                              labelStyle={{ color: "#ddd" }} // Estilo para la etiqueta del tooltip
                              itemStyle={{ color: "#fff" }} // Estilo para los ítems del tooltip
                            />
                            {/* Legend para identificar la línea */}
                            <Legend wrapperStyle={{ color: "#ccc" }} /> {/* Estilo para el texto de la leyenda */}
                            {/* Define un gradiente para el área si quieres ese efecto */}
                            {/* Los colores deben coincidir con el stroke de la línea */}
                            <defs>
                              <linearGradient id="colorEfficiencyArea" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            {/* Línea y área para la eficiencia */}
                            <Area
                              type="monotone" // Tipo de curva suave
                              dataKey="totalHarvestedWeight" // Datos a mostrar
                              stroke="#8884d8" // Color de la línea (ej. azul/púrpura)
                              fillOpacity={1} // Opacidad del relleno
                              fill="url(#colorEfficiencyArea)" // Usa el gradiente para el relleno
                              strokeWidth={2} // Grosor de la línea
                              dot={false} // No mostrar puntos individuales en la línea
                              // activeDot={{ r: 5, stroke: '#8884d8', fill: '#8884d8' }} // Opcional: punto al pasar el ratón
                            />
                            {/* Agrega una línea de referencia para el promedio */}
                            <ReferenceLine
                              y={averageEfficiency} // Usa el promedio calculado
                              stroke="red" // Color de la línea promedio
                              strokeDasharray="3 3" // Estilo de línea punteada
                              // label con estilo para dark mode
                              label={{
                                value: `Average: ${averageEfficiency.toFixed(1)}%`,
                                position: "right",
                                fill: "red",
                                fontSize: 12,
                              }}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="dark:bg-gray-800 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="dark:text-white">Simulation Details</CardTitle>
                    <CardDescription className="dark:text-gray-400">
                      Comprehensive information about the current simulation
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="dark:text-gray-300">
                        This dashboard provides an overview of the simulation data. Here, you can see aggregated
                        metrics, summary charts, and key performance indicators that provide insights into the overall
                        behavior and progress of the simulation.
                      </p>
                      <p className="dark:text-gray-300">
                        Use the navigation panel on the left to explore different aspects of the simulation data. You
                        can:
                      </p>
                      <ul className="list-disc pl-5 space-y-1 dark:text-gray-300">
                        <li>View detailed parameter analysis</li>
                        <li>Check individual agent status and activities</li>
                        <li>Analyze relationships and distributions between simulation variables</li>
                      </ul>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t border-border pt-4 flex justify-end dark:border-gray-700">
                    <Button
                      onClick={() => setActiveSection("statistics")}
                      className="dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:hover:text-white"
                    >
                      View Statistics
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            )}

            {/* Statistics Section */}
            {activeSection === "statistics" && (
              <div className="animate-fadeIn space-y-6">
                <Card className="dark:bg-gray-800 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="dark:text-white">Statistical Analysis</CardTitle>
                    <CardDescription className="dark:text-gray-400">
                      Analyze relationships and distributions between simulation variables
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="comparison" className="w-full">
                      <TabsList className="grid w-full grid-cols-3 mb-6 dark:bg-gray-700 dark:text-gray-300">
                        <TabsTrigger
                          value="comparison"
                          className="dark:data-[state=active]:bg-gray-900 dark:data-[state=active]:text-white"
                        >
                          Variable Comparison
                        </TabsTrigger>
                        <TabsTrigger
                          value="distribution"
                          className="dark:data-[state=active]:bg-gray-900 dark:data-[state=active]:text-white"
                        >
                          Distribution Analysis
                        </TabsTrigger>
                        <TabsTrigger
                          value="time-series"
                          className="dark:data-[state=active]:bg-gray-900 dark:data-[state=active]:text-white"
                        >
                          Time Series Analysis

                        </TabsTrigger>
                      </TabsList>

                      {/* Variable Comparison Tab */}
                      <TabsContent value="comparison" className="space-y-4">
                        <div className="bg-muted/30 p-4 rounded-lg dark:bg-gray-700/30">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <Label
                                htmlFor="primary-variable"
                                className="text-sm font-medium mb-2 block dark:text-white"
                              >
                                Primary Variable
                              </Label>
                              <Select value={primaryVariable} onValueChange={setPrimaryVariable}>
                                <SelectTrigger
                                  id="primary-variable"
                                  className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                                >
                                  <SelectValue placeholder="Select variable" />
                                </SelectTrigger>
                                <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                                  {availableVariables.map((variable) => (
                                    <SelectItem
                                      key={variable.value}
                                      value={variable.value}
                                      className="dark:text-white dark:focus:bg-gray-700"
                                    >
                                      {variable.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label
                                htmlFor="secondary-variable"
                                className="text-sm font-medium mb-2 block dark:text-white"
                              >
                                Secondary Variable
                              </Label>
                              <Select value={secondaryVariable} onValueChange={setSecondaryVariable}>
                                <SelectTrigger
                                  id="secondary-variable"
                                  className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                                >
                                  <SelectValue placeholder="Select variable" />
                                </SelectTrigger>
                                <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                                  {availableVariables.map((variable) => (
                                    <SelectItem
                                      key={variable.value}
                                      value={variable.value}
                                      className="dark:text-white dark:focus:bg-gray-700"
                                    >
                                      {variable.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="mt-4">
                            <Label htmlFor="time-range" className="text-sm font-medium mb-2 block dark:text-white">
                              Time Range: {simulationData[timeRange[0]]?.name || "N/A"} - {simulationData[timeRange[1]]?.name || "N/A"}
                            </Label>
                              <Slider
                              id="time-range"
                              min={0}
                              max={simulationData.length - 1}
                              step={1}
                              value={timeRange}
                              onValueChange={handleTimeRangeChange} // Usa el nuevo controlador
                              className="my-4"
                            />
                                                      </div>
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center space-x-2">
                              <Switch
                                id="show-regression"
                                checked={showRegressionLine}
                                onCheckedChange={setShowRegressionLine}
                              />
                              <Label htmlFor="show-regression" className="dark:text-white">
                                Show Regression Line
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Switch id="show-outliers" checked={showOutliers} onCheckedChange={setShowOutliers} />
                              <Label htmlFor="show-outliers" className="dark:text-white">
                                Include Outliers
                              </Label>
                            </div>
                          </div>
                        </div>

                        {/* Scatter Plot for Variable Comparison */}
                        <div className="bg-card border border-border rounded-lg p-6 dark:bg-gray-800 dark:border-gray-700">
                          <div className="mb-4 flex justify-between items-center">
                            <div>
                              <h3 className="text-lg font-medium dark:text-white">
                                {availableVariables.find((v) => v.value === primaryVariable)?.label} vs{" "}
                                {availableVariables.find((v) => v.value === secondaryVariable)?.label}
                              </h3>
                              <p className="text-sm text-muted-foreground dark:text-gray-400">
                                Correlation: {statistics.correlation.toFixed(3)}{" "}
                                {Math.abs(statistics.correlation) > 0.7
                                  ? "(Strong)"
                                  : Math.abs(statistics.correlation) > 0.3
                                    ? "(Moderate)"
                                    : "(Weak)"}
                              </p>
                            </div>
                            <Badge variant="outline" className="dark:border-gray-700 dark:text-white">
                              {filteredData.length} data points
                            </Badge>
                          </div>

                          <div className="h-96 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <div className="h-96 w-full">
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.5} />
        <XAxis
          type="number"
          dataKey={primaryVariable}
          name={availableVariables.find((v) => v.value === primaryVariable)?.label}
          stroke="#888"
          domain={['auto', 'auto']}
          label={{
            value: availableVariables.find((v) => v.value === primaryVariable)?.label,
            position: "bottom",
            fill: "#888",
          }}
        />
        <YAxis
          type="number"
          dataKey={secondaryVariable}
          name={availableVariables.find((v) => v.value === secondaryVariable)?.label}
          stroke="#888"
          domain={['auto', 'auto']}
          label={{
            value: availableVariables.find((v) => v.value === secondaryVariable)?.label,
            angle: -90,
            position: "left",
            fill: "#888",
          }}
        />
        <Tooltip
          cursor={{ strokeDasharray: "3 3" }}
          contentStyle={{
            backgroundColor: "#1f2937",
            border: "1px solid #374151",
            borderRadius: "6px",
            color: "#fff",
          }}
          formatter={(value, name) => [
            value,
            availableVariables.find((v) => v.value === name)?.label,
          ]}
        />
        <Scatter name="Variables" data={filteredOutlierData} fill="#8884d8" />
        {showRegressionLine && (
          <Line
            type="linear"
            data={regressionLineData}
            dataKey={secondaryVariable}
            stroke="#ff7300"
            strokeWidth={2}
            dot={false}
            activeDot={false}
            legendType="none"
            name="Línea de regresión"
          />
        )}
      </ScatterChart>
    </ResponsiveContainer>
  </div>
                            </ResponsiveContainer>
                          </div>

                          {/* Statistical Summary */}
                          <div className="mt-6 grid md:grid-cols-2 gap-6">
                            <div className="bg-muted/30 p-4 rounded-lg dark:bg-gray-700/30">
                              <h4 className="text-md font-medium mb-3 dark:text-white">
                                {availableVariables.find((v) => v.value === primaryVariable)?.label} Statistics
                              </h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-xs text-muted-foreground dark:text-gray-400">Mean</p>
                                  <p className="text-sm font-medium dark:text-white">
                                    {statistics.primary.mean.toFixed(2)}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground dark:text-gray-400">Median</p>
                                  <p className="text-sm font-medium dark:text-white">
  {statistics.primary.median ? statistics.primary.median.toFixed(2) : "N/A"}
</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground dark:text-gray-400">Std. Deviation</p>
                                  <p className="text-sm font-medium dark:text-white">
                                    {statistics.primary.stdDev.toFixed(2)}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground dark:text-gray-400">Range</p>
                                  <p className="text-sm font-medium dark:text-white">
                                    {statistics.primary.min.toFixed(1)} - {statistics.primary.max.toFixed(1)}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="bg-muted/30 p-4 rounded-lg dark:bg-gray-700/30">
                              <h4 className="text-md font-medium mb-3 dark:text-white">
                                {availableVariables.find((v) => v.value === secondaryVariable)?.label} Statistics
                              </h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-xs text-muted-foreground dark:text-gray-400">Mean</p>
                                  <p className="text-sm font-medium dark:text-white">
                                    {statistics.secondary.mean.toFixed(2)}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground dark:text-gray-400">Median</p>
                                  <p className="text-sm font-medium dark:text-white">
                                    {statistics.secondary.median ? statistics.secondary.median.toFixed(2):"N/A"}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground dark:text-gray-400">Std. Deviation</p>
                                  <p className="text-sm font-medium dark:text-white">
                                    {statistics.secondary.stdDev.toFixed(2)}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground dark:text-gray-400">Range</p>
                                  <p className="text-sm font-medium dark:text-white">
                                    {statistics.secondary.min.toFixed(1)} - {statistics.secondary.max.toFixed(1)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* Información de regresión (cuando está activada) */}
                              {showRegressionLine && (
                                <div className="mt-4 bg-muted/30 p-4 rounded-lg dark:bg-gray-700/30">
                                  <h4 className="text-md font-medium mb-3 dark:text-white">Análisis de Regresión</h4>
                                  <div className="grid grid-cols-3 gap-4">
                                    <div>
                                      <p className="text-xs text-muted-foreground dark:text-gray-400">Ecuación</p>
                                      <p className="text-sm font-medium dark:text-white">
                                        y = {statistics.regression.slope.toFixed(4)}x + {statistics.regression.intercept.toFixed(4)}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-muted-foreground dark:text-gray-400">Valor R²</p>
                                      <p className="text-sm font-medium dark:text-white">{statistics.regression.r2.toFixed(4)}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-muted-foreground dark:text-gray-400">Significancia</p>
                                      <p className="text-sm font-medium dark:text-white">
                                        {statistics.regression.r2 > 0.7 ? "Fuerte" : 
                                        statistics.regression.r2 > 0.3 ? "Moderada" : "Débil"}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Información de outliers (cuando están excluidos) */}
                              {!showOutliers && (statistics.outliers.primaryCount > 0 || statistics.outliers.secondaryCount > 0) && (
                                <div className="mt-4 bg-muted/30 p-4 rounded-lg dark:bg-gray-700/30">
                                  <h4 className="text-md font-medium mb-3 dark:text-white">Outliers Excluidos</h4>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <p className="text-xs text-muted-foreground dark:text-gray-400">
                                        {availableVariables.find((v) => v.value === primaryVariable)?.label}
                                      </p>
                                      <p className="text-sm font-medium dark:text-white">
                                        {statistics.outliers.primaryCount} outliers excluidos
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-muted-foreground dark:text-gray-400">
                                        {availableVariables.find((v) => v.value === secondaryVariable)?.label}
                                      </p>
                                      <p className="text-sm font-medium dark:text-white">
                                        {statistics.outliers.secondaryCount} outliers excluidos
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )}


                          {/* Automated Insights */}
                          <div className="mt-6">
                            <h4 className="text-md font-medium mb-3 dark:text-white">Automated Insights</h4>
                            <Alert className="dark:bg-gray-700/30 dark:border-gray-600">
                              <AlertDescription>
                                <ul className="list-disc pl-5 space-y-1 dark:text-gray-300">
                                  {generateInsights.map((insight, index) => (
                                    <li key={index}>{insight}</li>
                                  ))}
                                </ul>
                              </AlertDescription>
                            </Alert>
                          </div>
                        </div>
                      </TabsContent>

                      {/* Distribution Analysis Tab */}
                      <TabsContent value="distribution" className="space-y-4">
                        <div className="bg-muted/30 p-4 rounded-lg dark:bg-gray-700/30">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <Label
                                htmlFor="distribution-variable"
                                className="text-sm font-medium mb-2 block dark:text-white"
                              >
                                Variable to Analyze
                              </Label>
                              <Select value={primaryVariable} onValueChange={setPrimaryVariable}>
                                <SelectTrigger
                                  id="distribution-variable"
                                  className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                                >
                                  <SelectValue placeholder="Select variable" />
                                </SelectTrigger>
                                <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                                  {availableVariables.map((variable) => (
                                    <SelectItem
                                      key={variable.value}
                                      value={variable.value}
                                      className="dark:text-white dark:focus:bg-gray-700"
                                    >
                                      {variable.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="bins" className="text-sm font-medium mb-2 block dark:text-white">
                                Number of Bins: {distributionBins}
                              </Label>
                              <Slider
                                id="bins"
                                min={5}
                                max={20}
                                step={1}
                                value={[distributionBins]}
                                onValueChange={(value) => setDistributionBins(value[0])}
                                className="my-4"
                              />
                            </div>
                          </div>
                          
                        </div>

                        {/* Distribution Chart */}
                        <div className="bg-card border border-border rounded-lg p-6 dark:bg-gray-800 dark:border-gray-700">
                          <div className="mb-4">
                            <h3 className="text-lg font-medium dark:text-white">
                              Distribution of {availableVariables.find((v) => v.value === primaryVariable)?.label}
                            </h3>
                            <p className="text-sm text-muted-foreground dark:text-gray-400">
                              Histogram showing the frequency distribution
                            </p>
                          </div>

                          <div className="h-96 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart
                                data={(() => {
                                  // Create histogram data
                                  const min = Math.min(...primaryData)
                                  const max = Math.max(...primaryData)
                                  const binWidth = (max - min) / distributionBins

                                  const bins = Array.from({ length: distributionBins }, (_, i) => {
                                    const binStart = min + i * binWidth
                                    const binEnd = binStart + binWidth
                                    const count = primaryData.filter((val) => val >= binStart && val < binEnd).length

                                    return {
                                      bin: `${binStart.toFixed(1)}-${binEnd.toFixed(1)}`,
                                      count,
                                      binStart,
                                      binEnd,
                                    }
                                  })

                                  return bins
                                })()}
                                margin={{
                                  top: 5,
                                  right: 30,
                                  left: 20,
                                  bottom: 5,
                                }}
                              >
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                <XAxis dataKey="bin" stroke="#888" />
                                <YAxis stroke="#888" />
                                <Tooltip
                                  contentStyle={{
                                    backgroundColor: "#1f2937",
                                    border: "1px solid #374151",
                                    borderRadius: "6px",
                                    color: "#fff",
                                  }}
                                />
                                <Bar dataKey="count" fill="#8884d8" />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </TabsContent>

                      {/* Time Series Analysis Tab */}
                      <TabsContent value="time-series" className="space-y-4">
                        <div>
                          <p className="text-sm text-muted-foreground dark:text-gray-400">
                            <TimeSeriesAnalysis data={simulationData}/>
                          </p>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Agents Section */}
            {activeSection === "agents" && (
              <div className="animate-fadeIn space-y-6">
                {selectedAgent ? (
                  <AgentDetailView
                    agentId={selectedAgent}
                    agentData={selectedAgentData}
                    onBack={() => setSelectedAgent(null)}
                    averageEfficiency={averageEfficiency}
                  />
                ) : (
                  <Card className="dark:bg-gray-800 dark:border-gray-700">
                    <CardHeader>
                      <CardTitle className="dark:text-white">Agent Management</CardTitle>
                      <CardDescription className="dark:text-gray-400">
                        View and analyze individual agent status and behavior
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-4 dark:text-white">Agent Activity Summary</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          {/* Stats */}
                          <div className="bg-muted/40 p-4 rounded-lg dark:bg-gray-700/40 md:col-span-1">
                            <div className="grid md:grid-cols-3 gap-4">
                              <div className="md:col-span-3">
                                <p className="text-sm text-muted-foreground dark:text-gray-400 mb-2">
                                  Agent Status Distribution
                                </p>
                              </div>
                              <div className="md:col-span-1">
                                <p className="text-sm text-muted-foreground dark:text-gray-400">Active</p>
                                <h3 className="text-2xl font-bold dark:text-white">
                                  {activityData.find((d) => d.name === "Working")?.value || 0}
                                </h3>
                                <p className="text-xs text-muted-foreground mt-1 dark:text-gray-500">
                                  {/* Calcula el porcentaje si es posible */}
                                  {(
                                    ((activityData.find((d) => d.name === "Working")?.value || 0) /
                                      activityData.reduce((sum, d) => sum + d.value, 0)) *
                                    100
                                  ).toFixed(0)}
                                  % of total
                                </p>
                              </div>
                              <div className="md:col-span-1">
                                <p className="text-sm text-muted-foreground dark:text-gray-400">Idle</p>
                                <h3 className="text-2xl font-bold dark:text-white">
                                  {activityData.find((d) => d.name === "Idle")?.value || 0}
                                </h3>
                                <p className="text-xs text-muted-foreground mt-1 dark:text-gray-500">
                                  {(
                                    ((activityData.find((d) => d.name === "Idle")?.value || 0) /
                                      activityData.reduce((sum, d) => sum + d.value, 0)) *
                                    100
                                  ).toFixed(0)}
                                  % of total
                                </p>
                              </div>
                              <div className="md:col-span-1">
                                <p className="text-sm text-muted-foreground dark:text-gray-400">Terminated</p>
                                <h3 className="text-2xl font-bold dark:text-white">
                                  {activityData.find((d) => d.name === "Terminated")?.value || 0}
                                </h3>
                                <p className="text-xs text-muted-foreground mt-1 dark:text-gray-500">
                                  {(
                                    ((activityData.find((d) => d.name === "Terminated")?.value || 0) /
                                      activityData.reduce((sum, d) => sum + d.value, 0)) *
                                    100
                                  ).toFixed(0)}
                                  % of total
                                </p>
                              </div>
                            </div>
                          </div>
                          {/* Pie Chart */}
                          <div className="bg-muted/40 p-4 rounded-lg dark:bg-gray-700/40 md:col-span-1">
                            <p className="text-sm text-muted-foreground dark:text-gray-400 mb-2">
                              Agent Status Visualization
                            </p>
                            <div className="h-64 w-full">
                              <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                  <Pie
                                    data={activityData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={80}
                                    dataKey="value"
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                  >
                                    {activityData.map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                  </Pie>
                                  <Tooltip
                                    contentStyle={{
                                      backgroundColor: "#333",
                                      border: "none",
                                      color: "#fff",
                                    }}
                                    labelStyle={{ color: "#ddd" }}
                                    itemStyle={{ color: "#fff" }}
                                  />
                                  <Legend wrapperStyle={{ color: "#ccc" }} />
                                </PieChart>
                              </ResponsiveContainer>
                            </div>
                          </div>
                        </div>
                      </div>

                    {/* Agent List */}
                    <div className="mt-6">
                      <h3 className="text-lg font-medium mb-4 dark:text-white">Agentes Disponibles</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {agentsData.length === 0 ? (
                          <p className="text-muted-foreground dark:text-gray-400 col-span-3">Cargando agentes...</p>
                        ) : (
                          agentsData.map((agent, index) => {
                            // Extraer datos del CSV o usar valores predeterminados
                            const agentName = agent.id;
                            const familyNumber = index + 1;
                            
                            return (
                              <Card
                                key={agent.id}
                                className="dark:bg-gray-800 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer"
                                onClick={() => {
                                  setSelectedAgent(`${familyNumber}`);
                                  setSelectedAgentData(getAgentData(`${familyNumber}`));
                                }}
                              >
                                <CardContent className="p-4">
                                  <div className="flex items-center space-x-3">
                                    <div className="h-10 w-10 rounded-full flex items-center justify-center dark:bg-blue-900/30">
                                      <Users className="h-5 w-5 text-green-500" />
                                    </div>
                                    <div>
                                      <h4 className="font-medium dark:text-white">Familia {familyNumber}</h4>
                                      <div className="flex items-center">
                                        <span className="w-2 h-2 rounded-full text-green-500 mr-2"></span>
                                        <p className="text-xs text-muted-foreground dark:text-gray-400">
                                          {agentName}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            );
                          })
                        )}
                      </div>
                    </div>
                    </CardContent>
                    <CardFooter className="border-t border-border pt-4 flex justify-between dark:border-gray-700">
                      <Button
                        variant="outline"
                        onClick={() => setActiveSection("statistics")}
                        className="dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:hover:text-white"
                      >
                        Back to statistics
                      </Button>
                    </CardFooter>
                  </Card>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}