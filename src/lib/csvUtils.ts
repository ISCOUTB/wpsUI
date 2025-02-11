import Papa from "papaparse"
import moment from "moment"

export interface CSVData {
  [key: string]: string | number
}

export const fetchCSVData = async (url: string): Promise<CSVData[]> => {
  const response = await fetch(url)
  const csvText = await response.text()
  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      complete: (results) => resolve(results.data as CSVData[]),
      error: (error: any) => reject(error),
    })
  })
}

export const processCSVData = (data: CSVData[], parameter: string) => {
  return data.map((row) => ({
    date: moment(row.internalCurrentDate as string).format("YYYY-MM-DD"),
    [parameter]: Number.parseFloat(row[parameter] as string) || 0,
  }))
}

export const calculateStatistics = (data: CSVData[], parameter: string) => {
  const values = data.map((row) => Number.parseFloat(row[parameter] as string) || 0)
  const avg = values.reduce((acc, val) => acc + val, 0) / values.length
  const max = Math.max(...values)
  const min = Math.min(...values)
  const stdDev = Math.sqrt(values.reduce((acc, val) => acc + Math.pow(val - avg, 2), 0) / values.length)

  return { avg, max, min, stdDev }
}

