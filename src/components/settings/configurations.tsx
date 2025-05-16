"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import path from "path";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    electronAPI: {
      fileExists(csvPath: string): unknown;
      deleteFile(csvPath: string): unknown;
      readCsv(): unknown;
      executeExe: (File: string, args: string[]) => Promise<string>;
      getAppPath: () => Promise<string>;
      clearCsv: () => Promise<{
        success: boolean;
        path?: string;
        error?: string;
      }>;
    };
  }
}

interface ConfigOptionProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

const ConfigOption = ({ title, description, children }: ConfigOptionProps) => (
  <motion.div
    className="bg-[#181c20] text-[#ffffff] p-6 rounded-lg shadow-none border border-[#272d34]"
    whileHover={{ scale: 1.02 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
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

  const buildArgs = () => {
    const args = {
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
    return Object.entries(args).flatMap(([key, value]) => [
      `-${key}`,
      String(value),
    ]);
  };

  const handleExecuteExe = async () => {
    try {
      const appPath = await window.electronAPI.getAppPath();
      const csvPath = path.join(appPath, "/src/wps/logs/wpsSimulator.csv");

      // Eliminar el archivo si existe
      const csvExists = await window.electronAPI.fileExists(csvPath);
      if (csvExists) {
        await window.electronAPI.deleteFile(csvPath);
      }

      const args = buildArgs();
      const exePath = path.join(appPath, "/src/wps/wpsSimulator-1.0.exe");
      await window.electronAPI.executeExe(exePath, args);
    } catch (error) {
      if ((error as any).message.includes("Unrecognized option")) {
        // Manejo de error
      }
    }
  };

  const handleStartSimulation = () => {
    router.push("/pages/simulador");
  };

  return (
    <div className="min-h-screen bg-[#111418] text-[#ffffff] py-12 px-4 sm:px-6 lg:px-8 font-archivo">
      <div className="max-w-6xl mx-auto">
        <motion.h1
          className="text-4xl font-extrabold text-center mb-12 text-[#ffffff] font-clash p-4 rounded-lg "
          style={{ backgroundColor: "#004d66" }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          WellProdSimulator Configuration
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ConfigOption
            title="Agents"
            description="Number of peasant agents participating in the simulation."
          >
            <Slider
              value={[agents]}
              onValueChange={(value) => setAgents(value[0])}
              max={20}
              step={1}
              min={1}
              className="mt-2"
            />
            <p className="text-sm text-[hsl(217.9,10.6%,64.9%)] mt-2">
              Current Agents: {agents}
            </p>
          </ConfigOption>

          <ConfigOption
            title="Money"
            description="Initial amount of money each agent starts with."
          >
            <Input
              placeholder={String(money)}
              onChange={(e) => setMoney(Number(e.target.value))}
              className="mt-2"
              type="number"
            />
          </ConfigOption>

          <ConfigOption
            title="Land"
            description="Number of farmland plots available."
          >
            <Slider
              value={[land]}
              onValueChange={(value) => setLand(value[0])}
              max={20}
              step={1}
              min={1}
              className="mt-2"
            />
            <p className="text-sm text-[hsl(217.9,10.6%,64.9%)] mt-2">
              Current Lands: {land}
            </p>
          </ConfigOption>

          <ConfigOption
            title="Personality"
            description="Index representing each agent's personality traits."
          >
            <div className="flex items-center space-x-2 mt-2">
              <Input
                placeholder={String(personality)}
                onChange={(e) => setPersonality(Number(e.target.value))}
                className="mt-2"
                type="number"
              />
            </div>
          </ConfigOption>

          <ConfigOption
            title="Tools"
            description="Amount of farming tools available."
          >
            <Input
              placeholder={String(tools)}
              type="number"
              onChange={(e) => setTools(Number(e.target.value))}
              className="mt-2"
            />
          </ConfigOption>

          <ConfigOption
            title="Seeds"
            description="Number of seeds available for planting."
          >
            <Input
              placeholder={String(seeds)}
              type="number"
              onChange={(e) => setSeeds(Number(e.target.value))}
              className="mt-2"
            />
          </ConfigOption>

          <ConfigOption
            title="Water"
            description="Initial water resources available."
          >
            <Input
              placeholder={String(water)}
              type="number"
              onChange={(e) => setWater(Number(e.target.value))}
              className="mt-2"
            />
          </ConfigOption>

          <ConfigOption
            title="Irrigation"
            description="Irrigation system level (0 = none, higher = better)."
          >
            <Input
              placeholder={String(irrigation)}
              type="number"
              onChange={(e) => setIrrigation(Number(e.target.value))}
              className="mt-2"
            />
          </ConfigOption>

          <ConfigOption
            title="Emotions"
            description="Emotional complexity level for agents."
          >
            <Input
              placeholder={String(emotions)}
              type="number"
              onChange={(e) => setEmotions(Number(e.target.value))}
              className="mt-2"
            />
          </ConfigOption>

          <ConfigOption
            title="Years"
            description="Number of years the simulation should run."
          >
            <Slider
              value={[years]}
              onValueChange={(value) => setYears(value[0])}
              max={100}
              step={1}
              min={1}
              className="mt-2"
            />
            <p className="text-sm text-[hsl(217.9,10.6%,64.9%)] mt-2">
              Current Years: {years}
            </p>
          </ConfigOption>
        </div>

        <motion.button
          className="mt-12 w-full bg-[hsl(221.2,83.2%,53.3%)] text-[hsl(210,40%,98%)] py-3 px-6 rounded-lg font-semibold hover:bg-[hsl(221.2,83.2%,53.3%)]/90 transition-colors duration-200"
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
  );
}
