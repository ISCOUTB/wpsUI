'use client'

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import path from "path"

declare global {
  interface Window {
    electronAPI: {
      executeExe: (File: string, args: string[]) => Promise<string>
      getAppPath: () => Promise<string>
    }
  }
}

const LeafAnimation = () => (
  <motion.div
    className="absolute w-4 h-4 bg-gray-500 rounded-full opacity-50"
    initial={{ x: "-10%", y: "-10%" }}
    animate={{
      x: ["0%", "100%", "0%"],
      y: ["0%", "100%", "0%"],
      rotate: [0, 360],
      scale: [1, 1.5, 1],
    }}
    transition={{
      duration: 20,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "reverse",
    }}
  />
)

const WaterRipple = () => (
  <motion.div
    className="absolute w-16 h-16 border-2 border-gray-400 rounded-full opacity-30"
    initial={{ scale: 0, opacity: 0.7 }}
    animate={{ scale: 2, opacity: 0 }}
    transition={{
      duration: 4,
      ease: "easeOut",
      repeat: Infinity,
    }}
  />
)

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
  })

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
  })

  const router = useRouter()

  const updateConfig = () => {
    if (config.personality == "Neutral") {
      configupdated.personality = 0.0
    }

    if (config.emotions == true) {
      configupdated.emotions = 1
    }
  }

  function buildArgs(x: Record<string, any>): string[] {
    return Object.entries(x).flatMap(([key, value]) => [`-${key}`, String(value)])
  }

  const handleExecuteExe = async () => {
    const args = buildArgs(configupdated)
    const Path = await window.electronAPI.getAppPath()

    const exePath = path.join(Path, "/src/wps/wpsSimulator-1.0.exe")

    console.log("Path:", exePath)

    console.log(args)
    try {
      const result = await window.electronAPI.executeExe(exePath, args)
      console.log("Execution result:", result)
    } catch (error) {
      console.error("Error executing command:", error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target
    setConfig((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }))
  }

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target
    setConfig((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleStartSimulation = () => {
    console.log("Starting simulation with config:", config)
    router.push("/pages/simulador")
  }

  const inputVariants = {
    focus: { scale: 1.05, transition: { type: "spring", stiffness: 300, damping: 10 } },
    blur: { scale: 1, transition: { type: "spring", stiffness: 300, damping: 20 } },
  }

  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden relative bg-gradient-to-br from-gray-800 to-gray-900">
      <AnimatePresence>
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="absolute"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          >
            <LeafAnimation />
          </motion.div>
        ))}
      </AnimatePresence>
      <WaterRipple />
      <WaterRipple />
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-4xl relative z-10"
      >
        <Card className="backdrop-blur-md bg-gray-800 shadow-xl rounded-xl overflow-hidden">
          <CardHeader className="bg-gray-700 p-4">
            <CardTitle className="text-2xl font-bold text-center text-white">WellProdSim Configuración Inicial</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 p-4 bg-gray-700">
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(config).map(([key, value]) => (
                <motion.div key={key} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Label htmlFor={key} className="text-sm font-medium text-white mb-1 block">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </Label>
                  {typeof value === "boolean" ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={key}
                        name={key}
                        checked={value}
                        onChange={(e) => setConfig((prev) => ({ ...prev, [key]: e.target.checked }))}
                        className="bg-gray-600 border-gray-500 text-white rounded"
                      />
                      <span className="text-white">{value ? "Enabled" : "Disabled"}</span>
                    </div>
                  ) : key === "personality" ? (
                    <select
                      id={key}
                      name={key}
                      value={value as string}
                      onChange={handleSelectChange}
                      className="bg-gray-600 border-gray-500 text-white w-full mt-1 rounded-md p-2"
                    >
                      <option value="Neutral">Neutral</option>
                      <option value="Happy">Feliz</option>
                      <option value="Sad">Triste</option>
                      <option value="Angry">Enojado</option>
                      <option value="Excited">Emocionado</option>
                    </select>
                  ) : (
                    <motion.div variants={inputVariants} whileHover="focus" whileTap="blur">
                      <Input
                        id={key}
                        name={key}
                        type={typeof value === "number" ? "number" : "text"}
                        value={value}
                        onChange={handleInputChange}
                        className="bg-gray-600 border-gray-500 text-white"
                      />
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="bg-gray-700 p-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full"
            >
              <Button
                onClick={() => {
                  handleStartSimulation()
                  updateConfig()
                  handleExecuteExe()
                }}
                className="w-full bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300"
              >
                Iniciar Simulación
              </Button>
            </motion.div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
