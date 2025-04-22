"use client"

import { useState, useEffect } from "react"

interface FincaData {
  kind: string
  coordinates: number[][]
  name: string
}

export function useMapData() {
  const [mapData, setMapData] = useState<FincaData[]>([])
  const [filters, setFilters] = useState<string[]>([])

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch("/mediumworld.json")
        const data: FincaData[] = await response.json()
        setMapData(data)
      } catch (err) {
        console.error("Error loading data", err)
      }
    }

    loadData()
  }, [])

  const addFilter = (filter: string) => {
    setFilters((prev) => [...prev, filter])
  }

  return { mapData, filters, addFilter }
}
