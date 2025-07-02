"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Plus, Share, Eye, Users, Clock, CheckCircle, AlertCircle } from "lucide-react"

interface ClientProject {
  id: string
  name: string
  client: string
  status: "active" | "completed" | "on-hold"
  progress: number
  dueDate: string
  totalTasks: number
  completedTasks: number
  sharedWith: string[]
  lastUpdate: string
}

export default function ClientPortalPage() {
  const [projects, setProjects] = useState<ClientProject[]>([
    {
      id: "1",
      name: "E-commerce Website",
      client: "Acme Corp",
      status: "active",
      progress: 75,
      dueDate: "2024-02-15",
      totalTasks: 12,
      completedTasks: 9,
      sharedWith: ["john@acmecorp.com", "sarah@acmecorp.com"],
      lastUpdate: "2 hours ago",
    },
    {
      id: "2",
      name: "Mobile App Design",
      client: "TechStart Inc",
      status: "active",
      progress: 45,
      dueDate: "2024-03-01",
      totalTasks: 8,
      completedTasks: 4,
      sharedWith: ["mike@techstart.com"],
      lastUpdate: "1 day ago",
    },
    {
      id: "3",
      name: "Brand Identity",
      client: "Creative Studio",
      status: "completed",
      progress: 100,
      dueDate: "2024-01-10",
      totalTasks: 6,
      completedTasks: 6,
      sharedWith: ["lisa@creativestudio.com", "tom@creativestudio.com"],
      lastUpdate: "1 week ago",
    },
  ])

  const [newProject, setNewProject] = useState({
    name: "",
    client: "",
    dueDate: "",
    sharedWith: "",
  })

  const handleCreateProject = () => {
    if (newProject.name && newProject.client) {
      const project: ClientProject = {
        id: Date.now().toString(),
        name: newProject.name,
        client: newProject.client,
        status: "active",
        progress: 0,
        dueDate: newProject.dueDate,
        totalTasks: 0,
        completedTasks: 0,
        sharedWith: newProject.sharedWith
          .split(",")
          .map((email) => email.trim())
          .filter(Boolean),
        lastUpdate: "Just now",
      }
      setProjects([project, ...projects])
      setNewProject({ name: "", client: "", dueDate: "", sharedWith: "" })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "on-hold":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-slate-100 text-slate-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Clock className="h-4 w-4" />
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "on-hold":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Client Portal</h1>
            <p className="text-slate-600 mt-1">Share project progress with your clients</p>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Client Project
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Client Project</DialogTitle>
                <DialogDescription>Set up a new project to share with your client</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="project-name">Project Name</Label>
                  <Input
                    id="project-name"
                    placeholder="Enter project name"
                    value={newProject.name}
                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client-name">Client Name</Label>
                  <Input
                    id="client-name"
                    placeholder="Enter client name"
                    value={newProject.client}
                    onChange={(e) => setNewProject({ ...newProject, client: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="due-date">Due Date</Label>
                  <Input
                    id="due-date"
                    type="date"
                    value={newProject.dueDate}
                    onChange={(e) => setNewProject({ ...newProject, dueDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shared-emails">Client Emails (comma separated)</Label>
                  <Input
                    id="shared-emails"
                    placeholder="client@example.com, manager@example.com"
                    value={newProject.sharedWith}
                    onChange={(e) => setNewProject({ ...newProject, sharedWith: e.target.value })}
                  />
                </div>
                <Button onClick={handleCreateProject} className="w-full">
                  Create Project
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Projects</p>
                  <p className="text-2xl font-bold text-slate-800">{projects.length}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Active Projects</p>
                  <p className="text-2xl font-bold text-slate-800">
                    {projects.filter((p) => p.status === "active").length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Completed</p>
                  <p className="text-2xl font-bold text-slate-800">
                    {projects.filter((p) => p.status === "completed").length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Avg Progress</p>
                  <p className="text-2xl font-bold text-slate-800">
                    {Math.round(projects.reduce((acc, p) => acc + p.progress, 0) / projects.length)}%
                  </p>
                </div>
                <div className="h-8 w-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 font-bold">%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    <CardDescription className="mt-1">{project.client}</CardDescription>
                  </div>
                  <Badge className={getStatusColor(project.status)} variant="secondary">
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(project.status)}
                      <span className="capitalize">{project.status}</span>
                    </div>
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Progress</span>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>

                {/* Tasks */}
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Tasks</span>
                  <span className="font-medium">
                    {project.completedTasks}/{project.totalTasks} completed
                  </span>
                </div>

                {/* Due Date */}
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Due Date</span>
                  <span className="font-medium">{project.dueDate}</span>
                </div>

                {/* Shared With */}
                <div className="space-y-2">
                  <span className="text-sm text-slate-600">Shared with:</span>
                  <div className="flex flex-wrap gap-2">
                    {project.sharedWith.map((email, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {email}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    <Eye className="mr-2 h-4 w-4" />
                    View Portal
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    <Share className="mr-2 h-4 w-4" />
                    Share Link
                  </Button>
                </div>

                {/* Last Update */}
                <p className="text-xs text-slate-500 text-center pt-2">Last updated {project.lastUpdate}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Client Portal Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Client Portal Preview</CardTitle>
            <CardDescription>This is how your clients will see their project dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 bg-slate-50">
              <div className="max-w-4xl mx-auto space-y-6">
                {/* Mock Client Header */}
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-slate-800">E-commerce Website</h2>
                  <p className="text-slate-600">Project Dashboard for Acme Corp</p>
                </div>

                {/* Mock Progress */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="font-semibold mb-4">Project Progress</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Overall Progress</span>
                      <span className="font-medium">75%</span>
                    </div>
                    <Progress value={75} className="h-3" />
                    <div className="grid grid-cols-3 gap-4 text-center text-sm">
                      <div>
                        <p className="font-medium text-slate-800">9</p>
                        <p className="text-slate-600">Completed</p>
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">2</p>
                        <p className="text-slate-600">In Progress</p>
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">1</p>
                        <p className="text-slate-600">Remaining</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mock Recent Updates */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="font-semibold mb-4">Recent Updates</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium">Homepage design completed</p>
                        <p className="text-xs text-slate-500">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium">User authentication in progress</p>
                        <p className="text-xs text-slate-500">1 day ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
