import Papa from "papaparse";
import moment from "moment";

export interface CSVData {
  [key: string]: string | number;
}
export const fetchCSVData = async (p0: string): Promise<CSVData[]> => {
  const response = (await window.electronAPI.readCsv()) as {
    success: boolean;
    data?: string;
    error?: string;
  };

  if (!response.success) {
    console.error("Error al leer el archivo CSV:", response.error);
    return [];
  }

  return new Promise((resolve, reject) => {
    if (response.data) {
      Papa.parse(response.data, {
        header: true,
        complete: (results) => resolve(results.data as CSVData[]),
        error: (error: any) => reject(error),
      });
    } else {
      reject(new Error("No data to parse"));
    }
  });
};

export const processCSVData = (data: CSVData[], parameter: string) => {
  return data.map((row) => ({
    date: moment(row.internalCurrentDate as string).format("YYYY-MM-DD"),
    [parameter]: Number.parseFloat(row[parameter] as string) || 0,
  }));
};

export const calculateStatistics = (data: CSVData[], parameter: string) => {
  const values = data.map(
    (row) => Number.parseFloat(row[parameter] as string) || 0
  );
  const avg = values.reduce((acc, val) => acc + val, 0) / values.length;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const stdDev = Math.sqrt(
    values.reduce((acc, val) => acc + Math.pow(val - avg, 2), 0) / values.length
  );

  return { avg, max, min, stdDev };
};
