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

const integerVariables = [
  { key: "health", color: "#45B7D1" },
  { key: "currentSeason", color: "#F7B731" },
  { key: "robberyAccount", color: "#5D9CEC" },
  { key: "currentDay", color: "#AC92EC" },
  { key: "toPay", color: "#EC87C0" },
  { key: "peasantFamilyMinimalVital", color: "#5D9CEC" },
  { key: "loanAmountToPay", color: "#48CFAD" },
  { key: "tools", color: "#A0D468" },
  { key: "seeds", color: "#ED5565" },
  { key: "pesticidesAvailable", color: "#FC6E51" },
  { key: "HarvestedWeight", color: "#FFCE54" },
  { key: "totalHarvestedWeight", color: "#CCD1D9" },
  { key: "daysToWorkForOther", color: "#4FC1E9" },
  { key: "Emotion", color: "#37BC9B" },
];

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

export { floatVariables };

const ALL_AGENTS = "ALL_AGENTS";

const TabContent: React.FC = () => {
  const [selectedParameter, setSelectedParameter] = useState<string>(integerVariables[0].key);
  const [selectedType, setSelectedType] = useState<"integer" | "float">("integer");
  const [selectedAgent, setSelectedAgent] = useState<string>(ALL_AGENTS);
  const [agents, setAgents] = useState<string[]>([]);

  const handleTypeChange = (type: "integer" | "float") => {
    setSelectedType(type);
    const firstParameter = (type === "integer" ? integerVariables : floatVariables)[0]?.key;
    setSelectedParameter(firstParameter || "");
  };

  const parameters = selectedType === "integer" ? integerVariables : floatVariables;

  useEffect(() => {
    const loadAgents = async () => {
      try {
        const response = await window.electronAPI.readCsv();
        if (!response.success || !response.data) throw new Error(response.error || "Error al leer el archivo CSV");

        const rows = response.data.split("\n").filter((line) => line.trim() !== "");
        const headers = rows[0].split(",");
        const agentIndex = headers.indexOf("Agent");

        if (agentIndex === -1) throw new Error("No se encontró la columna 'Agent'");

        const agentsSet = new Set(
          rows.slice(1).map((row) => row.split(",")[agentIndex].trim())
        );
        setAgents(Array.from(agentsSet));
      } catch (error) {
        console.error("Error cargando agentes:", error);
      }
    };

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
                    {parameters.map((param) => (
                      <SelectItem key={param.key} value={param.key}>
                        <div className="flex items-center">
                          <div
                            className="w-4 h-4 rounded-full mr-2"
                            style={{ backgroundColor: param.color }}
                          ></div>
                          {param.key}
                        </div>
                      </SelectItem>
                    ))}
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
                color={parameters.find((p) => p.key === selectedParameter)?.color || "#000000"}
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
