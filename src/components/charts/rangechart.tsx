"use client";

import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Papa from "papaparse";

interface RangeChartProps {
  parameter: string;
  color: string;
  type: "float" | "integer"; // Agregar la propiedad 'type'
  agent: string | null; // Agente seleccionado
}

export const RangeChart: React.FC<RangeChartProps> = ({ parameter, color, type, agent }) => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await window.electronAPI.readCsv();
        if (!response.success || !response.data) throw new Error(response.error || "Error al leer el archivo CSV");

        // Analizar el contenido del CSV con papaparse
        Papa.parse(response.data, {
          header: true,
          complete: (results) => {
            const filteredData = results.data
              .filter((row: any) => row.internalCurrentDate) // Asegurarse de que la fecha exista
              .filter((row: any) => !agent || row.Agent === agent) // Filtrar por agente si está seleccionado
              .map((row: any) => ({
                date: row.internalCurrentDate, // Usar siempre internalCurrentDate como eje X
                value: parseFloat(row[parameter]), // Filtrar por el parámetro seleccionado
              }))
              .filter((row) => !isNaN(row.value)); // Filtrar valores no numéricos

            setData(filteredData);
          },
          error: (error: Error) => { // Especificar el tipo de 'error'
            console.error("Error al analizar el archivo CSV:", error);
          },
        });
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      }
    };

    loadData();

    // Actualización en tiempo real cada 5 segundos
    const interval = setInterval(loadData, 2000);
    return () => clearInterval(interval); // Limpiar el intervalo al desmontar el componente
  }, [parameter, agent]);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.8} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="#2c2c2c" strokeDasharray="3 3" /> {/* Oscurecer cuadrículas */}
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Area type="monotone" dataKey="value" stroke={color} fill="url(#colorGradient)" />
      </AreaChart>
    </ResponsiveContainer>
  );
};
