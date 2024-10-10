"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Playfair_Display, Open_Sans } from "next/font/google";
import { useRouter } from "next/navigation";
const playfair = Playfair_Display({ subsets: ["latin"], display: "swap" });
const openSans = Open_Sans({ subsets: ["latin"], display: "swap" });

export default function Index() {
  const [isHovered, setIsHovered] = useState(false);

  const handleHoverStart = useCallback(() => setIsHovered(true), []);
  const handleHoverEnd = useCallback(() => setIsHovered(false), []);

  const router = useRouter();

  const handleConfigRedirect = () => {
    router.push("/pages/confi");
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-300 via-green-200 to-blue-200">
      <div className="text-center p-8">
        <motion.h1
          className={`${playfair.className} text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Explora el Bienestar y Productividad de Familias Campesinas
        </motion.h1>

        <motion.p
          className={`${openSans.className} text-xl md:text-2xl text-gray-700 mb-8`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Configura tu simulación y comienza tu experiencia.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <button
            className={`${openSans.className} bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-full text-xl transition-colors duration-300 ease-in-out`}
            onMouseEnter={handleHoverStart}
            onMouseLeave={handleHoverEnd}
            onClick={handleConfigRedirect}
          >
            Iniciar Simulación
            {isHovered && (
              <motion.span
                className="ml-2 inline-block"
                initial={{ width: 0 }}
                animate={{ width: "auto" }}
                transition={{ duration: 0.3 }}
              >
                →
              </motion.span>
            )}
          </button>
        </motion.div>
      </div>
    </div>
  );
}
