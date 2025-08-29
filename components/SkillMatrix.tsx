"use client"

import { useState, useEffect } from "react"
import { skillService } from "../lib/database"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Edit2, Download, Filter, Save, X, FilterX } from "lucide-react"

interface SkillLevel {
  level: "L1" | "L2" | "L3" | "L4" | "NA"
}

interface Employee {
  id: string
  name: string
  employee_code: string
  skills?: Record<string, SkillLevel["level"]>
}

interface FilterState {
  skillActivities: string[]
  skillLevels: string[]
  employeeName: string
  employeeCode: string
}

interface SkillMatrixProps {
  departmentName: string
  employees: Employee[]
  onUpdateEmployeeSkills?: (employeeId: string, skills: Record<string, SkillLevel["level"]>) => void
}

export function SkillMatrix({ departmentName, employees, onUpdateEmployeeSkills }: SkillMatrixProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedEmployees, setEditedEmployees] = useState<Employee[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [employeeSkills, setEmployeeSkills] = useState<Record<string, Record<string, SkillLevel["level"]>>>({})
  const [loadingSkills, setLoadingSkills] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    skillActivities: [],
    skillLevels: [],
    employeeName: "",
    employeeCode: "",
  })

  // Load employee skills when component mounts or employees change
  useEffect(() => {
    loadEmployeeSkills()
  }, [employees])

  const loadEmployeeSkills = async () => {
    if (employees.length === 0) return

    setLoadingSkills(true)
    console.log("🎯 [SkillMatrix] Loading skills for employees...")

    try {
      const skillsData: Record<string, Record<string, SkillLevel["level"]>> = {}

      for (const employee of employees) {
        try {
          const skills = await skillService.getEmployeeSkills(employee.id)
          skillsData[employee.id] = skills
          console.log(`✅ [SkillMatrix] Loaded skills for ${employee.name}:`, skills)
        } catch (error) {
          console.error(`❌ [SkillMatrix] Error loading skills for ${employee.name}:`, error)
          // Initialize with empty skills if loading fails
          skillsData[employee.id] = {}
        }
      }

      setEmployeeSkills(skillsData)
      console.log("✅ [SkillMatrix] All employee skills loaded:", skillsData)
    } catch (error) {
      console.error("❌ [SkillMatrix] Error loading employee skills:", error)
    } finally {
      setLoadingSkills(false)
    }
  }

  // Department-specific skill categories
  const getDepartmentSkills = (deptName: string): string[] => {
    switch (deptName.toLowerCase()) {
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

  const skillCategories = getDepartmentSkills(departmentName)
  const skillLevels: SkillLevel["level"][] = ["L1", "L2", "L3", "L4", "NA"]

  const skillDefinitions = [
    {
      level: "L1",
      title: "Level 1",
      description:
        "Have basic or partial knowledge/skills and can work only under continuously supervision/instruction.",
      squares: 1,
    },
    {
      level: "L2",
      title: "Level 2",
      description:
        "Have significant knowledge/skills and can work independently once given instructions but can't give any feedback or suggestion.",
      squares: 2,
    },
    {
      level: "L3",
      title: "Level 3",
      description:
        "Have ample amount of knowledge/skills and can work independently at level where he can brainstorm to give feedback/suggestions.",
      squares: 3,
    },
    {
      level: "L4",
      title: "Level 4",
      description:
        "Have prominent knowledge/skills and work smoothly as well as have ability to train others on the same.",
      squares: 4,
    },
  ]

  // Component to render skill level as blue squares
  const SkillLevelSquares = ({ level, size = "sm" }: { level: SkillLevel["level"]; size?: "sm" | "md" }) => {
    if (level === "NA") {
      return <span className="text-xs text-gray-400">NA</span>
    }
    const squareCount = { L1: 1, L2: 2, L3: 3, L4: 4 }[level] || 0
    const squareSize = size === "sm" ? "w-2 h-2" : "w-3 h-3"

    return (
      <div className="flex items-center justify-center gap-0.5">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className={`${squareSize} ${index < squareCount ? "bg-blue-500" : "bg-gray-200"} rounded-sm`}
            title={`Level ${squareCount} (${level})`}
          />
        ))}
      </div>
    )
  }

  // Filter employees based on current filters
  const getFilteredEmployees = () => {
    let filtered = isEditing ? editedEmployees : employees

    // Filter by employee name
    if (filters.employeeName) {
      filtered = filtered.filter((emp) => emp.name.toLowerCase().includes(filters.employeeName.toLowerCase()))
    }

    // Filter by employee code
    if (filters.employeeCode) {
      filtered = filtered.filter((emp) => emp.employee_code.includes(filters.employeeCode))
    }

    // Filter by skill levels
    if (filters.skillLevels.length > 0) {
      filtered = filtered.filter((emp) =>
        emp.skills && Object.values(emp.skills).some((level) => filters.skillLevels.includes(level)),
      )
    }

    return filtered
  }

  // Get filtered skill categories
  const getFilteredSkillCategories = () => {
    if (filters.skillActivities.length === 0) {
      return skillCategories
    }
    return skillCategories.filter((skill) => filters.skillActivities.includes(skill))
  }

  const handleStartEdit = () => {
    const employeesWithSkills = employees.map(emp => ({
      ...emp,
      skills: employeeSkills[emp.id] || {}
    }))
    setEditedEmployees(employeesWithSkills)
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setEditedEmployees([])
    setIsEditing(false)
  }

  const handleSaveEdit = () => {
    // Update each employee's skills
    editedEmployees.forEach((employee) => {
      if (onUpdateEmployeeSkills && employee.skills) {
        onUpdateEmployeeSkills(employee.id, employee.skills)
      }
    })
    setIsEditing(false)
    setEditedEmployees([])
    console.log("Skill matrix updated successfully!")
  }

  const handleSkillChange = (employeeId: string, skill: string, newLevel: SkillLevel["level"]) => {
    setEditedEmployees((prev) =>
      prev.map((emp) => (emp.id === employeeId ? { ...emp, skills: { ...emp.skills, [skill]: newLevel } } : emp)),
    )
  }

  const handleFilterChange = (filterType: keyof FilterState, value: any) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }))
  }

  const handleSkillActivityToggle = (skill: string) => {
    setFilters((prev) => ({
      ...prev,
      skillActivities: prev.skillActivities.includes(skill)
        ? prev.skillActivities.filter((s) => s !== skill)
        : [...prev.skillActivities, skill],
    }))
  }

  const handleSkillLevelToggle = (level: string) => {
    setFilters((prev) => ({
      ...prev,
      skillLevels: prev.skillLevels.includes(level)
        ? prev.skillLevels.filter((l) => l !== level)
        : [...prev.skillLevels, level],
    }))
  }

  const clearAllFilters = () => {
    setFilters({ skillActivities: [], skillLevels: [], employeeName: "", employeeCode: "" })
  }

  const hasActiveFilters =
    filters.skillActivities.length > 0 || filters.skillLevels.length > 0 || filters.employeeName || filters.employeeCode

  const filteredEmployees = getFilteredEmployees()
  const filteredSkillCategories = getFilteredSkillCategories()

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-center">SKILL MATRIX FOR {departmentName.toUpperCase()}</CardTitle>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <span>Doc. No.: PSB/HRD/01</span>
              <span>Rev. No.: 01</span>
              <span>Rev. Date: 10.08.2023</span>
            </div>
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button variant="outline" size="sm" onClick={handleSaveEdit}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
                <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Popover open={showFilters} onOpenChange={setShowFilters}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                      {hasActiveFilters && (
                        <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 rounded-full text-xs">
                          {
                            [
                              ...filters.skillActivities,
                              ...filters.skillLevels,
                              ...(filters.employeeName ? ["name"] : []),
                              ...(filters.employeeCode ? ["code"] : []),
                            ].length
                          }
                        </Badge>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-96 p-4" align="end">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-medium">Filter Options</h4>
                        {hasActiveFilters && (
                          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                            <FilterX className="h-4 w-4 mr-2" />
                            Clear All
                          </Button>
                        )}
                      </div>

                      {/* Employee Filters */}
                      <div className="space-y-3">
                        <Label className="text-xs font-medium text-muted-foreground">EMPLOYEE FILTERS</Label>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label htmlFor="emp-name" className="text-xs">
                              Employee Name
                            </Label>
                            <Input
                              id="emp-name"
                              placeholder="Search name..."
                              value={filters.employeeName}
                              onChange={(e) => handleFilterChange("employeeName", e.target.value)}
                              className="h-8 text-xs"
                            />
                          </div>
                          <div>
                            <Label htmlFor="emp-code" className="text-xs">
                              Employee Code
                            </Label>
                            <Input
                              id="emp-code"
                              placeholder="Search code..."
                              value={filters.employeeCode}
                              onChange={(e) => handleFilterChange("employeeCode", e.target.value)}
                              className="h-8 text-xs"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Skill Level Filters */}
                      <div className="space-y-2">
                        <Label className="text-xs font-medium text-muted-foreground">SKILL LEVELS</Label>
                        <div className="space-y-2">
                          {skillLevels.map((level) => (
                            <div key={level} className="flex items-center space-x-2">
                              <Checkbox
                                id={`level-${level}`}
                                checked={filters.skillLevels.includes(level)}
                                onCheckedChange={() => handleSkillLevelToggle(level)}
                              />
                              <Label htmlFor={`level-${level}`} className="text-xs flex items-center gap-2">
                                {level}
                                {level !== "NA" && <SkillLevelSquares level={level} size="sm" />}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Skill Activity Filters */}
                      <div className="space-y-2">
                        <Label className="text-xs font-medium text-muted-foreground">SKILL ACTIVITIES</Label>
                        <div className="max-h-40 overflow-y-auto space-y-1">
                          {skillCategories.map((skill, index) => (
                            <div key={skill} className="flex items-center space-x-2">
                              <Checkbox
                                id={`skill-${index}`}
                                checked={filters.skillActivities.includes(skill)}
                                onCheckedChange={() => handleSkillActivityToggle(skill)}
                              />
                              <Label htmlFor={`skill-${index}`} className="text-xs leading-tight">
                                {departmentName.toLowerCase() === "bonded"
                                  ? skill.replace("Knowledge of ", "").substring(0, 30) + "..."
                                  : skill.substring(0, 25) + "..."}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <Button size="sm" onClick={() => setShowFilters(false)}>
                          Apply Filters
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline" size="sm" onClick={handleStartEdit}>
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit Matrix
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="mb-4 text-sm text-muted-foreground">
          <p>Department: {departmentName}</p>
          <p>Last Updated On: {new Date().toLocaleDateString("en-GB")}</p>
          {hasActiveFilters && (
            <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-blue-800 text-xs">
                Showing {filteredEmployees.length} of {employees.length} employees
                {filteredSkillCategories.length < skillCategories.length &&
                  ` • ${filteredSkillCategories.length} of ${skillCategories.length} skills`}
              </p>
            </div>
          )}
          {isEditing && (
            <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-blue-800 text-sm flex items-center gap-2">
                <Edit2 className="h-4 w-4" />
                Edit Mode: Click on skill cells to modify levels
              </p>
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 p-2 text-xs text-center min-w-12">S. No</th>
                <th className="border border-gray-300 p-2 text-xs text-center min-w-32">Operator Name</th>
                <th className="border border-gray-300 p-2 text-xs text-center min-w-24">Employee Code</th>
                {filteredSkillCategories.map((skill) => (
                  <th key={skill} className="border border-gray-300 p-1 text-xs text-center min-w-16 max-w-20">
                    <div className="transform -rotate-45 whitespace-nowrap text-center">
                      {departmentName.toLowerCase() === "bonded"
                        ? skill.replace("Knowledge of ", "").replace("with ", "w/ ")
                        : skill}
                    </div>
                  </th>
                ))}
              </tr>
              <tr className="bg-gray-50">
                <th colSpan={3} className="border border-gray-300 p-2 text-xs text-center">
                  Skill Activities
                </th>
                {filteredSkillCategories.map((_, index) => (
                  <th key={index} className="border border-gray-300 p-1 text-xs text-center">
                    {skillCategories.indexOf(filteredSkillCategories[index]) + 1}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((employee, index) => (
                <tr key={employee.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 p-2 text-xs text-center">{index + 1}</td>
                  <td className="border border-gray-300 p-2 text-xs">{employee.name}</td>
                  <td className="border border-gray-300 p-2 text-xs text-center">{employee.employee_code}</td>
                  {filteredSkillCategories.map((skill) => (
                    <td key={skill} className="border border-gray-300 p-1 text-center">
                      {isEditing ? (
                        <Select
                          value={employeeSkills[employee.id]?.[skill] || "NA"}
                          onValueChange={(value: SkillLevel["level"]) => handleSkillChange(employee.id, skill, value)}
                        >
                          <SelectTrigger className="w-20 h-8 mx-auto">
                            <SelectValue>
                              <SkillLevelSquares level={employeeSkills[employee.id]?.[skill] || "NA"} size="sm" />
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {skillLevels.map((level) => (
                              <SelectItem key={level} value={level}>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-medium">{level}</span>
                                  <SkillLevelSquares level={level} size="sm" />
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <SkillLevelSquares level={employeeSkills[employee.id]?.[skill] || "NA"} size="sm" />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
              {filteredEmployees.length === 0 && (
                <tr>
                  <td
                    colSpan={3 + filteredSkillCategories.length}
                    className="border border-gray-300 p-4 text-center text-muted-foreground"
                  >
                    No employees match the current filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 space-y-4">
          {/* Skill Level Definitions */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium mb-3">Skill Level Definitions</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {skillDefinitions.map((def) => (
                <div key={def.level} className="border border-gray-200 bg-white p-3 rounded">
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-xs font-medium text-gray-700">{def.level}</span>
                      <SkillLevelSquares level={def.level as SkillLevel["level"]} size="md" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-900">{def.title}</p>
                      <p className="text-xs text-gray-600 mt-1">{def.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium bg-gray-100 px-2 py-1 rounded">NA</span>
                <span className="text-xs text-gray-600">Not Applicable - Skill not required for this role</span>
              </div>
            </div>
          </div>

          {!isEditing && (
            <div className="text-xs text-muted-foreground text-right">
              Last modified: {new Date().toLocaleDateString()}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
