"use client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronLeft } from "lucide-react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts"

interface AgentDetailViewProps {
  agentId: string
  agentData: any
  onBack: () => void
  averageEfficiency: number
}

export function AgentDetailView({
  agentId,
  agentData = {
    status: "Unknown",
    currentActivity: "None",
    efficiency: 0,
    tasksCompleted: 0,
    performanceHistory: [],
    metrics: {},
    analysis: [],
    activities: [],
    activityLog: [],
    interactions: [],
    interactionInsights: [],
  },
  onBack,
  averageEfficiency,
}: AgentDetailViewProps) {
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"]

  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="dark:text-white">Agent #{agentId}</CardTitle>
            <CardDescription className="dark:text-gray-400">
              Detailed agent statistics and behavior analysis
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            className="dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to All Agents
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-muted/40 p-4 rounded-lg dark:bg-gray-700/40">
            <p className="text-sm text-muted-foreground dark:text-gray-400">Status</p>
            <h4 className="text-lg font-medium dark:text-white">{agentData?.status || "Unknown"}</h4>
            <Badge
              className={`mt-1 ${
                agentData?.status === "Active"
                  ? "bg-green-500/20 text-green-500 hover:bg-green-500/30 dark:bg-green-900/20 dark:text-green-400"
                  : agentData?.status === "Idle"
                    ? "bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30 dark:bg-yellow-900/20 dark:text-yellow-400"
                    : "bg-red-500/20 text-red-500 hover:bg-red-500/30 dark:bg-red-900/20 dark:text-red-400"
              }`}
            >
              {agentData?.currentActivity || "Unknown"}
            </Badge>
          </div>
          <div className="bg-muted/40 p-4 rounded-lg dark:bg-gray-700/40">
            <p className="text-sm text-muted-foreground dark:text-gray-400">Efficiency</p>
            <h4 className="text-lg font-medium dark:text-white">{agentData?.efficiency || 0}%</h4>
            <p className="text-xs text-muted-foreground mt-1 dark:text-gray-500">
              {agentData?.efficiency > averageEfficiency
                ? `+${((agentData?.efficiency || 0) - averageEfficiency).toFixed(1)}% above average`
                : agentData?.efficiency < averageEfficiency
                  ? `${((agentData?.efficiency || 0) - averageEfficiency).toFixed(1)}% below average`
                  : "At average"}
            </p>
          </div>
          <div className="bg-muted/40 p-4 rounded-lg dark:bg-gray-700/40">
            <p className="text-sm text-muted-foreground dark:text-gray-400">Tasks Completed</p>
            <h4 className="text-lg font-medium dark:text-white">{agentData?.tasksCompleted || 0}</h4>
            <p className="text-xs text-muted-foreground mt-1 dark:text-gray-500">Last 24 hours</p>
          </div>
        </div>

        <Tabs defaultValue="performance" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6 dark:bg-gray-700 dark:text-gray-300">
            <TabsTrigger
              value="performance"
              className="dark:data-[state=active]:bg-gray-900 dark:data-[state=active]:text-white"
            >
              Performance
            </TabsTrigger>
            <TabsTrigger
              value="activities"
              className="dark:data-[state=active]:bg-gray-900 dark:data-[state=active]:text-white"
            >
              Activities
            </TabsTrigger>
            <TabsTrigger
              value="interactions"
              className="dark:data-[state=active]:bg-gray-900 dark:data-[state=active]:text-white"
            >
              Interactions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="space-y-4">
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={agentData?.performanceHistory || []}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.5} vertical={false} />
                  <XAxis
                    dataKey="day"
                    stroke="#888"
                    label={{
                      value: "Time",
                      position: "bottom",
                      fill: "#888",
                    }}
                  />
                  <YAxis
                    stroke="#888"
                    label={{
                      value: "Performance",
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
                  />
                  <Legend wrapperStyle={{ color: "#ccc" }} />
                  <Line
                    type="monotone"
                    dataKey="efficiency"
                    stroke="#8884d8"
                    name="Efficiency"
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="productivity"
                    stroke="#82ca9d"
                    name="Productivity"
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                  <ReferenceLine
                    y={averageEfficiency}
                    stroke="red"
                    strokeDasharray="3 3"
                    label={{
                      value: "Avg Efficiency",
                      fill: "red",
                      position: "left",
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-muted/30 p-4 rounded-lg dark:bg-gray-700/30">
                <h4 className="text-md font-medium mb-3 dark:text-white">Performance Metrics</h4>
                <div className="space-y-3">
                  {(agentData?.metrics ? Object.entries(agentData.metrics) : []).map(
                    ([key, value]: [string, number]) => (
                      <div key={key}>
                        <div className="flex justify-between items-center">
                          <span className="text-sm dark:text-gray-300">
                            {key.charAt(0).toUpperCase() + key.slice(1)}
                          </span>
                          <span className="text-sm font-medium dark:text-white">{value}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              key === "efficiency"
                                ? "bg-blue-500"
                                : key === "productivity"
                                  ? "bg-green-500"
                                  : key === "happiness"
                                    ? "bg-yellow-500"
                                    : "bg-orange-500"
                            }`}
                            style={{ width: `${value}%` }}
                          ></div>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
              <div className="bg-muted/30 p-4 rounded-lg dark:bg-gray-700/30">
                <h4 className="text-md font-medium mb-3 dark:text-white">Performance Analysis</h4>
                <ScrollArea className="h-[200px] pr-4">
                  <div className="space-y-3">
                    {agentData?.analysis.map((insight: string, index: number) => (
                      <p key={index} className="text-sm dark:text-gray-300">
                        {insight}
                      </p>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="activities" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={agentData?.activities || []}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      innerRadius={60}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {agentData?.activities.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        border: "1px solid #374151",
                        borderRadius: "6px",
                        color: "#fff",
                      }}
                    />
                    <Legend wrapperStyle={{ color: "#ccc" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-muted/30 p-4 rounded-lg dark:bg-gray-700/30">
                <h4 className="text-md font-medium mb-3 dark:text-white">Activity Log</h4>
                <ScrollArea className="h-[280px] pr-4">
                  <div className="space-y-3">
                    {(agentData?.activityLog || []).map((log: any, index: number) => (
                      <div key={index} className="flex items-start">
                        <div className="mr-3 mt-0.5">
                          <div
                            className={`h-2 w-2 rounded-full ${
                              log.type === "work"
                                ? "bg-blue-500"
                                : log.type === "rest"
                                  ? "bg-green-500"
                                  : log.type === "social"
                                    ? "bg-purple-500"
                                    : "bg-yellow-500"
                            }`}
                          ></div>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground dark:text-gray-400">{log.time}</p>
                          <p className="text-sm dark:text-gray-300">{log.activity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="interactions" className="space-y-4">
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={agentData?.interactions || []} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.5} vertical={false} />
                  <XAxis
                    dataKey="name"
                    stroke="#888"
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    label={{
                      value: "Agents",
                      position: "bottom",
                      fill: "#888",
                      offset: 40,
                    }}
                  />
                  <YAxis
                    stroke="#888"
                    label={{
                      value: "Interactions",
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
                  />
                  <Legend wrapperStyle={{ color: "#ccc" }} />
                  <Bar dataKey="positive" name="Positive" fill="#4ade80" />
                  <Bar dataKey="negative" name="Negative" fill="#f87171" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-muted/30 p-4 rounded-lg dark:bg-gray-700/30">
              <h4 className="text-md font-medium mb-3 dark:text-white">Interaction Analysis</h4>
              <div className="space-y-3">
                {(agentData?.interactionInsights || []).map((insight: string, index: number) => (
                  <p key={index} className="text-sm dark:text-gray-300">
                    {insight}
                  </p>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="border-t border-border pt-4 flex justify-between dark:border-gray-700">
        <Button
          variant="outline"
          onClick={onBack}
          className="dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:hover:text-white"
        >
          Back to All Agents
        </Button>
      </CardFooter>
    </Card>
  )
}
