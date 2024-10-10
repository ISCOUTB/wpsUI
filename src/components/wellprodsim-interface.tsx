"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import {
  Play,
  Pause,
  FastForward,
  Rewind,
  Settings,
  BarChart2,
  Users,
  Cloud,
  Sun,
  Droplet,
  Leaf,
  Heart,
  DollarSign,
  Plus,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const mockData = [
  { name: "Día 1", productividad: 4000, bienestar: 2400 },
  { name: "Día 2", productividad: 3000, bienestar: 1398 },
  { name: "Día 3", productividad: 2000, bienestar: 9800 },
  { name: "Día 4", productividad: 2780, bienestar: 3908 },
  { name: "Día 5", productividad: 1890, bienestar: 4800 },
];

const WellprodsimInterface = () => {
  const [isSimulationRunning, setIsSimulationRunning] = useState(false || true);
  const [selectedAgent, setSelectedAgent] = useState<number | null>(null);
  const [activeLayers, setActiveLayers] = useState({
    productividad: true,
    bienestar: true,
    clima: false,
    recursos: false,
  });

  const toggleLayer = (layer: keyof typeof activeLayers) => {
    setActiveLayers((prev) => ({ ...prev, [layer]: !prev[layer] }));
  };

  const router = useRouter();

  const handleConfigRedirect = () => {
    router.push("/pages/confi");
  };
  return (
    <div className="flex h-screen bg-green-50 text-gray-800 p-4">
      {/* Left Sidebar */}
      <div className="w-64 bg-green-100 rounded-lg p-4 mr-4 flex flex-col">
        <h1 className="text-2xl font-bold mb-4 text-green-800">WellProdSim</h1>
        <button
          className={`mb-2 p-2 rounded-md ${
            isSimulationRunning
              ? "bg-yellow-500 hover:bg-yellow-600"
              : "bg-blue-500 hover:bg-blue-600"
          } text-white`}
          onClick={() => setIsSimulationRunning(!isSimulationRunning)}
        >
          {isSimulationRunning ? (
            <Pause className="inline mr-2" />
          ) : (
            <Play className="inline mr-2" />
          )}
          {isSimulationRunning ? "Pausar" : "Iniciar"} Simulación
        </button>
        <div className="flex mb-2">
          <button className="p-2 rounded-l-md bg-gray-500 hover:bg-gray-600 text-white flex-1">
            <Rewind className="inline mr-2" /> Ralentizar
          </button>
          <button className="p-2 rounded-r-md bg-gray-500 hover:bg-gray-600 text-white flex-1">
            <FastForward className="inline mr-2" /> Acelerar
          </button>
        </div>

        <button
          className="mb-2 p-2 rounded-md bg-green-600 hover:bg-green-700 text-white"
          onClick={handleConfigRedirect}
        >
          Configuracion
        </button>
        <button className="mb-2 p-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white">
          <BarChart2 className="inline mr-2" /> Ver Estadísticas
        </button>
        <button className="mb-2 p-2 rounded-md bg-purple-600 hover:bg-purple-700 text-white">
          <Plus className="inline mr-2" /> Crear Evento
        </button>
        <div className="mt-auto">
          <h3 className="font-semibold mb-2">Capas Activas</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(activeLayers).map(([layer, active]) => (
              <button
                key={layer}
                className={`p-1 rounded-md text-xs ${
                  active
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 text-gray-700"
                }`}
                onClick={() => toggleLayer(layer as keyof typeof activeLayers)}
              >
                {active ? (
                  <Eye className="inline mr-1 w-4 h-4" />
                ) : (
                  <EyeOff className="inline mr-1 w-4 h-4" />
                )}
                {layer}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Environment controls */}
        <div className="bg-blue-100 rounded-lg p-4 mb-4 flex justify-between">
          <div className="flex items-center">
            <Sun className="text-yellow-500 mr-2" />
            <input type="range" className="w-32" />
          </div>
          <div className="flex items-center">
            <Cloud className="text-gray-500 mr-2" />
            <input type="range" className="w-32" />
          </div>
          <div className="flex items-center">
            <Droplet className="text-blue-500 mr-2" />
            <input type="range" className="w-32" />
          </div>
        </div>

        {/* Simulation area */}
        <div className="flex-1 bg-green-200 rounded-lg p-4 relative overflow-hidden">
          {/* Farm representation */}
          <div className="absolute inset-4 bg-green-300 rounded-lg"></div>

          {/* Houses */}
          <div className="absolute top-8 left-8 w-32 h-24 bg-yellow-200 rounded-lg"></div>
          <div className="absolute top-8 right-8 w-32 h-24 bg-yellow-200 rounded-lg"></div>

          {/* Fields */}
          <div className="absolute top-40 left-8 right-8 bottom-8 bg-green-400 rounded-lg"></div>

          {/* Agents */}
          <div
            className="absolute top-12 left-48 w-8 h-8 bg-blue-500 rounded-full cursor-pointer flex items-center justify-center"
            onClick={() => setSelectedAgent(1)}
          >
            <Users className="text-white w-5 h-5" />
          </div>
          <div
            className="absolute top-48 left-16 w-8 h-8 bg-red-500 rounded-full cursor-pointer flex items-center justify-center"
            onClick={() => setSelectedAgent(2)}
          >
            <Users className="text-white w-5 h-5" />
          </div>
          <div
            className="absolute top-80 right-16 w-8 h-8 bg-purple-500 rounded-full cursor-pointer flex items-center justify-center"
            onClick={() => setSelectedAgent(3)}
          >
            <Users className="text-white w-5 h-5" />
          </div>

          {/* Layer overlays */}
          {activeLayers.productividad && (
            <div className="absolute inset-4 bg-green-500 opacity-30 rounded-lg"></div>
          )}
          {activeLayers.bienestar && (
            <div className="absolute inset-4 bg-blue-500 opacity-30 rounded-lg"></div>
          )}
          {activeLayers.clima && (
            <div className="absolute inset-4 bg-yellow-500 opacity-30 rounded-lg"></div>
          )}
          {activeLayers.recursos && (
            <div className="absolute inset-4 bg-brown-500 opacity-30 rounded-lg"></div>
          )}

          {/* Agent info popup */}
          {selectedAgent && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-lg shadow-lg">
              <h3 className="font-semibold mb-2">Agente {selectedAgent}</h3>
              <p>Creencia: Optimista</p>
              <p>Deseo: Aumentar producción</p>
              <p>Intención: Plantar nuevos cultivos</p>
              <p>Estado emocional: Entusiasmado</p>
              <button
                className="mt-2 p-1 bg-gray-200 rounded-md"
                onClick={() => setSelectedAgent(null)}
              >
                Cerrar
              </button>
            </div>
          )}
        </div>

        {/* Time and concurrency panel */}
        <div className="bg-blue-100 rounded-lg p-4 mt-4 flex justify-between items-center">
          <div>Día: 5</div>
          <div>Eventos concurrentes: 3</div>
          <div>Velocidad: 1x</div>
        </div>
      </div>

      {/* Right sidebar */}
      <div className="w-80 bg-green-100 rounded-lg p-4 ml-4 flex flex-col">
        <h2 className="text-xl font-semibold mb-4 text-green-800">
          Métricas y Eventos
        </h2>
        <div className="bg-white rounded-lg p-4 mb-4">
          <h3 className="font-semibold mb-2">Métricas Globales</h3>
          <div className="flex justify-between mb-2">
            <span className="flex items-center">
              <Leaf className="text-green-500 mr-1" /> Productividad:
            </span>
            <span>85%</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="flex items-center">
              <Heart className="text-red-500 mr-1" /> Bienestar:
            </span>
            <span>72%</span>
          </div>
          <div className="flex justify-between">
            <span className="flex items-center">
              <DollarSign className="text-yellow-500 mr-1" /> Recursos:
            </span>
            <span>60%</span>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 mb-4 flex-grow">
          <h3 className="font-semibold mb-2">Eventos Recientes</h3>
          <ul className="list-disc list-inside">
            <li>Lluvia inesperada</li>
            <li>Visita del vecino</li>
            <li>Cosecha exitosa</li>
          </ul>
        </div>
        <div className="bg-white rounded-lg p-4">
          <h3 className="font-semibold mb-2">Evolución Temporal</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={mockData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="productividad" stroke="#82ca9d" />
              <Line type="monotone" dataKey="bienestar" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default WellprodsimInterface;
