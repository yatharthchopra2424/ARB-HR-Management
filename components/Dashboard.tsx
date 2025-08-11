"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { DepartmentManagement } from "./DepartmentManagement"
import { MeetingManagement } from "./MeetingManagement"
import { TrainingChart } from "./TrainingChart"
import { departmentService, trainingDataService } from "../lib/database"
import { Building2, Users, Calendar, LogOut, BarChart3, TrendingUp, Clock, GraduationCap } from "lucide-react"

interface DashboardProps {
  username: string
  onLogout: () => void
}

interface TrainingData {
  month: string
  planned: number
  done: number
  pending: number
}

export function Dashboard({ username, onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [trainingData, setTrainingData] = useState<TrainingData[]>([])
  const [departmentCount, setDepartmentCount] = useState(0)
  const [totalEmployees, setTotalEmployees] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setIsLoading(true)

      // Load departments
      const departments = await departmentService.getAll()
      setDepartmentCount(departments.length)
      setTotalEmployees(departments.reduce((sum, dept) => sum + dept.employee_count, 0))

      // Load training data
      const training = await trainingDataService.getByYear(2025)
      const formattedTrainingData = training.map((item) => ({
        month: item.month,
        planned: item.planned,
        done: item.done,
        pending: item.pending,
      }))
      setTrainingData(formattedTrainingData)
    } catch (error) {
      console.error("Error loading dashboard data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateTrainingData = async (data: TrainingData[]) => {
    try {
      // Update each month's data
      for (const monthData of data) {
        await trainingDataService.updateMonth(monthData.month, 2025, {
          planned: monthData.planned,
          done: monthData.done,
          pending: monthData.pending,
        })
      }
      setTrainingData(data)
      console.log("Training data updated successfully!")
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error updating training data:", error.message, error.stack)
      } else {
        console.error("Error updating training data:", JSON.stringify(error))
      }
    }
  }

  const stats = [
    {
      title: "Total Employees",
      value: totalEmployees.toString(),
      change: "+12",
      changeType: "positive" as const,
      icon: Users,
    },
    {
      title: "Departments",
      value: departmentCount.toString(),
      change: "+1",
      changeType: "positive" as const,
      icon: Building2,
    },
    {
      title: "Training Today",
      value: "5",
      change: "-2",
      changeType: "negative" as const,
      icon: Calendar,
    },
    {
      title: "Training Sessions",
      value:
        trainingData
          .find((d) => d.month === new Date().toLocaleString("default", { month: "short" }))
          ?.planned.toString() || "30",
      change: "+8",
      changeType: "positive" as const,
      icon: GraduationCap,
    },
  ]

  const weeklyTrainings = [
    { id: "1", title: "Safety Training", time: "09:00 AM", participants: 8 },
    { id: "2", title: "Quality Control Training", time: "02:00 PM", participants: 5 },
    { id: "3", title: "Equipment Operation Training", time: "04:00 PM", participants: 12 },
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <img src="/images/arb-logo.jpg" alt="ARB Bearings" className="h-10 w-auto" />
              <h1>HR Management Dashboard</h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback>{username.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p>{username}</p>
                <p className="text-sm text-muted-foreground">HR Manager</p>
              </div>
            </div>
            <Button variant="outline" onClick={onLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="departments" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Departments
            </TabsTrigger>
            <TabsTrigger value="trainings" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Training
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat) => (
                <Card key={stat.title}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.title}</p>
                        <p className="text-2xl">{stat.value}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <TrendingUp
                            className={`h-3 w-3 ${stat.changeType === "positive" ? "text-green-600" : "text-red-600"}`}
                          />
                          <span
                            className={`text-xs ${stat.changeType === "positive" ? "text-green-600" : "text-red-600"}`}
                          >
                            {stat.change} this month
                          </span>
                        </div>
                      </div>
                      <div className="p-3 bg-primary/10 rounded-full">
                        <stat.icon className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Training Chart and Weekly Schedule */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <TrainingChart data={trainingData} onUpdateTrainingData={handleUpdateTrainingData} />
              </div>

              {/* Training Planned Weekly Scheduled */}
              <Card>
                <CardHeader>
                  <CardTitle>Training Planned Weekly Scheduled</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {weeklyTrainings.map((training) => (
                      <div key={training.id} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="text-sm">{training.title}</h5>
                          <Badge variant="outline" className="text-xs">
                            {training.participants} participants
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {training.time}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="departments">
            <DepartmentManagement />
          </TabsContent>

          <TabsContent value="trainings">
            <MeetingManagement />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
