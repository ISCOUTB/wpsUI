import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from "recharts"

interface DistributionAnalysisProps {
  data: number[]
  label: string
  bins?: number
  confidenceInterval?: number
}

export function DistributionAnalysis({ data, label, bins = 10, confidenceInterval = 95 }: DistributionAnalysisProps) {
  // Calculate basic statistics
  const mean = data.reduce((sum, val) => sum + val, 0) / data.length

  const sortedData = [...data].sort((a, b) => a - b)
  const median =
    sortedData.length % 2 === 0
      ? (sortedData[sortedData.length / 2 - 1] + sortedData[sortedData.length / 2]) / 2
      : sortedData[Math.floor(sortedData.length / 2)]

  const squaredDiffs = data.map((val) => Math.pow(val - mean, 2))
  const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / data.length
  const stdDev = Math.sqrt(variance)

  const min = Math.min(...data)
  const max = Math.max(...data)

  // Create histogram data
  const binWidth = (max - min) / bins
  const histogramData = Array.from({ length: bins }, (_, i) => {
    const binStart = min + i * binWidth
    const binEnd = binStart + binWidth
    const count = data.filter((val) => val >= binStart && val < (i === bins - 1 ? binEnd + 0.001 : binEnd)).length

    return {
      bin: `${binStart.toFixed(1)}-${binEnd.toFixed(1)}`,
      count,
      binStart,
      binEnd,
    }
  })

  // Calculate confidence interval
  const zScore = confidenceInterval === 95 ? 1.96 : confidenceInterval === 99 ? 2.576 : 1.645 // 95%, 99%, or 90%
  const ciLower = mean - zScore * (stdDev / Math.sqrt(data.length))
  const ciUpper = mean + zScore * (stdDev / Math.sqrt(data.length))

  // Determine skewness
  const skewness = data.reduce((sum, val) => sum + Math.pow(val - mean, 3), 0) / (data.length * Math.pow(stdDev, 3))
  const skewnessDescription =
    skewness > 0.5 ? "positively skewed" : skewness < -0.5 ? "negatively skewed" : "approximately symmetric"

  // Determine normality (very simplified)
  const kurtosis = data.reduce((sum, val) => sum + Math.pow(val - mean, 4), 0) / (data.length * Math.pow(stdDev, 4)) - 3
  const normalityDescription =
    Math.abs(kurtosis) < 0.5
      ? "approximately normal"
      : kurtosis > 0.5
        ? "more peaked than normal"
        : "flatter than normal"

  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardHeader className="pb-2">
        <CardTitle className="dark:text-white">Distribution of {label}</CardTitle>
        <CardDescription className="dark:text-gray-400">Histogram showing the frequency distribution</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={histogramData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.5} vertical={false} />
              <XAxis
                dataKey="bin"
                stroke="#888"
                angle={-45}
                textAnchor="end"
                height={70}
                label={{
                  value: label,
                  position: "bottom",
                  fill: "#888",
                  offset: 20,
                }}
              />
              <YAxis
                stroke="#888"
                label={{
                  value: "Frequency",
                  angle: -90,
                  position: "left",
                  fill: "#888",
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "1px solid #374151",
                  borderRadius: "6px",
                  color: "#fff",
                }}
                formatter={(value, name) => [value, "Frequency"]}
                labelFormatter={(label) => `Range: ${label}`}
              />
              <Legend />
              <defs>
                <linearGradient id="histogramGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.9} />
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0.6} />
                </linearGradient>
              </defs>
              <Bar
                dataKey="count"
                fill="url(#histogramGradient)"
                radius={[4, 4, 0, 0]}
                barSize={30}
                animationDuration={1500}
                name="Frequency"
              />
              <ReferenceLine
                x={(() => {
                  const meanBin = histogramData.find((bin) => mean >= bin.binStart && mean < bin.binEnd)?.bin
                  return meanBin
                })()}
                stroke="red"
                label={{
                  value: "Mean",
                  position: "top",
                  fill: "red",
                }}
              />
              <ReferenceLine
                x={(() => {
                  const medianBin = histogramData.find((bin) => median >= bin.binStart && median < bin.binEnd)?.bin
                  return medianBin
                })()}
                stroke="blue"
                strokeDasharray="3 3"
                label={{
                  value: "Median",
                  position: "top",
                  fill: "blue",
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-muted/30 p-4 rounded-lg dark:bg-gray-700/30">
            <p className="text-xs text-muted-foreground dark:text-gray-400">Mean</p>
            <p className="text-lg font-medium dark:text-white">{mean.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground mt-1 dark:text-gray-500">Central tendency</p>
          </div>
          <div className="bg-muted/30 p-4 rounded-lg dark:bg-gray-700/30">
            <p className="text-xs text-muted-foreground dark:text-gray-400">Standard Deviation</p>
            <p className="text-lg font-medium dark:text-white">{stdDev.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground mt-1 dark:text-gray-500">Measure of dispersion</p>
          </div>
          <div className="bg-muted/30 p-4 rounded-lg dark:bg-gray-700/30">
            <p className="text-xs text-muted-foreground dark:text-gray-400">
              Confidence Interval ({confidenceInterval}%)
            </p>
            <p className="text-lg font-medium dark:text-white">
              {ciLower.toFixed(2)} - {ciUpper.toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground mt-1 dark:text-gray-500">Range for the true mean</p>
          </div>
        </div>

        <Alert className="dark:bg-gray-700/30 dark:border-gray-600">
          <AlertDescription>
            <ul className="list-disc pl-5 space-y-1 dark:text-gray-300">
              <li>
                The distribution of {label} is {skewnessDescription} (skewness = {skewness.toFixed(2)}).
              </li>
              <li>
                The distribution shape is {normalityDescription} (excess kurtosis = {kurtosis.toFixed(2)}).
              </li>
              <li>
                With {confidenceInterval}% confidence, the true mean of {label} is between {ciLower.toFixed(2)} and{" "}
                {ciUpper.toFixed(2)}.
              </li>
              <li>
                The coefficient of variation is {(stdDev / mean).toFixed(2)}, indicating
                {stdDev / mean > 0.3
                  ? " high variability"
                  : stdDev / mean > 0.1
                    ? " moderate variability"
                    : " low variability"}{" "}
                in the data.
              </li>
            </ul>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}
