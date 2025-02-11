import "./styles/global.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Sidebar from "@/components/Sidebar/sidebar";
import MapSimulator from "@/components/mapSimulator";

const inter = Inter({ subsets: ["latin"] });

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
    <html lang="es">
      <body className={inter.className}>
        <main>{children}</main>
      </body>
    </html>
  );
}
