"use client";

import { useEffect, useRef, useState } from "react";
/// <reference types="@types/google.maps" />

export function useMapControls() {
  const mapRef = useRef<google.maps.Map>();
  const [landColor, setLandColor] = useState<string>("#F5DEB3");
  const [specificLandColor, setSpecificLandColor] = useState<string>("#F5DEB3");

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

  const onLoad = (map: google.maps.Map, mapData: any[]) => {
    const bounds = new google.maps.LatLngBounds();
    mapData.forEach((finca) => {
      finca.coordinates.forEach((coord: number[]) => {
        bounds.extend(new google.maps.LatLng(coord[0], coord[1]));
      });
    });
    map.fitBounds(bounds);
    mapRef.current = map;
  };

  const onUnmount = () => {
    mapRef.current = undefined;
  };

  return {
    mapRef,
    landColor,
    specificLandColor,
    onLoad,
    onUnmount,
  };
}
