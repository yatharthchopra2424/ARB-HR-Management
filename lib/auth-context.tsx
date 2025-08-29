"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from './supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log("🔐 [Auth] Initializing authentication...")

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("🔐 [Auth] Initial session:", session)
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("🔐 [Auth] Auth state changed:", event, session?.user?.email)
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string) => {
    console.log("🔐 [Auth] Signing up user:", email)
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      console.error("❌ [Auth] Sign up error:", error)
    } else {
      console.log("✅ [Auth] Sign up successful")
    }

    return { error }
  }

  const signIn = async (email: string, password: string) => {
    console.log("🔐 [Auth] Signing in user:", email)
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error("❌ [Auth] Sign in error:", error)
    } else {
      console.log("✅ [Auth] Sign in successful")
    }

    return { error }
  }

  const signOut = async () => {
    console.log("🔐 [Auth] Signing out user...")
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error("❌ [Auth] Sign out error:", error)
    } else {
      console.log("✅ [Auth] Sign out successful")
    }
  }

  const resetPassword = async (email: string) => {
    console.log("🔐 [Auth] Resetting password for:", email)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (error) {
      console.error("❌ [Auth] Password reset error:", error)
    } else {
      console.log("✅ [Auth] Password reset email sent")
    }

    return { error }
  }

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}