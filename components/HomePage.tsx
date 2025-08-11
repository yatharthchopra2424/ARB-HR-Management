"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Building2,
  Users,
  GraduationCap,
  BarChart3,
  Shield,
  Target,
  ArrowRight,
  CheckCircle,
  Star,
  Award,
} from "lucide-react"

interface HomePageProps {
  onEnterDashboard: () => void
}

export function HomePage({ onEnterDashboard }: HomePageProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleEnterDashboard = () => {
    setIsLoading(true)
    setTimeout(() => {
      onEnterDashboard()
      setIsLoading(false)
    }, 1000)
  }

  const features = [
    {
      icon: Users,
      title: "Employee Management",
      description: "Comprehensive employee profiles with skill tracking and performance monitoring",
    },
    {
      icon: Building2,
      title: "Department Organization",
      description: "Structured department management with role-based access and reporting",
    },
    {
      icon: GraduationCap,
      title: "Training Programs",
      description: "Advanced training scheduling, tracking, and competency development",
    },
    {
      icon: BarChart3,
      title: "Analytics & Reporting",
      description: "Real-time insights and comprehensive reporting for data-driven decisions",
    },
    {
      icon: Shield,
      title: "Skill Matrix",
      description: "Interactive skill assessment with L1-L4 proficiency levels",
    },
    {
      icon: Target,
      title: "Goal Tracking",
      description: "Set and monitor training goals with progress visualization",
    },
  ]

  const stats = [
    { label: "Departments", value: "9+", icon: Building2 },
    { label: "Employees", value: "239+", icon: Users },
    { label: "Training Sessions", value: "300+", icon: GraduationCap },
    { label: "Skill Categories", value: "50+", icon: Award },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src="/images/arb-logo.jpg" alt="ARB Bearings" className="h-12 w-auto" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">ARB Bearings</h1>
                <p className="text-sm text-gray-600">HR Management System</p>
              </div>
            </div>
            <Badge variant="secondary" className="px-3 py-1">
              v2.0
            </Badge>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <Badge className="mb-4 px-4 py-2 bg-blue-100 text-blue-800 border-blue-200">
              <Star className="h-4 w-4 mr-2" />
              Advanced HR Management Platform
            </Badge>
            <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              ARB HR
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Management System
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Streamline your human resources operations with our comprehensive platform designed for modern
              manufacturing environments. Track skills, manage training, and optimize workforce performance.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button
              size="lg"
              className="px-8 py-4 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              onClick={handleEnterDashboard}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Loading Dashboard...
                </>
              ) : (
                <>
                  Enter Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-4 text-lg bg-transparent">
              View Documentation
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            {stats.map((stat, index) => (
              <Card key={index} className="p-6 bg-white/60 backdrop-blur-sm border-gray-200">
                <CardContent className="p-0 text-center">
                  <div className="flex justify-center mb-3">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <stat.icon className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Powerful Features for Modern HR</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to manage your workforce effectively, from skill tracking to training management.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow bg-white/80 backdrop-blur-sm">
                <CardContent className="p-0">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg mr-4">
                      <feature.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Why Choose ARB HR Management?</h2>
              <div className="space-y-4">
                {[
                  "Comprehensive skill matrix with L1-L4 proficiency tracking",
                  "Advanced training scheduling and progress monitoring",
                  "Real-time analytics and performance insights",
                  "Department-specific customization and reporting",
                  "Secure data management with role-based access",
                  "Mobile-responsive design for on-the-go access",
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <Card className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                <CardContent className="p-0">
                  <div className="text-center">
                    <div className="mb-6">
                      <div className="inline-flex p-4 bg-blue-100 rounded-full">
                        <Award className="h-12 w-12 text-blue-600" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Industry Leading Platform</h3>
                    <p className="text-gray-600 mb-6">
                      Trusted by manufacturing companies worldwide for comprehensive HR management and workforce
                      optimization.
                    </p>
                    <div className="flex justify-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-sm text-gray-500 mt-2">Rated 5/5 by our users</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <img src="/images/arb-logo.jpg" alt="ARB Bearings" className="h-10 w-auto brightness-0 invert" />
            <div>
              <h3 className="text-lg font-semibold">ARB Bearings</h3>
              <p className="text-gray-400 text-sm">HR Management System</p>
            </div>
          </div>
          <p className="text-gray-400 mb-4">Empowering organizations with intelligent HR management solutions.</p>
          <div className="flex justify-center gap-6 text-sm text-gray-400">
            <span>© 2025 ARB Bearings. All rights reserved.</span>
            <span>•</span>
            <span>Version 2.0</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
