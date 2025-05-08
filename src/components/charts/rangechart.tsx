"use client";

import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import { fetchCSVData, processCSVData, calculateStatistics } from "@/lib/csvUtils";

interface RangeChartProps {
  parameter: string;
  color: string;
  type: "float" | "integer";
  agent: string | null;
}

export const RangeChart: React.FC<RangeChartProps> = ({ parameter, color, type, agent }) => {
  const [data, setData] = useState<any[]>([]);
  const [statistics, setStatistics] = useState({
    avg: 0,
    max: 0,
    min: 0,
    stdDev: 0,
  });
  const [fallback, setFallback] = useState(false); // Estado para manejar el fallback

  // Datos de prueba en caso de error
  const fallbackData = [
    { date: "2023-01-01", value: 10 },
    { date: "2023-01-02", value: 20 },
    { date: "2023-01-03", value: 15 },
    { date: "2023-01-04", value: 25 },
    { date: "2023-01-05", value: 30 },
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        const rawData = await fetchCSVData();
        console.log("Datos crudos del CSV:", rawData); // Log para depuración

        const processedData = processCSVData(rawData, parameter);
        console.log("Datos procesados para la gráfica:", processedData); // Log para depuración

        setData(processedData);
        setStatistics(calculateStatistics(processedData));
      } catch (error) {
        console.error("Error al cargar los datos del CSV:", error);
        setFallback(true); // Activar el fallback si ocurre un error
        setData(fallbackData); // Usar datos de prueba
        setStatistics(calculateStatistics(fallbackData)); // Calcular estadísticas con datos de prueba
      }
    };

    loadData();
  }, [parameter, agent]);

  if (fallback) {
    // Renderizar un gráfico nativo como alternativa
    return (
      <div>
        <h3>Gráfico alternativo</h3>
        <svg width="100%" height="400">
          <rect width="100%" height="100%" fill="#f0f0f0" />
          {data.map((point, index) => (
            <circle
              key={index}
              cx={`${(index / data.length) * 100}%`}
              cy={`${(1 - point.value / statistics.max) * 100}%`}
              r="5"
              fill={color}
            />
          ))}
        </svg>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.8} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <ReferenceLine
          y={statistics.avg}
          stroke="red"
          label={{ value: "Avg", position: "insideTopRight" }}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          fill="url(#colorGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};
