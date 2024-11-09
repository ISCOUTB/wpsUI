"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  BarChart,
  Activity,
  Users,
  Calendar,
  Brain,
  Settings,
  Home,
  PieChart,
  Play,
  Pause,
  Square,
} from "lucide-react"
import Image from "next/image"
import dynamic from "next/dynamic"
import "leaflet/dist/leaflet.css"
import { LatLngTuple } from "leaflet"
import CardInfo from "./farmInfoComponents"
import router from "next/router"

export default function MapaSim() {
  const handleConfigRedirect = () => {
    router.push("/pages/confi")
  }

  const [simulationRunning, setSimulationRunning] = useState(false)
  const [simulationPaused, setSimulationPaused] = useState(false)
  const [simulationProgress, setSimulationProgress] = useState(0)
  //const [isHovered, setIsHovered] = useState(false) //Removed isHovered state
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const startSimulation = () => {
    if (simulationPaused) {
      setSimulationPaused(false)
    } else {
      setSimulationProgress(0)
    }
    setSimulationRunning(true)
    intervalRef.current = setInterval(() => {
      setSimulationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(intervalRef.current!)
          setSimulationRunning(false)
          return 100
        }
        return prev + 1
      })
    }, 100)
  }

  const pauseSimulation = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    setSimulationPaused(true)
    setSimulationRunning(false)
  }

  const stopSimulation = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    setSimulationRunning(false)
    setSimulationPaused(false)
    setSimulationProgress(0)
  }

  useEffect(() => {
    if (typeof window !== "undefined" && mapRef.current) {
      import("leaflet").then((L) => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove()
        }

        if (mapRef.current) {
          mapInstanceRef.current = L.map(mapRef.current).setView(
            [9.9558349, -75.3062724],
            14
          )
        }

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "Map data © OpenStreetMap contributors",
        }).addTo(mapInstanceRef.current)

        const loadData = async () => {
          try {
            let response = await fetch("/mediumworld.json")
            let data = await response.json()
            data.forEach(function (fincaData: {
              kind: string
              coordinates: number[][]
              name: string
            }) {
              let fillColor
              switch (fincaData.kind) {
                case "road":
                  fillColor = "SlateGrey"
                  break
                case "water":
                  fillColor = "DarkBlue"
                  break
                case "forest":
                  fillColor = "DarkGreen"
                  break
                default:
                  fillColor = "Wheat"
              }

              let polygonOptions = {
                weight: 0.5,
                fillColor: fillColor,
                fillOpacity: 0.5,
              }

              let latLngs: LatLngTuple[] = fincaData.coordinates.map(
                (coord) => [coord[0], coord[1]] as LatLngTuple
              )

              let polygon = L.polygon(latLngs, polygonOptions)
                .addTo(mapInstanceRef.current)
                .bindTooltip(fincaData.name)
            })
          } catch (err) {
            console.error("Error loading data", err)
          }
        }

        loadData()
      })
    }
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
      }
    }
  }, [])

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-gray-800 shadow-lg">
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4 text-center">
            Social Simulator
          </h1>
          <div className="flex flex-col space-y-2 mb-4">
            <Button
              onClick={startSimulation}
              disabled={simulationRunning && !simulationPaused}
              className="w-full transition-all duration-300 bg-green-600 hover:bg-green-700"
            >
              <Play size={20} className="mr-2" />
              {simulationRunning && !simulationPaused
                ? "Simulation Running"
                : simulationPaused
                ? "Resume Simulation"
                : "Start Simulation"}
            </Button>
            <Button
              onClick={pauseSimulation}
              disabled={!simulationRunning || simulationPaused}
              className="w-full transition-all duration-300 bg-yellow-600 hover:bg-yellow-700"
            >
              <Pause size={20} className="mr-2" />
              Pause Simulation
            </Button>
            <Button
              onClick={stopSimulation}
              disabled={!simulationRunning && !simulationPaused && simulationProgress === 0}
              className="w-full transition-all duration-300 bg-red-600 hover:bg-red-700"
            >
              <Square size={20} className="mr-2" />
              Stop Simulation
            </Button>
          </div>
          <Progress value={simulationProgress} className="w-full bg-gray-700" />
        </div>
        <nav className="mt-8">
          <a
            href="/"
            className="flex items-center py-2 px-4 text-gray-300 hover:bg-gray-700"
          >
            <Home className="mr-2" size={20} />
            Home Page
          </a>
          <a
            href="#"
            className="flex items-center py-2 px-4 text-gray-300 hover:bg-gray-700"
          >
            <PieChart className="mr-2" size={20} />
            Analytics
          </a>
          <a
            href="/pages/confi"
            className="flex items-center py-2 px-4 text-gray-300 hover:bg-gray-700"
          >
            <Settings className="mr-2" size={20} />
            Settings of simulator
          </a>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 p-4 md:p-8 overflow-auto relative">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Card className="bg-gradient-to-br from-blue-600 to-blue-700">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Families
                    </CardTitle>
                    <Users size={20} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">1,284</div>
                    <p className="text-xs text-blue-200">
                      +20% from last month
                    </p>
                  </CardContent>
                </Card>
              </TooltipTrigger>
              <TooltipContent>
                <div className="w-64">
                  <h3 className="font-bold mb-2">Weekly Family Growth</h3>
                  <Image
                    src="/placeholder.svg"
                    alt="Weekly family growth chart"
                    width={200}
                    height={100}
                  />
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Card className="bg-gradient-to-br from-green-600 to-green-700">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Avg. Productivity
                    </CardTitle>
                    <Activity size={20} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">78%</div>
                    <p className="text-xs text-green-200">+5% from last week</p>
                  </CardContent>
                </Card>
              </TooltipTrigger>
              <TooltipContent>
                <div className="w-64">
                  <h3 className="font-bold mb-2">Monthly Productivity</h3>
                  <Image
                    src="/placeholder.svg"
                    alt="Monthly productivity chart"
                    width={200}
                    height={100}
                  />
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Card className="bg-gradient-to-br from-purple-600 to-purple-700">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Well-being Index
                    </CardTitle>
                    <Brain size={20} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">8.2/10</div>
                    <p className="text-xs text-purple-200">
                      Stable from last month
                    </p>
                  </CardContent>
                </Card>
              </TooltipTrigger>
              <TooltipContent>
                <div className="w-64">
                  <h3 className="font-bold mb-2">Well-being Trend</h3>
                  <Image
                    src="/placeholder.svg"
                    alt="Well-being trend chart"
                    width={200}
                    height={100}
                  />
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Simulation Map</CardTitle>
              <CardDescription>
                Geographical representation of the community
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div ref={mapRef} className="h-[400px] rounded-md"></div>
            </CardContent>
          </Card>
          <Card>
            <CardTitle className="p-4 text-2xl font-bold justify-center text-center bg-gradient-to-br from-green-600 to-green-700">
              {" "}
              Agentes Campesinos{" "}
            </CardTitle>
            <CardContent>
              <CardInfo />
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="families">Families</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="emotional">Emotional Reasoning</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Productivity & Well-being Trends</CardTitle>
                <CardDescription>
                  Historical data over the past year
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] bg-gray-700 rounded-md flex items-center justify-center">
                  <BarChart size={100} className="text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="families">
            <Card>
              <CardHeader>
                <CardTitle>Peasant Families</CardTitle>
                <CardDescription>
                  Detailed list of all simulated families
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] bg-gray-700 rounded-md flex items-center justify-center">
                  <Users size={100} className="text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="events">
            <Card>
              <CardHeader>
                <CardTitle>Event Timeline</CardTitle>
                <CardDescription>
                  Chronological view of significant events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] bg-gray-700 rounded-md flex items-center justify-center">
                  <Calendar size={100} className="text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="emotional">
            <Card>
              <CardHeader>
                <CardTitle>Emotional Fluctuation</CardTitle>
                <CardDescription>
                  Average emotional state of families in the community
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] bg-gray-700 rounded-md flex items-center justify-center">
                  <PieChart size={100} className="text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}