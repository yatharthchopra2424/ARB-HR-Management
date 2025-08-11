-- Insert initial departments
INSERT INTO departments (name, employee_count) VALUES
  ('Assembly', 10),
  ('Quality Control', 8),
  ('Maintenance', 10),
  ('Bonded', 9),
  ('Grinding', 10),
  ('HT', 7),
  ('Roller Grinding', 5),
  ('Store', 4),
  ('Turning', 11)
ON CONFLICT (name) DO NOTHING;

-- Insert skills for different departments
INSERT INTO skills (name, department_id) 
SELECT skill_name, d.id
FROM departments d
CROSS JOIN (
  SELECT unnest(ARRAY[
    'Visual Inspection', 'Computer Setting', 'Dial Reading', 'Seaming Make', 'RC Check',
    'Roller Filing', 'Master Matching', 'Giver Track Size', 'Lazer MC Operate', 'Washing Oiling MC',
    'Searing Practice', 'Child Complex Release', 'Ball Searing BC', 'Bore Gauge Setting', 'Vernier Reading',
    'Large Die Equipment', 'Rivet MC Setting', 'Pneumatic Press MC', 'Manual Operate'
  ]) AS skill_name
) skills
WHERE d.name NOT IN ('Bonded', 'Grinding', 'Maintenance')

UNION ALL

SELECT skill_name, d.id
FROM departments d
CROSS JOIN (
  SELECT unnest(ARRAY[
    'Knowledge of First In First Out', 'Knowledge of Identification of Material Lot/Ladle',
    'Knowledge of Material System Docking/un-docking', 'Knowledge of Bottle Handling',
    'Communication with Ladle System & Data Entry', 'Knowledge of Verification of invoice with Supplier',
    'Knowledge of Preparation of Challan (OGC/FIFO)', 'Knowledge of word Processing/Coordinating',
    'Knowledge of 5 S', 'Knowledge of Inventory Management', 'Wastage Management',
    'Knowledge of Internal Quality Standard', 'Operate to OSHA/Pollution & with Safety Instructions',
    'Additional Skill Activity'
  ]) AS skill_name
) skills
WHERE d.name = 'Bonded'

UNION ALL

SELECT skill_name, d.id
FROM departments d
CROSS JOIN (
  SELECT unnest(ARRAY[
    'Knowledge of First In First Out', 'Knowledge of Identification', 'Knowledge of Segregation of Rejected',
    'Knowledge of Grinding MC', 'Knowledge of Work Hardness', 'Knowledge of Thickness of Work',
    'Knowledge of End Lead of Piece', 'Knowledge of Hardess Index', 'Knowledge of Safety',
    'Knowledge of Grinding Test', 'Knowledge of FMEA', 'Knowledge of PM', 'Knowledge of Finish',
    'Knowledge of Post Process', 'Knowledge of Part Id of Post Process Work', 'Knowledge of Part Running Stock',
    'Knowledge of Process', 'Knowledge of Heat Change', 'Knowledge of Skill at Machine',
    'Knowledge of Coordinate of Grind MC', 'Knowledge of Pre and Post Grind MC'
  ]) AS skill_name
) skills
WHERE d.name = 'Grinding'

UNION ALL

SELECT skill_name, d.id
FROM departments d
CROSS JOIN (
  SELECT unnest(ARRAY[
    'Knowledge of Assembly/Disassembly Component', 'Knowledge of Electrical Part List', 'Knowledge of Mechanical',
    'Knowledge of Wind Preventive Maintenance', 'Knowledge of Lifting Equipment', 'Knowledge of Welding Equipment',
    'Knowledge of Material Handling', 'Knowledge of General Safety', 'Control Equipment',
    'Knowledge of Preventive Equipment', 'Knowledge of Safety Equipment', 'Knowledge of Equipment Operation',
    'Knowledge of Hydraulic Equipment', 'Knowledge of Pneumatic Equipment', 'Knowledge of Electrical Equipment',
    'Knowledge of Preventive/Basic Equipment', 'Knowledge of Basic Equipment', 'Knowledge of Operational Equipment',
    'Knowledge of Control Equipment', 'Post Equipment Monitoring', 'Knowledge of Emergency Equipment',
    'Knowledge of Fire Equipment', 'Knowledge of Safety Audit Equipment', 'Knowledge of Equipment Maintenance',
    'Knowledge of Diagnostic Equipment', 'Knowledge of Calibration Equipment', 'Knowledge of Troubleshooting',
    'Knowledge of Equipment Documentation', 'Knowledge of Spare Parts Management', 'Knowledge of Equipment Inspection',
    'Knowledge of Maintenance Planning'
  ]) AS skill_name
) skills
WHERE d.name = 'Maintenance'
ON CONFLICT DO NOTHING;

-- Insert sample employees
INSERT INTO employees (name, employee_code, position, department_id)
SELECT 'Brijesh Kumar', '10829', 'Assembly Operator', d.id
FROM departments d WHERE d.name = 'Assembly'
ON CONFLICT (employee_code) DO NOTHING;

INSERT INTO employees (name, employee_code, position, department_id)
SELECT 'Devender Singh', '11206', 'Assembly Technician', d.id
FROM departments d WHERE d.name = 'Assembly'
ON CONFLICT (employee_code) DO NOTHING;

INSERT INTO employees (name, employee_code, position, department_id)
SELECT 'Shambu Paswam', '11061', 'Bonding Operator', d.id
FROM departments d WHERE d.name = 'Bonded'
ON CONFLICT (employee_code) DO NOTHING;

-- Insert initial training data
INSERT INTO training_data (month, year, planned, done, pending) VALUES
  ('Jan', 2025, 12, 8, 4),
  ('Feb', 2025, 15, 12, 3),
  ('Mar', 2025, 18, 15, 3),
  ('Apr', 2025, 22, 18, 4),
  ('May', 2025, 25, 20, 5),
  ('Jun', 2025, 20, 18, 2),
  ('Jul', 2025, 28, 22, 6),
  ('Aug', 2025, 30, 25, 5),
  ('Sep', 2025, 24, 20, 4),
  ('Oct', 2025, 26, 22, 4),
  ('Nov', 2025, 32, 28, 4),
  ('Dec', 2025, 28, 24, 4)
ON CONFLICT (month, year) DO NOTHING;

-- Insert sample training plans
INSERT INTO training_plans (department_id, training_topic, planned_months, actual_months)
SELECT d.id, 'Duplex Grinding', ARRAY['Apr-25', 'Oct-25'], ARRAY['Apr-25']
FROM departments d WHERE d.name = 'Grinding'
ON CONFLICT DO NOTHING;

INSERT INTO training_plans (department_id, training_topic, planned_months, actual_months)
SELECT d.id, 'Surface Grinding', ARRAY['Apr-25'], ARRAY[]::text[]
FROM departments d WHERE d.name = 'Grinding'
ON CONFLICT DO NOTHING;

INSERT INTO training_plans (department_id, training_topic, planned_months, actual_months)
SELECT d.id, 'Center Less Grinding', ARRAY['May-25', 'Nov-25'], ARRAY[]::text[]
FROM departments d WHERE d.name = 'Grinding'
ON CONFLICT DO NOTHING;
