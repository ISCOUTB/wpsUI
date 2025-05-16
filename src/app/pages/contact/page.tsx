import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import DeveloperGrid from "@/Team/developergrid";

const TeamSection = ({
  backHref = "/pages/simulador",
}: {
  backHref?: string;
}) => {
  return (
    <>
      <section className="w-full bg-[#0F1417] py-12 sm:py-16 px-4 sm:px-6 lg:px-8 relative">
        {/* Back Button */}
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10">
          <Link href={backHref}>
            <button
              className="flex items-center justify-center p-2 rounded-full bg-[#171C1F] hover:bg-[#232A2F] transition-colors duration-200"
              aria-label="Go back"
            >
              <ChevronLeft className="w-5 h-5 text-[#DFE3E7]" />
            </button>
          </Link>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-[#DFE3E7] font-clash font-semibold text-2xl sm:text-3xl md:text-4xl mb-3 sm:mb-4">
              Simular no es prever: es construir posibilidades para todos
            </h2>
            <p className="text-gray-400 font-archivo text-sm sm:text-base max-w-2xl mx-auto">
              Somos el equipo detrás de WellProdSimulator, comprometidos con el
              desarrollo de herramientas que modelan el bienestar social.
              Creemos en el poder del conocimiento compartido y en la simulación
              como medio para entender y mejorar nuestro entorno. Si tienes
              dudas, ideas o propuestas, no dudes en contactarnos. Juntos
              podemos construir escenarios más justos y sostenibles para el
              futuro.
            </p>
          </div>

          <DeveloperGrid />
        </div>
      </section>
    </>
  );
};

export default TeamSection;
