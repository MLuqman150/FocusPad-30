"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { TimeTracker } from "@/components/time-tracker"

export default function TimeTrackingPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Time Tracking</h1>
          <p className="text-slate-600 mt-1">Track your time and manage your productivity</p>
        </div>
        <TimeTracker workspaceId="global" />
      </div>
    </DashboardLayout>
  )
}
