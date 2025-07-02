"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Plus, FileText, Edit, Trash2, Search } from "lucide-react"
import { format } from "date-fns"

interface Note {
  id: string
  title: string
  content: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
  author: string
}

interface NotesPanelProps {
  workspaceId: string
}

export function NotesPanel({ workspaceId }: NotesPanelProps) {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: "1",
      title: "Project Requirements",
      content: `# Project Requirements

## Core Features
- User authentication system
- Dashboard with analytics
- Real-time notifications
- File upload functionality

## Technical Stack
- **Frontend**: React, Next.js, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT tokens

## Timeline
- Week 1: Setup and authentication
- Week 2: Core features implementation
- Week 3: Testing and deployment`,
      tags: ["requirements", "planning"],
      createdAt: new Date("2024-01-10"),
      updatedAt: new Date("2024-01-12"),
      author: "John Doe",
    },
    {
      id: "2",
      title: "Meeting Notes - Jan 15",
      content: `# Team Meeting - January 15, 2024

## Attendees
- John Doe (Project Manager)
- Jane Smith (Developer)
- Mike Johnson (Designer)

## Agenda
1. Project progress review
2. Upcoming milestones
3. Resource allocation

## Key Decisions
- Move deadline for authentication to Jan 20
- Add dark mode support
- Schedule client demo for Jan 25

## Action Items
- [ ] John: Update project timeline
- [ ] Jane: Implement OAuth integration
- [ ] Mike: Create dark mode designs`,
      tags: ["meeting", "action-items"],
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date("2024-01-15"),
      author: "You",
    },
  ])

  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    tags: "",
  })

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleCreateNote = () => {
    if (newNote.title && newNote.content) {
      const note: Note = {
        id: Date.now().toString(),
        title: newNote.title,
        content: newNote.content,
        tags: newNote.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        createdAt: new Date(),
        updatedAt: new Date(),
        author: "You",
      }
      setNotes([note, ...notes])
      setNewNote({ title: "", content: "", tags: "" })
      setSelectedNote(note)
    }
  }

  const handleUpdateNote = () => {
    if (selectedNote) {
      setNotes(notes.map((note) => (note.id === selectedNote.id ? { ...selectedNote, updatedAt: new Date() } : note)))
      setIsEditing(false)
    }
  }

  const handleDeleteNote = (noteId: string) => {
    setNotes(notes.filter((note) => note.id !== noteId))
    if (selectedNote?.id === noteId) {
      setSelectedNote(null)
    }
  }

  const renderMarkdown = (content: string) => {
    // Simple markdown rendering for demo purposes
    return content
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mb-4">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold mb-3">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-medium mb-2">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/^- (.*$)/gm, '<li class="ml-4">• $1</li>')
      .replace(/^\d+\. (.*$)/gm, '<li class="ml-4">$1</li>')
      .replace(/\n/g, "<br>")
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
      {/* Notes List */}
      <Card className="lg:col-span-1">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Notes</CardTitle>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Note</DialogTitle>
                  <DialogDescription>Add a new note to your workspace</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="note-title">Title</Label>
                    <Input
                      id="note-title"
                      placeholder="Enter note title"
                      value={newNote.title}
                      onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="note-content">Content (Markdown supported)</Label>
                    <Textarea
                      id="note-content"
                      placeholder="Enter note content..."
                      className="min-h-[200px]"
                      value={newNote.content}
                      onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="note-tags">Tags (comma separated)</Label>
                    <Input
                      id="note-tags"
                      placeholder="e.g. meeting, planning, ideas"
                      value={newNote.tags}
                      onChange={(e) => setNewNote({ ...newNote, tags: e.target.value })}
                    />
                  </div>
                  <Button onClick={handleCreateNote} className="w-full">
                    Create Note
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search notes..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {filteredNotes.map((note) => (
              <div
                key={note.id}
                className={`p-3 cursor-pointer hover:bg-slate-50 border-l-4 ${
                  selectedNote?.id === note.id ? "border-l-blue-500 bg-blue-50" : "border-l-transparent"
                }`}
                onClick={() => setSelectedNote(note)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm text-slate-900 truncate">{note.title}</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      {format(note.updatedAt, "MMM d, yyyy")} • {note.author}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {note.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {note.tags.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{note.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Note Content */}
      <Card className="lg:col-span-2">
        {selectedNote ? (
          <>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{selectedNote.title}</CardTitle>
                  <p className="text-sm text-slate-500 mt-1">
                    Created {format(selectedNote.createdAt, "MMM d, yyyy")} • Updated{" "}
                    {format(selectedNote.updatedAt, "MMM d, yyyy")} • By {selectedNote.author}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                    <Edit className="mr-2 h-4 w-4" />
                    {isEditing ? "Cancel" : "Edit"}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDeleteNote(selectedNote.id)}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-3">
                {selectedNote.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardHeader>

            <CardContent>
              <Tabs value={isEditing ? "edit" : "preview"} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                  <TabsTrigger value="edit">Edit</TabsTrigger>
                </TabsList>

                <TabsContent value="preview" className="mt-4">
                  <div
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(selectedNote.content) }}
                  />
                </TabsContent>

                <TabsContent value="edit" className="mt-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-title">Title</Label>
                      <Input
                        id="edit-title"
                        value={selectedNote.title}
                        onChange={(e) => setSelectedNote({ ...selectedNote, title: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-content">Content</Label>
                      <Textarea
                        id="edit-content"
                        className="min-h-[300px] font-mono text-sm"
                        value={selectedNote.content}
                        onChange={(e) => setSelectedNote({ ...selectedNote, content: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-tags">Tags</Label>
                      <Input
                        id="edit-tags"
                        value={selectedNote.tags.join(", ")}
                        onChange={(e) =>
                          setSelectedNote({
                            ...selectedNote,
                            tags: e.target.value
                              .split(",")
                              .map((tag) => tag.trim())
                              .filter(Boolean),
                          })
                        }
                      />
                    </div>
                    <Button onClick={handleUpdateNote}>Save Changes</Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </>
        ) : (
          <CardContent className="flex items-center justify-center h-full">
            <div className="text-center">
              <FileText className="mx-auto h-12 w-12 text-slate-400" />
              <h3 className="mt-2 text-sm font-medium text-slate-900">No note selected</h3>
              <p className="mt-1 text-sm text-slate-500">Choose a note from the list to view its content.</p>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
