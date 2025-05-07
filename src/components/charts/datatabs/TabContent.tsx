"use client";

import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RangeChart } from "../rangechart";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const parameters = {
  integer: [] as { key: string; color: string }[],
  float: [] as { key: string; color: string }[],
};

const ALL_AGENTS = "ALL_AGENTS";

const TabContent: React.FC = () => {
  const [selectedParameter, setSelectedParameter] = useState("");
  const [selectedType, setSelectedType] = useState("integer");
  const [agents, setAgents] = useState<string[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<string>(ALL_AGENTS);

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    const firstParameter = parameters[type as keyof typeof parameters][0]?.key;
    setSelectedParameter(firstParameter || "");
  };

  const loadAgents = async () => {
    try {
      const response = await window.electronAPI.readCsv();
      if (!response.success || !response.data) throw new Error(response.error);

      const rows = response.data.split("\n").filter((line) => line.trim() !== "");
      const headers = rows[0].split(",");
      const agentIndex = headers.indexOf("Agent");

      if (agentIndex === -1) throw new Error("No se encontró la columna 'Agent'");

      const agentsSet = new Set(
        rows.slice(1).map((row) => row.split(",")[agentIndex])
      );
      setAgents(Array.from(agentsSet));
    } catch (error) {
      console.error("Error cargando agentes:", error);
    }
  };

  const loadParameters = async () => {
    try {
      const response = await window.electronAPI.readCsv();
      if (!response.success || !response.data) throw new Error(response.error);

      const rows = response.data.split("\n").filter((line) => line.trim() !== "");
      const headers = rows[0].split(",");

      parameters.integer = headers.map((key) => ({ key, color: "#45B7D1" }));
      parameters.float = headers.map((key) => ({ key, color: "#DA4453" }));

      // Selecciona el primer parámetro válido
      const firstParameter = parameters[selectedType as keyof typeof parameters][0]?.key;
      setSelectedParameter(firstParameter || "");
    } catch (error) {
      console.error("Error cargando parámetros:", error);
    }
  };

  useEffect(() => {
    loadParameters();
    loadAgents();
  }, []);

  return (
    <Tabs defaultValue="overview" className="w-full h-full">
      <TabsContent value="overview" className="h-full">
        <Card className="bg-[#181c20] text-[#ffffff] rounded-3xl h-full ">
          <CardHeader className="p-2">
            <CardTitle className="text-2xl font-clash bg-[#2664eb] text-white rounded-lg p-2 flex items-center justify-center">
              CSV Data Visualization
            </CardTitle>
            {/* Área de selección integrada en la cabecera */}
            <div className="flex flex-col md:flex-row gap-4 mt-4">
              <Select onValueChange={handleTypeChange} value={selectedType}>
                <SelectTrigger className="w-[200px] bg-[hsl(210,14%,11%)] text-[hsl(0,0%,100%)]">
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent className="bg-[hsl(210,14%,11%)] text-[hsl(0,0%,100%)]">
                  <SelectGroup>
                    <SelectLabel>Parameter Types</SelectLabel>
                    <SelectItem value="integer">Integer</SelectItem>
                    <SelectItem value="float">Float</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Select
                onValueChange={setSelectedParameter}
                value={selectedParameter}
              >
                <SelectTrigger className="w-[280px] bg-[hsl(210,14%,11%)] text-[hsl(0,0%,100%)]">
                  <SelectValue placeholder="Select a parameter" />
                </SelectTrigger>
                <SelectContent className="bg-[hsl(210,14%,11%)] text-[hsl(0,0%,100%)]">
                  <SelectGroup>
                    <SelectLabel>Parameters</SelectLabel>
                    {parameters[selectedType as keyof typeof parameters].map(
                      (param) => (
                        <SelectItem key={param.key} value={param.key}>
                          <div className="flex items-center">
                            <div
                              className="w-4 h-4 rounded-full mr-2"
                              style={{ backgroundColor: param.color }}
                            ></div>
                            {param.key}
                          </div>
                        </SelectItem>
                      )
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Select
                onValueChange={(value) => setSelectedAgent(value)}
                value={selectedAgent}
              >
                <SelectTrigger className="w-[280px] bg-[hsl(210,14%,11%)] text-[hsl(0,0%,100%)]">
                  <SelectValue placeholder="Select an agent" />
                </SelectTrigger>
                <SelectContent className="bg-[hsl(210,14%,11%)] text-[hsl(0,0%,100%)] max-h-60 overflow-y-auto">
                  <SelectGroup>
                    <SelectLabel>Agents</SelectLabel>
                    <SelectItem value={ALL_AGENTS}>All Agents</SelectItem>
                    {agents.map((agent) => (
                      <SelectItem key={agent} value={agent}>
                        {agent}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col h-full p-4">
            {/* Sección de gráfica que ocupa el espacio restante, sin borde */}
            <div className="flex rounded-lg -translate-y-5 h-full">
              <RangeChart
                parameter={selectedParameter}
                color={
                  parameters[selectedType as keyof typeof parameters].find(
                    (p) => p.key === selectedParameter
                  )?.color || "#000000"
                }
                type={selectedType}
                agent={selectedAgent === ALL_AGENTS ? null : selectedAgent}
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default TabContent;
