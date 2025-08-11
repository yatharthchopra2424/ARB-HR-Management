import {
  supabase,
  type Department,
  type Employee,
  type Skill,
  type Training,
  type TrainingPlan,
  type TrainingData,
} from "./supabase"

// Department operations
export const departmentService = {
  async getAll(): Promise<Department[]> {
    const { data, error } = await supabase.from("departments").select("*").order("name")

    if (error) throw error
    return data || []
  },

  async create(name: string): Promise<Department> {
    const { data, error } = await supabase.from("departments").insert({ name, employee_count: 0 }).select().single()

    if (error) throw error
    return data
  },

  async update(id: string, updates: Partial<Department>): Promise<Department> {
    const { data, error } = await supabase
      .from("departments")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from("departments").delete().eq("id", id)

    if (error) throw error
  },
}

// Employee operations
export const employeeService = {
  async getByDepartment(departmentId: string): Promise<Employee[]> {
    const { data, error } = await supabase
      .from("employees")
      .select(`
        *,
        department:departments(*)
      `)
      .eq("department_id", departmentId)
      .order("name")

    if (error) throw error
    return data || []
  },

  async create(employee: Omit<Employee, "id" | "created_at" | "updated_at">): Promise<Employee> {
    const { data, error } = await supabase.from("employees").insert(employee).select().single()

    if (error) throw error

    // Update department employee count
    await supabase.rpc("increment_department_count", { dept_id: employee.department_id })

    return data
  },

  async update(id: string, updates: Partial<Employee>): Promise<Employee> {
    const { data, error } = await supabase
      .from("employees")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    // Get employee to update department count
    const { data: employee } = await supabase.from("employees").select("department_id").eq("id", id).single()

    const { error } = await supabase.from("employees").delete().eq("id", id)

    if (error) throw error

    // Update department employee count
    if (employee) {
      await supabase.rpc("decrement_department_count", { dept_id: employee.department_id })
    }
  },
}

// Skill operations
export const skillService = {
  async getByDepartment(departmentId: string): Promise<Skill[]> {
    const { data, error } = await supabase.from("skills").select("*").eq("department_id", departmentId).order("name")

    if (error) throw error
    return data || []
  },

  async getEmployeeSkills(employeeId: string): Promise<Record<string, "L1" | "L2" | "L3" | "L4" | "NA">> {
    const { data, error } = await supabase
      .from("employee_skills")
      .select(`
        skill_level,
        skill:skills(name)
      `)
      .eq("employee_id", employeeId)

    if (error) throw error

    const skillsMap: Record<string, "L1" | "L2" | "L3" | "L4" | "NA"> = {}
    data?.forEach((item) => {
      if (item.skill) {
        skillsMap[item.skill.name] = item.skill_level
      }
    })

    return skillsMap
  },

  async updateEmployeeSkills(
    employeeId: string,
    skills: Record<string, "L1" | "L2" | "L3" | "L4" | "NA">,
  ): Promise<void> {
    // First, delete existing skills for this employee
    await supabase.from("employee_skills").delete().eq("employee_id", employeeId)

    // Get skill IDs for the skills
    const skillNames = Object.keys(skills)
    const { data: skillData } = await supabase.from("skills").select("id, name").in("name", skillNames)

    if (!skillData) return

    // Insert new skills
    const skillInserts = skillData.map((skill) => ({
      employee_id: employeeId,
      skill_id: skill.id,
      skill_level: skills[skill.name],
    }))

    const { error } = await supabase.from("employee_skills").insert(skillInserts)

    if (error) throw error
  },
}

// Training operations
export const trainingService = {
  async getAll(): Promise<Training[]> {
    const { data, error } = await supabase.from("trainings").select("*").order("training_date", { ascending: false })

    if (error) throw error
    return data || []
  },

  async create(
    training: Omit<Training, "id" | "created_at" | "updated_at">,
    participants: string[],
  ): Promise<Training> {
    const { data, error } = await supabase.from("trainings").insert(training).select().single()

    if (error) throw error

    // Add participants
    if (participants.length > 0) {
      const participantInserts = participants.map((name) => ({
        training_id: data.id,
        participant_name: name,
      }))

      await supabase.from("training_participants").insert(participantInserts)
    }

    return data
  },

  async getParticipants(trainingId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from("training_participants")
      .select("participant_name")
      .eq("training_id", trainingId)

    if (error) throw error
    return data?.map((p) => p.participant_name) || []
  },
}

// Training Plan operations
export const trainingPlanService = {
  async getAll(): Promise<TrainingPlan[]> {
    const { data, error } = await supabase
      .from("training_plans")
      .select(`
        *,
        department:departments(*)
      `)
      .order("created_at")

    if (error) throw error
    return data || []
  },

  async create(plan: Omit<TrainingPlan, "id" | "created_at" | "updated_at">): Promise<TrainingPlan> {
    const { data, error } = await supabase.from("training_plans").insert(plan).select().single()

    if (error) throw error
    return data
  },

  async update(id: string, updates: Partial<TrainingPlan>): Promise<TrainingPlan> {
    const { data, error } = await supabase
      .from("training_plans")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return data
  },
}

// Training Data operations
export const trainingDataService = {
  async getByYear(year: number): Promise<TrainingData[]> {
    const { data, error } = await supabase.from("training_data").select("*").eq("year", year).order("month")

    if (error) throw error
    return data || []
  },

  async updateMonth(
    month: string,
    year: number,
    updates: { planned?: number; done?: number; pending?: number },
  ): Promise<TrainingData> {
    const { data, error } = await supabase
      .from("training_data")
      .upsert({
        month,
        year,
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error
    return data
  },
}
