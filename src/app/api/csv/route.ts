import { NextResponse } from "next/server";
import Papa from "papaparse";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const parameter = url.searchParams.get("parameter");

  if (!parameter || parameter.trim() === "") {
    return NextResponse.json(
      { error: "El parámetro 'parameter' es obligatorio." },
      { status: 400 }
    );
  }

  try {
    // Usar la función de Electron para leer el archivo CSV
    const response = await window.electronAPI.readCsv();
    if (!response.success || !response.data) {
      throw new Error(response.error || "Error al leer el archivo CSV");
    }

    const parsedData = Papa.parse(response.data, { header: true }).data;

    const filteredData = parsedData.map((row: any) => ({
      date: row.internalCurrentDate,
      value: parseFloat(row[parameter]) || 0,
    }));

    const values = filteredData.map((item: any) => item.value);
    const avg = values.reduce((sum, v) => sum + v, 0) / values.length || 0;
    const max = Math.max(...values);
    const min = Math.min(...values);
    const stdDev =
      Math.sqrt(
        values.reduce((sum, v) => sum + Math.pow(v - avg, 2), 0) / values.length
      ) || 0;

    return NextResponse.json({
      data: filteredData,
      stats: { avg, max, min, stdDev },
    });
  } catch (error) {
    console.error("Error al leer el archivo CSV:", error);
    return NextResponse.json(
      { error: "No se pudo procesar el archivo CSV." },
      { status: 500 }
    );
  }
}