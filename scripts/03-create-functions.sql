-- Function to increment department employee count
CREATE OR REPLACE FUNCTION increment_department_count(dept_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE departments 
  SET employee_count = employee_count + 1,
      updated_at = NOW()
  WHERE id = dept_id;
END;
$$ LANGUAGE plpgsql;

-- Function to decrement department employee count
CREATE OR REPLACE FUNCTION decrement_department_count(dept_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE departments 
  SET employee_count = GREATEST(employee_count - 1, 0),
      updated_at = NOW()
  WHERE id = dept_id;
END;
$$ LANGUAGE plpgsql;
