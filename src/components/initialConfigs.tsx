"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
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

const MovingObjects = () => {
  interface MovingObject {
    id: number;
    x: number;
    y: number;
    size: number;
    speed: number;
  }

  const [objects, setObjects] = useState<MovingObject[]>([]);

  useEffect(() => {
    const generateObjects = () => {
      const newObjects: MovingObject[] = [];
      for (let i = 0; i < 50; i++) {
        newObjects.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          size: Math.random() * 5 + 1,
          speed: Math.random() * 2 + 1,
        });
      }
      setObjects(newObjects);
    };

    generateObjects();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setObjects((prevObjects) =>
        prevObjects.map((obj) => ({
          ...obj,
          y: obj.y + obj.speed > window.innerHeight ? 0 : obj.y + obj.speed,
        }))
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {objects.map((object) => (
        <motion.div
          key={object.id}
          className="absolute rounded-full bg-blue-300"
          style={{
            width: object.size,
            height: object.size,
            left: object.x,
            top: object.y,
          }}
          animate={{
            y: object.y + object.speed,
          }}
          transition={{
            duration: 0.05,
            ease: "linear",
            repeat: Infinity,
          }}
        />
      ))}
    </div>
  );
};

export default function WPSInitialConfig() {
  const [config, setConfig] = useState({
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

  function buildArgs(x: Record<string, any>): string[] {
    return Object.entries(x).flatMap(([key, value]) => [
      `-${key}`,
      String(value),
    ]);
  }

  const handleExecuteExe = async () => {
    const args = buildArgs(config);
    const Path = await window.electronAPI.getAppPath();

    const exePath = path.join(Path, "/src/wps/wpsSimulator-1.0.exe");

    console.log("Path:", exePath);

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
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />
      <MovingObjects />
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-4xl relative z-10"
        >
          <Card className="backdrop-blur-md bg-white/10 shadow-xl rounded-xl overflow-hidden border-0">
            <CardHeader className="bg-gray-600 text-white p-4">
              <CardTitle className="text-2xl font-bold text-center">
                WellProdSim Configuración Inicial
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 p-4">
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(config).map(([key, value]) => (
                  <div key={key}>
                    <Label
                      htmlFor={key}
                      className="text-sm font-medium text-gray-200"
                    >
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </Label>
                    {key === "mode" || key === "env" ? (
                      <select
                        id={key}
                        name={key}
                        value={value as string}
                        onChange={handleSelectChange}
                        className="bg-white/10 border-gray-300 text-white w-full rounded-md"
                      >
                        <option value={value as string}>
                          {value as string}
                        </option>
                      </select>
                    ) : (
                      <Input
                        id={key}
                        name={key}
                        type="number"
                        value={value as number}
                        onChange={handleInputChange}
                        className="bg-white/10 border-blue-300 text-white"
                      />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="bg-white/10 p-4">
                <Button
                onClick={() => {
                  handleStartSimulation();
                  handleExecuteExe();
                }}
                className="w-full bg-gradient-to-r from-gray-500 to-gray-700 hover:from-gray-600 hover:to-gray-800 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200"
                >
                Iniciar Simulación
                </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
