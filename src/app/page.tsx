import type React from "react";
// import Sidebar from "@/components/Sidebar/sidebar";
import WPSInitialConfig from "@/components/settings/initialConfigs";
import Config from "@/components/settings/simulator-config-page";

export default function Index() {
  return (
    // <div className="flex min-h-screen bg-[#171923] text-white">
      <main className="bg-[#171923]  p-6 overflow-auto]">
        <Config />
      </main>
    // </div>
  );
}
