import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RangeChart } from "@/components/charts/rangechart"
import { parameters, type ParameterType } from "@/lib/parameter-config"

interface ParameterChartProps {
  selectedType: ParameterType
  selectedParameter: string
}

export function ParameterChart({ selectedType, selectedParameter }: ParameterChartProps) {
  const parameter = parameters[selectedType].find((p) => p.key === selectedParameter)

  if (!parameter) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>{selectedParameter}</CardTitle>
        <CardDescription>{parameter.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <RangeChart parameter={selectedParameter} color={parameter.color} type={selectedType} />
      </CardContent>
    </Card>
  )
}

