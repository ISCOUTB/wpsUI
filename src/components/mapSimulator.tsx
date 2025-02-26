"use client";

import { useState, useEffect, useRef } from "react";
import Sidebar from "@/components/Sidebar/sidebar";
import SimulationMap from "@/components/map/mapSimulator";
import TabContent from "@/components/charts/datatabs/TabContent";
import FarmInfoComponent from "./farmInfoComponents";
import { ThemeProvider } from "next-themes";
import { Button } from "./ui/button";
import { RefreshCw, StopCircle } from "lucide-react";

const ToggleButton = () => {
  const [isStop, setIsStop] = useState(false);

  return (
    <div className="flex items-center justify-center space-x-4 mt-4">
      <Button className="flex items-center space-x-2 text-white bg-[#2664eb] hover:bg-[#1e4bbf] font-clash font-bold">
        {isStop ? (
          <>
            <RefreshCw className="w-8 h-8 font-clash" />
            <span>Reiniciar</span>
          </>
        ) : (
          <>
            <StopCircle className="w-8 h-8 font-clash" />
            <span>Stop</span>
          </>
        )}
      </Button>
    </div>
  );
};

export default function MapSimulator() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="flex h-screen bg-[#111418] text-[#ffffff] font-archivo">
        <Sidebar />
        <div className="flex-1 flex flex-col md:flex-row gap-4 p-4">
          {/* Sección de Información de la Finca */}
          <div className="w-full md:w-2/5 bg-[#181c20] rounded-lg shadow-md p-4">
            <h2 className="text-xl font-bold font-clash mb-4 text-center text-white bg-[#2664eb] rounded-lg p-2">
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
    </ThemeProvider>
  );
}
