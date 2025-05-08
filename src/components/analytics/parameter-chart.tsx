import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RangeChart } from "@/components/charts/rangechart"
import { parameters, type ParameterType } from "@/lib/parameter-config"

// Definir un valor predeterminado para ALL_AGENTS si no está importado
const ALL_AGENTS = "ALL_AGENTS";

interface ParameterChartProps {
  selectedType: ParameterType
  selectedParameter: string
  selectedAgent: string
}

export function ParameterChart({ selectedType, selectedParameter, selectedAgent }: ParameterChartProps) {
  const parameter = parameters[selectedType].find((p) => p.key === selectedParameter)

  if (!parameter) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>{selectedParameter}</CardTitle>
        <CardDescription>{parameter.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <RangeChart
          parameter={selectedParameter}
          color={parameter.color}
          type={selectedType}
          agent={selectedAgent === ALL_AGENTS ? null : selectedAgent}
        />
      </CardContent>
    </Card>
  )
}

