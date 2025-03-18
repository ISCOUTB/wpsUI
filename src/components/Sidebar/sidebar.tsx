"use client";

import type React from "react";
import { Home, PieChart, Settings, Mail } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTheme } from "next-themes";
import Image from "next/image";

const Sidebar: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const menuItems = [
    { icon: <Home size={20} />, label: "Home Page", href: "/pages/simulador" },
    {
      icon: <PieChart size={20} />,
      label: "Analytics",
      href: "/pages/analytics",
    },
    { icon: <Settings size={20} />, label: "Settings", href: "/#" },
    { icon: <Mail size={20} />, label: "Contact Us", href: "#" },
  ];

  return (
    <div className="bg-[#171c1f] text-foreground w-88 flex flex-col h-full">
      {/* Encabezado del sidebar */}
      <div className="p-4">
        <h1 className="text-2xl font-clash font-bold bg-[#2664eb] rounded-lg p-4 flex items-center justify-center">
          WellProdSimulator
        </h1>
      </div>

      {/* Menú de ítems */}
      <nav className="flex-1">
        <TooltipProvider>
          {menuItems.map((item, index) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <a
                  href={item.href}
                  className="flex items-center py-2 px-3 text-foreground hover:text-[#2664eb] rounded transition-colors font-clash text-white"
                >
                  {item.icon}
                  <span className="ml-2">{item.label}</span>
                </a>
              </TooltipTrigger>
            </Tooltip>
          ))}
        </TooltipProvider>
      </nav>

      {/* Imagen en la parte inferior */}
      <div className="mt-auto flex justify-center p-4">
        <Image
          src="/UTB.png"
          alt="WellProdSimulator"
          width={300}
          height={200}
          className="object-contain"
        />
      </div>
    </div>
  );
};

export default Sidebar;
