"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import path from "path"
import { useRouter } from "next/navigation";


declare global {
  interface Window {
    electronAPI: {
      executeExe: (File: string, args: string[]) => Promise<string>;
      getAppPath: () => Promise<string>;
      clearCsv: () => Promise<{ success: boolean, path?: string, error?: string }>;
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
    className="bg-white p-6 rounded-lg shadow-md"
    whileHover={{ scale: 1.02 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-sm text-gray-600 mb-4">{description}</p>
    {children}
  </motion.div>
)

export default function SimulatorConfigPage() {
  const [agents, setAgents] = useState(2)
  const [money, setMoney] = useState(75000)
  const [land, setLand] = useState(2)
  const [personality, setPersonality] = useState(0)
  const [tools, setTools] = useState(20)
  const [seeds, setSeeds] = useState(50)
  const [water, setWater] = useState(0)
  const [irrigation, setIrrigation] = useState(0)
  const [emotions, setEmotions] = useState(0)
  const [years, setYears] = useState(2)

  const router = useRouter();


  const buildArgs = () => {

    const args = {
      mode: "single", // Se pasa por defecto pero no se muestra en el formulario
      env: "local", // Se pasa por defecto pero no se muestra en el formulario
      agents: agents,
      money: money,
      land: land,
      personality: personality,
      tools: tools,
      seeds: seeds,
      water: water,
      irrigation: irrigation,
      emotions: emotions,
      years: years,
    }

    return Object.entries(args).flatMap(([key, value]) => [
      `-${key}`,
      String(value),
    ]);
    
  }
  const handleExecuteExe = async () => {
    try {
      const appPath = await window.electronAPI.getAppPath();
      const csvPath = path.join(appPath, '/src/wps/logs/wpsSimulator.csv');
  
      // En lugar de limpiar, eliminamos el archivo si existe
      const csvExists = await window.electronAPI.fileExists(csvPath);
      if (csvExists) {
        await window.electronAPI.deleteFile(csvPath);
        console.log("CSV file deleted successfully");
      }
  
      const args = buildArgs();
      const exePath = path.join(appPath, "/src/wps/wpsSimulator-1.0.exe");
  
      console.log("Path:", exePath);
      console.log("Args:", args);
  
      const result = await window.electronAPI.executeExe(exePath, args);
      console.log("Execution result:", result);

    } catch (error) {
      console.error("Error executing command:", error);
      if (error.message.includes("Unrecognized option")) {
        console.error("Please check the parameter names and values.");
      }
    }
};
  
  const handleStartSimulation = () => {
    router.push("/pages/simulador");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.h1
          className="text-4xl font-extrabold text-center text-gray-900 mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Simulator Configuration
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ConfigOption
            title="Agents"
            description="DESCRIPTION"
          >
            <Slider value={[agents]} onValueChange={(agents) => setAgents(agents[0])} max={20} step={1} min={1} className="mt-2" />
            <p className="text-sm text-gray-500 mt-2">Current Agents: {agents}</p>
          </ConfigOption>

          <ConfigOption
            title="Money"
            description="DESCRIPTION"
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
            description="DESCRIPTION"
          >
            <Slider value={[land]} onValueChange={(land) => setLand(land[0])} max={20} step={1} min={1} className="mt-2" />
            <p className="text-sm text-gray-500 mt-2">Current Lands: {land}</p>
          </ConfigOption>

          <ConfigOption title="Personality" description="DESCRIPTION">
            <div className="flex items-center space-x-2 mt-2">
            <Input
              placeholder={String(personality)}
              onChange={(e) => setPersonality(Number(e.target.value))}
              className="mt-2"
              type="number"
              />
            </div>
          </ConfigOption>

          <ConfigOption title="Tools" description="DESCRIPTION">
          <Input
              placeholder={String(tools)}
              type="number"
              onChange={(e) => setTools(Number(e.target.value))}
              className="mt-2"
              

            />
          </ConfigOption>

          <ConfigOption title="Seeds" description="DESCRIPTION">
          <Input
              placeholder={String(seeds)}
              type="number"
              onChange={(e) => setSeeds(Number(e.target.value))}
              className="mt-2"
            />
          </ConfigOption>
          
          <ConfigOption title="Water" description="DESCRIPTION">
          <Input
              placeholder={String(water)}
              type="number"
              onChange={(e) => setWater(Number(e.target.value))}
              className="mt-2"
            />
          </ConfigOption>
          
          <ConfigOption title="Irrigation" description="DESCRIPTION">
          <Input
              placeholder={String(irrigation)}
              type="number"
              onChange={(e) => setIrrigation(Number(e.target.value))}
              className="mt-2"
            />
          </ConfigOption>

          
          <ConfigOption title="Emotions" description="DESCRIPTION">
          <Input
              placeholder={String(emotions)}
              type="number"
              onChange={(e) => setEmotions(Number(e.target.value))}
              className="mt-2"
            />
          </ConfigOption>

          <ConfigOption title="Years" description="DESCRIPTION">
            <Slider value={[years]} onValueChange={(years) => setYears(years[0])} max={100} step={1} min={1} className="mt-2" />
            <p className="text-sm text-gray-500 mt-2">Current Years: {years}</p>
          </ConfigOption>
        </div>

        <motion.button
          className="mt-12 w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
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
  )
}

