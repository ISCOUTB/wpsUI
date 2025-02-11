"use client";

import type React from "react";
import { useState } from "react";
import {
  Home,
  PieChart,
  Settings,
  ChevronRight,
  ChevronLeft,
  Mail,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTheme } from "next-themes";
import DarkTheme from "../darktheme";

const Sidebar: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { theme, setTheme } = useTheme();

  const toggleSidebar = () => setIsExpanded(!isExpanded);

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
    <div
      className={`bg-background text-foreground transition-all duration-300 ease-in-out ${isExpanded ? "w-48" : "w-12"} flex flex-col h-full`}
    >
      {/* Botón de expansión */}
      <div className="p-2 flex justify-between items-center">
        <button
          onClick={toggleSidebar}
          className="text-foreground hover:text-[#3b82f6] transition-colors"
        >
          {isExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      {/* Menú items */}
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
                  <span
                    className={`ml-2 transition-opacity duration-300 ${isExpanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden"}`}
                  >
                    {item.label}
                  </span>
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

      {/* DarkTheme al final del sidebar */}
      <div className="p-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className="flex items-center py-2 px-3 text-foreground hover:bg-accent hover:text-[#3b82f6] rounded transition-colors cursor-pointer"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                <DarkTheme />
                <span
                  className={`ml-2 transition-opacity duration-300 ${isExpanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden"}`}
                >
                  Dark Theme
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent
              side="right"
              className="bg-popover text-popover-foreground"
            >
              Dark Theme
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default Sidebar;