"use client"

import React, { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Download, Filter, Calendar } from "lucide-react"

interface TrainingPlanItem {
  id: string
  department: string
  trainingTopic: string
  plannedMonths: string[]
  actualMonths: string[]
}

export function TrainingPlan() {
  const [trainingPlans, setTrainingPlans] = useState<TrainingPlanItem[]>([
    {
      id: "1",
      department: "Grinding",
      trainingTopic: "Duplex Grinding",
      plannedMonths: ["Apr-25", "Oct-25"],
      actualMonths: ["Apr-25"],
    },
    {
      id: "2",
      department: "Grinding",
      trainingTopic: "Surface Grinding",
      plannedMonths: ["Apr-25"],
      actualMonths: [],
    },
    {
      id: "3",
      department: "Grinding",
      trainingTopic: "Center Less Grinding",
      plannedMonths: ["May-25", "Nov-25"],
      actualMonths: [],
    },
    {
      id: "4",
      department: "Grinding",
      trainingTopic: "I/R Track Grinding",
      plannedMonths: ["May-25"],
      actualMonths: [],
    },
    {
      id: "5",
      department: "Grinding",
      trainingTopic: "O/R Track Grinding",
      plannedMonths: ["Jun-25"],
      actualMonths: [],
    },
    {
      id: "6",
      department: "Grinding",
      trainingTopic: "Bore Grinding",
      plannedMonths: ["Jun-25"],
      actualMonths: [],
    },
    {
      id: "7",
      department: "Grinding",
      trainingTopic: "OR OD Grinding",
      plannedMonths: ["Jul-25", "Jan-26"],
      actualMonths: [],
    },
    {
      id: "8",
      department: "Grinding",
      trainingTopic: "Manual Lathe Lip Operation",
      plannedMonths: ["Jul-25"],
      actualMonths: [],
    },
    {
      id: "9",
      department: "Grinding",
      trainingTopic: "Super Finishing (Honing)",
      plannedMonths: ["Aug-25", "Nov-25"],
      actualMonths: [],
    },
    {
      id: "10",
      department: "Grinding",
      trainingTopic: "Manual Machine TR-4/TR-5",
      plannedMonths: ["Aug-25"],
      actualMonths: [],
    },
    {
      id: "11",
      department: "Grinding",
      trainingTopic: "Sorting",
      plannedMonths: ["Sep-25", "Dec-25"],
      actualMonths: [],
    },
  ])

  const [isAddingPlan, setIsAddingPlan] = useState(false)
  const [newPlan, setNewPlan] = useState({
    department: "",
    trainingTopic: "",
    plannedMonths: [] as string[],
  })

  const months = [
    "Apr-25",
    "May-25",
    "Jun-25",
    "Jul-25",
    "Aug-25",
    "Sep-25",
    "Oct-25",
    "Nov-25",
    "Dec-25",
    "Jan-26",
    "Feb-26",
    "Mar-26",
  ]

  const departments = ["Grinding", "Assembly", "Manufacturing", "Quality Control", "Maintenance"]

  const handleAddPlan = () => {
    if (!newPlan.department || !newPlan.trainingTopic) return

    const plan: TrainingPlanItem = {
      id: Date.now().toString(),
      department: newPlan.department,
      trainingTopic: newPlan.trainingTopic,
      plannedMonths: newPlan.plannedMonths,
      actualMonths: [],
    }

    setTrainingPlans([...trainingPlans, plan])
    setNewPlan({ department: "", trainingTopic: "", plannedMonths: [] })
    setIsAddingPlan(false)
    console.log("Training plan added successfully!")
  }

  const handleMonthToggle = (planId: string, month: string, type: "planned" | "actual") => {
    setTrainingPlans((prev) =>
      prev.map((plan) => {
        if (plan.id !== planId) return plan

        const monthsArray = type === "planned" ? plan.plannedMonths : plan.actualMonths
        const isSelected = monthsArray.includes(month)

        if (type === "planned") {
          return {
            ...plan,
            plannedMonths: isSelected
              ? plan.plannedMonths.filter((m) => m !== month)
              : [...plan.plannedMonths, month].sort((a, b) => months.indexOf(a) - months.indexOf(b)),
          }
        } else {
          // For actual, only allow if it's planned
          if (!plan.plannedMonths.includes(month)) {
            console.error("Cannot mark as actual - training not planned for this month")
            return plan
          }
          return {
            ...plan,
            actualMonths: isSelected
              ? plan.actualMonths.filter((m) => m !== month)
              : [...plan.actualMonths, month].sort((a, b) => months.indexOf(a) - months.indexOf(b)),
          }
        }
      }),
    )
  }

  const isCellSelected = (planId: string, month: string, type: "planned" | "actual") => {
    const plan = trainingPlans.find((p) => p.id === planId)
    if (!plan) return false
    return type === "planned" ? plan.plannedMonths.includes(month) : plan.actualMonths.includes(month)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2>Training Plan for the Year - 2025-26</h2>
          <p className="text-muted-foreground">Annual training schedule by department and topic</p>
          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
            <span>Doc. No.: PSB/HRD/02</span>
            <span>Rev. No.: 00</span>
            <span>Rev. Date: {new Date().toLocaleDateString("en-GB")}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Dialog open={isAddingPlan} onOpenChange={setIsAddingPlan}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Training
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Training Plan</DialogTitle>
                <DialogDescription>
                  Create a new training schedule for a department with planned months.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-department">Department</Label>
                  <Select
                    value={newPlan.department}
                    onValueChange={(value) => setNewPlan({ ...newPlan, department: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-topic">Training Topic</Label>
                  <Input
                    id="new-topic"
                    value={newPlan.trainingTopic}
                    onChange={(e) => setNewPlan({ ...newPlan, trainingTopic: e.target.value })}
                    placeholder="Enter training topic"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Planned Months</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {months.map((month) => (
                      <Button
                        key={month}
                        type="button"
                        variant={newPlan.plannedMonths.includes(month) ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          const isSelected = newPlan.plannedMonths.includes(month)
                          setNewPlan({
                            ...newPlan,
                            plannedMonths: isSelected
                              ? newPlan.plannedMonths.filter((m) => m !== month)
                              : [...newPlan.plannedMonths, month],
                          })
                        }}
                        className="text-xs"
                      >
                        {month}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={handleAddPlan}>Add Training</Button>
                  <Button variant="outline" onClick={() => setIsAddingPlan(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 p-2 text-xs text-center min-w-12">S. NO.</th>
                  <th className="border border-gray-300 p-2 text-xs text-center min-w-24">Department</th>
                  <th className="border border-gray-300 p-2 text-xs text-center min-w-40">TRAINING TOPIC</th>
                  <th className="border border-gray-300 p-2 text-xs text-center min-w-20">PLAN / ACTUAL</th>
                  {months.map((month) => (
                    <th key={month} className="border border-gray-300 p-2 text-xs text-center min-w-16">
                      {month}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {trainingPlans.map((plan, index) => (
                  <React.Fragment key={plan.id}>
                    {/* Plan Row */}
                    <tr className="hover:bg-gray-50">
                      <td className="border border-gray-300 p-2 text-xs text-center" rowSpan={2}>
                        {index + 1}
                      </td>
                      <td className="border border-gray-300 p-2 text-xs" rowSpan={2}>
                        {plan.department}
                      </td>
                      <td className="border border-gray-300 p-2 text-xs" rowSpan={2}>
                        {plan.trainingTopic}
                      </td>
                      <td className="border border-gray-300 p-2 text-xs text-center bg-blue-50">
                        <Badge variant="outline" className="text-xs">
                          PLAN
                        </Badge>
                      </td>
                      {months.map((month) => (
                        <td
                          key={`${plan.id}-plan-${month}`}
                          className={`border border-gray-300 p-1 text-center cursor-pointer hover:bg-gray-100 ${
                            isCellSelected(plan.id, month, "planned") ? "bg-yellow-300" : ""
                          }`}
                          onClick={() => handleMonthToggle(plan.id, month, "planned")}
                        >
                          {isCellSelected(plan.id, month, "planned") && <Calendar className="h-3 w-3 mx-auto" />}
                        </td>
                      ))}
                    </tr>
                    {/* Actual Row */}
                    <tr className="hover:bg-gray-50">
                      <td className="border border-gray-300 p-2 text-xs text-center bg-green-50">
                        <Badge variant="outline" className="text-xs">
                          ACTUAL
                        </Badge>
                      </td>
                      {months.map((month) => (
                        <td
                          key={`${plan.id}-actual-${month}`}
                          className={`border border-gray-300 p-1 text-center cursor-pointer hover:bg-gray-100 ${
                            isCellSelected(plan.id, month, "actual") ? "bg-green-300" : ""
                          } ${!plan.plannedMonths.includes(month) ? "bg-gray-100 cursor-not-allowed" : ""}`}
                          onClick={() => handleMonthToggle(plan.id, month, "actual")}
                        >
                          {isCellSelected(plan.id, month, "actual") && <Calendar className="h-3 w-3 mx-auto" />}
                        </td>
                      ))}
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center text-sm text-muted-foreground">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-300 border"></div>
            <span>Planned Training</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-300 border"></div>
            <span>Completed Training</span>
          </div>
        </div>
        <div>Click on cells to mark training as planned or completed</div>
      </div>
    </div>
  )
}
