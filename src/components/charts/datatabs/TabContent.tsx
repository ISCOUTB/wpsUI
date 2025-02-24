"use client";

import type React from "react";
import { useState, useEffect } from "react";
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
  boolean: [
    { key: "currentActivity", color: "#FF6B6B" },
    { key: "haveEmotions", color: "#4ECDC4" },
  ],
  integer: [
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
  ],
  float: [
    { key: "HappinessSadness", color: "#DA4453" },
    { key: "HopefulUncertainty", color: "#967ADC" },
    { key: "SecureInsecure", color: "#D770AD" },
    { key: "money", color: "#656D78" },
    { key: "peasantFamilyAffinity", color: "#AAB2BD" },
    { key: "peasantLeisureAffinity", color: "#E9573F" },
    { key: "peasantFriendsAffinity", color: "#8CC152" },
    { key: "waterAvailable", color: "#5D9CEC" },
  ],
  string: [
    { key: "Timestamp", color: "#A0D468" },
    { key: "purpose", color: "#4FC1E9" },
    { key: "currentPeasantLeisureType", color: "#FC6E51" },
    { key: "currentResourceNeededType", color: "#48CFAD" },
    { key: "internalCurrentDate", color: "#AC92EC" },
    { key: "peasantKind", color: "#ED5565" },
    { key: "peasantFamilyLandAlias", color: "#FFCE54" },
    { key: "farm", color: "#EC87C0" },
    { key: "contractor", color: "#5D9CEC" },
    { key: "Agent", color: "#A0D468" },
    { key: "peasantFamilyHelper", color: "#FC6E51" },
  ],
};

const ALL_AGENTS = "ALL_AGENTS";

const TabContent: React.FC = () => {
  const [selectedParameter, setSelectedParameter] = useState(
    parameters.boolean[0].key
  );
  const [selectedType, setSelectedType] = useState("boolean");
  const [agents, setAgents] = useState<string[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<string>(ALL_AGENTS);

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    setSelectedParameter(parameters[type as keyof typeof parameters][0].key);
  };

  const loadAgents = async () => {
    try {
      const response = await fetch(`/api/csv?parameter=Agent`);
      if (!response.ok) throw new Error("Error obteniendo agentes");

      const { data } = await response.json();
      setAgents(data);
    } catch (error) {
      console.error("Error cargando agentes:", error);
    }
  };

  useEffect(() => {
    loadAgents();
  }, []);

  return (
    <Tabs defaultValue="overview" className="w-full h-full">
      {/* Lista de pestañas */}
      <TabsList className="flex bg-[hsl(210,14%,11%)] rounded-full p-1 justify-center gap-2 w-full">
        <TabsTrigger
          value="overview"
          className="rounded-full text-[hsl(0,0%,100%)] data-[state=active]:bg-[hsl(221.2,83.2%,53.3%)] data-[state=active]:text-[hsl(210,40%,98%)] transition-all text-center w-full py-1.5 text-lg"
        >
          Overview
        </TabsTrigger>
      </TabsList>

      {/* Contenido de la pestaña "Overview" */}
      <TabsContent value="overview" className="h-full">
        {/* Se elimina el borde y sombra del Card con border-none y shadow-none */}
        <Card className="bg-[hsl(210,14%,11%)] text-[hsl(0,0%,100%)] rounded-3xl h-full border-none shadow-none">
          <CardHeader className="p-6">
            <CardTitle className="text-2xl font-bold font-clash">
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
                    <SelectItem value="boolean">Boolean</SelectItem>
                    <SelectItem value="integer">Integer</SelectItem>
                    <SelectItem value="float">Float</SelectItem>
                    <SelectItem value="string">String</SelectItem>
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
                <SelectContent className="bg-[hsl(210,14%,11%)] text-[hsl(0,0%,100%)]">
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
            <div className="flex-grow rounded-lg">
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