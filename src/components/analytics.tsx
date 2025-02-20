"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AnalyticsNavigation from "./analyticsnavigation";
import { ParameterSelector } from "@/components/analytics/parameter-selector";
import { ParameterChart } from "@/components/analytics/parameter-chart";
import { DownloadSection } from "@/components/analytics/download-section";
import type { ParameterType } from "@/lib/parameter-config";
import { parameters } from "@/lib/parameter-config";
import { Button } from "@/components/ui/button";
import AgentSearch from "./search/AgentSearch";
import Barchart from "@/components/charts/datatabs/barchart";

export default function Analytics() {
  const [selectedType, setSelectedType] = useState<ParameterType>("boolean");
  const [selectedParameter, setSelectedParameter] = useState("currentActivity");
  const [activeSection, setActiveSection] = useState("parameter");
  const router = useRouter();

  const handleTypeChange = (type: string) => {
    setSelectedType(type as ParameterType);
    // Reset parameter selection when type changes
    const firstParameter = parameters[type as ParameterType][0].key;
    setSelectedParameter(firstParameter);
  };

  return (
    <div className="flex">
      <div className="flex-1 p-6">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Detailed Simulation Analysis</CardTitle>
            <CardDescription>
              Explore simulation data with interactive charts and detailed
              explanations.
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
                {activeSection === "home" && (
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Welcome</h2>
                    <p>
                      In this section, you get an overview of the simulation
                      data. Here, you can see aggregated metrics, summary
                      charts, and key performance indicators that provide
                      insights into the overall behavior and progress of the
                      simulation.
                    </p>
                    <p className="mt-2">
                      This is your starting point for understanding the
                      simulation's performance. From here, you can navigate to
                      more detailed analysis sections or download the data for
                      further investigation.
                    </p>
                    <Button
                      className="mt-4"
                      onClick={() => router.push("/pages/simulador")}
                    >
                      Go to Simulator
                    </Button>
                    <Barchart />
                  </div>
                )}
                {activeSection === "parameter" && (
                  <div>
                    <h2 className="text-2xl font-bold mb-4">
                      Parameter Analysis
                    </h2>
                    <div className="space-y-4">
                      <ParameterSelector
                        selectedType={selectedType}
                        selectedParameter={selectedParameter}
                        onTypeChange={handleTypeChange}
                        onParameterChange={setSelectedParameter}
                      />
                      <ParameterChart
                        selectedType={selectedType}
                        selectedParameter={selectedParameter}
                      />
                    </div>
                  </div>
                )}
                {activeSection === "download" && (
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Download Data</h2>
                    <DownloadSection />
                  </div>
                )}

                {activeSection === "Agents" && (
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Agents</h2>
                    <p>
                      In this section, you can view the agents in the
                      simulation. You can see the current status of each agent,
                      including their activity, location, and other relevant
                      information.
                    </p>
                    <AgentSearch />
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
