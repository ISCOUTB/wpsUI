"use client";

import React, { useEffect, useRef, useState } from "react";
import { GoogleMap, useJsApiLoader, Polygon } from "@react-google-maps/api";

interface FincaData {
  kind: string;
  coordinates: number[][];
  name: string;
}

const SimulationMap: React.FC = () => {
  const mapRef = useRef<google.maps.Map>();
  const [mapData, setMapData] = useState<FincaData[]>([]);
  const [filters, setFilters] = useState<string[]>([]);
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
  const renderPolygons = () => {
    return mapData
      .filter((finca) => filters.length === 0 || filters.includes(finca.kind))
      .map((fincaData, index) => {
        let fillColor;
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
          default:
            fillColor = "#F5DEB3"; // Dorado (para casos no especificados)
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
      className="w-full h-full"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "100%" }}
          zoom={14}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={{
            scrollwheel: true,
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
