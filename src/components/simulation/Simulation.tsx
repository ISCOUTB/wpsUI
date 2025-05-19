"use client";
import Sidebar from "@/components/Sidebar/sidebar";
import SimulationMap from "@/components/simulation/containerMap";
import TabContent from "@/components/charts/datatabs/TabContent";
import FarmInfoComponent from "./farmInfoComponents";
import { Button } from "../ui/button";
import { StopCircle } from "lucide-react";

const ToggleButton = () => {
  const handleButtonClick = async () => {
    try {
      const result = await window.electronAPI.killJavaProcess();
      if (result.success) {
        console.log("Proceso Java detenido correctamente");
      } else {
        console.error("Error al detener el proceso:", result.error);
      }
    } catch (error) {
      console.error("Error al detener el proceso Java:", error);
    }
  };

  return (
    <div className="flex items-center justify-center space-x-2 mt-2">
      <Button
        onClick={handleButtonClick}
        className="flex items-center space-x-1 text-white bg-[#2664eb] hover:bg-[#1e4bbf] font-clash font-bold py-1"
      >
        <StopCircle className="w-6 h-6 font-clash" />
        <span>Stop</span>
      </Button>
    </div>
  );
};
export default function MapSimulator() {
  return (
    <div className="flex h-screen bg-[#111418] text-[#ffffff] font-archivo overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col md:flex-row gap-2 p-2 relative ">
        {/* Sección de Información de la Finca */}
        <div className="w-full md:w-2/5 bg-[#181c20] rounded-lg shadow-md p-2 scrollbar-hide overflow-auto">
          <h2 className="text-xl font-bold font-clash mb-2 text-center text-white bg-[#2664eb] rounded-lg p-1">
            Farm Information
          </h2>
          <FarmInfoComponent />
        </div>
        {/* Sección de Mapa de Simulación + Contenido de Pestañas */}
        <div className="w-full bg-[#181c20] rounded-lg shadow-md p-2 overflow-auto">
          <div className="h-[400px] rounded-3xl">
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
