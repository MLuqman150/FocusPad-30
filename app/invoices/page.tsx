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
import { Plus, Download, Eye, Send, DollarSign, Calendar, FileText } from "lucide-react"
import { format } from "date-fns"

interface Invoice {
  id: string
  invoiceNumber: string
  client: string
  amount: number
  status: "draft" | "sent" | "paid" | "overdue"
  dueDate: Date
  createdDate: Date
  items: InvoiceItem[]
  notes?: string
}

interface InvoiceItem {
  id: string
  description: string
  hours: number
  rate: number
  amount: number
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: "1",
      invoiceNumber: "INV-001",
      client: "Acme Corp",
      amount: 2250,
      status: "paid",
      dueDate: new Date("2024-01-30"),
      createdDate: new Date("2024-01-15"),
      items: [
        {
          id: "1",
          description: "Homepage Design & Development",
          hours: 15,
          rate: 75,
          amount: 1125,
        },
        {
          id: "2",
          description: "User Authentication System",
          hours: 15,
          rate: 75,
          amount: 1125,
        },
      ],
      notes: "Thank you for your business!",
    },
    {
      id: "2",
      invoiceNumber: "INV-002",
      client: "TechStart Inc",
      amount: 1800,
      status: "sent",
      dueDate: new Date("2024-02-15"),
      createdDate: new Date("2024-01-20"),
      items: [
        {
          id: "1",
          description: "Mobile App UI Design",
          hours: 24,
          rate: 75,
          amount: 1800,
        },
      ],
    },
    {
      id: "3",
      invoiceNumber: "INV-003",
      client: "Creative Studio",
      amount: 900,
      status: "draft",
      dueDate: new Date("2024-02-20"),
      createdDate: new Date("2024-01-25"),
      items: [
        {
          id: "1",
          description: "Brand Identity Design",
          hours: 12,
          rate: 75,
          amount: 900,
        },
      ],
    },
  ])

  const [newInvoice, setNewInvoice] = useState({
    client: "",
    dueDate: "",
    notes: "",
  })

  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)

  const handleCreateInvoice = () => {
    if (newInvoice.client) {
      const invoice: Invoice = {
        id: Date.now().toString(),
        invoiceNumber: `INV-${String(invoices.length + 1).padStart(3, "0")}`,
        client: newInvoice.client,
        amount: 0,
        status: "draft",
        dueDate: new Date(newInvoice.dueDate),
        createdDate: new Date(),
        items: [],
        notes: newInvoice.notes,
      }
      setInvoices([invoice, ...invoices])
      setNewInvoice({ client: "", dueDate: "", notes: "" })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800"
      case "sent":
        return "bg-blue-100 text-blue-800"
      case "overdue":
        return "bg-red-100 text-red-800"
      case "draft":
        return "bg-slate-100 text-slate-800"
      default:
        return "bg-slate-100 text-slate-800"
    }
  }

  const getTotalRevenue = () => {
    return invoices.filter((invoice) => invoice.status === "paid").reduce((total, invoice) => total + invoice.amount, 0)
  }

  const getPendingAmount = () => {
    return invoices.filter((invoice) => invoice.status === "sent").reduce((total, invoice) => total + invoice.amount, 0)
  }

  const getOverdueAmount = () => {
    return invoices
      .filter((invoice) => invoice.status === "overdue")
      .reduce((total, invoice) => total + invoice.amount, 0)
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Invoices</h1>
            <p className="text-slate-600 mt-1">Manage your invoices and track payments</p>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Invoice
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Invoice</DialogTitle>
                <DialogDescription>Generate an invoice from your time entries</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="invoice-client">Client</Label>
                  <Select
                    value={newInvoice.client}
                    onValueChange={(value) => setNewInvoice({ ...newInvoice, client: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select client" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Acme Corp">Acme Corp</SelectItem>
                      <SelectItem value="TechStart Inc">TechStart Inc</SelectItem>
                      <SelectItem value="Creative Studio">Creative Studio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="invoice-due-date">Due Date</Label>
                  <Input
                    id="invoice-due-date"
                    type="date"
                    value={newInvoice.dueDate}
                    onChange={(e) => setNewInvoice({ ...newInvoice, dueDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="invoice-notes">Notes (Optional)</Label>
                  <Textarea
                    id="invoice-notes"
                    placeholder="Add any additional notes..."
                    value={newInvoice.notes}
                    onChange={(e) => setNewInvoice({ ...newInvoice, notes: e.target.value })}
                  />
                </div>
                <Button onClick={handleCreateInvoice} className="w-full">
                  Create Invoice
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
                  <p className="text-sm font-medium text-slate-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-slate-800">${getTotalRevenue().toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Pending</p>
                  <p className="text-2xl font-bold text-slate-800">${getPendingAmount().toLocaleString()}</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Overdue</p>
                  <p className="text-2xl font-bold text-slate-800">${getOverdueAmount().toLocaleString()}</p>
                </div>
                <div className="h-8 w-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <span className="text-red-600 font-bold">!</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Invoices</p>
                  <p className="text-2xl font-bold text-slate-800">{invoices.length}</p>
                </div>
                <FileText className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Invoices List */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Invoices</CardTitle>
            <CardDescription>Manage and track your invoice status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50"
                >
                  <div className="flex items-center space-x-4">
                    <div>
                      <h3 className="font-medium text-slate-900">{invoice.invoiceNumber}</h3>
                      <p className="text-sm text-slate-600">{invoice.client}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <p className="font-medium text-slate-900">${invoice.amount.toLocaleString()}</p>
                      <p className="text-xs text-slate-500">Due {format(invoice.dueDate, "MMM d, yyyy")}</p>
                    </div>

                    <Badge className={getStatusColor(invoice.status)} variant="secondary">
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </Badge>

                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => setSelectedInvoice(invoice)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      {invoice.status === "draft" && (
                        <Button variant="outline" size="sm">
                          <Send className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Invoice Preview Modal */}
        {selectedInvoice && (
          <Dialog open={!!selectedInvoice} onOpenChange={() => setSelectedInvoice(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Invoice Preview</DialogTitle>
                <DialogDescription>
                  {selectedInvoice.invoiceNumber} - {selectedInvoice.client}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Invoice Header */}
                <div className="flex justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">INVOICE</h2>
                    <p className="text-slate-600">{selectedInvoice.invoiceNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">Your Business Name</p>
                    <p className="text-sm text-slate-600">your@email.com</p>
                    <p className="text-sm text-slate-600">+1 (555) 123-4567</p>
                  </div>
                </div>

                {/* Client & Dates */}
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-medium mb-2">Bill To:</h3>
                    <p className="font-medium">{selectedInvoice.client}</p>
                  </div>
                  <div className="text-right">
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Invoice Date:</span>
                        <span>{format(selectedInvoice.createdDate, "MMM d, yyyy")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Due Date:</span>
                        <span>{format(selectedInvoice.dueDate, "MMM d, yyyy")}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Invoice Items */}
                <div>
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Description</th>
                        <th className="text-right py-2">Hours</th>
                        <th className="text-right py-2">Rate</th>
                        <th className="text-right py-2">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedInvoice.items.map((item) => (
                        <tr key={item.id} className="border-b">
                          <td className="py-2">{item.description}</td>
                          <td className="text-right py-2">{item.hours}</td>
                          <td className="text-right py-2">${item.rate}</td>
                          <td className="text-right py-2">${item.amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Total */}
                <div className="flex justify-end">
                  <div className="w-64">
                    <div className="flex justify-between py-2 border-t font-medium">
                      <span>Total:</span>
                      <span>${selectedInvoice.amount}</span>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {selectedInvoice.notes && (
                  <div>
                    <h3 className="font-medium mb-2">Notes:</h3>
                    <p className="text-slate-600">{selectedInvoice.notes}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex space-x-2">
                  <Button className="flex-1">
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </Button>
                  {selectedInvoice.status === "draft" && (
                    <Button variant="outline" className="flex-1 bg-transparent">
                      <Send className="mr-2 h-4 w-4" />
                      Send Invoice
                    </Button>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </DashboardLayout>
  )
}
