"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { KanbanBoard } from "@/components/kanban-board"
import { ChatPanel } from "@/components/chat-panel"
import { NotesPanel } from "@/components/notes-panel"
import { TimeTracker } from "@/components/time-tracker"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, MessageSquare, FileText, Clock, Settings, Share } from "lucide-react"

export default function WorkspacePage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("board")

  // Mock workspace data
  const workspace = {
    id: params.id,
    name: params.id === "1" ? "Personal Projects" : params.id === "2" ? "Acme Corp Website" : "Marketing Team",
    type: params.id === "1" ? "solo" : params.id === "2" ? "client" : "team",
    members: [
      { id: "1", name: "You", avatar: "/placeholder.svg?height=32&width=32", online: true },
      { id: "2", name: "John Doe", avatar: "/placeholder.svg?height=32&width=32", online: true },
      { id: "3", name: "Jane Smith", avatar: "/placeholder.svg?height=32&width=32", online: false },
    ],
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Workspace Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">{workspace.name}</h1>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="secondary" className="capitalize">
                  {workspace.type}
                </Badge>
                <span className="text-sm text-slate-500">
                  {workspace.members.length} member{workspace.members.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Share className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>

        {/* Members */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-slate-600">Team:</span>
          <div className="flex -space-x-2">
            {workspace.members.map((member) => (
              <div key={member.id} className="relative">
                <img
                  src={member.avatar || "/placeholder.svg"}
                  alt={member.name}
                  className="w-8 h-8 rounded-full border-2 border-white"
                />
                {member.online && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="board" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Board</span>
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4" />
              <span>Chat</span>
            </TabsTrigger>
            <TabsTrigger value="notes" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Notes</span>
            </TabsTrigger>
            <TabsTrigger value="time" className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>Time</span>
            </TabsTrigger>
            <TabsTrigger value="files" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Files</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="board" className="space-y-4">
            <KanbanBoard workspaceId={workspace.id} />
          </TabsContent>

          <TabsContent value="chat" className="space-y-4">
            <ChatPanel workspaceId={workspace.id} />
          </TabsContent>

          <TabsContent value="notes" className="space-y-4">
            <NotesPanel workspaceId={workspace.id} />
          </TabsContent>

          <TabsContent value="time" className="space-y-4">
            <TimeTracker workspaceId={workspace.id} />
          </TabsContent>

          <TabsContent value="files" className="space-y-4">
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-slate-400" />
              <h3 className="mt-2 text-sm font-medium text-slate-900">No files</h3>
              <p className="mt-1 text-sm text-slate-500">Get started by uploading a file.</p>
              <div className="mt-6">
                <Button>Upload File</Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
