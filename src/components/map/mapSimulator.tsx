"use client"

import React from "react"
import { GoogleMap, useJsApiLoader, Polygon } from "@react-google-maps/api"
import { useMapData } from "@/hooks/use-map-data"
import { useWebSocket } from "@/hooks/use-websocket"
import { useMapControls } from "@/hooks/use-map-controls"
import { usePolygonRenderer } from "@/hooks/use-polygon-renderer"

const SimulationMap: React.FC = () => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "AIzaSyAXbjhnWqg-0oLtD2K2LaHpsQzAuYJ0UmE",
  })

  const { mapData, filters, addFilter } = useMapData()
  const {specificLandNames, specificSeason } = useWebSocket(mapData)
  const { mapRef, onLoad: baseOnLoad, onUnmount } = useMapControls()
  const { getPolygonColor } = usePolygonRenderer()

  const onLoad = React.useCallback(
    (map: google.maps.Map) => {
      baseOnLoad(map, mapData)
    },
    [baseOnLoad, mapData],
  )

  const renderPolygons = () => {
    return mapData
      .filter((finca) => filters.length === 0 || filters.includes(finca.kind))
      .map((fincaData, index) => {
        const fillColor = getPolygonColor(fincaData, specificLandNames, specificSeason)
        const paths = fincaData.coordinates.map((coord) => ({
          lat: coord[0],
          lng: coord[1],
        }))

        return (
          <Polygon
            key={index}
            paths={paths}
            options={{
              fillColor: fillColor,
              fillOpacity: 0.7,
              strokeColor: "#000000",
              strokeOpacity: 0.8,
              strokeWeight: 2,
            }}
          />
        )
      })
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const filter = e.dataTransfer.getData("text/plain")
    addFilter(filter)
  }

  return (
    <div
      className="w-full h-full flex justify-center items-center rounded-lg"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={{
            width: "850px",
            height: "400px",
            borderRadius: "30px",
            border: "2px solid #ffff",
          }}
          zoom={14.2}
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
  )
}

export default SimulationMap
