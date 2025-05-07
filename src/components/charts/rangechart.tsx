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
}

export const RangeChart: React.FC<RangeChartProps> = ({ parameter, color }) => {
  const [data, setData] = useState<any[]>([]);
  const [statistics, setStatistics] = useState({
    avg: 0,
    max: 0,
    min: 0,
    stdDev: 0,
  });

  useEffect(() => {
    const loadData = async () => {
      const rawData = await fetchCSVData();
      const processedData = processCSVData(rawData, parameter);
      setData(processedData);
      setStatistics(calculateStatistics(processedData));
    };

    loadData();
  }, [parameter]);

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
