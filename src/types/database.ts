export type AppRole = "employee" | "manager" | "hr_admin";

export type GoalStatus = "draft" | "submitted" | "approved" | "sent_back";

export type ReviewStatus =
  | "not_started"
  | "self_appraisal_submitted"
  | "manager_reviewed"
  | "completed";

export type Employee = {
  id: string;
  clerk_user_id: string;
  email: string;
  full_name: string;
  job_title: string | null;
  department: string | null;
  role: AppRole;
  manager_id: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type ReviewCycle = {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  goal_setting_deadline: string | null;
  self_appraisal_deadline: string | null;
  manager_review_deadline: string | null;
  is_active: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type Goal = {
  id: string;
  employee_id: string;
  cycle_id: string;
  title: string;
  description: string | null;
  success_criteria: string | null;
  weight: number;
  status: GoalStatus;
  sent_back_reason: string | null;
  submitted_at: string | null;
  approved_at: string | null;
  approved_by: string | null;
  created_at: string;
  updated_at: string;
};

export type Review = {
  id: string;
  employee_id: string;
  cycle_id: string;
  status: ReviewStatus;
  self_overall_comments: string | null;
  manager_overall_comments: string | null;
  self_submitted_at: string | null;
  manager_reviewed_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type GoalRating = {
  id: string;
  review_id: string;
  goal_id: string;
  self_rating: number | null;
  self_comments: string | null;
  manager_rating: number | null;
  manager_comments: string | null;
  created_at: string;
  updated_at: string;
};
