"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar/sidebar";
import SimulationMap from "@/components/map/mapSimulator";
import TabContent from "@/components/charts/datatabs/TabContent";
import FarmInfoComponent from "./farmInfoComponents";
import { ThemeProvider } from "next-themes";


export default function MapSimulator() {
  const mapHeight = 600;

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="flex h-screen bg-background text-foreground font-archivo">
        <Sidebar />
        <div className="flex-1 flex flex-col md:flex-row gap-4 p-4">
          {/* Farm Information Section (40%) */}
          <div className="w-full md:w-2/5 bg-card rounded-lg shadow-md p-4">
            <h2 className="text-xl font-bold mb-4 text-center">
              Farm Information
            </h2>
            <FarmInfoComponent />
          </div>
          {/* Simulation Map + Tab Content + Agent Search Section (60%) */}
          <div className="w-full  bg-card rounded-lg shadow-md p-4 overflow-auto">
            {/* Combined Simulation Map and Tab Content */}
            <div className="h-[400px]">
              <SimulationMap />
              <TabContent />
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
