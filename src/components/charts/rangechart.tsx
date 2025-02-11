"use client";

import type React from "react";
import { useState, useEffect } from "react";
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
import {
  fetchCSVData,
  processCSVData,
  calculateStatistics,
  type CSVData,
} from "@/lib/csvUtils";

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
      <div className="bg-surface p-3">
        <div className="flex flex-row items-center gap-3">
          <div
            id="labelColorIndicator"
            className="w-4 h-4"
            style={{
              backgroundColor: chartColor,
            }}
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
  const [data, setData] = useState<CSVData[]>([]);
  const [processedData, setProcessedData] = useState<any[]>([]);
  const [statistics, setStatistics] = useState({
    avg: 0,
    max: 0,
    min: 0,
    stdDev: 0,
  });

  useEffect(() => {
    const loadData = async () => {
      const csvData = await fetchCSVData("/wpsSimulator.csv");
      setData(csvData);
    };
    loadData();
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      const processed = processCSVData(data, parameter);
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
            <Tooltip />
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
              className="stroke-gray-200 dark:stroke-gray-700"
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => moment(value).format("MMM D")}
              className="text-outline-variant dark:text-white"
            />
            <YAxis
              type="number"
              domain={["auto", "dataMax"]}
              tickFormatter={(value) => value.toFixed(2)}
              className="text-gray-600 dark:text-gray-300"
            />
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
            <ReferenceLine
              y={statistics.avg}
              stroke="#ba1a1a"
              label={{
                value: "Average",
                position: "insideTopRight",
                className: "fill-red-600 dark:fill-red-400",
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
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey={parameter} fill={color} />
          </BarChart>
        );
      default:
        return <></>;
    }
  };

  return (
    <div className="w-full h-[70vh] mt-3 bg-background dark:bg-surface-dark">
      <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between border-b dark:border-outline-variant-dark">
        <div>
          <h2 className="text-xl font-semibold font-clash text-on-background dark:text-on-background-dark">
            {`${parameter} Data Visualization`}
          </h2>
          <p className="font-archivo text-sm text-on-surface-variant dark:text-on-surface-variant-dark/60">
            Data visualization over time
          </p>
        </div>
        <div>
          <div className="hidden md:grid grid-cols-4 gap-8 justify-end bg-surface dark:bg-surface-dark my-3">
            <div id="maxContainer">
              <p className="text-on-surface-variant dark:text-on-surface-variant-dark/60 font-archivo text-sm">
                Month maximum
              </p>
              <p className="text-on-surface dark:text-on-surface-dark text-lg font-clash font-semibold text-right">
                {statistics.max.toFixed(2)}
              </p>
            </div>
            <div id="minContainer">
              <p className="text-on-surface-variant dark:text-on-surface-variant-dark/60 font-archivo text-sm">
                Month minimum
              </p>
              <p className="text-on-surface dark:text-on-surface-dark text-lg font-clash font-semibold text-right">
                {statistics.min.toFixed(2)}
              </p>
            </div>
            <div id="averageContainer">
              <p className="text-on-surface-variant dark:text-on-surface-variant-dark/60 font-archivo text-sm">
                Month average
              </p>
              <p className="text-on-surface dark:text-on-surface-dark text-lg font-clash font-semibold text-right">
                {statistics.avg.toFixed(2)}
              </p>
            </div>
            <div id="stdDevContainer">
              <p className="text-on-surface-variant dark:text-on-surface-variant-dark/60 font-archivo text-sm">
                Month standard deviation
              </p>
              <p className="text-on-surface dark:text-on-surface-dark text-lg font-clash font-semibold text-right">
                {statistics.stdDev.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col h-[calc(100%-5rem)] p-4">
        <div className="order-2 grid md:hidden grid-cols-2 gap-8 justify-end bg-surface dark:bg-surface-dark my-3">
          <div id="maxContainer">
            <p className="text-on-surface-variant dark:text-on-surface-variant-dark/60 font-archivo text-sm">
              Month maximum
            </p>
            <p className="text-on-surface dark:text-on-surface-dark text-lg font-clash font-semibold text-right">
              {statistics.max.toFixed(2)}
            </p>
          </div>
          <div id="minContainer">
            <p className="text-on-surface-variant dark:text-on-surface-variant-dark/60 font-archivo text-sm">
              Month minimum
            </p>
            <p className="text-on-surface dark:text-on-surface-dark text-lg font-clash font-semibold text-right">
              {statistics.min.toFixed(2)}
            </p>
          </div>
          <div id="averageContainer">
            <p className="text-on-surface-variant dark:text-on-surface-variant-dark/60 font-archivo text-sm">
              Month average
            </p>
            <p className="text-on-surface dark:text-on-surface-dark text-lg font-clash font-semibold text-right">
              {statistics.avg.toFixed(2)}
            </p>
          </div>
          <div id="stdDevContainer">
            <p className="text-on-surface-variant dark:text-on-surface-variant-dark/60 font-archivo text-sm">
              Month standard deviation
            </p>
            <p className="text-on-surface dark:text-on-surface-dark text-lg font-clash font-semibold text-right">
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
