"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Coins, Calendar, Sprout, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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

export default function FarmInfoComponent() {
  const socketRef = useRef<WebSocket | null>(null);
  const [farmData, setFarmData] = useState<FarmInfo[]>(initialData);

  const connectWebSocket = () => {
    const url = "ws://localhost:8000/wpsViewer";
    socketRef.current = new WebSocket(url);

    socketRef.current.onerror = function (event) {
      setTimeout(connectWebSocket, 2000);
    };

    socketRef.current.onopen = function (event) {
      function sendMessage() {
        try {
          socketRef.current?.send("setup");
        } catch (error) {
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
          } catch (error) {}
          break;
        case "q=":
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
        case "d=":
          const date = data;
          setFarmData((prevFarmData) =>
            prevFarmData.map((farm) => ({
              ...farm,
              date: date,
            }))
          );
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
                  <span>{info.date}</span>
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
