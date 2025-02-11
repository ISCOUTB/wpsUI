"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Coins, Calendar, Sprout, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";

interface FarmInfo {
  id: string;
  count: number;
  life: number;
  amount: number;
  date: string;
  farmId: string;
}

export default function FarmInfoComponent() {
  const [farmData, setFarmData] = useState<FarmInfo[]>([]);
  const socketRef = useRef<WebSocket | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCSVData = async () => {
      try {
        const response = await fetch("/wpsSimulator.csv");
        const text = await response.text();
        const rows = text.split("\n").slice(1);
        const parsedData: FarmInfo[] = rows.map((row) => {
          const [id, , life, amount, date, farmId] = row.split(",");
          return {
            id,
            count: 1,
            life: Number.parseFloat(life),
            amount: Number.parseFloat(amount),
            date,
            farmId,
          };
        });
        setFarmData(parsedData);
      } catch (error) {
        console.error("Error fetching CSV data:", error);
        toast({
          title: "Error",
          description: "No se pudo cargar los datos iniciales.",
          variant: "destructive",
        });
      }
    };

    fetchCSVData();
  }, [toast]);

  useEffect(() => {
    const connectWebSocket = () => {
      const url = "ws://localhost:8000/wpsViewer";
      socketRef.current = new WebSocket(url);

      socketRef.current.onopen = () => {
        console.log("WebSocket connected");
        socketRef.current?.send("setup");
      };

      socketRef.current.onmessage = (event) => {
        const prefix = event.data.substring(0, 2);
        const data = event.data.substring(2);

        if (prefix === "j=") {
          try {
            const { name, state } = JSON.parse(data);
            const parsedState = JSON.parse(state);
            setFarmData((prevData) =>
              prevData.map((farm) =>
                farm.id === name
                  ? {
                      ...farm,
                      count: parsedState.tools,
                      life: parsedState.health,
                      amount: parsedState.money,
                      date: parsedState.internalCurrentDate,
                      farmId: parsedState.peasantFamilyLandAlias,
                    }
                  : farm
              )
            );
          } catch (error) {
            console.error("Error parsing WebSocket data:", error);
          }
        }
      };

      socketRef.current.onerror = () => {
        console.error("WebSocket error");
        toast({
          title: "Error de conexión",
          description:
            "No se pudo conectar al servidor de datos en tiempo real.",
          variant: "destructive",
        });
      };

      socketRef.current.onclose = () => {
        console.log("WebSocket closed. Reconnecting...");
        setTimeout(connectWebSocket, 5000);
      };
    };

    connectWebSocket();

    return () => {
      socketRef.current?.close();
    };
  }, []);

  return (
    <ScrollArea className="h-[calc(100vh-4rem)] w-full p-2 sm:p-4">
      <AnimatePresence>
        {farmData.map((info) => (
          <motion.div
            key={info.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="mb-2 sm:mb-4"
          >
            <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white p-3 sm:p-4">
                <CardTitle className="flex items-center justify-between text-sm sm:text-base">
                  <span className="flex items-center gap-2">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                    {info.id}
                  </span>
                  <span className="bg-emerald-700/50 px-2 py-1 rounded text-xs sm:text-sm">
                    {info.count} 👥
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                <div className="flex items-center gap-2 text-red-500 text-sm sm:text-base">
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="font-semibold">{info.life.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-2 text-yellow-600 text-sm sm:text-base">
                  <Coins className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="font-semibold">
                    ${" "}
                    {info.amount.toLocaleString("es-ES", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-blue-500 text-sm sm:text-base">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>{new Date(info.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-green-600 text-sm sm:text-base">
                  <Sprout className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>{info.farmId}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </ScrollArea>
  );
}
