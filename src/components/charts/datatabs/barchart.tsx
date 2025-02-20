"use client";

import React, { useState, useEffect } from "react";
import { TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Label, // Add this line to import Label from recharts
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";

// Configuración del gráfico para el parámetro "money"
const chartConfig = {
  money: {
    label: "Money",
    color: "#007bff", // Color azul para la barra
    description: "Cantidad de dinero que posee el agente.",
  },
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-blue-600 text-white p-2 rounded-md shadow-md">
        <p className="font-semibold">{label}</p>
        <p className="text-lg">{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

export default function BarChartComponent() {
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    // Se obtiene el CSV desde la API /api/getCsv
    fetch("/api/getCsv")
      .then((response) => response.text())
      .then((csvText) => {
        const lines = csvText.split("\n").filter(Boolean);
        const headers = lines[0].split(",");
        const data = lines.slice(1).map((line) => {
          const values = line.split(",");
          const obj: any = {};
          headers.forEach((header, index) => {
            obj[header.trim()] = values[index]?.trim();
          });
          if (obj.money) {
            obj.money = parseFloat(obj.money);
          }
          return obj;
        });
        setChartData(data);
      })
      .catch((error) =>
        console.error("Error fetching CSV data from API:", error)
      );
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Graphics</CardTitle>
        <CardDescription>Agent's Money Data</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart data={chartData} width={800} height={400}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="years"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            >
              <Label value="Month" offset={-5} position="insideBottom" />
            </XAxis>
            <YAxis tickLine={false} axisLine={false}>
              <Label
                value="Money"
                angle={-90}
                position="insideLeft"
                style={{ textAnchor: "start", fontSize: 20 }}
              />
            </YAxis>
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="money" fill={chartConfig.money.color} radius={10} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-xl ">
        <div className="leading-none text-muted-foreground">
          Showing the agent's money over the last period
        </div>
      </CardFooter>
    </Card>
  );
}
