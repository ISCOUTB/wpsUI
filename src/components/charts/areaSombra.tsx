"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  YAxis,
} from "recharts";
import Papa from "papaparse";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface DataPoint {
  label: string;
  value1: number;
}

type AreaChartFromCsvProps = {
  rutaCsv: string;
  colLabel: string;
  colValue1: string;
  titulo: string;
  descripcion?: string;
};

export const AreaSombra: React.FC<AreaChartFromCsvProps> = ({
  rutaCsv,
  colLabel,
  colValue1,
  titulo,
  descripcion,
}) => {
  const [data, setData] = useState<DataPoint[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    fetch(rutaCsv)
      .then((response) => response.text())
      .then((csvData) => {
        Papa.parse(csvData, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            const processedData = result.data.map(
              (fila: any, index: number) => ({
                label: fila[colLabel] || "Unknown",
                value1: Number.parseFloat(fila[colValue1]) || 0,
                index,
              })
            );

            setData(processedData);
          },
          error: (err: any) => {
           
          },
        });
      });
  }, [rutaCsv, colLabel, colValue1]);

  const chartConfig: ChartConfig = {
    value1: {
      label: "Dataset 1",
      color: "#344CB7",
    },
  };

  return (
    <Card className="bg-[#00097] text-white transition-all duration-300 hover:shadow-lg">
      <CardHeader>
        <CardTitle className="text-[#344CB7] text-2xl font-bold">
          {titulo}
        </CardTitle>
        {descripcion && (
          <CardDescription className="text-white">
            {descripcion}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              onMouseMove={(state) => {
                if (state.isTooltipActive) {
                  setHoveredIndex(state.activeTooltipIndex ?? null);
                } else {
                  setHoveredIndex(null);
                }
              }}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#FFFFFF33" />
              <XAxis dataKey="label" stroke="#FFFFFF" />
              <YAxis stroke="#FFFFFF" />
              <Tooltip
                content={<ChartTooltipContent indicator="solid" />}
                contentStyle={{
                  backgroundColor: "#000957",
                  border: "1px solidrgb(59, 159, 76)",
                }}
                labelStyle={{ color: "#FFFFFF" }}
                itemStyle={{ color: "#344CB7" }}
              />
              <defs>
                <linearGradient id="colorValue1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#344CB7" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorValue2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#000957" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#000957" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value1"
                stroke="#344CB7"
                fillOpacity={1}
                fill="url(#colorValue1)"
                strokeWidth={2}
                activeDot={{ r: 8 }}
                style={{
                  transition: "all 0.3s ease",
                }}
              />
              <Area
                type="monotone"
                dataKey="value2"
                stroke="#00957"
                fillOpacity={1}
                fill="url(#colorValue2)"
                strokeWidth={2}
                activeDot={{ r: 8 }}
                style={{
                  transition: "all 0.3s ease",
                }}
              />
              <Legend wrapperStyle={{ color: "#FFFFFF" }} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none text-gray-300">
              CSV Data Visualization
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
