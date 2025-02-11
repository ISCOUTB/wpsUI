"use client"

import type React from "react"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, PieChart } from "lucide-react"
import { AreaSombra } from "../areaSombra"
import { RangeChart } from "../rangechart"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const parameters = {
  boolean: [
    { key: "currentActivity", color: "#FF6B6B" },
    { key: "haveEmotions", color: "#4ECDC4" },
  ],
  integer: [
    { key: "health", color: "#45B7D1" },
    { key: "currentSeason", color: "#F7B731" },
    { key: "robberyAccount", color: "#5D9CEC" },
    { key: "currentDay", color: "#AC92EC" },
    { key: "toPay", color: "#EC87C0" },
    { key: "peasantFamilyMinimalVital", color: "#5D9CEC" },
    { key: "loanAmountToPay", color: "#48CFAD" },
    { key: "tools", color: "#A0D468" },
    { key: "seeds", color: "#ED5565" },
    { key: "pesticidesAvailable", color: "#FC6E51" },
    { key: "HarvestedWeight", color: "#FFCE54" },
    { key: "totalHarvestedWeight", color: "#CCD1D9" },
    { key: "daysToWorkForOther", color: "#4FC1E9" },
    { key: "Emotion", color: "#37BC9B" },
  ],
  float: [
    { key: "HappinessSadness", color: "#DA4453" },
    { key: "HopefulUncertainty", color: "#967ADC" },
    { key: "SecureInsecure", color: "#D770AD" },
    { key: "money", color: "#656D78" },
    { key: "peasantFamilyAffinity", color: "#AAB2BD" },
    { key: "peasantLeisureAffinity", color: "#E9573F" },
    { key: "peasantFriendsAffinity", color: "#8CC152" },
    { key: "waterAvailable", color: "#5D9CEC" },
  ],
  string: [
    { key: "Timestamp", color: "#A0D468" },
    { key: "purpose", color: "#4FC1E9" },
    { key: "currentPeasantLeisureType", color: "#FC6E51" },
    { key: "currentResourceNeededType", color: "#48CFAD" },
    { key: "internalCurrentDate", color: "#AC92EC" },
    { key: "peasantKind", color: "#ED5565" },
    { key: "peasantFamilyLandAlias", color: "#FFCE54" },
    { key: "farm", color: "#EC87C0" },
    { key: "contractor", color: "#5D9CEC" },
    { key: "Agent", color: "#A0D468" },
    { key: "peasantFamilyHelper", color: "#FC6E51" },
  ],
}

const TabContent: React.FC = () => {
  const [selectedParameter, setSelectedParameter] = useState(parameters.boolean[0].key)
  const [selectedType, setSelectedType] = useState("boolean")

  const handleTypeChange = (type: string) => {
    setSelectedType(type)
    setSelectedParameter(parameters[type as keyof typeof parameters][0].key)
  }

  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-card rounded-full p-1">
        <TabsTrigger
          value="overview"
          className="rounded-full text-card-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
        >
          Overview
        </TabsTrigger>
        <TabsTrigger
          value="families"
          className="rounded-full text-card-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
        >
          Families
        </TabsTrigger>
        <TabsTrigger
          value="events"
          className="rounded-full text-card-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
        >
          Events
        </TabsTrigger>
        <TabsTrigger
          value="emotional"
          className="rounded-full text-card-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
        >
          Emotional Reasoning
        </TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <div className="grid gap-4 md:grid-cols-1">
          <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">CSV Data Visualization</h1>
            <div className="mb-4 flex space-x-4">
              <Select onValueChange={handleTypeChange} value={selectedType}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Parameter Types</SelectLabel>
                    <SelectItem value="boolean">Boolean</SelectItem>
                    <SelectItem value="integer">Integer</SelectItem>
                    <SelectItem value="float">Float</SelectItem>
                    <SelectItem value="string">String</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Select onValueChange={setSelectedParameter} value={selectedParameter}>
                <SelectTrigger className="w-[280px]">
                  <SelectValue placeholder="Select a parameter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Parameters</SelectLabel>
                    {parameters[selectedType as keyof typeof parameters].map((param) => (
                      <SelectItem key={param.key} value={param.key}>
                        <div className="flex items-center">
                          <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: param.color }}></div>
                          {param.key}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <RangeChart
              parameter={selectedParameter}
              color={
                parameters[selectedType as keyof typeof parameters].find((p) => p.key === selectedParameter)?.color ||
                "#000000"
              }
              type={selectedType}
            />
          </div>
          <AreaSombra
            rutaCsv="/wpsSimulator.csv"
            colLabel="Agent"
            colValue1="money"
            titulo="Emociones vs Tiempo de simulacion"
            descripcion="Distribucion de las emociones en el tiempo de simulación"
          />
        </div>
      </TabsContent>
      <TabsContent value="families">
        <Card className="bg-card text-card-foreground rounded-3xl">
          <CardHeader>
            <CardTitle>Peasant Families</CardTitle>
            <CardDescription>Detailed list of all simulated families</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] bg-accent rounded-2xl flex items-center justify-center">
              <Users size={100} className="text-accent-foreground" />
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="events">
        <Card className="bg-card text-card-foreground rounded-3xl">
          <CardHeader>
            <CardTitle>Event Timeline</CardTitle>
            <CardDescription>Chronological view of significant events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] bg-accent rounded-2xl flex items-center justify-center">
              <Calendar size={100} className="text-accent-foreground" />
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="emotional">
        <Card className="bg-card text-card-foreground rounded-3xl">
          <CardHeader>
            <CardTitle>Emotional Fluctuation</CardTitle>
            <CardDescription>Average emotional state of families in the community</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] bg-accent rounded-2xl flex items-center justify-center">
              <PieChart size={100} className="text-accent-foreground" />
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

export default TabContent

