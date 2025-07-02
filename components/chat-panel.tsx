"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Send, Paperclip, Smile, Users } from "lucide-react"
import { format } from "date-fns"

interface Message {
  id: string
  content: string
  sender: string
  timestamp: Date
  type: "text" | "file" | "system"
  fileUrl?: string
  fileName?: string
}

interface ChatPanelProps {
  workspaceId: string
}

export function ChatPanel({ workspaceId }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hey team! Just finished the homepage design. Take a look and let me know what you think.",
      sender: "John Doe",
      timestamp: new Date("2024-01-15T10:30:00"),
      type: "text",
    },
    {
      id: "2",
      content: "Looks great! I love the color scheme. Should we proceed with the implementation?",
      sender: "Jane Smith",
      timestamp: new Date("2024-01-15T10:35:00"),
      type: "text",
    },
    {
      id: "3",
      content: "John Doe uploaded homepage-mockup.png",
      sender: "System",
      timestamp: new Date("2024-01-15T10:40:00"),
      type: "system",
    },
    {
      id: "4",
      content: "Perfect! I'll start working on the authentication system next.",
      sender: "You",
      timestamp: new Date("2024-01-15T10:45:00"),
      type: "text",
    },
  ])

  const [newMessage, setNewMessage] = useState("")
  const [onlineUsers] = useState([
    { id: "1", name: "John Doe", avatar: "/placeholder.svg?height=32&width=32" },
    { id: "2", name: "Jane Smith", avatar: "/placeholder.svg?height=32&width=32" },
    { id: "3", name: "You", avatar: "/placeholder.svg?height=32&width=32" },
  ])

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        content: newMessage,
        sender: "You",
        timestamp: new Date(),
        type: "text",
      }
      setMessages([...messages, message])
      setNewMessage("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const getUserAvatar = (sender: string) => {
    const user = onlineUsers.find((u) => u.name === sender)
    return user?.avatar || "/placeholder.svg?height=32&width=32"
  }

  const getUserInitials = (sender: string) => {
    return sender
      .split(" ")
      .map((n) => n[0])
      .join("")
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
      {/* Chat Messages */}
      <Card className="lg:col-span-3 flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Team Chat</CardTitle>
            <Badge variant="secondary" className="flex items-center space-x-1">
              <Users className="h-3 w-3" />
              <span>{onlineUsers.length} online</span>
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === "You" ? "justify-end" : "justify-start"}`}>
                {message.type === "system" ? (
                  <div className="text-center w-full">
                    <Badge variant="outline" className="text-xs">
                      {message.content}
                    </Badge>
                    <p className="text-xs text-slate-500 mt-1">{format(message.timestamp, "HH:mm")}</p>
                  </div>
                ) : (
                  <div
                    className={`flex space-x-3 max-w-xs lg:max-w-md ${message.sender === "You" ? "flex-row-reverse space-x-reverse ml-auto" : ""}`}
                  >
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarImage src={getUserAvatar(message.sender) || "/placeholder.svg"} />
                      <AvatarFallback className="text-xs bg-slate-100 text-slate-700">
                        {getUserInitials(message.sender)}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`rounded-2xl px-4 py-2 max-w-full ${
                        message.sender === "You"
                          ? "bg-blue-500 text-white rounded-br-md"
                          : "bg-slate-100 text-slate-900 rounded-bl-md"
                      }`}
                    >
                      {message.sender !== "You" && (
                        <p className="text-xs font-medium mb-1 opacity-70">{message.sender}</p>
                      )}
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      <p className={`text-xs mt-1 ${message.sender === "You" ? "text-blue-100" : "text-slate-500"}`}>
                        {format(message.timestamp, "HH:mm")}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Paperclip className="h-4 w-4" />
            </Button>
            <div className="flex-1 relative">
              <Input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pr-10"
              />
              <Button variant="ghost" size="sm" className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0">
                <Smile className="h-4 w-4" />
              </Button>
            </div>
            <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Online Users */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Online Now</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {onlineUsers.map((user) => (
              <div key={user.id} className="flex items-center space-x-3">
                <div className="relative">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="text-xs">{getUserInitials(user.name)}</AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">{user.name}</p>
                  <p className="text-xs text-slate-500">Active now</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
