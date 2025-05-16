"use client"

import type React from "react"

import { useState, useEffect, useMemo } from "react"
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
import { fetchCSVData } from "@/lib/csvUtils"; // Importa la función para leer el CSV

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
import { DownloadSection } from "@/components/analytics/download-section";
import { TimeSeriesAnalysis } from "@/components/analytics/time-series-analysis";
const floatVariables = [
  { key: "HappinessSadness", color: "#DA4453" },
  { key: "HopefulUncertainty", color: "#967ADC" },
  { key: "SecureInsecure", color: "#D770AD" },
  { key: "money", color: "#656D78" },
  { key: "peasantFamilyAffinity", color: "#AAB2BD" },
  { key: "peasantLeisureAffinity", color: "#E9573F" },
  { key: "peasantFriendsAffinity", color: "#8CC152" },
  { key: "waterAvailable", color: "#5D9CEC" },
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
  {
    id: "download",
    label: "Data Export",
    description: "Exportar datos para análisis",
    icon: <Download className="w-5 h-5" />,
  },
]

export default function Analytics() {
   const [simulationData, setSimulationData] = useState<any[]>([]);
const [isTimeRangeSet, setIsTimeRangeSet] = useState(false); // Controla si el rango fue configurado manualmente
const [timeRange, setTimeRange] = useState<[number, number]>([0, 100]); // Rango de tiempo inicial

useEffect(() => {
  const loadData = async () => {
    try {
      const csvData = await fetchCSVData(); // Carga los datos del CSV
      const mappedData = csvData.map((row: Record<string, any>) => ({
        name: row.internalCurrentDate || "Unknown Date", // Usa la fecha como nombre
        ...floatVariables.reduce((acc, variable) => {
          acc[variable.key] = parseFloat(String(row[variable.key])) || 0;
          return acc;
        }, {} as Record<string, number>),
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

  loadData(); // Carga inicial

  const interval = setInterval(loadData, 2000); // Actualiza cada 2 segundos

  return () => clearInterval(interval); // Limpia el intervalo al desmontar
}, [isTimeRangeSet]);

// Controlador para manejar cambios en el rango de tiempo
const handleTimeRangeChange = (newRange: [number, number]) => {
  setTimeRange(newRange);
  setIsTimeRangeSet(true); // Marca que el usuario configuró el rango manualmente
};

// Otros estados y variables
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

  // Statistical utility functions
  const calculateMean = (data: number[]): number => {
    return data.reduce((sum, value) => sum + value, 0) / data.length
  }

  const calculateMedian = (data: number[]): number => {
    const sorted = [...data].sort((a, b) => a - b)
    const middle = Math.floor(sorted.length / 2)
    return sorted.length % 2 === 0 ? (sorted[middle - 1] + sorted[middle]) / 2 : sorted[middle]
  }

  const calculateStandardDeviation = (data: number[]): number => {
    const mean = calculateMean(data)
    const squareDiffs = data.map((value) => Math.pow(value - mean, 2))
    const variance = calculateMean(squareDiffs)
    return Math.sqrt(variance)
  }

  const calculateCorrelation = (xData: number[], yData: number[]): number => {
    if (xData.length !== yData.length || xData.length === 0) return 0

    const xMean = calculateMean(xData)
    const yMean = calculateMean(yData)

    let numerator = 0
    let xDenominator = 0
    let yDenominator = 0

    for (let i = 0; i < xData.length; i++) {
      const xDiff = xData[i] - xMean
      const yDiff = yData[i] - yMean
      numerator += xDiff * yDiff
      xDenominator += xDiff * xDiff
      yDenominator += yDiff * yDiff
    }

    if (xDenominator === 0 || yDenominator === 0) return 0
    return numerator / Math.sqrt(xDenominator * yDenominator)
  }

  // Filter data based on time range
  const filteredData = useMemo(() => {
    return simulationData.slice(timeRange[0], timeRange[1] + 1)
  }, [timeRange])

  // Extract data for selected variables
  const primaryData = useMemo(() => {
    return filteredData.map((item) => item[primaryVariable as keyof typeof item] as number)
  }, [filteredData, primaryVariable])

  const secondaryData = useMemo(() => {
    return filteredData.map((item) => item[secondaryVariable as keyof typeof item] as number)
  }, [filteredData, secondaryVariable])

  // Calculate statistics
  const statistics = useMemo(() => {
  if (primaryData.length === 0 || secondaryData.length === 0) {
    return {
      primary: {
        mean: 0,
        median: 0,
        stdDev: 0,
        min: 0,
        max: 0,
      },
      secondary: {
        mean: 0,
        median: 0,
        stdDev: 0,
        min: 0,
        max: 0,
      },
      correlation: 0,
    };
  }

  return {
    primary: {
      mean: calculateMean(primaryData),
      median: calculateMedian(primaryData),
      stdDev: calculateStandardDeviation(primaryData),
      min: Math.min(...primaryData),
      max: Math.max(...primaryData),
    },
    secondary: {
      mean: calculateMean(secondaryData),
      median: calculateMedian(secondaryData),
      stdDev: calculateStandardDeviation(secondaryData),
      min: Math.min(...secondaryData),
      max: Math.max(...secondaryData),
    },
    correlation: calculateCorrelation(primaryData, secondaryData),
  };
}, [primaryData, secondaryData]);

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

  // Function to get agent data when selected
  const getAgentData = (agentId: string) => {
    // This would normally fetch data from your API
    // For now, we'll return mock data
    return {
      status: "Active",
      currentActivity: "Working",
      efficiency: 78,
      tasksCompleted: 42,
      performanceHistory: [
        { day: "Day 1", efficiency: 65, productivity: 60 },
        { day: "Day 2", efficiency: 68, productivity: 63 },
        { day: "Day 3", efficiency: 72, productivity: 70 },
        { day: "Day 4", efficiency: 75, productivity: 73 },
        { day: "Day 5", efficiency: 78, productivity: 76 },
      ],
      metrics: {
        efficiency: 78,
        productivity: 76,
        happiness: 82,
        energy: 70,
      },
      analysis: [
        "Agent shows consistent improvement in efficiency over time.",
        "Productivity correlates strongly with happiness levels.",
        "Performance is 12% above average compared to similar agents.",
        "Recommended for complex tasks requiring sustained focus.",
      ],
      activities: [
        { name: "Working", value: 65 },
        { name: "Learning", value: 15 },
        { name: "Socializing", value: 10 },
        { name: "Resting", value: 10 },
      ],
      activityLog: [
        { time: "09:00", activity: "Started work on task #1242", type: "work" },
        { time: "10:30", activity: "Completed task #1242", type: "work" },
        { time: "10:45", activity: "Coffee break", type: "rest" },
        { time: "11:00", activity: "Meeting with team", type: "social" },
        { time: "12:00", activity: "Lunch break", type: "rest" },
        { time: "13:00", activity: "Started work on task #1243", type: "work" },
        { time: "15:30", activity: "Learning session", type: "work" },
      ],
      interactions: [
        { name: "Agent #12", positive: 8, negative: 1 },
        { name: "Agent #23", positive: 5, negative: 0 },
        { name: "Agent #34", positive: 3, negative: 2 },
        { name: "Agent #45", positive: 7, negative: 0 },
        { name: "Agent #56", positive: 4, negative: 1 },
      ],
      interactionInsights: [
        "Most frequent interactions are with Agent #12 (9 total).",
        "Highest positive interaction ratio with Agent #45 (100% positive).",
        "Some friction detected with Agent #34 (40% negative interactions).",
        "Overall positive interaction rate is 84.4%.",
      ],
    }
  }

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
        <main className="flex-1 overflow-y-auto p-6 dark:bg-gray-950">
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
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-muted/40 p-4 rounded-lg dark:bg-gray-700/40">
                          <p className="text-sm text-muted-foreground dark:text-gray-400">Active Agents</p>
                          <h3 className="text-2xl font-bold dark:text-white">247</h3> {/* Example value */}
                          <p className="text-xs text-muted-foreground dark:text-gray-500">Last count</p>
                        </div>
                        <div className="bg-muted/40 p-4 rounded-lg dark:bg-gray-700/40">
                          <p className="text-sm text-muted-foreground dark:text-gray-400">Average Efficiency</p>
                          <h3 className="text-2xl font-bold dark:text-white">{averageEfficiency.toFixed(1)}%</h3>{" "}
                          {/* Display calculated average */}
                          <p className="text-xs text-muted-foreground dark:text-gray-500">Overall mean</p>
                        </div>
                        <div className="bg-muted/40 p-4 rounded-lg dark:bg-gray-700/40">
                          <p className="text-sm text-muted-foreground dark:text-gray-400">Total Iterations</p>
                          <h3 className="text-2xl font-bold dark:text-white">1,893</h3> {/* Example value */}
                          <p className="text-xs text-muted-foreground dark:text-gray-500">Completed</p>
                        </div>
                        <div className="bg-muted/40 p-4 rounded-lg dark:bg-gray-700/40">
                          <p className="text-sm text-muted-foreground dark:text-gray-400">Total Runtime</p>
                          <h3 className="text-2xl font-bold dark:text-white">4.3h</h3> {/* Example value */}
                          <p className="text-xs text-muted-foreground dark:text-gray-500">Since start</p>
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
                              dataKey="money" // Datos a mostrar
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
                        <li>Download raw or processed data for further analysis</li>
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
                              <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.5} />
                                <XAxis
                                  type="number"
                                  dataKey={primaryVariable}
                                  name={availableVariables.find((v) => v.value === primaryVariable)?.label}
                                  stroke="#888"
                                  domain={["auto", "auto"]}
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
                                  domain={["auto", "auto"]}
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
                                <Scatter name="Variables" data={filteredData} fill="#8884d8" />
                                {showRegressionLine && (
                                  <Line
                                    type="linear"
                                    dataKey={secondaryVariable}
                                    stroke="#ff7300"
                                    dot={false}
                                    activeDot={false}
                                    legendType="none"
                                  />
                                )}
                              </ScatterChart>
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
                          <div className="mt-4">
                            <Label
                              htmlFor="confidence-interval"
                              className="text-sm font-medium mb-2 block dark:text-white"
                            >
                              Confidence Interval: {confidenceInterval}%
                            </Label>
                            <Slider
                              id="confidence-interval"
                              min={80}
                              max={99}
                              step={1}
                              value={[confidenceInterval]}
                              onValueChange={(value) => setConfidenceInterval(value[0])}
                              className="my-4"
                            />
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
                            <TimeSeriesAnalysis data={simulationData} />
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
                      <div className="bg-muted/30 p-4 rounded-lg dark:bg-gray-700/30">
                        <h3 className="text-lg font-medium mb-2 dark:text-white">Agent Filter</h3>
                        <p className="mb-4 dark:text-gray-300">
                          Search and filter agents based on their properties, status, and activities.
                        </p>
                        {/* AgentSearch component */}
                      </div>

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
                        <h3 className="text-lg font-medium mb-4 dark:text-white">Available Agents</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {Array.from({ length: 6 }).map((_, index) => (
                            <Card
                              key={index}
                              className="dark:bg-gray-800 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer"
                              onClick={() => {
                                setSelectedAgent(`${index + 1}`)
                                setSelectedAgentData(getAgentData(`${index + 1}`))
                              }}
                            >
                              <CardContent className="p-4">
                                <div className="flex items-center space-x-3">
                                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center dark:bg-blue-900/30">
                                    <Users className="h-5 w-5 text-primary dark:text-blue-400" />
                                  </div>
                                  <div>
                                    <h4 className="font-medium dark:text-white">Agent #{index + 1}</h4>
                                    <p className="text-xs text-muted-foreground dark:text-gray-400">
                                      {index % 3 === 0 ? "Active" : index % 3 === 1 ? "Idle" : "Terminated"}
                                    </p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
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
                      <Button
                        onClick={() => setActiveSection("download")}
                        className="dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:hover:text-white"
                      >
                        Export Data
                        <ChevronRight className="ml-2 h-4 w-4" />
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

import {
  Card as AgentCard,
  CardContent as AgentCardContent,
  CardDescription as AgentCardDescription,
  CardHeader as AgentCardHeader,
  CardTitle as AgentCardTitle,
  CardFooter as AgentCardFooter,
} from "@/components/ui/card"

interface AgentDetailViewProps {
  agentId: string
  agentData: any
  onBack: () => void
  averageEfficiency: number
}

const AgentDetailView: React.FC<AgentDetailViewProps> = ({ agentId, agentData, onBack, averageEfficiency }) => {
  if (!agentData) {
    return <div>Loading agent data...</div>
  }

  return (
    <div className="space-y-6">
      <Button
        variant="outline"
        onClick={onBack}
        className="dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:hover:text-white"
      >
        <ChevronRight className="mr-2 h-4 w-4 rotate-180" />
        Back to Agents
      </Button>

      <AgentCard className="dark:bg-gray-800 dark:border-gray-700">
        <AgentCardHeader>
          <AgentCardTitle className="dark:text-white">
            Agent #{agentId} - {agentData.status}
          </AgentCardTitle>
          <AgentCardDescription className="dark:text-gray-400">
            Detailed information and performance metrics
          </AgentCardDescription>
        </AgentCardHeader>
        <AgentCardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Basic Information */}
            <div className="bg-muted/30 p-4 rounded-lg dark:bg-gray-700/30">
              <h4 className="text-md font-medium mb-3 dark:text-white">Basic Information</h4>
              <p className="text-sm text-muted-foreground dark:text-gray-400">
                Current Activity: {agentData.currentActivity}
              </p>
              <p className="text-sm text-muted-foreground dark:text-gray-400">
                Tasks Completed: {agentData.tasksCompleted}
              </p>
            </div>

            {/* Key Metrics */}
            <div className="bg-muted/30 p-4 rounded-lg dark:bg-gray-700/30">
              <h4 className="text-md font-medium mb-3 dark:text-white">Key Metrics</h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-muted-foreground dark:text-gray-400">Efficiency</p>
                  <p className="text-sm font-medium dark:text-white">{agentData.metrics.efficiency}%</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground dark:text-gray-400">Productivity</p>
                  <p className="text-sm font-medium dark:text-white">{agentData.metrics.productivity}%</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground dark:text-gray-400">Happiness</p>
                  <p className="text-sm font-medium dark:text-white">{agentData.metrics.happiness}%</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground dark:text-gray-400">Energy</p>
                  <p className="text-sm font-medium dark:text-white">{agentData.metrics.energy}%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Performance History Chart */}
          <div className="bg-card border border-border rounded-lg p-6 dark:bg-gray-800 dark:border-gray-700">
            <h4 className="text-md font-medium mb-3 dark:text-white">Performance History</h4>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={agentData.performanceHistory} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="day" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "1px solid #374151",
                      borderRadius: "6px",
                      color: "#fff",
                    }}
                  />
                  <Legend wrapperStyle={{ color: "#ccc" }} />
                  <Line type="monotone" dataKey="efficiency" stroke="#8884d8" name="Efficiency" />
                  <Line type="monotone" dataKey="productivity" stroke="#82ca9d" name="Productivity" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Activity Summary */}
          <div className="bg-card border border-border rounded-lg p-6 dark:bg-gray-800 dark:border-gray-700">
            <h4 className="text-md font-medium mb-3 dark:text-white">Activity Summary</h4>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={agentData.activities}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {agentData.activities.map((entry, index) => (
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

          {/* Activity Log */}
          <div className="bg-muted/30 p-4 rounded-lg dark:bg-gray-700/30">
            <h4 className="text-md font-medium mb-3 dark:text-white">Activity Log</h4>
            <ul className="space-y-2">
              {agentData.activityLog.map((log, index) => (
                <li key={index} className="text-sm dark:text-gray-300">
                  <span className="font-medium">{log.time}</span> - {log.activity}
                </li>
              ))}
            </ul>
          </div>

          {/* Interactions */}
          <div className="bg-muted/30 p-4 rounded-lg dark:bg-gray-700/30">
            <h4 className="text-md font-medium mb-3 dark:text-white">Interactions with Other Agents</h4>
            <ul className="space-y-2">
              {agentData.interactions.map((interaction, index) => (
                <li key={index} className="text-sm dark:text-gray-300">
                  {interaction.name} - Positive: {interaction.positive}, Negative: {interaction.negative}
                </li>
              ))}
            </ul>
          </div>

          {/* Interaction Insights */}
          <div className="bg-muted/30 p-4 rounded-lg dark:bg-gray-700/30">
            <h4 className="text-md font-medium mb-3 dark:text-white">Interaction Insights</h4>
            <ul className="space-y-2">
              {agentData.interactionInsights.map((insight, index) => (
                <li key={index} className="text-sm dark:text-gray-300">
                  {insight}
                </li>
              ))}
            </ul>
          </div>

          {/* Analysis and Recommendations */}
          <div className="bg-muted/30 p-4 rounded-lg dark:bg-gray-700/30">
            <h4 className="text-md font-medium mb-3 dark:text-white">Analysis and Recommendations</h4>
            <ul className="list-disc pl-5 space-y-2 dark:text-gray-300">
              {agentData.analysis.map((analysis, index) => (
                <li key={index}>{analysis}</li>
              ))}
            </ul>
          </div>
        </AgentCardContent>
        <AgentCardFooter className="border-t border-border pt-4 flex justify-end dark:border-gray-700">
          <Button
            onClick={onBack}
            className="dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            Close
          </Button>
        </AgentCardFooter>
      </AgentCard>
    </div>
  )
}
