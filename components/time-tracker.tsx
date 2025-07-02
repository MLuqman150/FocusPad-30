"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Play, Pause, Square, Clock, Plus, Download } from "lucide-react"
import { format } from "date-fns"

interface TimeEntry {
  id: string
  taskName: string
  description: string
  startTime: Date
  endTime?: Date
  duration: number // in minutes
  project: string
  billable: boolean
  hourlyRate?: number
}

interface TimeTrackerProps {
  workspaceId: string
}

export function TimeTracker({ workspaceId }: TimeTrackerProps) {
  const [isRunning, setIsRunning] = useState(false)
  const [currentTime, setCurrentTime] = useState(0) // in seconds
  const [currentTask, setCurrentTask] = useState("")
  const [currentProject, setCurrentProject] = useState("")

  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([
    {
      id: "1",
      taskName: "Homepage Design",
      description: "Created wireframes and mockups for the main landing page",
      startTime: new Date("2024-01-15T09:00:00"),
      endTime: new Date("2024-01-15T12:30:00"),
      duration: 210, // 3.5 hours
      project: "Acme Corp Website",
      billable: true,
      hourlyRate: 75,
    },
    {
      id: "2",
      taskName: "Authentication System",
      description: "Implemented user login and registration functionality",
      startTime: new Date("2024-01-15T14:00:00"),
      endTime: new Date("2024-01-15T17:00:00"),
      duration: 180, // 3 hours
      project: "Acme Corp Website",
      billable: true,
      hourlyRate: 75,
    },
    {
      id: "3",
      taskName: "Team Meeting",
      description: "Weekly standup and project planning session",
      startTime: new Date("2024-01-16T10:00:00"),
      endTime: new Date("2024-01-16T11:00:00"),
      duration: 60, // 1 hour
      project: "Internal",
      billable: false,
    },
  ])

  const [newEntry, setNewEntry] = useState({
    taskName: "",
    description: "",
    project: "",
    billable: true,
    hourlyRate: 75,
  })

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRunning) {
      interval = setInterval(() => {
        setCurrentTime((time) => time + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRunning])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const handleStartTimer = () => {
    if (currentTask) {
      setIsRunning(true)
      setCurrentTime(0)
    }
  }

  const handlePauseTimer = () => {
    setIsRunning(false)
  }

  const handleStopTimer = () => {
    if (currentTime > 0 && currentTask) {
      const entry: TimeEntry = {
        id: Date.now().toString(),
        taskName: currentTask,
        description: "",
        startTime: new Date(Date.now() - currentTime * 1000),
        endTime: new Date(),
        duration: Math.floor(currentTime / 60),
        project: currentProject || "Personal",
        billable: true,
        hourlyRate: 75,
      }
      setTimeEntries([entry, ...timeEntries])
    }
    setIsRunning(false)
    setCurrentTime(0)
    setCurrentTask("")
    setCurrentProject("")
  }

  const handleAddManualEntry = () => {
    if (newEntry.taskName) {
      const entry: TimeEntry = {
        id: Date.now().toString(),
        taskName: newEntry.taskName,
        description: newEntry.description,
        startTime: new Date(),
        endTime: new Date(),
        duration: 60, // Default 1 hour
        project: newEntry.project || "Personal",
        billable: newEntry.billable,
        hourlyRate: newEntry.hourlyRate,
      }
      setTimeEntries([entry, ...timeEntries])
      setNewEntry({
        taskName: "",
        description: "",
        project: "",
        billable: true,
        hourlyRate: 75,
      })
    }
  }

  const getTotalHours = () => {
    return timeEntries.reduce((total, entry) => total + entry.duration, 0) / 60
  }

  const getBillableAmount = () => {
    return timeEntries
      .filter((entry) => entry.billable && entry.hourlyRate)
      .reduce((total, entry) => total + (entry.duration / 60) * (entry.hourlyRate || 0), 0)
  }

  const projects = Array.from(new Set(timeEntries.map((entry) => entry.project)))

  return (
    <div className="space-y-6">
      {/* Timer Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Time Tracker</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Current Timer Display */}
            <div className="text-center py-8 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg">
              <div className="text-5xl font-mono font-bold text-slate-800 mb-3 tracking-tight">
                {formatTime(currentTime)}
              </div>
              {currentTask && (
                <div className="space-y-1">
                  <p className="text-lg font-medium text-slate-700">Working on: {currentTask}</p>
                  {currentProject && <p className="text-sm text-slate-500">Project: {currentProject}</p>}
                </div>
              )}
            </div>

            {/* Timer Controls */}
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="current-task">Task Name</Label>
                  <Input
                    id="current-task"
                    placeholder="What are you working on?"
                    value={currentTask}
                    onChange={(e) => setCurrentTask(e.target.value)}
                    disabled={isRunning}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="current-project">Project</Label>
                  <Select value={currentProject} onValueChange={setCurrentProject} disabled={isRunning}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select project" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Personal">Personal</SelectItem>
                      {projects.map((project) => (
                        <SelectItem key={project} value={project}>
                          {project}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-center space-x-2">
                {!isRunning ? (
                  <Button onClick={handleStartTimer} disabled={!currentTask} className="flex items-center space-x-2">
                    <Play className="h-4 w-4" />
                    <span>Start</span>
                  </Button>
                ) : (
                  <Button
                    onClick={handlePauseTimer}
                    variant="outline"
                    className="flex items-center space-x-2 bg-transparent"
                  >
                    <Pause className="h-4 w-4" />
                    <span>Pause</span>
                  </Button>
                )}
                <Button
                  onClick={handleStopTimer}
                  variant="outline"
                  className="flex items-center space-x-2 bg-transparent"
                >
                  <Square className="h-4 w-4" />
                  <span>Stop</span>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Hours</p>
                <p className="text-2xl font-bold text-slate-800">{getTotalHours().toFixed(1)}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Billable Amount</p>
                <p className="text-2xl font-bold text-slate-800">${getBillableAmount().toFixed(0)}</p>
              </div>
              <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 font-bold">$</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Time Entries</p>
                <p className="text-2xl font-bold text-slate-800">{timeEntries.length}</p>
              </div>
              <div className="h-8 w-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 font-bold">#</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Time Entries */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Time Entries</CardTitle>
            <div className="flex space-x-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Entry
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Manual Time Entry</DialogTitle>
                    <DialogDescription>Add a time entry for work completed offline</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="entry-task">Task Name</Label>
                      <Input
                        id="entry-task"
                        placeholder="Enter task name"
                        value={newEntry.taskName}
                        onChange={(e) => setNewEntry({ ...newEntry, taskName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="entry-description">Description</Label>
                      <Textarea
                        id="entry-description"
                        placeholder="Enter task description"
                        value={newEntry.description}
                        onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="entry-project">Project</Label>
                        <Select
                          value={newEntry.project}
                          onValueChange={(value) => setNewEntry({ ...newEntry, project: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select project" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Personal">Personal</SelectItem>
                            {projects.map((project) => (
                              <SelectItem key={project} value={project}>
                                {project}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="entry-rate">Hourly Rate ($)</Label>
                        <Input
                          id="entry-rate"
                          type="number"
                          value={newEntry.hourlyRate}
                          onChange={(e) => setNewEntry({ ...newEntry, hourlyRate: Number(e.target.value) })}
                        />
                      </div>
                    </div>
                    <Button onClick={handleAddManualEntry} className="w-full">
                      Add Entry
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {timeEntries.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h3 className="font-semibold text-slate-900">{entry.taskName}</h3>
                      <p className="text-sm text-slate-600">{entry.project}</p>
                      {entry.description && (
                        <p className="text-xs text-slate-500 line-clamp-2 max-w-md">{entry.description}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-6 ml-4">
                  <div className="text-right">
                    <p className="font-semibold text-slate-900 text-lg">{formatDuration(entry.duration)}</p>
                    <p className="text-xs text-slate-500">
                      {format(entry.startTime, "MMM d, HH:mm")}
                      {entry.endTime && ` - ${format(entry.endTime, "HH:mm")}`}
                    </p>
                  </div>

                  <div className="flex flex-col items-end space-y-1">
                    {entry.billable ? (
                      <Badge className="bg-green-50 text-green-700 border-green-200 font-semibold">
                        ${((entry.duration / 60) * (entry.hourlyRate || 0)).toFixed(0)}
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-slate-100 text-slate-600">
                        Non-billable
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
