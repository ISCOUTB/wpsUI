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
import DarkTheme from "../darktheme";

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
        <h1 className="text-xl font-bold text-foreground">
          Well Prod Simulation
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
                  className="flex items-center py-2 px-3 text-foreground hover:bg-accent hover:text-[#3b82f6] rounded transition-colors"
                >
                  {item.icon}
                  <span className="ml-2">{item.label}</span>
                </a>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                className="bg-popover text-popover-foreground"
              >
                {item.label}
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </nav>
    </div>
  );
};

export default Sidebar;
