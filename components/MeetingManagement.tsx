"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrainingPlan } from "./TrainingPlan"
import { Plus, CalendarIcon, Clock, Users, MapPin, GraduationCap } from "lucide-react"

interface Training {
  id: string
  title: string
  description: string
  date: Date
  time: string
  duration: number
  participants: string[]
  location: string
  organizer: string
  type: "Team Training" | "One-on-One" | "All Hands" | "Interview" | "Training"
}

export function MeetingManagement() {
  const [trainings, setTrainings] = useState<Training[]>([
    {
      id: "1",
      title: "Weekly Team Training",
      description: "Weekly progress update and training session",
      date: new Date(2025, 7, 11), // August 11, 2025
      time: "09:00",
      duration: 30,
      participants: ["John Smith", "Sarah Johnson", "Mike Wilson"],
      location: "Training Room A",
      organizer: "Emily Davis",
      type: "Team Training",
    },
    {
      id: "2",
      title: "Quarterly Skills Training",
      description: "Q3 skills assessment and Q4 training planning",
      date: new Date(2025, 7, 15), // August 15, 2025
      time: "14:00",
      duration: 120,
      participants: ["All Department Heads"],
      location: "Main Training Hall",
      organizer: "Emily Davis",
      type: "All Hands",
    },
    {
      id: "3",
      title: "New Employee Training",
      description: "Orientation session for new hires",
      date: new Date(2025, 7, 18), // August 18, 2025
      time: "10:00",
      duration: 60,
      participants: ["New Hires", "HR Team"],
      location: "Training Room",
      organizer: "Emily Davis",
      type: "Training",
    },
  ])

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [isSchedulingTraining, setIsSchedulingTraining] = useState(false)
  const [newTraining, setNewTraining] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    duration: "",
    participants: "",
    location: "",
    type: "Team Training" as Training["type"],
  })

  const trainingTypes: Training["type"][] = ["Team Training", "One-on-One", "All Hands", "Interview", "Training"]

  const getTrainingsForDate = (date: Date) => {
    return trainings.filter((training) => training.date.toDateString() === date.toDateString())
  }

  const getUpcomingTrainings = () => {
    const today = new Date()
    return trainings
      .filter((training) => training.date >= today)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 5)
  }

  const handleScheduleTraining = () => {
    if (!newTraining.title || !newTraining.date || !newTraining.time) return

    const training: Training = {
      id: Date.now().toString(),
      title: newTraining.title,
      description: newTraining.description,
      date: new Date(newTraining.date),
      time: newTraining.time,
      duration: Number.parseInt(newTraining.duration) || 60,
      participants: newTraining.participants
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean),
      location: newTraining.location,
      organizer: "Current User",
      type: newTraining.type,
    }

    setTrainings([...trainings, training])
    setNewTraining({
      title: "",
      description: "",
      date: "",
      time: "",
      duration: "",
      participants: "",
      location: "",
      type: "Team Training",
    })
    setIsSchedulingTraining(false)
    console.log("Training scheduled successfully!")
  }

  const getTypeColor = (type: Training["type"]) => {
    const colors = {
      "Team Training": "bg-blue-100 text-blue-800",
      "One-on-One": "bg-green-100 text-green-800",
      "All Hands": "bg-purple-100 text-purple-800",
      Interview: "bg-orange-100 text-orange-800",
      Training: "bg-yellow-100 text-yellow-800",
    }
    return colors[type]
  }

  const formatTime = (time: string, duration: number) => {
    const [hours, minutes] = time.split(":").map(Number)
    const startTime = new Date()
    startTime.setHours(hours, minutes, 0, 0)

    const endTime = new Date(startTime.getTime() + duration * 60000)

    return `${startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - ${endTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2>Training Management</h2>
          <p className="text-muted-foreground">Schedule trainings and manage training plans</p>
        </div>
      </div>

      <Tabs defaultValue="trainings" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="trainings" className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            Trainings
          </TabsTrigger>
          <TabsTrigger value="training-plan" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            Training Plan
          </TabsTrigger>
        </TabsList>

        <TabsContent value="trainings" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3>Training Management</h3>
              <p className="text-muted-foreground">Schedule and manage team trainings</p>
            </div>
            <Button onClick={() => setIsSchedulingTraining(!isSchedulingTraining)}>
              <Plus className="h-4 w-4 mr-2" />
              Schedule Training
            </Button>
          </div>

          {isSchedulingTraining && (
            <Card>
              <CardHeader>
                <CardTitle>Schedule New Training</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="training-title">Training Title</Label>
                    <Input
                      id="training-title"
                      value={newTraining.title}
                      onChange={(e) => setNewTraining({ ...newTraining, title: e.target.value })}
                      placeholder="Enter training title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="training-type">Training Type</Label>
                    <Select
                      value={newTraining.type}
                      onValueChange={(value: Training["type"]) => setNewTraining({ ...newTraining, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {trainingTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="training-date">Date</Label>
                    <Input
                      id="training-date"
                      type="date"
                      value={newTraining.date}
                      onChange={(e) => setNewTraining({ ...newTraining, date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="training-time">Time</Label>
                    <Input
                      id="training-time"
                      type="time"
                      value={newTraining.time}
                      onChange={(e) => setNewTraining({ ...newTraining, time: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="training-duration">Duration (minutes)</Label>
                    <Input
                      id="training-duration"
                      type="number"
                      value={newTraining.duration}
                      onChange={(e) => setNewTraining({ ...newTraining, duration: e.target.value })}
                      placeholder="60"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="training-location">Location</Label>
                    <Input
                      id="training-location"
                      value={newTraining.location}
                      onChange={(e) => setNewTraining({ ...newTraining, location: e.target.value })}
                      placeholder="Training room or virtual link"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="training-participants">Participants (comma separated)</Label>
                    <Input
                      id="training-participants"
                      value={newTraining.participants}
                      onChange={(e) => setNewTraining({ ...newTraining, participants: e.target.value })}
                      placeholder="John Smith, Sarah Johnson, Mike Wilson"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="training-description">Description</Label>
                    <Input
                      id="training-description"
                      value={newTraining.description}
                      onChange={(e) => setNewTraining({ ...newTraining, description: e.target.value })}
                      placeholder="Training agenda and details"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleScheduleTraining}>Schedule Training</Button>
                  <Button variant="outline" onClick={() => setIsSchedulingTraining(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Trainings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {getUpcomingTrainings().map((training) => (
                    <div key={training.id} className="p-4 border rounded-lg space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <h4>{training.title}</h4>
                          <p className="text-sm text-muted-foreground">{training.description}</p>
                        </div>
                        <Badge className={getTypeColor(training.type)}>{training.type}</Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                          <span>{training.date.toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{formatTime(training.time, training.duration)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{training.location}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{training.participants.join(", ")}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Calendar</CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                  />
                </CardContent>
              </Card>

              {selectedDate && (
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {selectedDate.toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {getTrainingsForDate(selectedDate).length > 0 ? (
                      <div className="space-y-3">
                        {getTrainingsForDate(selectedDate).map((training) => (
                          <div key={training.id} className="p-3 border rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                              <h5 className="text-sm">{training.title}</h5>
                              <Badge variant="outline" className="text-xs">
                                {training.type}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mb-2">
                              {formatTime(training.time, training.duration)}
                            </p>
                            <p className="text-xs text-muted-foreground">{training.location}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No trainings scheduled for this date.</p>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="training-plan">
          <TrainingPlan />
        </TabsContent>
      </Tabs>
    </div>
  )
}
