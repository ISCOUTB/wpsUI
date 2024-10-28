"use client";

import React, { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import "../app/styles/global.css";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { app } from 'electron';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import path from "path";

declare global {
  interface Window {
    electronAPI: {
      executeExe: (File: string, args: string[]) => Promise<string>;
      getAppPath: () => Promise<string>;
    };
  }
}

const LeafAnimation = () => (
  <motion.div
    className="absolute w-4 h-4 bg-green-300 rounded-full opacity-50"
    initial={{ x: "-10%", y: "-10%" }}
    animate={{
      x: ["0%", "100%", "0%"],
      y: ["0%", "100%", "0%"],
    }}
    transition={{
      duration: 20,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "reverse",
    }}
  />
);

const WaterRipple = () => (
  <motion.div
    className="absolute w-16 h-16 border-2 border-blue-300 rounded-full opacity-30"
    initial={{ scale: 0 }}
    animate={{ scale: 2 }}
    transition={{
      duration: 4,
      ease: "easeOut",
      repeat: Infinity,
    }}
  />
);

export default function WPSInitialConfig() {
  const [config, setConfig] = useState({
    mode: "single",
    env: "local",
    agents: 2,
    money: 750000,
    land: 2,
    personality: "Neutral",
    tools: 20,
    seeds: 50,
    water: 0,
    irrigation: 0,
    emotions: true,
  });

  const [configupdated, setConfigUpdated] = useState({
    mode: "single",
    env: "local",
    agents: 2,
    money: 750000,
    land: 2,
    personality: 0.0,
    tools: 20,
    seeds: 50,
    water: 0,
    irrigation: 0,
    emotions: 0,
  });

  const router = useRouter();


  const updateConfig = () => {

    if (config.personality == "Neutral") {
      configupdated.personality = 0.0;
    }

    if (config.emotions == true) {
      configupdated.emotions = 1;
    }

  }

  
  function buildArgs(x: Record<string, any>): string[] { 
    return Object.entries(x).flatMap(([key, value]) => [`-${key}`, String(value)]);
  }

  const handleExecuteExe = async () => {
    const args = buildArgs(configupdated);
    const Path = await window.electronAPI.getAppPath();

    const exePath = path.join(Path, "/src/wps/wpsSimulator-1.0.exe");

    console.log("Path:", exePath);

    // Log the command to be executed
    console.log(args);
    try {
      const result = await window.electronAPI.executeExe(exePath, args);
      console.log("Execution result:", result);
    } catch (error) {
      console.error("Error executing command:", error);
    }
    
  };


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setConfig((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setConfig((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStartSimulation = () => {
    console.log("Starting simulation with config:", config);
    router.push("/pages/simulador");
  };

  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-green-200 via-blue-200 to-yellow-200 animate-bg min-h-screen" />
      <LeafAnimation />
      <LeafAnimation />
      <LeafAnimation />
      <WaterRipple />
      <WaterRipple />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl relative z-10"
      >
        <Card className="backdrop-blur-md bg-white/30 shadow-xl rounded-xl overflow-hidden">
          <CardHeader className="bg-green-600/60 text-white p-4">
            <CardTitle className="text-2xl font-bold text-center">
              WellProdSim Configuración Inicial
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="mode"
                  className="text-sm font-medium text-green-800"
                >
                  Modo
                </Label>
                <select
                  id="mode"
                  name="mode"
                  value={config.mode}
                  onChange={handleSelectChange}
                  className="bg-white/70 border-green-300 text-green-800"
                >
                  <option value="single">Individual</option>
                  <option value="multi">Múltiple</option>
                </select>
              </div>
              <div>
                <Label
                  htmlFor="env"
                  className="text-sm font-medium text-green-800"
                >
                  Entorno
                </Label>
                <select
                  id="env"
                  name="env"
                  value={config.env}
                  onChange={handleSelectChange}
                  className="bg-white/70 border-green-300 text-green-800"
                >
                  <option value="local">Local</option>
                  <option value="cloud">Nube</option>
                </select>
              </div>
              <div>
                <Label
                  htmlFor="agents"
                  className="text-sm font-medium text-green-800"
                >
                  Agentes
                </Label>
                <Input
                  id="agents"
                  name="agents"
                  type="number"
                  value={config.agents}
                  onChange={handleInputChange}
                  className="bg-white/70 border-green-300 text-green-800"
                />
              </div>
              <div>
                <Label
                  htmlFor="money"
                  className="text-sm font-medium text-green-800"
                >
                  Dinero
                </Label>
                <Input
                  id="money"
                  name="money"
                  type="number"
                  value={config.money}
                  onChange={handleInputChange}
                  className="bg-white/70 border-green-300 text-green-800"
                />
              </div>
              <div>
                <Label
                  htmlFor="land"
                  className="text-sm font-medium text-green-800"
                >
                  Terreno
                </Label>
                <Input
                  id="land"
                  name="land"
                  type="number"
                  value={config.land}
                  onChange={handleInputChange}
                  className="bg-white/70 border-green-300 text-green-800"
                />
              </div>
              <div>
                <Label
                  htmlFor="personality"
                  className="text-sm font-medium text-green-800"
                >
                  Personalidad
                </Label>
                <select
                  id="personality"
                  name="personality"
                  value={config.personality}
                  onChange={handleSelectChange}
                  className="bg-white/70 border-green-300 text-green-800"
                >
                  <option value="Neutral">Neutral</option>
                  <option value="Happy">Feliz</option>
                  <option value="Sad">Triste</option>
                  <option value="Angry">Enojado</option>
                  <option value="Excited">Emocionado</option>
                </select>
              </div>
              <div>
                <Label
                  htmlFor="tools"
                  className="text-sm font-medium text-green-800"
                >
                  Herramientas
                </Label>
                <Input
                  id="tools"
                  name="tools"
                  type="number"
                  value={config.tools}
                  onChange={handleInputChange}
                  className="bg-white/70 border-green-300 text-green-800"
                />
              </div>
              <div>
                <Label
                  htmlFor="seeds"
                  className="text-sm font-medium text-green-800"
                >
                  Semillas
                </Label>
                <Input
                  id="seeds"
                  name="seeds"
                  type="number"
                  value={config.seeds}
                  onChange={handleInputChange}
                  className="bg-white/70 border-green-300 text-green-800"
                />
              </div>
              <div>
                <Label
                  htmlFor="water"
                  className="text-sm font-medium text-green-800"
                >
                  Agua
                </Label>
                <Input
                  id="water"
                  name="water"
                  type="number"
                  value={config.water}
                  onChange={handleInputChange}
                  className="bg-white/70 border-green-300 text-green-800"
                />
              </div>
              <div>
                <Label
                  htmlFor="irrigation"
                  className="text-sm font-medium text-green-800"
                >
                  Irrigación
                </Label>
                <Input
                  id="irrigation"
                  name="irrigation"
                  type="number"
                  value={config.irrigation}
                  onChange={handleInputChange}
                  className="bg-white/70 border-green-300 text-green-800"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Label
                htmlFor="emotions"
                className="text-sm font-medium text-green-800"
              >
                Habilitar Emociones
              </Label>
            </div>
          </CardContent>
          <CardFooter className="bg-white/30 p-4">
            <Button
              onClick={() => {
                handleStartSimulation();
                updateConfig();
                handleExecuteExe();
              }}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Iniciar Simulación
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
