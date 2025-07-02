"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Chrome, Mail, Users, Clock, FileText, DollarSign } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">CollabFlow</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Minimalist collaboration tool for small teams and freelancers. Manage projects, track time, and grow your
            business.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Features Section */}
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">Team Collaboration</h3>
                  <p className="text-sm text-slate-600">Kanban boards & real-time chat</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Clock className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">Time Tracking</h3>
                  <p className="text-sm text-slate-600">Track time on tasks & projects</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FileText className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">Client Portal</h3>
                  <p className="text-sm text-slate-600">Share progress with clients</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">Invoice Generation</h3>
                  <p className="text-sm text-slate-600">Generate invoices from time logs</p>
                </div>
              </div>
            </div>
          </div>

          {/* Auth Section */}
          <Card className="w-full max-w-md mx-auto">
            <CardHeader>
              <CardTitle>{isLogin ? "Welcome Back" : "Get Started"}</CardTitle>
              <CardDescription>
                {isLogin ? "Sign in to your account" : "Create your account to start collaborating"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={isLogin ? "login" : "signup"} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login" onClick={() => setIsLogin(true)}>
                    Login
                  </TabsTrigger>
                  <TabsTrigger value="signup" onClick={() => setIsLogin(false)}>
                    Sign Up
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="Enter your email" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" placeholder="Enter your password" />
                  </div>
                  <Link href="/dashboard">
                    <Button className="w-full">Sign In</Button>
                  </Link>
                </TabsContent>

                <TabsContent value="signup" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="Enter your full name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="Enter your email" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" placeholder="Create a password" />
                  </div>
                  <Link href="/dashboard">
                    <Button className="w-full">Create Account</Button>
                  </Link>
                </TabsContent>
              </Tabs>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-slate-500">Or continue with</span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <Button variant="outline" className="w-full bg-transparent">
                    <Chrome className="mr-2 h-4 w-4" />
                    Google
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent">
                    <Mail className="mr-2 h-4 w-4" />
                    Email
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
