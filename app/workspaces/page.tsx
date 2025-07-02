"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Users, Clock, FileText, Settings, Search } from "lucide-react"

interface Workspace {
  id: string
  name: string
  type: "team" | "solo" | "client"
  members: number
  lastActivity: string
  description: string
  tasks: number
  completedTasks: number
}

export default function WorkspacesPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")

  const [workspaces, setWorkspaces] = useState<Workspace[]>([
    {
      id: "1",
      name: "Personal Projects",
      type: "solo",
      members: 1,
      lastActivity: "2 hours ago",
      description: "My personal development projects and experiments",
      tasks: 8,
      completedTasks: 5,
    },
    {
      id: "2",
      name: "Acme Corp Website",
      type: "client",
      members: 3,
      lastActivity: "1 day ago",
      description: "E-commerce website development for Acme Corporation",
      tasks: 12,
      completedTasks: 9,
    },
    {
      id: "3",
      name: "Marketing Team",
      type: "team",
      members: 5,
      lastActivity: "3 hours ago",
      description: "Internal marketing campaigns and content creation",
      tasks: 15,
      completedTasks: 8,
    },
    {
      id: "4",
      name: "Mobile App Design",
      type: "client",
      members: 2,
      lastActivity: "5 hours ago",
      description: "UI/UX design for TechStart mobile application",
      tasks: 6,
      completedTasks: 3,
    },
  ])

  const [newWorkspace, setNewWorkspace] = useState({
    name: "",
    type: "solo" as "team" | "solo" | "client",
    description: "",
  })

  const handleCreateWorkspace = () => {
    if (newWorkspace.name) {
      const workspace: Workspace = {
        id: Date.now().toString(),
        name: newWorkspace.name,
        type: newWorkspace.type,
        members: 1,
        lastActivity: "Just now",
        description: newWorkspace.description,
        tasks: 0,
        completedTasks: 0,
      }
      setWorkspaces([workspace, ...workspaces])
      setNewWorkspace({ name: "", type: "solo", description: "" })
    }
  }

  const handleWorkspaceClick = (workspaceId: string) => {
    router.push(`/workspace/${workspaceId}`)
  }

  const filteredWorkspaces = workspaces.filter((workspace) => {
    const matchesSearch =
      workspace.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workspace.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterType === "all" || workspace.type === filterType
    return matchesSearch && matchesFilter
  })

  const getWorkspaceIcon = (type: string) => {
    switch (type) {
      case "team":
        return <Users className="h-5 w-5 text-blue-600" />
      case "client":
        return <FileText className="h-5 w-5 text-green-600" />
      default:
        return <Clock className="h-5 w-5 text-purple-600" />
    }
  }

  const getWorkspaceColor = (type: string) => {
    switch (type) {
      case "team":
        return "border-l-blue-500"
      case "client":
        return "border-l-green-500"
      default:
        return "border-l-purple-500"
    }
  }

  const getProgressPercentage = (completed: number, total: number) => {
    return total > 0 ? Math.round((completed / total) * 100) : 0
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Workspaces</h1>
            <p className="text-slate-600 mt-1">Manage all your workspaces and projects</p>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Workspace
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Workspace</DialogTitle>
                <DialogDescription>Set up a new workspace for your team or project</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="workspace-name">Workspace Name</Label>
                  <Input
                    id="workspace-name"
                    placeholder="Enter workspace name"
                    value={newWorkspace.name}
                    onChange={(e) => setNewWorkspace({ ...newWorkspace, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="workspace-description">Description</Label>
                  <Input
                    id="workspace-description"
                    placeholder="Brief description of the workspace"
                    value={newWorkspace.description}
                    onChange={(e) => setNewWorkspace({ ...newWorkspace, description: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="workspace-type">Workspace Type</Label>
                  <Select
                    value={newWorkspace.type}
                    onValueChange={(value: "team" | "solo" | "client") =>
                      setNewWorkspace({ ...newWorkspace, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="solo">Personal/Solo</SelectItem>
                      <SelectItem value="team">Team Collaboration</SelectItem>
                      <SelectItem value="client">Client Project</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleCreateWorkspace} className="w-full">
                  Create Workspace
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search workspaces..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="solo">Personal/Solo</SelectItem>
              <SelectItem value="team">Team</SelectItem>
              <SelectItem value="client">Client</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Workspaces</p>
                  <p className="text-2xl font-bold text-slate-800">{workspaces.length}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Team Workspaces</p>
                  <p className="text-2xl font-bold text-slate-800">
                    {workspaces.filter((w) => w.type === "team").length}
                  </p>
                </div>
                <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Client Projects</p>
                  <p className="text-2xl font-bold text-slate-800">
                    {workspaces.filter((w) => w.type === "client").length}
                  </p>
                </div>
                <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Tasks</p>
                  <p className="text-2xl font-bold text-slate-800">{workspaces.reduce((sum, w) => sum + w.tasks, 0)}</p>
                </div>
                <div className="h-8 w-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 font-bold">#</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Workspaces Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkspaces.map((workspace) => (
            <Card
              key={workspace.id}
              className={`hover:shadow-lg transition-shadow cursor-pointer border-l-4 ${getWorkspaceColor(workspace.type)}`}
              onClick={() => handleWorkspaceClick(workspace.id)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    {getWorkspaceIcon(workspace.type)}
                    <div>
                      <CardTitle className="text-lg">{workspace.name}</CardTitle>
                      <CardDescription className="capitalize">{workspace.type} workspace</CardDescription>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      // Handle settings click
                    }}
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-slate-600">{workspace.description}</p>

                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Progress</span>
                    <span className="font-medium">
                      {workspace.completedTasks}/{workspace.tasks} tasks
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getProgressPercentage(workspace.completedTasks, workspace.tasks)}%` }}
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="flex justify-between text-sm text-slate-600">
                  <span>
                    {workspace.members} member{workspace.members !== 1 ? "s" : ""}
                  </span>
                  <span>{workspace.lastActivity}</span>
                </div>

                {/* Type Badge */}
                <div className="flex justify-end">
                  <Badge variant="secondary" className="capitalize">
                    {workspace.type}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredWorkspaces.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-slate-400" />
            <h3 className="mt-2 text-sm font-medium text-slate-900">No workspaces found</h3>
            <p className="mt-1 text-sm text-slate-500">
              {searchTerm || filterType !== "all"
                ? "Try adjusting your search or filter criteria."
                : "Get started by creating your first workspace."}
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
