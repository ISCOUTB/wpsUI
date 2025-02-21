"use client";

import React, { useState, useEffect } from "react";
import moment from "moment";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface APIData {
  date: string;
  value: number;
}

interface RangeTooltipProps {
  active: boolean;
  payload: any[];
  label: string;
  chartColor: string;
}

const RangeTooltip: React.FC<RangeTooltipProps> = ({
  active,
  payload,
  label,
  chartColor,
}) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="p-3 rounded shadow-md"
        style={{
          backgroundColor: "hsl(var(--card))",
          color: "hsl(var(--card-foreground))",
        }}
      >
        <div className="flex flex-row items-center gap-3">
          <div
            id="labelColorIndicator"
            className="w-4 h-4 rounded"
            style={{ backgroundColor: chartColor }}
          />
          <span className="font-clash font-semibold">
            {moment(label).format("MMM D, YYYY")}
          </span>
        </div>
        {payload.map((item, index) => (
          <div key={index}>
            <span className="font-archivo">
              {item.name}: {item.value.toFixed(4)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

interface RangeChartProps {
  parameter: string;
  color: string;
  type: string;
}

export const RangeChart: React.FC<RangeChartProps> = ({
  parameter,
  color,
  type,
}) => {
  const [data, setData] = useState<APIData[]>([]);
  const [processedData, setProcessedData] = useState<any[]>([]);
  const [statistics, setStatistics] = useState({
    avg: 0,
    max: 0,
    min: 0,
    stdDev: 0,
  });

  const loadData = async () => {
    try {
      const response = await fetch(`/api/csv?parameter=${parameter}`);
      if (!response.ok) throw new Error("Error obteniendo datos");

      const { data, stats } = await response.json();
      setProcessedData(data);
      setStatistics(stats);
    } catch (error) {
      // Manejo del error según convenga
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000); // Actualiza cada 5 segundos
    return () => clearInterval(interval); // Limpia el intervalo al desmontar el componente
  }, [parameter]);

  useEffect(() => {
    if (data.length > 0) {
      const processed = data.map((item) => ({
        date: item.date,
        [parameter]: item.value,
      }));
      setProcessedData(processed);
      setStatistics(calculateStatistics(data, parameter));
    }
  }, [data, parameter]);

  const renderChart = () => {
    switch (type) {
      case "boolean":
        return (
          <PieChart width={400} height={400}>
            <Pie
              data={processedData}
              cx={200}
              cy={200}
              labelLine={false}
              outerRadius={80}
              fill={color}
              dataKey={parameter}
            >
              {processedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={color} />
              ))}
            </Pie>
            <Tooltip
              content={
                <RangeTooltip
                  active={false}
                  payload={[]}
                  label={""}
                  chartColor={color}
                />
              }
            />
          </PieChart>
        );
      case "integer":
      case "float":
        return (
          <AreaChart data={processedData}>
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.8} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              className="stroke-[hsl(var(--border))] dark:stroke-[hsl(var(--border))]"
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) =>
                moment(value, "YYYY-MM-DD").isValid()
                  ? moment(value, "YYYY-MM-DD").format("YYYY-MM-DD")
                  : "Fecha inválida"
              }
              className="text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]"
            />
            <YAxis
              type="number"
              domain={["auto", "dataMax"]}
              tickFormatter={(value) => value.toFixed(2)}
              className="text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]"
            />
            <Tooltip
              content={
                <RangeTooltip
                  active={true}
                  payload={[]}
                  label={""}
                  chartColor={color}
                />
              }
            />
            <ReferenceLine
              y={statistics.avg}
              stroke="#ba1a1a"
              label={{
                value: "Average",
                position: "insideTopRight",
                className: "text-red-600 dark:text-red-400",
              }}
            />
            <Area
              connectNulls
              type="monotone"
              dataKey={parameter}
              stroke={color}
              fill="url(#colorGradient)"
              strokeWidth={2}
              dot={false}
            />
          </AreaChart>
        );
      case "string":
        return (
          <BarChart data={processedData}>
            <CartesianGrid
              strokeDasharray="3 3"
              className="stroke-[hsl(var(--border))] dark:stroke-[hsl(var(--border))]"
            />
            <XAxis
              dataKey="date"
              className="text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]"
            />
            <YAxis className="text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]" />
            <Tooltip />
            <Bar dataKey={parameter} fill={color} />
          </BarChart>
        );
      default:
        return <></>;
    }
  };

  return (
    <div className="w-full h-[70vh] mt-3 bg-[#0f1417] text-[hsl(var(--foreground))] transition-all duration-300 ease-in-out font-archivo">
      <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between border-b border-[hsl(var(--border))] p-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight font-clash text-[hsl(var(--foreground))]">
            {`${parameter} Data Visualization`}
          </h2>
          <p className="font-archivo text-sm text-[hsl(var(--muted-foreground))]">
            Data visualization over time
          </p>
        </div>
        <div>
          <div className="hidden md:grid grid-cols-4 gap-8 justify-end bg-[#171c1f] dark:bg-[#171c1f] my-3 p-4 rounded">
            <div id="maxContainer">
              <p className="font-archivo text-sm text-[hsl(var(--muted-foreground))]">
                Month maximum
              </p>
              <p className="font-clash font-semibold text-lg text-right text-[hsl(var(--foreground))]">
                {statistics.max.toFixed(2)}
              </p>
            </div>
            <div id="minContainer">
              <p className="font-archivo text-sm text-[hsl(var(--muted-foreground))]">
                Month minimum
              </p>
              <p className="font-clash font-semibold text-lg text-right text-[hsl(var(--foreground))]">
                {statistics.min.toFixed(2)}
              </p>
            </div>
            <div id="averageContainer">
              <p className="font-archivo text-sm text-[hsl(var(--muted-foreground))]">
                Month average
              </p>
              <p className="font-clash font-semibold text-lg text-right text-[hsl(var(--foreground))]">
                {statistics.avg.toFixed(2)}
              </p>
            </div>
            <div id="stdDevContainer">
              <p className="font-archivo text-sm text-[hsl(var(--muted-foreground))]">
                Month standard deviation
              </p>
              <p className="font-clash font-semibold text-lg text-right text-[hsl(var(--foreground))]">
                {statistics.stdDev.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col h-[calc(100%-5rem)] p-4 rounded-lg border border-[hsl(var(--border))] bg-[#171c1f]">
        <div className="order-2 grid md:hidden grid-cols-2 gap-8 justify-end bg-[#171c1f] dark:bg-[#171c1f] my-3 p-4 rounded">
          <div id="maxContainer">
            <p className="font-archivo text-sm text-[hsl(var(--muted-foreground))]">
              Month maximum
            </p>
            <p className="font-clash font-semibold text-lg text-right text-[hsl(var(--foreground))]">
              {statistics.max.toFixed(2)}
            </p>
          </div>
          <div id="minContainer">
            <p className="font-archivo text-sm text-[hsl(var(--muted-foreground))]">
              Month minimum
            </p>
            <p className="font-clash font-semibold text-lg text-right text-[hsl(var(--foreground))]">
              {statistics.min.toFixed(2)}
            </p>
          </div>
          <div id="averageContainer">
            <p className="font-archivo text-sm text-[hsl(var(--muted-foreground))]">
              Month average
            </p>
            <p className="font-clash font-semibold text-lg text-right text-[hsl(var(--foreground))]">
              {statistics.avg.toFixed(2)}
            </p>
          </div>
          <div id="stdDevContainer">
            <p className="font-archivo text-sm text-[hsl(var(--muted-foreground))]">
              Month standard deviation
            </p>
            <p className="font-clash font-semibold text-lg text-right text-[hsl(var(--foreground))]">
              {statistics.stdDev.toFixed(2)}
            </p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

function calculateStatistics(
  data: APIData[],
  parameter: string
): { avg: number; max: number; min: number; stdDev: number } {
  // Función de ejemplo para el cálculo de estadísticas
  const values = data.map((item) => item.value);
  const avg = values.reduce((sum, v) => sum + v, 0) / values.length || 0;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const stdDev =
    Math.sqrt(
      values.reduce((sum, v) => sum + Math.pow(v - avg, 2), 0) / values.length
    ) || 0;
  return { avg, max, min, stdDev };
}
