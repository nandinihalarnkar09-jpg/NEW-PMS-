export type EmployeeRole = "employee" | "manager" | "hr_admin";

/** One row from public.employees — matches supabase/schema.sql. */
export type EmployeeRow = {
  id: string;
  clerk_user_id: string;
  full_name: string;
  email: string;
  designation: string | null;
  department: string | null;
  date_of_joining: string | null;
  manager_id: string | null;
  role: EmployeeRole;
  is_active: boolean;
  created_at: string;
};

export type EmployeeListItem = EmployeeRow & {
  manager_name: string | null;
};
