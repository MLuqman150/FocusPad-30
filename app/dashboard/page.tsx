"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Plus, Users, Clock, FileText, Bell } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"

interface Workspace {
  id: string
  name: string
  type: "team" | "solo" | "client"
  members: number
  lastActivity: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [workspaces, setWorkspaces] = useState<Workspace[]>([
    {
      id: "1",
      name: "Personal Projects",
      type: "solo",
      members: 1,
      lastActivity: "2 hours ago",
    },
    {
      id: "2",
      name: "Acme Corp Website",
      type: "client",
      members: 3,
      lastActivity: "1 day ago",
    },
    {
      id: "3",
      name: "Marketing Team",
      type: "team",
      members: 5,
      lastActivity: "3 hours ago",
    },
  ])

  const [newWorkspace, setNewWorkspace] = useState({
    name: "",
    type: "solo" as "team" | "solo" | "client",
  })

  const handleCreateWorkspace = () => {
    if (newWorkspace.name) {
      const workspace: Workspace = {
        id: Date.now().toString(),
        name: newWorkspace.name,
        type: newWorkspace.type,
        members: 1,
        lastActivity: "Just now",
      }
      setWorkspaces([...workspaces, workspace])
      setNewWorkspace({ name: "", type: "solo" })
    }
  }

  const handleWorkspaceClick = (workspaceId: string) => {
    router.push(`/workspace/${workspaceId}`)
  }

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

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
            <p className="text-slate-600 mt-1">Manage your workspaces and projects</p>
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

        {/* Quick Stats */}
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
                  <p className="text-sm font-medium text-slate-600">Active Tasks</p>
                  <p className="text-2xl font-bold text-slate-800">12</p>
                </div>
                <FileText className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Hours This Week</p>
                  <p className="text-2xl font-bold text-slate-800">32.5</p>
                </div>
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Notifications</p>
                  <p className="text-2xl font-bold text-slate-800">3</p>
                </div>
                <Bell className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Workspaces Grid */}
        <div>
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Your Workspaces</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workspaces.map((workspace) => (
              <Card
                key={workspace.id}
                className={`hover:shadow-lg transition-shadow cursor-pointer border-l-4 ${getWorkspaceColor(workspace.type)}`}
                onClick={() => handleWorkspaceClick(workspace.id)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{workspace.name}</CardTitle>
                    {getWorkspaceIcon(workspace.type)}
                  </div>
                  <CardDescription className="capitalize">{workspace.type} workspace</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>
                      {workspace.members} member{workspace.members !== 1 ? "s" : ""}
                    </span>
                    <span>{workspace.lastActivity}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates across your workspaces</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Task "Design Homepage" completed</p>
                  <p className="text-xs text-slate-500">Acme Corp Website • 2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New comment on "Marketing Strategy"</p>
                  <p className="text-xs text-slate-500">Marketing Team • 4 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Time logged: 2.5 hours</p>
                  <p className="text-xs text-slate-500">Personal Projects • 1 day ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
