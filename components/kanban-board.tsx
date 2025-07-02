"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Plus, CalendarIcon, Clock, User, MoreHorizontal } from "lucide-react"
import { format } from "date-fns"

interface Task {
  id: string
  title: string
  description: string
  status: "todo" | "in-progress" | "done"
  priority: "low" | "medium" | "high"
  assignee?: string
  dueDate?: Date
  timeSpent?: number
}

interface KanbanBoardProps {
  workspaceId: string
}

export function KanbanBoard({ workspaceId }: KanbanBoardProps) {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Design Homepage",
      description: "Create wireframes and mockups for the homepage",
      status: "done",
      priority: "high",
      assignee: "John Doe",
      dueDate: new Date("2024-01-15"),
      timeSpent: 8,
    },
    {
      id: "2",
      title: "Implement Authentication",
      description: "Set up user login and registration system",
      status: "in-progress",
      priority: "high",
      assignee: "Jane Smith",
      dueDate: new Date("2024-01-20"),
      timeSpent: 12,
    },
    {
      id: "3",
      title: "Write Documentation",
      description: "Create user guide and API documentation",
      status: "todo",
      priority: "medium",
      dueDate: new Date("2024-01-25"),
    },
    {
      id: "4",
      title: "Setup CI/CD Pipeline",
      description: "Configure automated testing and deployment",
      status: "todo",
      priority: "low",
      dueDate: new Date("2024-01-30"),
    },
  ])

  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
  })

  const [selectedDate, setSelectedDate] = useState<Date>()

  const columns = [
    { id: "todo", title: "To Do", color: "bg-slate-100" },
    { id: "in-progress", title: "In Progress", color: "bg-blue-100" },
    { id: "done", title: "Done", color: "bg-green-100" },
  ]

  const handleCreateTask = () => {
    if (newTask.title) {
      const task: Task = {
        id: Date.now().toString(),
        title: newTask.title,
        description: newTask.description || "",
        status: newTask.status as "todo" | "in-progress" | "done",
        priority: newTask.priority as "low" | "medium" | "high",
        assignee: newTask.assignee,
        dueDate: selectedDate,
      }
      setTasks([...tasks, task])
      setNewTask({ title: "", description: "", status: "todo", priority: "medium" })
      setSelectedDate(undefined)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-50 text-red-700 border-red-200"
      case "medium":
        return "bg-yellow-50 text-yellow-700 border-yellow-200"
      case "low":
        return "bg-green-50 text-green-700 border-green-200"
      default:
        return "bg-slate-50 text-slate-700 border-slate-200"
    }
  }

  const moveTask = (taskId: string, newStatus: "todo" | "in-progress" | "done") => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task)))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-slate-800">Task Board</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
              <DialogDescription>Add a new task to your board</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="task-title">Title</Label>
                <Input
                  id="task-title"
                  placeholder="Enter task title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="task-description">Description</Label>
                <Textarea
                  id="task-description"
                  placeholder="Enter task description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select
                    value={newTask.priority}
                    onValueChange={(value) => setNewTask({ ...newTask, priority: value as "low" | "medium" | "high" })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={newTask.status}
                    onValueChange={(value) =>
                      setNewTask({ ...newTask, status: value as "todo" | "in-progress" | "done" })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todo">To Do</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="done">Done</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Due Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
              <Button onClick={handleCreateTask} className="w-full">
                Create Task
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((column) => (
          <div key={column.id} className="space-y-4">
            <div className={`p-4 rounded-lg ${column.color}`}>
              <h3 className="font-semibold text-slate-800">{column.title}</h3>
              <p className="text-sm text-slate-600">{tasks.filter((task) => task.status === column.id).length} tasks</p>
            </div>

            <div className="space-y-3">
              {tasks
                .filter((task) => task.status === column.id)
                .map((task) => (
                  <Card
                    key={task.id}
                    className="cursor-pointer hover:shadow-md transition-all duration-200 border-0 shadow-sm"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-sm font-semibold leading-tight">{task.title}</CardTitle>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0 space-y-3">
                      {task.description && <p className="text-xs text-slate-600 line-clamp-2">{task.description}</p>}

                      <div className="flex items-center justify-between">
                        <Badge
                          className={`${getPriorityColor(task.priority)} text-xs font-medium border`}
                          variant="outline"
                        >
                          {task.priority}
                        </Badge>
                        {task.timeSpent && (
                          <div className="flex items-center text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded">
                            <Clock className="mr-1 h-3 w-3" />
                            {task.timeSpent}h
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                        {task.assignee ? (
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src="/placeholder.svg?height=24&width=24" />
                              <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
                                {task.assignee
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-slate-600 font-medium">{task.assignee}</span>
                          </div>
                        ) : (
                          <div className="flex items-center text-xs text-slate-400">
                            <User className="mr-1 h-3 w-3" />
                            Unassigned
                          </div>
                        )}

                        {task.dueDate && (
                          <div className="flex items-center text-xs text-slate-500">
                            <CalendarIcon className="mr-1 h-3 w-3" />
                            {format(task.dueDate, "MMM d")}
                          </div>
                        )}
                      </div>

                      {/* Quick move buttons */}
                      <div className="flex space-x-1 pt-2">
                        {columns
                          .filter((col) => col.id !== task.status)
                          .map((col) => (
                            <Button
                              key={col.id}
                              variant="outline"
                              size="sm"
                              className="text-xs h-7 px-2 bg-transparent hover:bg-slate-50 border-slate-200"
                              onClick={() => moveTask(task.id, col.id as "todo" | "in-progress" | "done")}
                            >
                              → {col.title}
                            </Button>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
