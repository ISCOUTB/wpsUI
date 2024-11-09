"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import { Konkhmer_Sleokchher, Inter } from "next/font/google";
import { useRouter } from "next/navigation";

const konkhmerSleokchher = Konkhmer_Sleokchher({
  subsets: ["latin"],
  weight: "400",
});
const inter = Inter({ subsets: ["latin"] });

const Particles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: Math.random(),
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: [0.1, 0.5, 0.1],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};

export default function LandingPage() {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);

  const handleButtonClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      router.push("/pages/confi");
    }, 2000); // Simula una carga de 2 segundos
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div
      className={`h-screen flex items-center justify-center overflow-hidden relative ${inter.className}`}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-[#1F2937] to-[#374151]"
        style={{ y }}
      />
      <Particles />

      <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center justify-between relative z-10">
        <div className="lg:w-1/2 text-center lg:text-left mb-8 lg:mb-0">
          <motion.h1
            className={`text-4xl lg:text-5xl font-serif font-bold mb-4 text-white ${konkhmerSleokchher.className}`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Explora el Bienestar y Productividad de Familias Campesinas
          </motion.h1>
          <motion.p
            className="text-xl lg:text-2xl mb-8 text-gray-300"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Comienza tu simulación configurando los parámetros iniciales
          </motion.p>

          <motion.button
            className="bg-gradient-to-r from-green-500 to-green-700 text-white text-lg font-bold py-3 px-8 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ease-in-out"
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 15px rgba(0,255,0,0.5)",
            }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            onClick={handleButtonClick}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <>
                Iniciar Simulación
                <motion.div
                  className="ml-2"
                  animate={{ x: isHovered ? 5 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ArrowRight size={24} />
                </motion.div>
              </>
            )}
          </motion.button>
        </div>

        <motion.div
          className="lg:w-1/2 relative"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative w-full h-[400px] lg:h-[600px]">
            <Image
              src="/maiz.png?height=600&width=600"
              alt="Familia campesina en entorno rural"
              layout="fill"
              objectFit="cover"
              className="rounded-lg shadow-2xl"
              priority
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
