"use client"

import { useState } from "react"
import { HomePage } from "../components/HomePage"
import { LoginPage } from "../components/LoginPage"
import { Dashboard } from "../components/Dashboard"

type AppState = "home" | "login" | "dashboard"

export default function App() {
  const [appState, setAppState] = useState<AppState>("home")
  const [currentUser, setCurrentUser] = useState<string>("")

  const handleEnterDashboard = () => {
    setAppState("login")
  }

  const handleLogin = (username: string) => {
    setCurrentUser(username)
    setAppState("dashboard")
  }

  const handleLogout = () => {
    setCurrentUser("")
    setAppState("home")
  }

  if (appState === "home") {
    return <HomePage onEnterDashboard={handleEnterDashboard} />
  }

  if (appState === "login") {
    return <LoginPage onLogin={handleLogin} />
  }

  return <Dashboard username={currentUser} onLogout={handleLogout} />
}
