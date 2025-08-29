"use client"

import { useState } from "react"
import { HomePage } from "../components/HomePage"
import { AuthPage } from "../components/AuthPage"
import { Dashboard } from "../components/Dashboard"
import { AuthProvider, useAuth } from "../lib/auth-context"

type AppState = "home" | "auth" | "dashboard"

function AppContent() {
  const [appState, setAppState] = useState<AppState>("home")
  const [currentUser, setCurrentUser] = useState<string>("")
  const { user, loading } = useAuth()

  // If user is authenticated, show dashboard
  if (user && !loading) {
    const username = user.email?.split('@')[0] || 'User'
    return <Dashboard username={username} onLogout={() => {}} />
  }

  // If still loading auth state, show loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  const handleEnterDashboard = () => {
    setAppState("auth")
  }

  const handleAuthSuccess = (username: string) => {
    setCurrentUser(username)
    setAppState("dashboard")
  }

  if (appState === "home") {
    return <HomePage onEnterDashboard={handleEnterDashboard} />
  }

  if (appState === "auth") {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />
  }

  return <Dashboard username={currentUser} onLogout={() => setAppState("home")} />
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
