"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart,
} from "recharts";

const floatVariables = [
  { key: "HappinessSadness", color: "#DA4453", label: "Happiness/Sadness" },
  { key: "HopefulUncertainty", color: "#967ADC", label: "Hopeful/Uncertainty" },
  { key: "SecureInsecure", color: "#D770AD", label: "Secure/Insecure" },
  { key: "money", color: "#656D78", label: "Money" },
  { key: "peasantFamilyAffinity", color: "#AAB2BD", label: "Family Affinity" },
  { key: "peasantLeisureAffinity", color: "#E9573F", label: "Leisure Affinity" },
  { key: "peasantFriendsAffinity", color: "#8CC152", label: "Friends Affinity" },
  { key: "waterAvailable", color: "#5D9CEC", label: "Water Available" },
];

export function TimeSeriesAnalysis({ data }: { data: any[] }) {
  const [selectedVariable, setSelectedVariable] = useState<string>(
    floatVariables[0].key
  );
  const [showMovingAverage, setShowMovingAverage] = useState(true);
  const [showTrend, setShowTrend] = useState(true);

  // Extraer valores para la variable seleccionada
  const variableData = useMemo(() => {
    return data.map((item) => item[selectedVariable] as number);
  }, [data, selectedVariable]);

  // Calcular la media móvil (moving average)
  const calculateMovingAverage = (data: number[], windowSize = 5): number[] => {
    const result: number[] = [];
    for (let i = 0; i < data.length; i++) {
      if (i < windowSize - 1) {
        result.push(Number.NaN); // No hay suficientes puntos para calcular la media móvil
      } else {
        let sum = 0;
        for (let j = 0; j < windowSize; j++) {
          sum += data[i - j];
        }
        result.push(sum / windowSize);
      }
    }
    return result;
  };

  // Calcular la línea de tendencia (regresión lineal simple)
  const calculateTrendLine = (data: number[]): { slope: number; intercept: number } => {
    const n = data.length;
    const indices = Array.from({ length: n }, (_, i) => i);

    const sumX = indices.reduce((sum, x) => sum + x, 0);
    const sumY = data.reduce((sum, y) => sum + y, 0);
    const sumXY = indices.reduce((sum, x, i) => sum + x * data[i], 0);
    const sumXX = indices.reduce((sum, x) => sum + x * x, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    return { slope, intercept };
  };

  // Calcular media móvil
  const movingAverageData = useMemo(() => {
    return calculateMovingAverage(variableData, 5);
  }, [variableData]);

  // Calcular línea de tendencia
  const trendLine = useMemo(() => {
    return calculateTrendLine(variableData);
  }, [variableData]);

  // Calcular datos para la línea de tendencia
  const trendData = useMemo(() => {
    return data.map((_, i) => trendLine.intercept + trendLine.slope * i);
  }, [data, trendLine]);

  // Analizar tendencia
  const trendAnalysis = useMemo(() => {
    if (trendLine.slope > 0.5) return "strong upward";
    if (trendLine.slope > 0.1) return "moderate upward";
    if (trendLine.slope < -0.5) return "strong downward";
    if (trendLine.slope < -0.1) return "moderate downward";
    return "relatively stable";
  }, [trendLine]);

  // Detectar patrones cíclicos (simplificado)
  const detectCycles = useMemo(() => {
    // Implementación simplificada para detectar patrones cíclicos
    // En un caso real, podrías usar análisis de Fourier o autocorrelación
    let changes = 0;
    for (let i = 1; i < variableData.length; i++) {
      if (
        (variableData[i] > variableData[i - 1] && variableData[i - 1] <= (variableData[i - 2] || 0)) ||
        (variableData[i] < variableData[i - 1] && variableData[i - 1] >= (variableData[i - 2] || 0))
      ) {
        changes++;
      }
    }

    const cycleRatio = changes / variableData.length;
    if (cycleRatio > 0.4) return "highly cyclical";
    if (cycleRatio > 0.2) return "moderately cyclical";
    return "not significantly cyclical";
  }, [variableData]);

  // Calcular volatilidad
  const volatility = useMemo(() => {
    if (variableData.length === 0) return { level: "Unknown", value: 0 };
    
    const mean = variableData.reduce((sum, val) => sum + val, 0) / variableData.length;
    const squaredDiffs = variableData.map(val => Math.pow(val - mean, 2));
    const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / variableData.length;
    const stdDev = Math.sqrt(variance);
    const cv = stdDev / mean; // Coeficiente de variación
    
    let level = "Low";
    if (cv > 0.3) level = "High";
    else if (cv > 0.1) level = "Moderate";
    
    return { level, value: cv };
  }, [variableData]);

  // Calcular estadísticas de cambio
  const changeStats = useMemo(() => {
    if (variableData.length < 2) return { percentChange: 0, firstHalfMean: 0, secondHalfMean: 0 };
    
    const firstHalf = variableData.slice(0, Math.floor(variableData.length / 2));
    const secondHalf = variableData.slice(Math.floor(variableData.length / 2));
    const firstHalfMean = firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length;
    const secondHalfMean = secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length;
    const percentChange = ((secondHalfMean - firstHalfMean) / firstHalfMean) * 100;
    
    return { percentChange, firstHalfMean, secondHalfMean };
  }, [variableData]);

  // Encontrar extremos
  const extremes = useMemo(() => {
    if (variableData.length === 0) return { max: 0, min: 0, maxIndex: -1, minIndex: -1 };
    
    const max = Math.max(...variableData);
    const min = Math.min(...variableData);
    const maxIndex = variableData.indexOf(max);
    const minIndex = variableData.indexOf(min);
    
    return { max, min, maxIndex, minIndex };
  }, [variableData]);

  // Obtener etiqueta para la variable
  const getLabel = (key: string): string => {
    return floatVariables.find((v) => v.key === key)?.label || key;
  };

  // Obtener color para la variable
  const getColor = (key: string): string => {
    return floatVariables.find((v) => v.key === key)?.color || "#8884d8";
  };

  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardHeader className="pb-2">
        <CardTitle className="dark:text-white">
          Time Series Analysis: {getLabel(selectedVariable)}
        </CardTitle>
        <CardDescription className="dark:text-gray-400">
          Analyze how {getLabel(selectedVariable)} changes over time
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <Label htmlFor="variable-select" className="dark:text-white mb-2 block">
              Variable to Analyze
            </Label>
            <Select value={selectedVariable} onValueChange={setSelectedVariable}>
              <SelectTrigger id="variable-select" className="dark:bg-gray-700 dark:text-white">
                <SelectValue placeholder="Select variable" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800">
                {floatVariables.map((variable) => (
                  <SelectItem key={variable.key} value={variable.key} className="dark:text-white">
                    {variable.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="moving-average" checked={showMovingAverage} onCheckedChange={setShowMovingAverage} />
            <Label htmlFor="moving-average" className="dark:text-white">
              Show Moving Average (5-day)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="trend-line" checked={showTrend} onCheckedChange={setShowTrend} />
            <Label htmlFor="trend-line" className="dark:text-white">
              Show Trend Line
            </Label>
          </div>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.5} />
              <XAxis 
                dataKey="name" 
                stroke="#888"
                label={{
                  value: "Time",
                  position: "bottom",
                  fill: "#888",
                  offset: 0,
                }}
              />
              <YAxis 
                stroke="#888"
                label={{
                  value: getLabel(selectedVariable),
                  angle: -90,
                  position: "left",
                  fill: "#888",
                }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "1px solid #374151",
                  borderRadius: "6px",
                  color: "#fff",
                }}
                formatter={(value, name) => {
                  if (name === selectedVariable) return [value, getLabel(selectedVariable)];
                  if (name === "Moving Average") return [value, "5-day Moving Average"];
                  if (name === "Trend Line") return [value, "Trend Line"];
                  return [value, name];
                }}
              />
              <Legend wrapperStyle={{ color: "#ccc" }} />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={getColor(selectedVariable)} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={getColor(selectedVariable)} stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey={selectedVariable}
                stroke={getColor(selectedVariable)}
                fillOpacity={1}
                fill="url(#colorGradient)"
                name={getLabel(selectedVariable)}
              />
              {showMovingAverage && (
                <Line
                  type="monotone"
                  dataKey={(_, index) => movingAverageData[index]}
                  stroke="#ff7300"
                  strokeWidth={2}
                  dot={false}
                  name="Moving Average"
                />
              )}
              {showTrend && (
                <Line
                  type="monotone"
                  dataKey={(_, index) => trendData[index]}
                  stroke="#82ca9d"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  name="Trend Line"
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Añadimos las métricas de análisis */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-muted/30 p-4 rounded-lg dark:bg-gray-700/30">
            <p className="text-xs text-muted-foreground dark:text-gray-400">Trend Analysis</p>
            <p className="text-lg font-medium dark:text-white capitalize">{trendAnalysis}</p>
            <p className="text-xs text-muted-foreground mt-1 dark:text-gray-500">
              Slope: {trendLine.slope.toFixed(4)}
            </p>
          </div>
          <div className="bg-muted/30 p-4 rounded-lg dark:bg-gray-700/30">
            <p className="text-xs text-muted-foreground dark:text-gray-400">Cyclical Pattern</p>
            <p className="text-lg font-medium dark:text-white capitalize">{detectCycles}</p>
            <p className="text-xs text-muted-foreground mt-1 dark:text-gray-500">
              Based on direction changes
            </p>
          </div>
          <div className="bg-muted/30 p-4 rounded-lg dark:bg-gray-700/30">
            <p className="text-xs text-muted-foreground dark:text-gray-400">Volatility</p>
            <p className="text-lg font-medium dark:text-white">{volatility.level}</p>
            <p className="text-xs text-muted-foreground mt-1 dark:text-gray-500">
              CV: {volatility.value.toFixed(3)}
            </p>
          </div>
        </div>

        {/* Añadimos el resumen de insights */}
        <Alert className="dark:bg-gray-700/30 dark:border-gray-600">
          <AlertDescription>
            <ul className="list-disc pl-5 space-y-1 dark:text-gray-300">
              <li>
                {getLabel(selectedVariable)} shows a {trendAnalysis} trend over the analyzed time period.
              </li>
              <li>
                The data exhibits {detectCycles} patterns, suggesting
                {detectCycles === "highly cyclical"
                  ? " regular fluctuations that may be predictable."
                  : detectCycles === "moderately cyclical"
                    ? " some recurring patterns."
                    : " mostly random variations without clear cycles."}
              </li>
              <li>
                {Math.abs(changeStats.percentChange) < 5
                  ? `The variable remained relatively stable with only a ${changeStats.percentChange.toFixed(1)}% change between the first and second half of the period.`
                  : `There was a ${changeStats.percentChange > 0 ? "positive" : "negative"} change of ${Math.abs(changeStats.percentChange).toFixed(1)}% between the first and second half of the period.`}
              </li>
              <li>
                The highest value ({extremes.max.toFixed(2)}) was observed at point {data[extremes.maxIndex]?.name || "unknown"}, 
                while the lowest value ({extremes.min.toFixed(2)}) was observed at point {data[extremes.minIndex]?.name || "unknown"}.
              </li>
              <li>
                Volatility is {volatility.level.toLowerCase()}, with a coefficient of variation of {volatility.value.toFixed(3)}, 
                indicating {volatility.level === "High" ? "significant" : volatility.level === "Moderate" ? "moderate" : "minimal"} fluctuations.
              </li>
            </ul>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}