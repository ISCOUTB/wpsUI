"use client"

import { useState, useEffect, useRef } from "react"

interface LandData {
  name: string
  current_season: string
}

interface AgentData {
  name_agent: string
  lands: LandData[]
}

export function useWebSocket(mapData: any[]) {
  const socketRef = useRef<WebSocket | null>(null)
  const [agentData, setAgentData] = useState<AgentData[]>([])
  const [specificLandNames, setSpecificLandNames] = useState<string[]>([])
  const [specificSeason, setSpecificSeason] = useState<string[]>([])

  useEffect(() => {
    connectWebSocket()
    return () => {
      socketRef.current?.close()
    }
  }, [mapData])

  const connectWebSocket = () => {
    const url = "ws://localhost:8000/wpsViewer"
    socketRef.current = new WebSocket(url)

    socketRef.current.onerror = (event) => {
      console.error("Error en la conexión a la dirección: " + url)
      setTimeout(connectWebSocket, 2000)
    }

    socketRef.current.onopen = (event) => {
      function sendMessage() {
        try {
          socketRef.current?.send("setup")
        } catch (error) {
          console.error(error)
          setTimeout(sendMessage, 2000)
        }
      }
      sendMessage()
    }

    socketRef.current.onmessage = (event) => {
      const prefix = event.data.substring(0, 2)
      const data = event.data.substring(2)
      switch (prefix) {
        case "q=":
          const number = Number.parseInt(data, 10)
          setAgentData(() => {
            const newAgentData = []
            for (let i = 1; i <= number; i++) {
              newAgentData.push({
                name_agent: `MAS_500PeasantFamily${i}`,
                lands: [],
              })
            }
            return newAgentData
          })
          break
      }
    }
  }

  useEffect(() => {
    const connectWebSocket2 = () => {
      const url = "ws://localhost:8000/wpsViewer"
      socketRef.current = new WebSocket(url)

      socketRef.current.onerror = (event) => {
        console.error("Error en la conexión a la dirección: " + url)
        setTimeout(connectWebSocket, 2000)
      }

      socketRef.current.onmessage = (event) => {
        const prefix = event.data.substring(0, 2)
        const data = event.data.substring(2)
        switch (prefix) {
          case "j=":
            try {
              const jsonData = JSON.parse(data)
              const { name, state } = jsonData
              const parsedState = JSON.parse(state)
              if (agentData !== null) {
                const lands_number = parsedState.assignedLands.length
                //console.log(lands_number);
                for (let i = 0; i < agentData.length; i++) {
                  if (agentData[i].name_agent === name) {
                    agentData[i].lands = []
                    for (let j = 0; j < lands_number; j++) {
                      const land_name = parsedState.assignedLands[j].landName
                      //tomar los primeros digitos hasta que encuentre el segundo _
                      const land_name_short = land_name.split("_")[1]
                      agentData[i].lands.push({
                        name: "land_" + land_name_short,
                        current_season: parsedState.assignedLands[j].currentSeason,
                      })
                    }
                  }
                }
              }
            } catch (error) {
              console.error(error)
            }
            break
        }
      }
    }
    connectWebSocket2()

    //repetir cada 5 segundos
    const interval = setInterval(() => {
      const landNames: string[] = []
      const seasonNames: string[] = []
      agentData.forEach((agent) => {
        agent.lands.forEach((land) => {
          landNames.push(land.name)
          seasonNames.push(land.current_season)
        })
      })
      setSpecificLandNames(landNames)
      setSpecificSeason(seasonNames)
    }, 1000)

    return () => clearInterval(interval)
  }, [agentData])

  return { agentData, specificLandNames, specificSeason }
}
