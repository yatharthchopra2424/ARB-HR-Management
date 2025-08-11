"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Edit2, Save, X } from "lucide-react"

interface TrainingData {
  month: string
  planned: number
  done: number
  pending: number
}

interface TrainingChartProps {
  data?: TrainingData[]
  onUpdateTrainingData?: (data: TrainingData[]) => void
}

export function TrainingChart({ data, onUpdateTrainingData }: TrainingChartProps) {
  const [isEditingData, setIsEditingData] = useState(false)
  const [editedData, setEditedData] = useState<TrainingData[]>([])

  // Default training data if not provided
  const defaultData: TrainingData[] = [
    { month: "Jan", planned: 12, done: 8, pending: 4 },
    { month: "Feb", planned: 15, done: 12, pending: 3 },
    { month: "Mar", planned: 18, done: 15, pending: 3 },
    { month: "Apr", planned: 22, done: 18, pending: 4 },
    { month: "May", planned: 25, done: 20, pending: 5 },
    { month: "Jun", planned: 20, done: 18, pending: 2 },
    { month: "Jul", planned: 28, done: 22, pending: 6 },
    { month: "Aug", planned: 30, done: 25, pending: 5 },
    { month: "Sep", planned: 24, done: 20, pending: 4 },
    { month: "Oct", planned: 26, done: 22, pending: 4 },
    { month: "Nov", planned: 32, done: 28, pending: 4 },
    { month: "Dec", planned: 28, done: 24, pending: 4 },
  ]

  const chartData = data || defaultData

  const handleStartEdit = () => {
    setEditedData([...chartData])
    setIsEditingData(true)
  }

  const handleSaveEdit = () => {
    if (onUpdateTrainingData) {
      onUpdateTrainingData(editedData)
    }
    setIsEditingData(false)
    console.log("Training data updated successfully!")
  }

  const handleCancelEdit = () => {
    setEditedData([])
    setIsEditingData(false)
  }

  const handleDataChange = (monthIndex: number, field: keyof Omit<TrainingData, "month">, value: string) => {
    const numValue = Number.parseInt(value) || 0
    setEditedData((prev) => prev.map((item, index) => (index === monthIndex ? { ...item, [field]: numValue } : item)))
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium mb-2">{`${label} 2025`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-xs" style={{ color: entry.color }}>
              {`${
                entry.dataKey === "planned" ? "Planned" : entry.dataKey === "done" ? "Done" : "Pending"
              }: ${entry.value}`}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Monthly Training Overview</CardTitle>
            <p className="text-sm text-muted-foreground">
              Training sessions planned, done, and pending throughout the year
            </p>
          </div>
          <Dialog open={isEditingData} onOpenChange={setIsEditingData}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" onClick={handleStartEdit}>
                <Edit2 className="h-4 w-4 mr-2" />
                Edit Data
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Training Data</DialogTitle>
                <DialogDescription>
                  Modify the training numbers for each month. Values should be non-negative integers.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {editedData.map((monthData, index) => (
                    <Card key={monthData.month} className="p-4">
                      <h4 className="text-center mb-3">{monthData.month} 2025</h4>
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label htmlFor={`planned-${index}`} className="text-xs">
                            Planned
                          </Label>
                          <Input
                            id={`planned-${index}`}
                            type="number"
                            min="0"
                            value={monthData.planned}
                            onChange={(e) => handleDataChange(index, "planned", e.target.value)}
                            className="h-8"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`done-${index}`} className="text-xs">
                            Done
                          </Label>
                          <Input
                            id={`done-${index}`}
                            type="number"
                            min="0"
                            max={monthData.planned}
                            value={monthData.done}
                            onChange={(e) => handleDataChange(index, "done", e.target.value)}
                            className="h-8"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`pending-${index}`} className="text-xs">
                            Pending
                          </Label>
                          <Input
                            id={`pending-${index}`}
                            type="number"
                            min="0"
                            value={monthData.pending}
                            onChange={(e) => handleDataChange(index, "pending", e.target.value)}
                            className="h-8"
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button variant="outline" onClick={handleCancelEdit}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button onClick={handleSaveEdit}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} fontSize={12} tick={{ fill: "#666" }} />
              <YAxis axisLine={false} tickLine={false} fontSize={12} tick={{ fill: "#666" }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="planned" fill="var(--chart-1)" radius={[4, 4, 0, 0]} name="Planned" />
              <Bar dataKey="done" fill="var(--chart-2)" radius={[4, 4, 0, 0]} name="Done" />
              <Bar dataKey="pending" fill="var(--chart-3)" radius={[4, 4, 0, 0]} name="Pending" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: "var(--chart-1)" }}></div>
            <span className="text-xs text-muted-foreground">Planned</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: "var(--chart-2)" }}></div>
            <span className="text-xs text-muted-foreground">Done</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: "var(--chart-3)" }}></div>
            <span className="text-xs text-muted-foreground">Pending</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
