import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import csvParser from "csv-parser";
import moment from "moment"; // 📌 Instalar con npm install moment si no lo tienes

const filePath = path.resolve(process.cwd(), "src/wps/logs/wpsSimulator.csv");

function processCSVData(data: any[], parameter: string) {
  return data.map((item) => {
    let formattedDate = moment(item.internalCurrentDate, "DD/MM/YYYY").format("YYYY-MM-DD");

    console.log("📆 Formateando fecha:", item.internalCurrentDate, "➡", formattedDate); // DEPURACIÓN

    return {
      date: formattedDate !== "Invalid date" ? formattedDate : item.internalCurrentDate, // Usa la original si hay error
      [parameter]: Number(item[parameter]) || 0, // Convertir a número si es posible
    };
  });
}

function calculateStatistics(data: any[], parameter: string) {
  const values = data
    .map((item) => Number(item[parameter]))
    .filter((val) => !isNaN(val)); // ✅ Filtra valores inválidos

  if (values.length === 0) return { avg: 0, max: 0, min: 0, stdDev: 0 };

  const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const variance = values.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance);

  return { avg, max, min, stdDev };
}

export async function GET(req: Request) {
  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "Archivo CSV no encontrado" }, { status: 404 });
  }

  const results: any[] = [];
  const url = new URL(req.url);
  const parameter = url.searchParams.get("parameter");

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (data) => {
        console.log("📄 Fila original del CSV:", data); // ✅ VERIFICA QUÉ DATOS LLEGA DEL CSV
        
        if (data.internalCurrentDate) {
          // Asegúrate de que se está transformando bien la fecha
          const formattedDate = moment(data.internalCurrentDate, "DD/MM/YYYY").format("YYYY-MM-DD");
          console.log("📆 Fecha formateada:", formattedDate);
          data.internalCurrentDate = formattedDate;
        }
      
        results.push(data);
      })
      
      
      .on("end", () => {
        if (!parameter) {
          return resolve(NextResponse.json(results)); // ✅ Retorna todo si no hay parámetro
        }

        const processedData = processCSVData(results, parameter);
        const stats = calculateStatistics(processedData, parameter);

        resolve(NextResponse.json({ data: processedData, stats }));
      })
      .on("error", (error) => 
        reject(NextResponse.json({ error: error.message }, { status: 500 }))
      );
  });
}
