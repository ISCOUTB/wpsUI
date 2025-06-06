"use client"
import { useEffect } from "react";
import { toast } from "@/components/ui/use-toast";

export function SimulationToastListener() {
  useEffect(() => {
    const handler = () => {
      toast({
        variant: "default",
        title: "Simulation Finished",
        description:
          "Simulation has ended. Now you can review the results or restart the simulation.",
      });
    };
    if (window.electronAPI && window.electronAPI.on) {
      window.electronAPI.on("simulation-ended", handler);
    }
    return () => {
      if (window.electronAPI && window.electronAPI.removeListener) {
        window.electronAPI.removeListener("simulation-ended", handler);
      }
    };
  }, []);
  return null;
}
