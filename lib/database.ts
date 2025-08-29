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
    console.log("🔍 [DB] Fetching all departments...")
    console.log("🔍 [DB] Query: SELECT * FROM departments ORDER BY name")

    const { data, error } = await supabase.from("departments").select("*").order("name")

    if (error) {
      console.error("❌ [DB] Error fetching departments:", error)
      console.error("❌ [DB] Error details:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      throw error
    }

    console.log("✅ [DB] Departments fetched successfully:", data)
    console.log(`✅ [DB] Retrieved ${data?.length || 0} departments`)
    return data || []
  },

  async create(name: string): Promise<Department> {
    console.log(`📝 [Dept] Creating new department: ${name}`)
    console.log(`📝 [Dept] Query: INSERT INTO departments (name, employee_count) VALUES ('${name}', 0)`)

    const { data, error } = await supabase.from("departments").insert({ name, employee_count: 0 }).select().single()

    if (error) {
      console.error("❌ [Dept] Error creating department:", error)
      console.error("❌ [Dept] Error details:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      throw error
    }

    console.log("✅ [Dept] Department created successfully:", data)
    return data
  },

  async update(id: string, updates: Partial<Department>): Promise<Department> {
    console.log(`📝 [Dept] Updating department: ${id}`)
    console.log(`📝 [Dept] Update data:`, updates)
    console.log(`📝 [Dept] Query: UPDATE departments SET ... WHERE id = '${id}'`)

    const { data, error } = await supabase
      .from("departments")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("❌ [Dept] Error updating department:", error)
      console.error("❌ [Dept] Error details:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      throw error
    }

    console.log("✅ [Dept] Department updated successfully:", data)
    return data
  },

  async delete(id: string): Promise<void> {
    console.log(`🗑️ [Dept] Deleting department: ${id}`)
    console.log(`🗑️ [Dept] Query: DELETE FROM departments WHERE id = '${id}'`)

    const { error } = await supabase.from("departments").delete().eq("id", id)

    if (error) {
      console.error("❌ [Dept] Error deleting department:", error)
      console.error("❌ [Dept] Error details:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      throw error
    }

    console.log("✅ [Dept] Department deleted successfully")
  },
}

// Employee operations
export const employeeService = {
  async getByDepartment(departmentId: string): Promise<Employee[]> {
    console.log(`🔍 [Emp] Fetching employees for department: ${departmentId}`)
    console.log(`🔍 [Emp] Query: SELECT *, department:departments(*) FROM employees WHERE department_id = '${departmentId}' ORDER BY name`)

    const { data, error } = await supabase
      .from("employees")
      .select(`
        *,
        department:departments(*)
      `)
      .eq("department_id", departmentId)
      .order("name")

    if (error) {
      console.error("❌ [Emp] Error fetching employees:", error)
      console.error("❌ [Emp] Error details:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      throw error
    }

    console.log("✅ [Emp] Employees fetched successfully:", data)
    console.log(`✅ [Emp] Retrieved ${data?.length || 0} employees for department ${departmentId}`)
    return data || []
  },

  async create(employee: Omit<Employee, "id" | "created_at" | "updated_at">): Promise<Employee> {
    console.log("👤 [Emp] Creating new employee...")
    console.log("👤 [Emp] Employee data:", employee)
    console.log("👤 [Emp] Query: INSERT INTO employees (name, employee_code, position, department_id) VALUES (...)")

    const { data, error } = await supabase.from("employees").insert(employee).select().single()

    if (error) {
      console.error("❌ [Emp] Error creating employee:", error)
      console.error("❌ [Emp] Error details:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      throw error
    }

    console.log("✅ [Emp] Employee created successfully:", data)

    // Update department employee count
    console.log("🔄 [Emp] Updating department employee count...")
    console.log("🔄 [Emp] Calling RPC: increment_department_count with dept_id:", employee.department_id)

    const { data: rpcData, error: rpcError } = await supabase.rpc("increment_department_count", {
      dept_id: employee.department_id
    })

    if (rpcError) {
      console.error("❌ [Emp] Error updating department count:", rpcError)
      console.error("❌ [Emp] RPC Error details:", {
        message: rpcError.message,
        details: rpcError.details,
        hint: rpcError.hint,
        code: rpcError.code
      })
      // Don't throw here as employee was created successfully
    } else {
      console.log("✅ [Emp] Department count updated successfully:", rpcData)
    }

    return data
  },

  async update(id: string, updates: Partial<Employee>): Promise<Employee> {
    console.log(`📝 [Emp] Updating employee: ${id}`)
    console.log(`📝 [Emp] Update data:`, updates)
    console.log(`📝 [Emp] Query: UPDATE employees SET ... WHERE id = '${id}'`)

    const { data, error } = await supabase
      .from("employees")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("❌ [Emp] Error updating employee:", error)
      console.error("❌ [Emp] Error details:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      throw error
    }

    console.log("✅ [Emp] Employee updated successfully:", data)
    return data
  },

  async delete(id: string): Promise<void> {
    console.log(`🗑️ [Emp] Deleting employee: ${id}`)

    // Get employee to update department count
    console.log(`🔍 [Emp] Fetching employee details for deletion...`)
    const { data: employee, error: fetchError } = await supabase.from("employees").select("department_id").eq("id", id).single()

    if (fetchError) {
      console.error("❌ [Emp] Error fetching employee for deletion:", fetchError)
      console.error("❌ [Emp] Fetch error details:", {
        message: fetchError.message,
        details: fetchError.details,
        hint: fetchError.hint,
        code: fetchError.code
      })
    } else {
      console.log("✅ [Emp] Employee details fetched:", employee)
    }

    console.log(`🗑️ [Emp] Query: DELETE FROM employees WHERE id = '${id}'`)
    const { error } = await supabase.from("employees").delete().eq("id", id)

    if (error) {
      console.error("❌ [Emp] Error deleting employee:", error)
      console.error("❌ [Emp] Delete error details:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      throw error
    }

    console.log("✅ [Emp] Employee deleted successfully")

    // Update department employee count
    if (employee) {
      console.log("🔄 [Emp] Updating department employee count...")
      console.log("🔄 [Emp] Calling RPC: decrement_department_count with dept_id:", employee.department_id)

      const { data: rpcData, error: rpcError } = await supabase.rpc("decrement_department_count", {
        dept_id: employee.department_id
      })

      if (rpcError) {
        console.error("❌ [Emp] Error updating department count:", rpcError)
        console.error("❌ [Emp] RPC Error details:", {
          message: rpcError.message,
          details: rpcError.details,
          hint: rpcError.hint,
          code: rpcError.code
        })
        // Don't throw here as employee was deleted successfully
      } else {
        console.log("✅ [Emp] Department count updated successfully:", rpcData)
      }
    } else {
      console.log("⚠️ [Emp] No employee data found, skipping department count update")
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
      if (item.skill && typeof item.skill === 'object' && 'name' in item.skill) {
        skillsMap[String(item.skill.name)] = item.skill_level
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
    console.log(`🔍 [DB] Fetching training data for year: ${year}`)
    console.log(`🔍 [DB] Query: SELECT * FROM training_data WHERE year = ${year} ORDER BY month`)

    const { data, error } = await supabase.from("training_data").select("*").eq("year", year).order("month")

    if (error) {
      console.error("❌ [DB] Error fetching training data:", error)
      console.error("❌ [DB] Error details:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      throw error
    }

    console.log("✅ [DB] Training data fetched successfully:", data)
    console.log(`✅ [DB] Retrieved ${data?.length || 0} training records for year ${year}`)
    return data || []
  },

  async updateMonth(
    month: string,
    year: number,
    updates: { planned?: number; done?: number; pending?: number },
  ): Promise<TrainingData> {
    console.log(`🔄 [DB] Updating training data for ${month} ${year}`)
    console.log(`🔄 [DB] Update data:`, updates)
    console.log(`🔄 [DB] Query: UPSERT training_data SET month='${month}', year=${year}, ...`)

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

    if (error) {
      console.error("❌ [DB] Error updating training data:", error)
      console.error("❌ [DB] Error details:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      throw error
    }

    console.log("✅ [DB] Training data updated successfully:", data)
    return data
  },
}
