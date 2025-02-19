// "use client";

// import type React from "react";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import Image from "next/image";
// import { Button } from "../ui/button";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardFooter,
// } from "../ui/card";
// import { Label } from "../ui/label";
// import { Input } from "../ui/input";
// import path from "path";
// import styles from "../settings/settings.module.css";
// import InfoDropdowns from "./info-dropdowns";
// // import Sidebar from "@/components/Sidebar/sidebar";

// declare global {
//   interface Window {
//     electronAPI: {
//       executeExe: (File: string, args: string[]) => Promise<string>;
//       getAppPath: () => Promise<string>;
//     };
//   }
// }

// export default function WPSInitialConfig() {
//   const [config, setConfig] = useState({
//     mode: "single", // Se pasa por defecto pero no se muestra en el formulario
//     env: "local", // Se pasa por defecto pero no se muestra en el formulario
//     agents: 2,
//     money: 750000,
//     land: 2,
//     personality: 0.0,
//     tools: 20,
//     seeds: 50,
//     water: 0,
//     irrigation: 0,
//     emotions: 0,
//     years: 3,
//   });

//   const router = useRouter();

//   function buildArgs(x: Record<string, any>): string[] {
//     return Object.entries(x).flatMap(([key, value]) => [
//       `-${key}`,
//       String(value),
//     ]);
//   }

//   const handleExecuteExe = async () => {
//     const args = buildArgs(config);
//     const Path = await window.electronAPI.getAppPath();
  
//     const exePath = path.join(Path, "/src/wps/wpsSimulator-1.0.exe");
  
//     console.log("Path:", exePath);
//     console.log(args);
  
//     try {
//       const result = await window.electronAPI.executeExe(exePath, args);
//       console.log("Execution result:", result);
//     } catch (error) {
//       console.error("Error executing command:", error);
//       if (error.message.includes("Unrecognized option")) {
//         console.error("Please check the parameter names and values.");
//       }
//     }
//   };
//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value, type } = e.target;
//     setConfig((prev) => ({
//       ...prev,
//       [name]: type === "number" ? Number(value) : value,
//     }));
//   };

//   const handleStartSimulation = () => {
//     console.log("Starting simulation with config:", config);
//     router.push("/pages/simulador");
//   };

//   return (
//     <div className="min-h-screen flex  overflow-hidden relative">
//       {/* <Sidebar /> */}

//       <div className="w-full max-w-6xl relative z-10">
//         <div className={styles.container}>
//           <Card className="shadow-xl rounded-xl overflow-hidden border-0">
//             <CardHeader className="bg-[#4361EE] text-white p-4">
//               {" "}
//               {/*#263abd */}
//               <CardTitle className="text-2xl text-center">
//                 WellProdSim Configuración Inicial
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="grid gap-4 p-4">
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {Object.entries(config)
//                   .filter(([key]) => key !== "mode" && key !== "env") // Filtrar mode y env
//                   .map(([key, value]) => (
//                     <div key={key} className={styles.inputGroup}>
//                       <Label
//                         htmlFor={key}
//                         className="text-sm font-medium text-black flex items-center Wix-Madefor-Display "
//                       >
//                         {key.charAt(0).toUpperCase() + key.slice(1)}
//                       </Label>
//                       <Input
//                         id={key}
//                         name={key}
//                         type="number"
//                         value={value as number}
//                         onChange={handleInputChange}
//                         className={styles.input}
//                       />
//                     </div>
//                   ))}
//               </div>
//             </CardContent>
//             <CardFooter className="bg-dark p-4 flex justify-center">
//               <Button
//                 onClick={() => {
//                   handleStartSimulation();
//                   handleExecuteExe();
//                 }}
//                 className="bg-[#4361EE] hover:brightness-110 text-gray-200 font-bold py-2 px-4 rounded-lg transition-all duration-200"
//               >
//                 Iniciar Simulación
//               </Button>
//             </CardFooter>
//           </Card>

//           <InfoDropdowns />
//         </div>
//       </div>
//     </div>
//   );
// }
