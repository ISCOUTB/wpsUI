"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import styles from "./info-dropdowns.module.css"
import Image from "next/image"

const fieldDescriptions = {
  agents: "Número de agentes (agricultores) en la simulación",
  money: "Capital inicial disponible para inversiones",
  land: "Hectáreas de tierra disponibles para cultivo",
  personality: "Factor de variabilidad en la toma de decisiones de los agentes",
  tools: "Cantidad de herramientas y equipos agrícolas disponibles",
  seeds: "Cantidad de semillas disponibles para la siembra",
  water: "Disponibilidad de agua para riego (en unidades arbitrarias)",
  irrigation: "Nivel de infraestructura de riego (0-100)",
  emotions: "Factor de influencia emocional en las decisiones de los agentes",
  years: "Duración de la simulación en años",
}

export default function InfoDropdowns() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  const toggleDropdown = (key: string) => {
    setOpenDropdown(openDropdown === key ? null : key)
  }

  return (
    <div className={styles.dropdowns}>
      {Object.entries(fieldDescriptions).map(([key, description]) => (
        <div key={key} className={styles.dropdown}>

          <button className={styles.dropdownToggle} onClick={() => toggleDropdown(key)}>
            {key.charAt(0).toUpperCase() + key.slice(1)}
            {openDropdown === key ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          {openDropdown === key && <div className={styles.dropdownContent}>{description}</div>}
         
        </div>
        
      ))}
      
    </div>
    
  )
}

