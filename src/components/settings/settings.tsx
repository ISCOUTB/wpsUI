"use client";

import React, { useState, useLayoutEffect } from "react";
import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import path from "path";
import { useRouter } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";
import { startSettingsTour } from "@/components/settings/tourJs/tour";

interface ConfigOptionProps {
  id?: string;
  title: string;
  description: string;
  tooltipInfo: string;
  children: React.ReactNode;
}

const ConfigOption = ({
  id,
  title,
  description,
  tooltipInfo,
  children,
}: ConfigOptionProps) => (
  <motion.div
    id={id}
    className="bg-[#181c20] text-[#ffffff] p-6 rounded-lg border border-[#272d34]"
    whileHover={{ scale: 1.02 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <div className="flex items-center gap-2 mb-2">
      <h3 className="text-lg font-semibold">{title}</h3>
      <Tooltip>
        <TooltipTrigger asChild>
          <InfoIcon className="h-4 w-4 text-[hsl(217.9,10.6%,64.9%)] cursor-help" />
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs">{tooltipInfo}</p>
        </TooltipContent>
      </Tooltip>
    </div>
    <p className="text-sm text-[hsl(217.9,10.6%,64.9%)] mb-4">{description}</p>
    {children}
  </motion.div>
);

export default function SimulatorConfigPage() {
  const [agents, setAgents] = useState(2);
  const [money, setMoney] = useState(75000);
  const [land, setLand] = useState(2);
  const [personality, setPersonality] = useState(0);
  const [tools, setTools] = useState(20);
  const [seeds, setSeeds] = useState(50);
  const [water, setWater] = useState(0);
  const [irrigation, setIrrigation] = useState(0);
  const [emotions, setEmotions] = useState(0);
  const [years, setYears] = useState(2);

  const router = useRouter();

  const tourElementIds = [
    "config-agents",
    "config-money",
    "config-land",
    "config-personality",
    "config-tools",
    "config-seeds",
    "config-water",
    "config-irrigation",
    "config-emotions",
    "config-years",
  ];

  useLayoutEffect(() => {
    if (process.env.NODE_ENV === "development") {
      localStorage.removeItem("hasSeenTour");
    }

    let attempts = 0;
    const maxAttempts = 10;
    let rafId: number;
    let timeoutId: ReturnType<typeof setTimeout>;

    const checkAndStart = () => {
      attempts++;
      const allReady = tourElementIds.every((id) => {
        const el = document.getElementById(id);
        if (!el) console.log(`Elemento no encontrado aún: ${id}`);
        return !!el;
      });

      if (!allReady && attempts < maxAttempts) {
        timeoutId = setTimeout(() => {
          rafId = window.requestAnimationFrame(checkAndStart);
        }, 500);
        return;
      }

      if (!allReady) {
        console.error("No se pudo iniciar el tour tras varios intentos.");
        return;
      }

      const hasSeenTour = localStorage.getItem("hasSeenTour") === "true";
      if (!hasSeenTour) {
        try {
          startSettingsTour();
          localStorage.setItem("hasSeenTour", "true");
        } catch (error) {
          console.error("Error al iniciar el tour:", error);
        }
      }
    };

    rafId = window.requestAnimationFrame(checkAndStart);

    return () => {
      window.cancelAnimationFrame(rafId);
      clearTimeout(timeoutId);
    };
  }, []);

  const buildArgs = () => {
    const argsObj = {
      mode: "single",
      env: "local",
      agents,
      money,
      land,
      personality,
      tools,
      seeds,
      water,
      irrigation,
      emotions,
      years,
    };
    return Object.entries(argsObj).flatMap(([key, value]) => [
      `-${key}`,
      String(value),
    ]);
  };

  const handleExecuteExe = async () => {
    try {
      const appPath = await window.electronAPI.getAppPath();
      const csvPath = path.join(appPath, "/src/wps/logs/wpsSimulator.csv");
      if (await window.electronAPI.fileExists(csvPath)) {
        await window.electronAPI.deleteFile(csvPath);
      }
      const args = buildArgs();
      const exePath = path.join(appPath, "/src/wps/wpsSimulator-1.0.exe");
      await window.electronAPI.executeExe(exePath, args);
    } catch (error: any) {
      if (!error.message.includes("Unrecognized option")) {
        console.error("Error ejecutando el EXE:", error);
      }
    }
  };

  const handleStartSimulation = () => {
    router.push("/pages/simulador");
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-[#111418] text-[#ffffff] py-12 px-4 sm:px-6 lg:px-8 font-archivo">
        <div className="max-w-6xl mx-auto">
          <motion.h1
            className="text-4xl font-extrabold text-center mb-12 p-4 rounded-lg font-clash"
            style={{ backgroundColor: "#004d66" }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            WellProdSimulator Configuration
          </motion.h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ConfigOption
              id="config-agents"
              title="Agents"
              description="Number of peasant agents participating in the simulation."
              tooltipInfo="Agents represent individual farmers..."
            >
              <Slider
                value={[agents]}
                onValueChange={(v) => setAgents(v[0])}
                min={1}
                max={1000}
                step={1}
                className="mt-2"
              />
              <p className="text-sm mt-2">Current Agents: {agents}</p>
            </ConfigOption>

            <ConfigOption
              id="config-money"
              title="Money"
              description="Initial amount of money each agent starts with."
              tooltipInfo="Starting capital for each agent..."
            >
              <Input
                type="number"
                placeholder={String(money)}
                onChange={(e) => setMoney(Number(e.target.value))}
                className="mt-2"
              />
            </ConfigOption>

            <ConfigOption
              id="config-land"
              title="Land"
              description="Number of farmland plots available."
              tooltipInfo="Total land plots in the simulation..."
            >
              <Slider
                value={[land]}
                onValueChange={(v) => {
                  const allowed = [2, 6, 12];
                  const nearest = allowed.reduce((p, c) =>
                    Math.abs(c - v[0]) < Math.abs(p - v[0]) ? c : p
                  );
                  setLand(nearest);
                }}
                min={2}
                max={12}
                step={4}
                className="mt-2"
              />
              <p className="text-sm mt-2">Current Lands: {land}</p>
            </ConfigOption>

            <ConfigOption
              id="config-personality"
              title="Personality"
              description="Index representing each agent's personality traits."
              tooltipInfo="Affects how agents make decisions..."
            >
              <Input
                type="number"
                placeholder={String(personality)}
                onChange={(e) => setPersonality(Number(e.target.value))}
                className="mt-2"
              />
            </ConfigOption>

            <ConfigOption
              id="config-tools"
              title="Tools"
              description="Amount of farming tools available."
              tooltipInfo="Tools increase farming efficiency..."
            >
              <Input
                type="number"
                placeholder={String(tools)}
                onChange={(e) => setTools(Number(e.target.value))}
                className="mt-2"
              />
            </ConfigOption>

            <ConfigOption
              id="config-seeds"
              title="Seeds"
              description="Number of seeds available for planting."
              tooltipInfo="Seeds are essential for crop production..."
            >
              <Input
                type="number"
                placeholder={String(seeds)}
                onChange={(e) => setSeeds(Number(e.target.value))}
                className="mt-2"
              />
            </ConfigOption>

            <ConfigOption
              id="config-water"
              title="Water"
              description="Initial water resources available."
              tooltipInfo="Water is crucial for crop growth..."
            >
              <Input
                type="number"
                placeholder={String(water)}
                onChange={(e) => setWater(Number(e.target.value))}
                className="mt-2"
              />
            </ConfigOption>

            <ConfigOption
              id="config-irrigation"
              title="Irrigation"
              description="Irrigation system level (0 = none, higher = better)."
              tooltipInfo="Better irrigation systems improve yields..."
            >
              <Input
                type="number"
                placeholder={String(irrigation)}
                onChange={(e) => setIrrigation(Number(e.target.value))}
                className="mt-2"
              />
            </ConfigOption>

            <ConfigOption
              id="config-emotions"
              title="Emotions"
              description="Emotional complexity level for agents."
              tooltipInfo="Determines how emotions affect decisions..."
            >
              <Input
                type="number"
                placeholder={String(emotions)}
                onChange={(e) => setEmotions(Number(e.target.value))}
                className="mt-2"
              />
            </ConfigOption>

            <ConfigOption
              id="config-years"
              title="Years"
              description="Number of years the simulation should run."
              tooltipInfo="Simulation duration..."
            >
              <Slider
                value={[years]}
                onValueChange={(v) => setYears(v[0])}
                min={1}
                max={100}
                step={1}
                className="mt-2"
              />
              <p className="text-sm mt-2">Current Years: {years}</p>
            </ConfigOption>
          </div>

          <motion.button
            className="mt-6 w-full bg-[#004d66] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#004d66]/90 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              localStorage.removeItem("hasSeenTour");
              setTimeout(() => startSettingsTour(), 50);
            }}
          >
            Show Guide
          </motion.button>

          <motion.button
            className="mt-12 w-full bg-[hsl(221.2,83.2%,53.3%)] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[hsl(221.2,83.2%,53.3%)]/90 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              handleExecuteExe();
              handleStartSimulation();
            }}
          >
            Save Configuration
          </motion.button>
        </div>
      </div>
    </TooltipProvider>
  );
}
