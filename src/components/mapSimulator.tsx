"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar/sidebar";
import SimulationMap from "@/components/map/mapSimulator";
import TabContent from "@/components/charts/datatabs/TabContent";
import FarmInfoComponent from "./farmInfoComponents";
import { ThemeProvider } from "next-themes";

export default function MapSimulator() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="flex h-screen bg-[hsl(214,17%,8%)] text-[hsl(0,0%,100%)] font-archivo">
        <Sidebar />
        <div className="flex-1 flex flex-col md:flex-row gap-4 p-4">
          {/* Sección de Información de la Finca (40%) */}
          <div className="w-full md:w-2/5 bg-[hsl(210,14%,11%)] rounded-lg shadow-md p-4">
            <h2 className="text-xl font-bold mb-4 text-center text-[hsl(0,0%,100%)]">
              Farm Information
            </h2>
            <FarmInfoComponent />
          </div>
          {/* Sección de Mapa de Simulación + Contenido de Pestañas (60%) */}
          <div className="w-full bg-[hsl(210,14%,11%)] rounded-lg shadow-md p-4 overflow-auto">
            <div className="h-[500px]">
              <SimulationMap />
              <div className="mt-4">
                <TabContent />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
