import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function GET() {
  const filePath = path.join(process.cwd(), "src/wps/logs/wpsSimulator.csv");
  const timeout = 5000; // tiempo máximo en ms para esperar
  const interval = 100; // intervalo de espera en ms
  const startTime = Date.now();

  try {
    // Espera hasta que el archivo exista o se agote el timeout
    while (true) {
      try {
        await fs.access(filePath);
        break; // El archivo existe, sal del bucle
      } catch {
        // Si el archivo no existe, esperar un poco
        if (Date.now() - startTime > timeout) {
          throw new Error("CSV file did not appear in time");
        }
        await new Promise((resolve) => setTimeout(resolve, interval));
      }
    }

    // Una vez que se confirma que el archivo existe, se lee su contenido
    const fileContent = await fs.readFile(filePath, "utf-8");
    return new NextResponse(fileContent, {
      status: 200,
      headers: { "Content-Type": "text/csv" },
    });
  } catch (error) {
    console.error("Error reading CSV file:", error);
    return new NextResponse(JSON.stringify({ error: "CSV file not found" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
