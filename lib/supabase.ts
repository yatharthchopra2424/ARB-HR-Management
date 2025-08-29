import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

console.log("🔧 [Supabase] Initializing Supabase client...")
console.log("🔧 [Supabase] URL:", supabaseUrl ? "✅ Configured" : "❌ Missing")
console.log("🔧 [Supabase] Anon Key:", supabaseAnonKey ? "✅ Configured" : "❌ Missing")

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

console.log("✅ [Supabase] Client initialized successfully")
console.log("🔧 [Supabase] Client config:", {
  url: supabaseUrl,
  hasAnonKey: !!supabaseAnonKey,
  clientVersion: "Latest"
})

// Database types
export interface Department {
  id: string
  name: string
  employee_count: number
  created_at: string
  updated_at: string
}

export interface Employee {
  id: string
  name: string
  employee_code: string
  position: string
  department_id: string
  created_at: string
  updated_at: string
  department?: Department
}

export interface Skill {
  id: string
  name: string
  department_id: string
  created_at: string
}

export interface EmployeeSkill {
  id: string
  employee_id: string
  skill_id: string
  skill_level: "L1" | "L2" | "L3" | "L4" | "NA"
  created_at: string
  updated_at: string
  skill?: Skill
}

export interface Training {
  id: string
  title: string
  description: string
  training_date: string
  training_time: string
  duration: number
  location: string
  organizer: string
  training_type: "Team Training" | "One-on-One" | "All Hands" | "Interview" | "Training"
  created_at: string
  updated_at: string
}

export interface TrainingParticipant {
  id: string
  training_id: string
  participant_name: string
  created_at: string
}

export interface TrainingPlan {
  id: string
  department_id: string
  training_topic: string
  planned_months: string[]
  actual_months: string[]
  created_at: string
  updated_at: string
  department?: Department
}

export interface TrainingData {
  id: string
  month: string
  year: number
  planned: number
  done: number
  pending: number
  created_at: string
  updated_at: string
}
