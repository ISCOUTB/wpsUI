"use client";

import { useState, useEffect, useRef } from "react";
import Sidebar from "@/components/Sidebar/sidebar";
import SimulationMap from "@/components/map/mapSimulator";
import TabContent from "@/components/charts/datatabs/TabContent";
import FarmInfoComponent from "./farmInfoComponents";
import { Button } from "./ui/button";
import { RefreshCw, StopCircle } from "lucide-react";

const ToggleButton = () => {
  const handleButtonClick = async () => {
    try {
      const result = await window.electronAPI.killJavaProcess();
      if (result.success) {
        console.log("Proceso Java detenido correctamente");
      } else {
        console.error("Error al detener el proceso:", result.message || result.error);
      }
    } catch (error) {
      console.error("Error al detener el proceso Java:", error);
    }
  };

  return (
    <div className="flex items-center justify-center space-x-4 mt-4">
      <Button 
        onClick={handleButtonClick}
        className="flex items-center space-x-2 text-white bg-[#2664eb] hover:bg-[#1e4bbf] font-clash font-bold">
        <StopCircle className="w-8 h-8 font-clash" />
        <span>Stop</span>
      </Button>
    </div>
  );
};
export default function MapSimulator() {
  return (
    <div className="flex h-screen bg-[#111418] text-[#ffffff] font-archivo overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col md:flex-row gap-4 p-4 relative ">
        {/* Sección de Información de la Finca */}
        <div className="w-full md:w-2/5 bg-[#181c20] rounded-lg shadow-md p-4 scrollbar-hide overflow-auto">
          <h2 className="text-2xl font-bold font-clash mb-4 text-center text-white bg-[#2664eb] rounded-lg p-2">
            Farm Information
          </h2>
          <FarmInfoComponent />
        </div>
        {/* Sección de Mapa de Simulación + Contenido de Pestañas */}
        <div className="w-full bg-[#181c20] rounded-lg shadow-md p-4 overflow-auto">
          <div className="h-[450px] rounded-3xl">
            <SimulationMap />

            {/* Botón con WebSocket */}
            <ToggleButton />

            <TabContent />
          </div>
        </div>
      </div>
    </div>
  );
}
