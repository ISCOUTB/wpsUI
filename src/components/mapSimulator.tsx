"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar/sidebar";
import SimulationMap from "@/components/map/mapSimulator";
import TabContent from "@/components/charts/datatabs/TabContent";
import FarmInfoComponent from "./farmInfoComponents";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import { ThemeProvider } from "next-themes";
import AgentSearch from "@/components/search/AgentSearch";

export default function MapSimulator() {
  const [mapHeight, setMapHeight] = useState(600);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="flex flex-col md:flex-row h-screen bg-background text-foreground font-archivo">
        <Sidebar />
        <div className="max-w-3xl mx-auto mt-6 p-4 bg-card rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 text-center">Información de las Granjas</h2>
            <FarmInfoComponent />
          </div>
        <div className="flex-1 p-4 md:p-8 overflow-auto relative">
          
          <ResizableBox
            width={Number.POSITIVE_INFINITY}
            height={mapHeight}
            minConstraints={[Number.POSITIVE_INFINITY, 300]}
            maxConstraints={[Number.POSITIVE_INFINITY, 800]}
            onResize={(e, { size }) => setMapHeight(size.height)}
            className="mb-8"
          >
            <SimulationMap />
          </ResizableBox>
          <TabContent />
          <AgentSearch />
          
         
        </div>
      </div>
    </ThemeProvider>
  );
}
