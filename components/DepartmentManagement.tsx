"use client"

import { useState } from "react"
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
import { SkillMatrix } from "./SkillMatrix"
import { Plus, Edit2, Users, Eye, UserPlus, Settings, Trash2 } from "lucide-react"

interface Department {
  id: string
  name: string
  employeeCount: number
}

interface Employee {
  id: string
  name: string
  employeeCode: string
  position: string
  skills: Record<string, "L1" | "L2" | "L3" | "L4" | "NA">
}

export function DepartmentManagement() {
  const [departments, setDepartments] = useState<Department[]>([
    { id: "1", name: "Assembly", employeeCount: 10 },
    { id: "3", name: "Quality Control", employeeCount: 8 },
    { id: "4", name: "Maintenance", employeeCount: 10 },
    { id: "5", name: "Bonded", employeeCount: 9 },
    { id: "6", name: "Grinding", employeeCount: 10 },
    { id: "7", name: "HT", employeeCount: 7 },
    { id: "8", name: "Roller Grinding", employeeCount: 5 },
    { id: "9", name: "Store", employeeCount: 4 },
    { id: "10", name: "Turning", employeeCount: 11 },
  ])

  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null)
  const [isAddingDepartment, setIsAddingDepartment] = useState(false)
  const [isAddingEmployee, setIsAddingEmployee] = useState(false)
  const [employeeData, setEmployeeData] = useState<Record<string, Employee[]>>({})
  const [newDepartment, setNewDepartment] = useState({ name: "" })
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    employeeCode: "",
    position: "",
    skills: {} as Record<string, "L1" | "L2" | "L3" | "L4" | "NA">,
  })

  // Get department-specific skill categories
  const getDepartmentSkills = (departmentName: string): string[] => {
    switch (departmentName.toLowerCase()) {
      case "bonded":
        return [
          "Knowledge of First In First Out",
          "Knowledge of Identification of Material Lot/Ladle",
          "Knowledge of Material System Docking/un-docking",
          "Knowledge of Bottle Handling",
          "Communication with Ladle System & Data Entry",
          "Knowledge of Verification of invoice with Supplier",
          "Knowledge of Preparation of Challan (OGC/FIFO)",
          "Knowledge of word Processing/Coordinating",
          "Knowledge of 5 S",
          "Knowledge of Inventory Management",
          "Wastage Management",
          "Knowledge of Internal Quality Standard",
          "Operate to OSHA/Pollution & with Safety Instructions",
          "Additional Skill Activity",
        ]
      case "grinding":
        return [
          "Knowledge of First In First Out",
          "Knowledge of Identification",
          "Knowledge of Segregation of Rejected",
          "Knowledge of Grinding MC",
          "Knowledge of Work Hardness",
          "Knowledge of Thickness of Work",
          "Knowledge of End Lead of Piece",
          "Knowledge of Hardess Index",
          "Knowledge of Safety",
          "Knowledge of Grinding Test",
          "Knowledge of FMEA",
          "Knowledge of PM",
          "Knowledge of Finish",
          "Knowledge of Post Process",
          "Knowledge of Part Id of Post Process Work",
          "Knowledge of Part Running Stock",
          "Knowledge of Process",
          "Knowledge of Heat Change",
          "Knowledge of Skill at Machine",
          "Knowledge of Coordinate of Grind MC",
          "Knowledge of Pre and Post Grind MC",
        ]
      case "maintenance":
        return [
          "Knowledge of Assembly/Disassembly Component",
          "Knowledge of Electrical Part List",
          "Knowledge of Mechanical",
          "Knowledge of Wind Preventive Maintenance",
          "Knowledge of Lifting Equipment",
          "Knowledge of Welding Equipment",
          "Knowledge of Material Handling",
          "Knowledge of General Safety",
          "Control Equipment",
          "Knowledge of Preventive Equipment",
          "Knowledge of Safety Equipment",
          "Knowledge of Equipment Operation",
          "Knowledge of Hydraulic Equipment",
          "Knowledge of Pneumatic Equipment",
          "Knowledge of Electrical Equipment",
          "Knowledge of Preventive/Basic Equipment",
          "Knowledge of Basic Equipment",
          "Knowledge of Operational Equipment",
          "Knowledge of Control Equipment",
          "Post Equipment Monitoring",
          "Knowledge of Emergency Equipment",
          "Knowledge of Fire Equipment",
          "Knowledge of Safety Audit Equipment",
          "Knowledge of Equipment Maintenance",
          "Knowledge of Diagnostic Equipment",
          "Knowledge of Calibration Equipment",
          "Knowledge of Troubleshooting",
          "Knowledge of Equipment Documentation",
          "Knowledge of Spare Parts Management",
          "Knowledge of Equipment Inspection",
          "Knowledge of Maintenance Planning",
        ]
      default:
        return [
          "Visual Inspection",
          "Computer Setting",
          "Dial Reading",
          "Seaming Make",
          "RC Check",
          "Roller Filing",
          "Master Matching",
          "Giver Track Size",
          "Lazer MC Operate",
          "Washing Oiling MC",
          "Searing Practice",
          "Child Complex Release",
          "Ball Searing BC",
          "Bore Gauge Setting",
          "Vernier Reading",
          "Large Die Equipment",
          "Rivet MC Setting",
          "Pneumatic Press MC",
          "Manual Operate",
        ]
    }
  }

  // Initialize employee data
  const getInitialEmployeeData = (): Record<string, Employee[]> => ({
    "1": [
      {
        id: "1",
        name: "Brijesh Kumar",
        employeeCode: "10829",
        position: "Assembly Operator",
        skills: {
          "Visual Inspection": "L4",
          "Computer Setting": "L3",
          "Dial Reading": "L4",
          "Seaming Make": "L4",
          "RC Check": "L3",
          "Roller Filing": "L4",
          "Master Matching": "L3",
          "Giver Track Size": "L4",
          "Lazer MC Operate": "L4",
          "Washing Oiling MC": "L4",
          "Searing Practice": "L4",
          "Child Complex Release": "L3",
          "Ball Searing BC": "L4",
          "Bore Gauge Setting": "L4",
          "Vernier Reading": "L4",
          "Large Die Equipment": "L4",
          "Rivet MC Setting": "L4",
          "Pneumatic Press MC": "L4",
          "Manual Operate": "L4",
        },
      },
      {
        id: "2",
        name: "Devender Singh",
        employeeCode: "11206",
        position: "Assembly Technician",
        skills: {
          "Visual Inspection": "L3",
          "Computer Setting": "L3",
          "Dial Reading": "L3",
          "Seaming Make": "L4",
          "RC Check": "L3",
          "Roller Filing": "L4",
          "Master Matching": "L3",
          "Giver Track Size": "L4",
          "Lazer MC Operate": "L4",
          "Washing Oiling MC": "L4",
          "Searing Practice": "L4",
          "Child Complex Release": "L3",
          "Ball Searing BC": "L4",
          "Bore Gauge Setting": "L4",
          "Vernier Reading": "L4",
          "Large Die Equipment": "L4",
          "Rivet MC Setting": "L4",
          "Pneumatic Press MC": "L4",
          "Manual Operate": "L4",
        },
      },
    ],
    "5": [
      {
        id: "8",
        name: "Shambu Paswam",
        employeeCode: "11061",
        position: "Bonding Operator",
        skills: {
          "Knowledge of First In First Out": "L3",
          "Knowledge of Identification of Material Lot/Ladle": "L3",
          "Knowledge of Material System Docking/un-docking": "L3",
          "Knowledge of Bottle Handling": "L3",
          "Communication with Ladle System & Data Entry": "NA",
          "Knowledge of Verification of invoice with Supplier": "L3",
          "Knowledge of Preparation of Challan (OGC/FIFO)": "NA",
          "Knowledge of word Processing/Coordinating": "NA",
          "Knowledge of 5 S": "L3",
          "Knowledge of Inventory Management": "L3",
          "Wastage Management": "NA",
          "Knowledge of Internal Quality Standard": "L3",
          "Operate to OSHA/Pollution & with Safety Instructions": "L3",
          "Additional Skill Activity": "L3",
        },
      },
    ],
  })

  // Initialize employee data if not already done
  if (Object.keys(employeeData).length === 0) {
    setEmployeeData(getInitialEmployeeData())
  }

  const getEmployeesByDepartment = (departmentId: string): Employee[] => {
    return employeeData[departmentId] || []
  }

  const handleUpdateEmployeeSkills = (employeeId: string, skills: Record<string, "L1" | "L2" | "L3" | "L4" | "NA">) => {
    if (!selectedDepartment) return
    setEmployeeData((prev) => ({
      ...prev,
      [selectedDepartment]:
        prev[selectedDepartment]?.map((emp) => (emp.id === employeeId ? { ...emp, skills } : emp)) || [],
    }))
    console.log("Employee skills updated successfully!")
  }

  const getSkillLevelCounts = (skills: Record<string, "L1" | "L2" | "L3" | "L4" | "NA">) => {
    const counts = { L1: 0, L2: 0, L3: 0, L4: 0 }
    const skillValues = Object.values(skills)

    skillValues.forEach((level) => {
      if (level !== "NA" && counts.hasOwnProperty(level)) {
        counts[level as keyof typeof counts]++
      }
    })
    const totalSkills = skillValues.filter((level) => level !== "NA").length
    return { counts, totalSkills }
  }

  const formatSkillSummary = (skills: Record<string, "L1" | "L2" | "L3" | "L4" | "NA">) => {
    const { counts, totalSkills } = getSkillLevelCounts(skills)
    const summaryParts = []
    if (counts.L1 > 0) summaryParts.push(`L1 = ${counts.L1}`)
    if (counts.L2 > 0) summaryParts.push(`L2 = ${counts.L2}`)
    if (counts.L3 > 0) summaryParts.push(`L3 = ${counts.L3}`)
    if (counts.L4 > 0) summaryParts.push(`L4 = ${counts.L4}`)
    return `${summaryParts.join(", ")} out of ${totalSkills} skills`
  }

  const handleAddDepartment = () => {
    if (!newDepartment.name) return
    const department: Department = {
      id: Date.now().toString(),
      name: newDepartment.name,
      employeeCount: 0,
    }
    setDepartments([...departments, department])
    setNewDepartment({ name: "" })
    setIsAddingDepartment(false)
    console.log("Department added successfully!")
  }

  const handleAddEmployee = () => {
    if (!selectedDepartment || !newEmployee.name || !newEmployee.employeeCode || !newEmployee.position) {
      console.error("Please fill in all required fields")
      return
    }

    // Check if employee code already exists
    const allEmployees = Object.values(employeeData).flat()
    if (allEmployees.some((emp) => emp.employeeCode === newEmployee.employeeCode)) {
      console.error("Employee code already exists")
      return
    }

    const department = departments.find((d) => d.id === selectedDepartment)
    if (!department) return

    // Initialize skills with default values
    const departmentSkills = getDepartmentSkills(department.name)
    const initialSkills: Record<string, "L1" | "L2" | "L3" | "L4" | "NA"> = {}

    departmentSkills.forEach((skill) => {
      initialSkills[skill] = newEmployee.skills[skill] || "NA"
    })

    const employee: Employee = {
      id: Date.now().toString(),
      name: newEmployee.name,
      employeeCode: newEmployee.employeeCode,
      position: newEmployee.position,
      skills: initialSkills,
    }

    setEmployeeData((prev) => ({
      ...prev,
      [selectedDepartment]: [...(prev[selectedDepartment] || []), employee],
    }))

    // Update department employee count
    setDepartments((prev) =>
      prev.map((dept) => (dept.id === selectedDepartment ? { ...dept, employeeCount: dept.employeeCount + 1 } : dept)),
    )

    setNewEmployee({ name: "", employeeCode: "", position: "", skills: {} })
    setIsAddingEmployee(false)
    console.log("Employee added successfully!")
  }

  const handleDeleteEmployee = (employeeId: string) => {
    if (!selectedDepartment) return
    setEmployeeData((prev) => ({
      ...prev,
      [selectedDepartment]: prev[selectedDepartment]?.filter((emp) => emp.id !== employeeId) || [],
    }))

    // Update department employee count
    setDepartments((prev) =>
      prev.map((dept) =>
        dept.id === selectedDepartment ? { ...dept, employeeCount: Math.max(0, dept.employeeCount - 1) } : dept,
      ),
    )
    console.log("Employee deleted successfully!")
  }

  if (selectedDepartment) {
    const department = departments.find((d) => d.id === selectedDepartment)
    const employees = getEmployeesByDepartment(selectedDepartment)

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Button variant="outline" onClick={() => setSelectedDepartment(null)} className="mb-2">
              ← Back to Departments
            </Button>
            <h2>{department?.name} Department</h2>
            <p className="text-muted-foreground">Employee skills and competency matrix</p>
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
                        value={newEmployee.employeeCode}
                        onChange={(e) => setNewEmployee({ ...newEmployee, employeeCode: e.target.value })}
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
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Manage Skills
            </Button>
          </div>
        </div>

        <Tabs defaultValue="employees" className="space-y-6">
          <TabsList>
            <TabsTrigger value="employees">Employee List</TabsTrigger>
            <TabsTrigger value="skill-matrix">Skill Matrix</TabsTrigger>
            <TabsTrigger value="department-info">Department Info</TabsTrigger>
          </TabsList>

          <TabsContent value="employees" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Department Employees ({employees.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {employees.map((employee) => (
                    <Card key={employee.id} className="p-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4>{employee.name}</h4>
                            <p className="text-sm text-muted-foreground">{employee.position}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Badge variant="outline">{employee.employeeCode}</Badge>
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
                        <Separator />
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Skills Summary</p>
                          <p className="text-xs text-gray-700 bg-gray-50 p-2 rounded">
                            {formatSkillSummary(employee.skills)}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
                {employees.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No employees in this department. Click "Add Employee" to get started.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="skill-matrix">
            <SkillMatrix
              departmentName={department?.name || ""}
              employees={employees}
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
                      <p className="text-sm text-muted-foreground">Total Employees</p>
                      <p>{employees.length} employees</p>
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
          <p className="text-muted-foreground">Manage organizational departments and employee skills</p>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments.map((dept) => (
          <Card key={dept.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{dept.name}</CardTitle>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Edit2 className="h-4 w-4" />
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
    </div>
  )
}
