"use client";

import { useState } from "react";
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

const initialData: FarmInfo[] = [
  {
    id: "MAS_500PeasantFamily1",
    count: 100,
    life: 100,
    amount: 1303.57,
    date: "23/04/2022",
    farmId: "Farm_101_small",
  },
  {
    id: "MAS_501PeasantFamily2",
    count: 150,
    life: 100,
    amount: 1500.0,
    date: "24/04/2022",
    farmId: "Farm_102_medium",
  },
  {
    id: "MAS_502PeasantFamily3",
    count: 80,
    life: 80,
    amount: 1000.25,
    date: "25/04/2022",
    farmId: "Farm_103_large",
  },
];

export default function CardInfo() {
  const [farmData] = useState<FarmInfo[]>(initialData);

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
