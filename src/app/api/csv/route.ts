import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import csvParser from "csv-parser";
import moment from "moment"; // 📌 Instalar con npm install moment si no lo tienes

const filePath = path.resolve(process.cwd(), "src/wps/logs/wpsSimulator.csv");

interface CsvRecord {
  internalCurrentDate: string;
  Agent: string;
  [key: string]: string;
}

interface ProcessedData {
  date: string;
  [key: string]: string | number;
}

interface Statistics {
  avg: number;
  max: number;
  min: number;
  stdDev: number;
}

/**
 * Reads and parses the CSV file, applying an optional filter
 */
async function readCSV<T>(filterFn?: (data: CsvRecord) => boolean): Promise<T[]> {
  if (!fs.existsSync(filePath)) {
    throw new Error("Archivo CSV no encontrado");
  }

  return new Promise((resolve, reject) => {
    const results: CsvRecord[] = [];

    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (data: CsvRecord) => {
        // Format date if it exists
        if (data.internalCurrentDate) {
          const formattedDate = moment(data.internalCurrentDate, "DD/MM/YYYY").format("YYYY-MM-DD");
          if (formattedDate !== "Invalid date") {
            data.internalCurrentDate = formattedDate;
          }
        }
        
        if (!filterFn || filterFn(data)) {
          results.push(data);
        }
      })
      .on("end", () => resolve(results as unknown as T[]))
      .on("error", (error) => reject(error));
  });
}

/**
 * Processes CSV data for a specific parameter
 */
function processCSVData(data: CsvRecord[], parameter: string): ProcessedData[] {
  return data.map((item) => ({
    date: item.internalCurrentDate,
    [parameter]: Number(item[parameter]) || 0,
  }));
}

/**
 * Calculates statistics for a dataset and parameter
 */
function calculateStatistics(data: ProcessedData[], parameter: string): Statistics {
  const values = data
    .map((item) => Number(item[parameter]))
    .filter((val) => !isNaN(val));

  if (values.length === 0) {
    return { avg: 0, max: 0, min: 0, stdDev: 0 };
  }

  const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const variance = values.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance);

  return { avg, max, min, stdDev };
}

/**
 * Gets the list of unique agents from the CSV
 */
async function getAgents(): Promise<string[]> {
  try {
    const results = await readCSV<CsvRecord>();
    return Array.from(new Set(results.map((item) => item.Agent)));
  } catch (error) {
    throw error;
  }
}

/**
 * Handles GET requests to the API
 */
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const parameter = url.searchParams.get("parameter");
    const agent = url.searchParams.get("agent");

    // Handle agent list request
    if (parameter === "Agent") {
      const agents = await getAgents();
      return NextResponse.json({ data: agents });
    }

    // Read CSV data
    const results = await readCSV<CsvRecord>();
    
    // Return all data if no parameter specified
    if (!parameter) {
      return NextResponse.json(results);
    }

    // Filter by agent if specified
    const filteredResults = agent 
      ? results.filter((item) => item.Agent === agent) 
      : results;

    // Process data and calculate statistics
    const processedData = processCSVData(filteredResults, parameter);
    const stats = calculateStatistics(processedData, parameter);

    return NextResponse.json({ data: processedData, stats });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json({ error: message }, { status: error instanceof Error && error.message.includes("no encontrado") ? 404 : 500 });
  }
}