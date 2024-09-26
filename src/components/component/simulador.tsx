"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
import { JSX, SVGProps } from "react";

export default function Simulator() {
  const [showConfig, setShowConfig] = useState(false);

  const handleConfigClick = () => {
    setShowConfig(!showConfig);
  };

  return (
    <div className="flex h-screen">
      <aside className="flex w-64 flex-col bg-blue-700 text-white">
        <div className="flex h-16 items-center justify-center bg-blue-800">
          <Link href="/pages/indez">
            <button className="hover bg-skye-800 flex items-center space-x-2">
              <HomeIcon className="h-6 w-6" />

              <span className="ml-2 text-lg font-semibold">Inicio</span>
            </button>
          </Link>
        </div>
        <nav className="flex flex-col space-y-2 p-4">
          <Button variant="ghost" className="flex items-center space-x-2">
            <UserIcon className="h-5 w-5" />
            <span>Comportamiento de Agentes</span>
          </Button>
          <Button variant="ghost" className="flex items-center space-x-2">
            <BarChartIcon className="h-5 w-5" />
            <span>Reporte de datos</span>
          </Button>
        </nav>
      </aside>
      <main className="bg-white-300 flex-1 p-8">
        <div className="mb-4 flex justify-between">
          <div className="hover:bg-white-700 flex space-x-4">
            <Button className="flex items-center space-x-2 bg-blue-600">
              <PlayIcon className="h-5 w-5" />
              <span>Start</span>
            </Button>
            <Button className="hover-effect flex items-center space-x-2 bg-blue-600">
              <PauseIcon className="h-5 w-5" />
              <span>Pause</span>
            </Button>
            <Button className="hover-effect flex items-center space-x-2 bg-blue-600">
              <CircleStopIcon className="h-5 w-5" />
              <span>Stop</span>
            </Button>
          </div>
          <div className="flex space-x-4">
            <Button variant="outline" onClick={handleConfigClick}>
              <SettingsIcon className="mr-2 h-5 w-5" />
              <span>Configurar Simulador</span>
            </Button>
          </div>
        </div>
        {showConfig && (
          <div className="config-panel rounded-lg bg-gray-100 p-4 shadow-md">
            <h2 className="mb-4 text-xl font-semibold">
              Panel de Configuración
            </h2>
            {/* Aquí puedes agregar el contenido del panel de configuración */}
            <Label htmlFor="config-input">Configuración:</Label>
            <Input
              id="config-input"
              type="text"
              placeholder="Ingrese configuración"
            />
            <Button className="mt-4">Guardar</Button>
          </div>
        )}
        <div className="flex flex-col items-center">
          <div className="h-96 w-3/6 rounded-xl border-gray-200 bg-blue-600 p-6 shadow-md">
            <div className="mb-4 flex justify-between">
              <h2 className="text-2xl font-semibold">Simulador</h2>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function HomeIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 3l10 9h-4v9H6v-9H2l10-9z" />
    </svg>
  );
}

function UserIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function SettingsIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>,
) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function BarChartIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>,
) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor">
      <path d="M5 9h4v12H5zm6-6h4v18h-4zm6 12h4v6h-4z" />
    </svg>
  );
}

function PlayIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function PauseIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 19h4V5H6zm8-14v14h4V5z" />
    </svg>
  );
}

function CircleStopIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>,
) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14h4V8h-4v8z" />
    </svg>
  );
}
