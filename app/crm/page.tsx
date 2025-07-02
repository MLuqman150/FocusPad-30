"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, Mail, Phone, Building, DollarSign, User } from "lucide-react"
import { format } from "date-fns"

interface Client {
  id: string
  name: string
  company: string
  email: string
  phone: string
  status: "active" | "inactive" | "prospect"
  totalProjects: number
  totalRevenue: number
  lastContact: Date
  notes: string
  avatar?: string
}

export default function CRMPage() {
  const [clients, setClients] = useState<Client[]>([
    {
      id: "1",
      name: "John Smith",
      company: "Acme Corp",
      email: "john@acmecorp.com",
      phone: "+1 (555) 123-4567",
      status: "active",
      totalProjects: 3,
      totalRevenue: 15750,
      lastContact: new Date("2024-01-15"),
      notes: "Great client, always pays on time. Interested in expanding to mobile app development.",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "2",
      name: "Sarah Johnson",
      company: "TechStart Inc",
      email: "sarah@techstart.com",
      phone: "+1 (555) 987-6543",
      status: "active",
      totalProjects: 1,
      totalRevenue: 8500,
      lastContact: new Date("2024-01-12"),
      notes: "Startup focused on fintech. Looking for ongoing design support.",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "3",
      name: "Mike Wilson",
      company: "Creative Studio",
      email: "mike@creativestudio.com",
      phone: "+1 (555) 456-7890",
      status: "prospect",
      totalProjects: 0,
      totalRevenue: 0,
      lastContact: new Date("2024-01-10"),
      notes: "Potential client for brand identity work. Follow up next week.",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ])

  const [newClient, setNewClient] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    status: "prospect" as "active" | "inactive" | "prospect",
    notes: "",
  })

  const [selectedClient, setSelectedClient] = useState<Client | null>(null)

  const handleCreateClient = () => {
    if (newClient.name && newClient.email) {
      const client: Client = {
        id: Date.now().toString(),
        name: newClient.name,
        company: newClient.company,
        email: newClient.email,
        phone: newClient.phone,
        status: newClient.status,
        totalProjects: 0,
        totalRevenue: 0,
        lastContact: new Date(),
        notes: newClient.notes,
        avatar: "/placeholder.svg?height=40&width=40",
      }
      setClients([client, ...clients])
      setNewClient({
        name: "",
        company: "",
        email: "",
        phone: "",
        status: "prospect",
        notes: "",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-slate-100 text-slate-800"
      case "prospect":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-slate-100 text-slate-800"
    }
  }

  const getTotalClients = () => clients.length
  const getActiveClients = () => clients.filter((c) => c.status === "active").length
  const getProspects = () => clients.filter((c) => c.status === "prospect").length
  const getTotalRevenue = () => clients.reduce((total, client) => total + client.totalRevenue, 0)

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">CRM</h1>
            <p className="text-slate-600 mt-1">Manage your client relationships and projects</p>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Client
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Client</DialogTitle>
                <DialogDescription>Add a new client to your CRM system</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="client-name">Full Name</Label>
                    <Input
                      id="client-name"
                      placeholder="Enter client name"
                      value={newClient.name}
                      onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="client-company">Company</Label>
                    <Input
                      id="client-company"
                      placeholder="Enter company name"
                      value={newClient.company}
                      onChange={(e) => setNewClient({ ...newClient, company: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="client-email">Email</Label>
                    <Input
                      id="client-email"
                      type="email"
                      placeholder="Enter email address"
                      value={newClient.email}
                      onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="client-phone">Phone</Label>
                    <Input
                      id="client-phone"
                      placeholder="Enter phone number"
                      value={newClient.phone}
                      onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client-status">Status</Label>
                  <Select
                    value={newClient.status}
                    onValueChange={(value: "active" | "inactive" | "prospect") =>
                      setNewClient({ ...newClient, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="prospect">Prospect</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client-notes">Notes</Label>
                  <Textarea
                    id="client-notes"
                    placeholder="Add any notes about this client..."
                    value={newClient.notes}
                    onChange={(e) => setNewClient({ ...newClient, notes: e.target.value })}
                  />
                </div>
                <Button onClick={handleCreateClient} className="w-full">
                  Add Client
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
                  <p className="text-sm font-medium text-slate-600">Total Clients</p>
                  <p className="text-2xl font-bold text-slate-800">{getTotalClients()}</p>
                </div>
                <User className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Active Clients</p>
                  <p className="text-2xl font-bold text-slate-800">{getActiveClients()}</p>
                </div>
                <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 font-bold">✓</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Prospects</p>
                  <p className="text-2xl font-bold text-slate-800">{getProspects()}</p>
                </div>
                <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 font-bold">?</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-slate-800">${getTotalRevenue().toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Clients Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {clients.map((client) => (
            <Card key={client.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={client.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {client.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{client.name}</CardTitle>
                      <CardDescription>{client.company}</CardDescription>
                    </div>
                  </div>
                  <Badge className={getStatusColor(client.status)} variant="secondary">
                    {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Contact Info */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-slate-600">
                    <Mail className="h-4 w-4" />
                    <span>{client.email}</span>
                  </div>
                  {client.phone && (
                    <div className="flex items-center space-x-2 text-sm text-slate-600">
                      <Phone className="h-4 w-4" />
                      <span>{client.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2 text-sm text-slate-600">
                    <Building className="h-4 w-4" />
                    <span>{client.company}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                  <div className="text-center">
                    <p className="text-lg font-bold text-slate-800">{client.totalProjects}</p>
                    <p className="text-xs text-slate-600">Projects</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-slate-800">${client.totalRevenue.toLocaleString()}</p>
                    <p className="text-xs text-slate-600">Revenue</p>
                  </div>
                </div>

                {/* Last Contact */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Last Contact:</span>
                  <span className="font-medium">{format(client.lastContact, "MMM d, yyyy")}</span>
                </div>

                {/* Notes Preview */}
                {client.notes && (
                  <div className="pt-2 border-t">
                    <p className="text-xs text-slate-600 line-clamp-2">{client.notes}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex space-x-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    <Mail className="mr-2 h-4 w-4" />
                    Email
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    <Phone className="mr-2 h-4 w-4" />
                    Call
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest interactions with your clients</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Payment received from Acme Corp</p>
                  <p className="text-xs text-slate-500">2 hours ago • $2,250</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New project started with TechStart Inc</p>
                  <p className="text-xs text-slate-500">1 day ago • Mobile App Design</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Follow-up call scheduled with Creative Studio</p>
                  <p className="text-xs text-slate-500">2 days ago • Brand Identity Discussion</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
