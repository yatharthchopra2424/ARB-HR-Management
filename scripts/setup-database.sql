-- =====================================================
-- HR Management System Database Setup
-- =====================================================
-- This script sets up the complete database structure for the HR Management System
-- Run this in your Supabase SQL Editor

-- =====================================================
-- 1. Enable Row Level Security
-- =====================================================
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- =====================================================
-- 2. Create Tables
-- =====================================================

-- Create departments table
CREATE TABLE IF NOT EXISTS departments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  employee_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create employees table
CREATE TABLE IF NOT EXISTS employees (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  employee_code VARCHAR(50) NOT NULL UNIQUE,
  position VARCHAR(255) NOT NULL,
  department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create skills table
CREATE TABLE IF NOT EXISTS skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create employee_skills table (junction table)
CREATE TABLE IF NOT EXISTS employee_skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
  skill_level VARCHAR(10) CHECK (skill_level IN ('L1', 'L2', 'L3', 'L4', 'NA')) DEFAULT 'NA',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(employee_id, skill_id)
);

-- Create trainings table
CREATE TABLE IF NOT EXISTS trainings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  training_date DATE NOT NULL,
  training_time TIME NOT NULL,
  duration INTEGER DEFAULT 60, -- in minutes
  location VARCHAR(255),
  organizer VARCHAR(255),
  training_type VARCHAR(50) CHECK (training_type IN ('Team Training', 'One-on-One', 'All Hands', 'Interview', 'Training')) DEFAULT 'Training',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create training_participants table
CREATE TABLE IF NOT EXISTS training_participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  training_id UUID REFERENCES trainings(id) ON DELETE CASCADE,
  participant_name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create training_plans table
CREATE TABLE IF NOT EXISTS training_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
  training_topic VARCHAR(255) NOT NULL,
  planned_months TEXT[], -- Array of month strings like ['Apr-25', 'Oct-25']
  actual_months TEXT[] DEFAULT '{}', -- Array of completed month strings
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create training_data table for chart data
CREATE TABLE IF NOT EXISTS training_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  month VARCHAR(10) NOT NULL,
  year INTEGER NOT NULL,
  planned INTEGER DEFAULT 0,
  done INTEGER DEFAULT 0,
  pending INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(month, year)
);

-- =====================================================
-- 3. Create Indexes for Better Performance
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_employees_department_id ON employees(department_id);
CREATE INDEX IF NOT EXISTS idx_employee_skills_employee_id ON employee_skills(employee_id);
CREATE INDEX IF NOT EXISTS idx_employee_skills_skill_id ON employee_skills(skill_id);
CREATE INDEX IF NOT EXISTS idx_skills_department_id ON skills(department_id);
CREATE INDEX IF NOT EXISTS idx_training_participants_training_id ON training_participants(training_id);
CREATE INDEX IF NOT EXISTS idx_training_plans_department_id ON training_plans(department_id);
CREATE INDEX IF NOT EXISTS idx_training_data_month_year ON training_data(month, year);

-- =====================================================
-- 4. Enable Row Level Security (RLS)
-- =====================================================
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE trainings ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_data ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 5. Create RLS Policies
-- =====================================================
-- Allow all operations for authenticated users (you can restrict later)
CREATE POLICY "Allow all operations on departments" ON departments FOR ALL USING (true);
CREATE POLICY "Allow all operations on employees" ON employees FOR ALL USING (true);
CREATE POLICY "Allow all operations on skills" ON skills FOR ALL USING (true);
CREATE POLICY "Allow all operations on employee_skills" ON employee_skills FOR ALL USING (true);
CREATE POLICY "Allow all operations on trainings" ON trainings FOR ALL USING (true);
CREATE POLICY "Allow all operations on training_participants" ON training_participants FOR ALL USING (true);
CREATE POLICY "Allow all operations on training_plans" ON training_plans FOR ALL USING (true);
CREATE POLICY "Allow all operations on training_data" ON training_data FOR ALL USING (true);

-- =====================================================
-- 6. Departments Table Ready
-- =====================================================
-- No sample departments inserted. Use the application to add departments as needed.

-- =====================================================
-- 7. Skills Table Ready
-- =====================================================
-- No sample skills inserted. Skills will be created dynamically when departments are added.

-- =====================================================
-- 8. Employees Table Ready
-- =====================================================
-- No sample employees inserted. Use the application to add employees as needed.

-- =====================================================
-- 9. Training Data Table Ready
-- =====================================================
-- No sample training data inserted. Use the application to add training data as needed.

-- =====================================================
-- 10. Create RPC Functions for Department Count Management
-- =====================================================

-- Function to increment department employee count
CREATE OR REPLACE FUNCTION increment_department_count(dept_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE departments
  SET employee_count = employee_count + 1,
      updated_at = NOW()
  WHERE id = dept_id;
END;
$$;

-- Function to decrement department employee count
CREATE OR REPLACE FUNCTION decrement_department_count(dept_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE departments
  SET employee_count = GREATEST(employee_count - 1, 0),
      updated_at = NOW()
  WHERE id = dept_id;
END;
$$;

-- =====================================================
-- 11. Training Plans Table Ready
-- =====================================================
-- No sample training plans inserted. Use the application to create training plans as needed.

-- =====================================================
-- Setup Complete!
-- =====================================================
-- Your HR Management System database is now ready.
-- You can now run your Next.js application with authentication.