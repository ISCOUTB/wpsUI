import "./styles/global.css";
import type { Metadata } from "next";
import { Archivo, Inter } from "next/font/google";
import Sidebar from "@/components/Sidebar/sidebar";
import MapSimulator from "@/components/mapSimulator";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
});
export const metadata: Metadata = {
  title: "WellProdSim",
  description:
    "Simulador Social de Productividad y Bienestar para Familias Campesinas",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={archivo.className}>
      <body className="font-archivo"> {children}</body>
    </html>
  );
}
