"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RangeChart } from "@/components/charts/rangechart";
import { fetchCSVData, type CSVData } from "@/lib/csvUtils";
import { Download } from "lucide-react";
import Sidebar from "@/components/Sidebar/sidebar";
import AnalyticsNavigation from "./analyticsnavigation";
import moment from "moment";
import Papa from "papaparse";

const parameters = {
  boolean: [
    {
      key: "currentActivity",
      color: "#FF6B6B",
      description:
        "Indica si el agente está realizando una actividad actualmente.",
    },
    {
      key: "haveEmotions",
      color: "#4ECDC4",
      description: "Indica si el agente tiene emociones habilitadas.",
    },
  ],
  integer: [
    {
      key: "health",
      color: "#45B7D1",
      description: "Nivel de salud del agente en una escala numérica.",
    },
    {
      key: "currentSeason",
      color: "#F7B731",
      description: "Temporada actual en el sistema (1-4).",
    },
    {
      key: "robberyAccount",
      color: "#5D9CEC",
      description: "Número de robos sufridos por el agente.",
    },
    {
      key: "currentDay",
      color: "#AC92EC",
      description: "Día actual en la simulación.",
    },
    {
      key: "toPay",
      color: "#EC87C0",
      description: "Cantidad que el agente debe pagar.",
    },
    {
      key: "peasantFamilyMinimalVital",
      color: "#5D9CEC",
      description: "Mínimo vital de la familia campesina.",
    },
    {
      key: "loanAmountToPay",
      color: "#48CFAD",
      description: "Cantidad de préstamo que el agente debe pagar.",
    },
    {
      key: "tools",
      color: "#A0D468",
      description: "Número de herramientas disponibles.",
    },
    {
      key: "seeds",
      color: "#ED5565",
      description: "Número de semillas disponibles.",
    },
    {
      key: "pesticidesAvailable",
      color: "#FC6E51",
      description: "Cantidad de pesticidas disponibles.",
    },
    {
      key: "HarvestedWeight",
      color: "#FFCE54",
      description: "Peso de la cosecha actual.",
    },
    {
      key: "totalHarvestedWeight",
      color: "#CCD1D9",
      description: "Peso total de todas las cosechas.",
    },
    {
      key: "daysToWorkForOther",
      color: "#4FC1E9",
      description: "Días que el agente trabaja para otros.",
    },
    {
      key: "Emotion",
      color: "#37BC9B",
      description:
        "Valor numérico que representa la emoción actual del agente.",
    },
  ],
  float: [
    {
      key: "HappinessSadness",
      color: "#DA4453",
      description: "Nivel de felicidad o tristeza del agente.",
    },
    {
      key: "HopefulUncertainty",
      color: "#967ADC",
      description: "Nivel de esperanza o incertidumbre del agente.",
    },
    {
      key: "SecureInsecure",
      color: "#D770AD",
      description: "Nivel de seguridad o inseguridad del agente.",
    },
    {
      key: "money",
      color: "#656D78",
      description: "Cantidad de dinero que posee el agente.",
    },
    {
      key: "peasantFamilyAffinity",
      color: "#AAB2BD",
      description: "Afinidad del agente con su familia campesina.",
    },
    {
      key: "peasantLeisureAffinity",
      color: "#E9573F",
      description: "Afinidad del agente con actividades de ocio.",
    },
    {
      key: "peasantFriendsAffinity",
      color: "#8CC152",
      description: "Afinidad del agente con sus amigos.",
    },
    {
      key: "waterAvailable",
      color: "#5D9CEC",
      description: "Cantidad de agua disponible para el agente.",
    },
  ],
  string: [
    {
      key: "Timestamp",
      color: "#A0D468",
      description: "Marca de tiempo del evento.",
    },
    {
      key: "purpose",
      color: "#4FC1E9",
      description: "Propósito actual del agente.",
    },
    {
      key: "currentPeasantLeisureType",
      color: "#FC6E51",
      description: "Tipo de actividad de ocio actual del agente.",
    },
    {
      key: "currentResourceNeededType",
      color: "#48CFAD",
      description: "Tipo de recurso que el agente necesita actualmente.",
    },
    {
      key: "internalCurrentDate",
      color: "#AC92EC",
      description: "Fecha actual en la simulación.",
    },
    {
      key: "peasantKind",
      color: "#ED5565",
      description: "Tipo de campesino que es el agente.",
    },
    {
      key: "peasantFamilyLandAlias",
      color: "#FFCE54",
      description: "Alias de la tierra de la familia campesina.",
    },
    {
      key: "farm",
      color: "#EC87C0",
      description: "Estado actual de la granja del agente.",
    },
    {
      key: "contractor",
      color: "#5D9CEC",
      description: "Contratista actual del agente.",
    },
    {
      key: "Agent",
      color: "#A0D468",
      description: "Identificador único del agente.",
    },
    {
      key: "peasantFamilyHelper",
      color: "#FC6E51",
      description: "Ayudante de la familia campesina del agente.",
    },
  ],
};

