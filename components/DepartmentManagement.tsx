"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Edit2, Users, Eye, UserPlus, Settings, Trash2, Loader2 } from "lucide-react"
import { SkillMatrix } from "./SkillMatrix"
import { departmentService, employeeService, skillService } from "../lib/database"
import type { Department, Employee, Skill } from "../lib/supabase"

export function DepartmentManagement() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null)
  const [isAddingDepartment, setIsAddingDepartment] = useState(false)
  const [isEditingDepartment, setIsEditingDepartment] = useState(false)
  const [isAddingEmployee, setIsAddingEmployee] = useState(false)
  const [loading, setLoading] = useState(true)
  const [newDepartment, setNewDepartment] = useState({ name: "" })
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null)
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    employee_code: "",
    position: "",
    department_id: "",
  })

  // Load data from Supabase
  useEffect(() => {
    loadDepartments()
  }, [])

  useEffect(() => {
    if (departments.length > 0) {
      loadEmployees()
      loadSkills()
    }
  }, [departments])

  const loadDepartments = async () => {
    try {
      console.log("📊 [Dept] Loading departments...")
      const data = await departmentService.getAll()
      console.log("✅ [Dept] Departments loaded:", data)
      setDepartments(data)
    } catch (error) {
      console.error("❌ [Dept] Error loading departments:", error)
    }
  }

  const loadEmployees = async () => {
    try {
      console.log("👥 [Emp] Loading employees...")
      const allEmployees: Employee[] = []
      for (const dept of departments) {
        try {
          const deptEmployees = await employeeService.getByDepartment(dept.id)
          allEmployees.push(...deptEmployees)
        } catch (error) {
          console.error(`❌ [Emp] Error loading employees for department ${dept.id}:`, error)
        }
      }
      console.log("✅ [Emp] Employees loaded:", allEmployees)
      setEmployees(allEmployees)
    } catch (error) {
      console.error("❌ [Emp] Error loading employees:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadSkills = async () => {
    try {
      console.log("🎯 [Skill] Loading skills...")
      const allSkills: Skill[] = []
      for (const dept of departments) {
        try {
          const deptSkills = await skillService.getByDepartment(dept.id)
          allSkills.push(...deptSkills)
        } catch (error) {
          console.error(`❌ [Skill] Error loading skills for department ${dept.id}:`, error)
        }
      }
      console.log("✅ [Skill] Skills loaded:", allSkills)
      setSkills(allSkills)
    } catch (error) {
      console.error("❌ [Skill] Error loading skills:", error)
    }
  }

  const getEmployeesByDepartment = (departmentId: string): Employee[] => {
    return employees.filter(emp => emp.department_id === departmentId)
  }

  const handleAddDepartment = async () => {
    if (!newDepartment.name.trim()) return

    try {
      console.log("📝 [Dept] Adding new department:", newDepartment.name)
      const department = await departmentService.create(newDepartment.name)
      console.log("✅ [Dept] Department added successfully:", department)

      setDepartments([...departments, department])
      setNewDepartment({ name: "" })
      setIsAddingDepartment(false)
    } catch (error) {
      console.error("❌ [Dept] Error adding department:", error)
    }
  }

  const handleEditDepartment = (department: Department) => {
    setEditingDepartment(department)
    setIsEditingDepartment(true)
  }

  const handleUpdateDepartment = async () => {
    if (!editingDepartment || !editingDepartment.name.trim()) return

    try {
      console.log("📝 [Dept] Updating department:", editingDepartment.id)
      const updated = await departmentService.update(editingDepartment.id, {
        name: editingDepartment.name
      })
      console.log("✅ [Dept] Department updated successfully:", updated)

      setDepartments(departments.map(dept =>
        dept.id === editingDepartment.id ? updated : dept
      ))
      setIsEditingDepartment(false)
      setEditingDepartment(null)
    } catch (error) {
      console.error("❌ [Dept] Error updating department:", error)
    }
  }

  const handleDeleteDepartment = async (departmentId: string) => {
    try {
      console.log("🗑️ [Dept] Deleting department:", departmentId)
      await departmentService.delete(departmentId)
      console.log("✅ [Dept] Department deleted successfully")

      setDepartments(departments.filter(dept => dept.id !== departmentId))
      if (selectedDepartment === departmentId) {
        setSelectedDepartment(null)
      }
    } catch (error) {
      console.error("❌ [Dept] Error deleting department:", error)
    }
  }

  const handleAddEmployee = async () => {
    if (!newEmployee.name.trim() || !newEmployee.employee_code.trim() ||
        !newEmployee.position.trim() || !selectedDepartment) {
      console.error("❌ [Emp] Please fill in all required fields")
      return
    }

    try {
      console.log("👤 [Emp] Adding new employee:", newEmployee.name)
      const employee = await employeeService.create({
        name: newEmployee.name,
        employee_code: newEmployee.employee_code,
        position: newEmployee.position,
        department_id: selectedDepartment,
      })
      console.log("✅ [Emp] Employee added successfully:", employee)

      // Initialize skills for the new employee with default "NA" values
      const department = departments.find(d => d.id === selectedDepartment)
      if (department) {
        const deptSkills = skills.filter(s => s.department_id === selectedDepartment)
        const initialSkills: Record<string, "L1" | "L2" | "L3" | "L4" | "NA"> = {}

        deptSkills.forEach(skill => {
          initialSkills[skill.name] = "NA"
        })

        if (Object.keys(initialSkills).length > 0) {
          console.log("🎯 [Skill] Initializing skills for new employee:", initialSkills)
          await skillService.updateEmployeeSkills(employee.id, initialSkills)
          console.log("✅ [Skill] Skills initialized for new employee")
        }
      }

      setEmployees([...employees, employee])
      setNewEmployee({ name: "", employee_code: "", position: "", department_id: "" })
      setIsAddingEmployee(false)

      // Refresh departments to update employee count
      await loadDepartments()
      await loadEmployees() // Refresh to get updated employee data with skills
    } catch (error) {
      console.error("❌ [Emp] Error adding employee:", error)
    }
  }

  const handleDeleteEmployee = async (employeeId: string) => {
    try {
      console.log("🗑️ [Emp] Deleting employee:", employeeId)
      await employeeService.delete(employeeId)
      console.log("✅ [Emp] Employee deleted successfully")

      setEmployees(employees.filter(emp => emp.id !== employeeId))
      // Refresh departments to update employee count
      await loadDepartments()
    } catch (error) {
      console.error("❌ [Emp] Error deleting employee:", error)
    }
  }

  const handleUpdateEmployeeSkills = async (employeeId: string, skills: Record<string, "L1" | "L2" | "L3" | "L4" | "NA">) => {
    try {
      console.log("🎯 [Skill] Updating employee skills:", employeeId, skills)
      await skillService.updateEmployeeSkills(employeeId, skills)
      console.log("✅ [Skill] Employee skills updated successfully")

      // Refresh employees to get updated skill data
      await loadEmployees()
    } catch (error) {
      console.error("❌ [Skill] Error updating employee skills:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading departments...</p>
        </div>
      </div>
    )
  }

  if (selectedDepartment) {
    const department = departments.find((d) => d.id === selectedDepartment)
    const departmentEmployees = getEmployeesByDepartment(selectedDepartment)

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Button variant="outline" onClick={() => setSelectedDepartment(null)} className="mb-2">
              ← Back to Departments
            </Button>
            <h2>{department?.name} Department</h2>
            <p className="text-muted-foreground">Manage employees and department details</p>
          </div>
          <div className="flex gap-2">
            <Dialog open={isAddingEmployee} onOpenChange={setIsAddingEmployee}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Employee
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Employee</DialogTitle>
                  <DialogDescription>Add a new employee to the {department?.name} department</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="emp-name">Employee Name *</Label>
                      <Input
                        id="emp-name"
                        value={newEmployee.name}
                        onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                        placeholder="Enter employee name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emp-code">Employee Code *</Label>
                      <Input
                        id="emp-code"
                        value={newEmployee.employee_code}
                        onChange={(e) => setNewEmployee({ ...newEmployee, employee_code: e.target.value })}
                        placeholder="Enter employee code"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emp-position">Position *</Label>
                    <Input
                      id="emp-position"
                      value={newEmployee.position}
                      onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
                      placeholder="Enter position/role"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddingEmployee(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddEmployee}>Add Employee</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs defaultValue="employees" className="space-y-6">
          <TabsList>
            <TabsTrigger value="employees">Employee List</TabsTrigger>
            <TabsTrigger value="skills">Skill Matrix</TabsTrigger>
            <TabsTrigger value="department-info">Department Info</TabsTrigger>
          </TabsList>

          <TabsContent value="employees" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Department Employees ({departmentEmployees.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {departmentEmployees.map((employee) => (
                    <Card key={employee.id} className="p-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4>{employee.name}</h4>
                            <p className="text-sm text-muted-foreground">{employee.position}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Badge variant="outline">{employee.employee_code}</Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteEmployee(employee.id)}
                              className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
                {departmentEmployees.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No employees in this department. Click "Add Employee" to get started.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="skills">
            <SkillMatrix
              departmentName={department?.name || ""}
              employees={departmentEmployees}
              onUpdateEmployeeSkills={handleUpdateEmployeeSkills}
            />
          </TabsContent>

          <TabsContent value="department-info">
            <Card>
              <CardHeader>
                <CardTitle>Department Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Department Name</p>
                      <p>{department?.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Employees</p>
                      <p>{departmentEmployees.length} employees</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <Badge variant="secondary">Active</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2>Department Management</h2>
          <p className="text-muted-foreground">Manage organizational departments and employees</p>
        </div>
        <Button onClick={() => setIsAddingDepartment(!isAddingDepartment)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Department
        </Button>
      </div>

      {isAddingDepartment && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Department</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dept-name">Department Name</Label>
              <Input
                id="dept-name"
                value={newDepartment.name}
                onChange={(e) => setNewDepartment({ ...newDepartment, name: e.target.value })}
                placeholder="Enter department name"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddDepartment}>Add Department</Button>
              <Button variant="outline" onClick={() => setIsAddingDepartment(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Department Dialog */}
      <Dialog open={isEditingDepartment} onOpenChange={setIsEditingDepartment}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Department</DialogTitle>
            <DialogDescription>Update department information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-dept-name">Department Name</Label>
              <Input
                id="edit-dept-name"
                value={editingDepartment?.name || ""}
                onChange={(e) => setEditingDepartment(editingDepartment ? { ...editingDepartment, name: e.target.value } : null)}
                placeholder="Enter department name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditingDepartment(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateDepartment}>Update Department</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments.map((dept) => (
          <Card key={dept.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{dept.name}</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditDepartment(dept)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteDepartment(dept.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>{getEmployeesByDepartment(dept.id).length} employees</span>
              </div>
              <Separator />
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-transparent"
                  onClick={() => setSelectedDepartment(dept.id)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </div>
              <Badge variant="secondary" className="w-fit">
                Active
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {departments.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No departments found. Click "Add Department" to get started.
        </div>
      )}
    </div>
  )
}