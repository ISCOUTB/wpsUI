"use client";

import React, { useEffect, useRef, useState } from "react";
import { GoogleMap, useJsApiLoader, Polygon } from "@react-google-maps/api";

interface FincaData {
  kind: string;
  coordinates: number[][];
  name: string;
}

interface AgentData {
  name_agent: string;
  lands: LandData[];
}

interface LandData {
  name: string;
  current_season: string;
}

const SimulationMap: React.FC = () => {
  const mapRef = useRef<google.maps.Map>();
  const socketRef = useRef<WebSocket | null>(null);
  const [agentData, setAgentData] = useState<AgentData[]>([]);
  const [mapData, setMapData] = useState<FincaData[]>([]);
  const [filters, setFilters] = useState<string[]>([]);
  const [landColor, setLandColor] = useState<string>("#F5DEB3");
  const [specificLandColor, setSpecificLandColor] = useState<string>("#F5DEB3");
  const [specificLandNames, setSpecificLandNames] = useState<string[]>([]);
  const [specificSeason, setSpecificSeason] = useState<string[]>([]);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey:
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
      "AIzaSyAXbjhnWqg-0oLtD2K2LaHpsQzAuYJ0UmE",
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch("/mediumworld.json");
        const data: FincaData[] = await response.json();
        setMapData(data);
      } catch (err) {
        console.error("Error loading data", err);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "f") {
        mapRef.current?.setZoom((mapRef.current?.getZoom() || 0) + 1);
      } else if (e.key === "v") {
        mapRef.current?.setZoom((mapRef.current?.getZoom() || 0) - 1);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  useEffect(() => {
    const colors = ["#F5DEB3", "#FFD700", "#FFA500", "#FF4500"];
    const interval = setInterval(() => {
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      setSpecificLandColor(randomColor);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    connectWebSocket();
  }, [mapData]);

  const onLoad = React.useCallback(
    (map: google.maps.Map) => {
      const bounds = new window.google.maps.LatLngBounds();
      mapData.forEach((finca) => {
        finca.coordinates.forEach((coord) => {
          bounds.extend(new google.maps.LatLng(coord[0], coord[1]));
        });
      });
      map.fitBounds(bounds);
      mapRef.current = map;
    },
    [mapData]
  );

  const onUnmount = React.useCallback(() => {
    mapRef.current = undefined;
  }, []);

  const connectWebSocket = () => {
    const url = "ws://localhost:8000/wpsViewer";
    socketRef.current = new WebSocket(url);

    socketRef.current.onerror = function (event) {
      console.error("Error en la conexión a la dirección: " + url);
      setTimeout(connectWebSocket, 2000);
    };

    socketRef.current.onopen = function (event) {
      function sendMessage() {
        try {
          socketRef.current?.send("setup");
        } catch (error) {
          console.error(error);
          setTimeout(sendMessage, 2000);
        }
      }
      sendMessage();
    };

    socketRef.current.onmessage = function (event) {
      let prefix = event.data.substring(0, 2);
      let data = event.data.substring(2);
      switch (prefix) {
        case "q=":
          let number = parseInt(data, 10);
          setAgentData(() => {
            const newAgentData = [];
            for (let i = 1; i <= number; i++) {
              newAgentData.push({
                name_agent: `MAS_500PeasantFamily${i}`,
                lands: [],
              });
            }
            return newAgentData;
          });
          break;
      }
    };
  };

  useEffect(() => {
    const connectWebSocket2 = () => {
      const url = "ws://localhost:8000/wpsViewer";
      socketRef.current = new WebSocket(url);

      socketRef.current.onerror = function (event) {
        console.error("Error en la conexión a la dirección: " + url);
        setTimeout(connectWebSocket, 2000);
      };

      socketRef.current.onmessage = function (event) {
        let prefix = event.data.substring(0, 2);
        let data = event.data.substring(2);
        switch (prefix) {
          case "j=":
            try {
              let jsonData = JSON.parse(data);
              const { name, state } = jsonData;
              const parsedState = JSON.parse(state);
              if (agentData !== null) {
                const lands_number = parsedState.assignedLands.length;
                //console.log(lands_number);
                for (let i = 0; i < agentData.length; i++) {
                  if (agentData[i].name_agent === name) {
                    agentData[i].lands = [];
                    for (let j = 0; j < lands_number; j++) {
                      const land_name = parsedState.assignedLands[j].landName;
                      //tomar los primeros digitos hasta que encuentre el segundo _
                      const land_name_short = land_name.split("_")[1];
                      agentData[i].lands.push({
                        name: "land_" + land_name_short,
                        current_season:
                          parsedState.assignedLands[j].currentSeason,
                      });
                    }
                  }
                }
              }
            } catch (error) {
              console.error(error);
            }
            break;
        }
      };
    };
    connectWebSocket2();

    //repetir cada 5 segundos
    const interval = setInterval(() => {
      const landNames: string[] = [];
      const seasonNames: string[] = [];
      agentData.forEach((agent) => {
        agent.lands.forEach((land) => {
          landNames.push(land.name);
          seasonNames.push(land.current_season);
        });
      });
      setSpecificLandNames(landNames);
      setSpecificSeason(seasonNames);
    }, 1000);
  }, [agentData]);

  const renderPolygons = () => {
    return mapData
      .filter((finca) => filters.length === 0 || filters.includes(finca.kind))
      .map((fincaData, index) => {
        let fillColor;
        if (specificLandNames.includes(fincaData.name)) {
          switch (specificSeason[specificLandNames.indexOf(fincaData.name)]) {
            case "PREPARATION":
              fillColor = "#FFD700"; // Dorado
              break;
            case "PLANTING":
              fillColor = "#FFA500"; // Naranja
              break;
            case "GROWTH":
              fillColor = "#FF4500"; // Rojo
              break;
            case "HARVEST":
              fillColor = "#00FF00"; // Verde brillante
              break;
          }
        } else {
          switch (fincaData.kind) {
            case "road":
              fillColor = "#708090"; // Coral
              break;
            case "water":
              fillColor = "#00B4D8"; // Azul brillante
              break;
            case "forest":
              fillColor = "#4CAF50"; // Verde vibrante
              break;
            case "land":
              fillColor = "#F5DEB3"; // Color por defecto para "land"
              break;
            default:
              fillColor = "#F5DEB3"; // Dorado (para casos no especificados)
          }
        }

        const paths = fincaData.coordinates.map((coord) => ({
          lat: coord[0],
          lng: coord[1],
        }));

        return (
          <Polygon
            key={index}
            paths={paths}
            options={{
              fillColor: fillColor,
              fillOpacity: 0.7, // Ajusta la opacidad si es necesario
              strokeColor: "#000000", // Color del borde
              strokeOpacity: 0.8,
              strokeWeight: 2,
            }}
          />
        );
      });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const filter = e.dataTransfer.getData("text/plain");
    setFilters((prev) => [...prev, filter]);
  };

  return (
    <div
      className="w-full h-full flex justify-center items-center rounded-lg"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={{ width: "850px", height: "400px", borderRadius: "30px", border: "2px solid #ffff" }}
          

          zoom={14}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={{
            draggable: false,
            gestureHandling: "none",
            scrollwheel: false,
            styles: [
              { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
              {
                elementType: "labels.text.stroke",
                stylers: [{ color: "#242f3e" }],
              },
              {
                elementType: "labels.text.fill",
                stylers: [{ color: "#746855" }],
              },
              {
                featureType: "administrative.locality",
                elementType: "labels.text.fill",
                stylers: [{ color: "#d59563" }],
              },
              {
                featureType: "poi",
                elementType: "labels.text.fill",
                stylers: [{ color: "#d59563" }],
              },
              {
                featureType: "poi.park",
                elementType: "geometry",
                stylers: [{ color: "#263c3f" }],
              },
              {
                featureType: "poi.park",
                elementType: "labels.text.fill",
                stylers: [{ color: "#6b9a76" }],
              },
              {
                featureType: "road",
                elementType: "geometry",
                stylers: [{ color: "#38414e" }],
              },
              {
                featureType: "road",
                elementType: "geometry.stroke",
                stylers: [{ color: "#212a37" }],
              },
              {
                featureType: "road",
                elementType: "labels.text.fill",
                stylers: [{ color: "#9ca5b3" }],
              },
              {
                featureType: "road.highway",
                elementType: "geometry",
                stylers: [{ color: "#746855" }],
              },
              {
                featureType: "road.highway",
                elementType: "geometry.stroke",
                stylers: [{ color: "#1f2835" }],
              },
              {
                featureType: "road.highway",
                elementType: "labels.text.fill",
                stylers: [{ color: "#f3d19c" }],
              },
              {
                featureType: "transit",
                elementType: "geometry",
                stylers: [{ color: "#2f3948" }],
              },
              {
                featureType: "transit.station",
                elementType: "labels.text.fill",
                stylers: [{ color: "#d59563" }],
              },
              {
                featureType: "water",
                elementType: "geometry",
                stylers: [{ color: "#17263c" }],
              },
              {
                featureType: "water",
                elementType: "labels.text.fill",
                stylers: [{ color: "#515c6d" }],
              },
              {
                featureType: "water",
                elementType: "labels.text.stroke",
                stylers: [{ color: "#17263c" }],
              },
            ],
          }}
        >
          {renderPolygons()}
        </GoogleMap>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default SimulationMap;