const Analytics: React.FC = () => {
  const [selectedType, setSelectedType] = useState("boolean");
  const [selectedParameter, setSelectedParameter] = useState(
    parameters.boolean[0].key
  );
  const [csvData, setCsvData] = useState<CSVData[]>([]);
  const [activeSection, setActiveSection] = useState("parameter");

  useEffect(() => {
    const loadData = async () => {
      console.log("Loading data...");
      const data = await fetchCSVData("/src/wps/logs/wpsSimulator.csv");
      console.log("Data loaded:", data);
      setCsvData(data);
    };
    loadData();
  }, []);

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    setSelectedParameter(parameters[type as keyof typeof parameters][0].key);
  };
  const downloadCSV = async () => {
    try {
      // Recargar los datos más recientes
      const data = await fetchCSVData("src/wps/logs/wpsSimulator.csv");

      if (!data || data.length === 0) {
        console.error("No hay datos disponibles para descargar");
        return;
      }

      // Obtener los encabezados
      const headers = Object.keys(data[0]);

      // Crear el contenido del CSV usando Papa.unparse
      const csv = Papa.unparse({
        fields: headers,
        data: data,
      });

      // Crear el blob con el contenido
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

      // Crear URL del blob
      const url = window.URL.createObjectURL(blob);

      // Crear y configurar el enlace de descarga
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `simulation_results_${moment().format("YYYY-MM-DD_HH-mm")}.csv`
      );
      link.style.visibility = "hidden";

      // Agregar a documento, click y limpiar
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Liberar la URL del blob
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al descargar el CSV:", error);
    }
  };
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Análisis Detallado de la Simulación</CardTitle>
            <CardDescription>
              Explore los datos de la simulación con gráficas interactivas y
              explicaciones detalladas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex">
              <div className="w-64 pr-6">
                <AnalyticsNavigation
                  setActiveSection={setActiveSection}
                  activeSection={activeSection}
                />
              </div>
              <div className="flex-1">
                {activeSection === "general" && (
                  <div>
                    <h2 className="text-2xl font-bold mb-4">
                      Análisis General
                    </h2>
                    {/* Aquí puedes agregar un resumen general o gráficos generales */}
                  </div>
                )}
                {activeSection === "parameter" && (
                  <div>
                    <h2 className="text-2xl font-bold mb-4">
                      Análisis por Parámetro
                    </h2>
                    <div className="space-y-4">
                      <div className="flex space-x-4">
                        <Select
                          onValueChange={handleTypeChange}
                          value={selectedType}
                        >
                          <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Seleccionar tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="boolean">Booleano</SelectItem>
                            <SelectItem value="integer">Entero</SelectItem>
                            <SelectItem value="float">Flotante</SelectItem>
                            <SelectItem value="string">Cadena</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select
                          onValueChange={setSelectedParameter}
                          value={selectedParameter}
                        >
                          <SelectTrigger className="w-[280px]">
                            <SelectValue placeholder="Seleccionar parámetro" />
                          </SelectTrigger>
                          <SelectContent>
                            {parameters[
                              selectedType as keyof typeof parameters
                            ].map((param) => (
                              <SelectItem key={param.key} value={param.key}>
                                {param.key}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Card>
                        <CardHeader>
                          <CardTitle>{selectedParameter}</CardTitle>
                          <CardDescription>
                            {
                              parameters[
                                selectedType as keyof typeof parameters
                              ].find((p) => p.key === selectedParameter)
                                ?.description
                            }
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <RangeChart
                            parameter={selectedParameter}
                            color={
                              parameters[
                                selectedType as keyof typeof parameters
                              ].find((p) => p.key === selectedParameter)
                                ?.color || "#000000"
                            }
                            type={selectedType}
                          />
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}
                {activeSection === "download" && (
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Descargar Datos</h2>
                    <Card>
                      <CardHeader>
                        <CardTitle>
                          Descargar Resultados de la Simulación
                        </CardTitle>
                        <CardDescription>
                          Descargue los datos completos de la simulación en
                          formato CSV para un análisis más detallado.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button onClick={downloadCSV}>
                          <Download className="mr-2 h-4 w-4" /> Descargar CSV
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
