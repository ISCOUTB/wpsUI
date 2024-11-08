"use client";

import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Heart, Coins, Calendar, Sprout, Users } from "lucide-react";
import { motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FarmInfo {
  id: string;
  count: number;
  life: number;
  amount: number;
  date: string;
  farmId: string;
}

const initialData: FarmInfo[] = [];

export default function CardInfo() {
  const socketRef = useRef<WebSocket | null>(null);
  const [farmData, setFarmData] = useState<FarmInfo[]>(initialData);

  const connectWebSocket = () => {
    const url = "ws://localhost:8000/wpsViewer";
    socketRef.current = new WebSocket(url);

    socketRef.current.onerror = function (event) {
      console.error("Error en la conexión a la dirección: " + url);
      setTimeout(connectWebSocket, 2000);
    };

    socketRef.current.onopen = function (event) {
      function sendMessage() {
        try {
          socketRef.current?.send("setup");
        } catch (error) {
          console.error(error);
          setTimeout(sendMessage, 2000);
        }
      }
      sendMessage();
    };

    socketRef.current.onmessage = function (event) {
      let prefix = event.data.substring(0, 2);
      let data = event.data.substring(2);
      switch (prefix) {
        case "j=":
          try {
            let jsonData = JSON.parse(data);
            const { name, state } = jsonData;
            const parsedState = JSON.parse(state);

            setFarmData((prevFarmData) =>
              prevFarmData.map((farm) =>
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
            console.error(error);
          }
          break;
        case "q=":
          console.log(data);
          let number = parseInt(data, 10);
          setFarmData(() => {
            const newFarmData = [];
            for (let i = 1; i <= number; i++) {
              newFarmData.push({
                id: `MAS_500PeasantFamily${i}`,
                count: 0,
                life: 0,
                amount: 0,
                date: "",
                farmId: "",
              });
            }
            return newFarmData;
          });
          break;
      }
    };
  };

  useEffect(() => {
    if (window.WebSocket) {
      connectWebSocket();
    }

    return () => {
      socketRef.current?.close();
    };
  }, []);

  return (
    <ScrollArea className="h-[400px] w-full">
      <div className="space-y-3 p-3">
        {farmData.map((info) => (
          <motion.div
            key={info.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-md overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span className="font-semibold flex-1">{info.id}</span>
                  <span className="bg-emerald-500/50 px-2 py-0.5 rounded text-sm">
                    {info.count} 👥
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  <span className="font-mono">{info.life}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4" />
                  <span className="font-mono">
                    ${" "}
                    {info.amount.toLocaleString("es-ES", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{info.date}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Sprout className="w-4 h-4" />
                  <span>{info.farmId}</span>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </ScrollArea>
  );
}
