export type Language = "en" | "es";

export type Role = "customer" | "developer";

export type SubscriptionStatus = "active" | "pending" | "past_due" | "cancelled";

export type ProjectStatus =
  | "new"
  | "intake_submitted"
  | "in_review"
  | "planning"
  | "in_progress"
  | "waiting_for_client"
  | "ready_for_approval"
  | "completed"
  | "archived";

export type WorkItemStatus =
  | "new"
  | "reviewing"
  | "needs_client_info"
  | "approved"
  | "staged"
  | "in_progress"
  | "internal_review"
  | "waiting_for_client_approval"
  | "rejected"
  | "complete"
  | "archived";

export type WorkItemPriority = "low" | "normal" | "high" | "urgent";

export type QuestionType =
  | "short_text"
  | "long_text"
  | "email"
  | "phone"
  | "url"
  | "single_select"
  | "multi_select"
  | "checkbox"
  | "date";

export type NoteVisibility = "internal" | "customer_visible";

export type SourceType = "intake" | "contact" | "support_request" | "subscription_request" | "manual";

export type IntakeAnswerValue = string | string[] | boolean | Record<string, unknown>;

export interface AuthUser {
  id: string;
  email: string;
  password_hash: string;
  provider: "email" | "google" | "apple";
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  auth_user_id: string;
  full_name: string;
  email: string;
  phone: string;
  business_name: string;
  preferred_language: Language;
  role: Role;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  customer_id: string;
  plan_name: string;
  status: SubscriptionStatus;
  renewal_date: string | null;
  included_services: string[];
  created_at: string;
  updated_at: string;
}

export interface Plan {
  id: string;
  name: string;
  monthly_price: string;
  description_en: string;
  description_es: string;
  features_en: string[];
  features_es: string[];
  requires_verification?: boolean;
  notification_note_en?: string;
  notification_note_es?: string;
}

export interface Project {
  id: string;
  customer_id: string;
  name: string;
  service_type: string;
  status: ProjectStatus;
  description: string;
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
}

export interface IntakeQuestion {
  id: string;
  label_en: string;
  label_es: string;
  help_text_en: string;
  help_text_es: string;
  question_type: QuestionType;
  required: boolean;
  display_order: number;
  active: boolean;
  archived: boolean;
  options_json: string[];
  created_at: string;
  updated_at: string;
}

export interface IntakeSubmission {
  id: string;
  customer_id: string;
  submitted_at: string;
  status: "submitted" | "reviewing" | "complete";
  created_at: string;
  updated_at: string;
}

export interface IntakeAnswer {
  id: string;
  submission_id: string;
  question_id: string;
  answer_json: IntakeAnswerValue;
  created_at: string;
  updated_at: string;
}

export interface WorkItem {
  id: string;
  customer_id: string;
  project_id: string | null;
  intake_submission_id: string | null;
  title: string;
  source_type: SourceType;
  status: WorkItemStatus;
  priority: WorkItemPriority;
  assigned_to: string | null;
  archived: boolean;
  created_at: string;
  updated_at: string;
}

export interface WorkItemNote {
  id: string;
  work_item_id: string;
  author_id: string;
  note: string;
  visibility: NoteVisibility;
  created_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  business_name: string;
  preferred_language: Language;
  message: string;
  status: "new" | "reviewing" | "responded" | "archived";
  created_at: string;
}

export interface SiteSettings {
  business_display_name: string;
  contact_email: string;
  phone_number: string;
  social_links: {
    facebook: string;
    instagram: string;
    linkedin: string;
  };
  default_language: Language;
  maintenance_mode: boolean;
}

export interface ActivityItem {
  id: string;
  message_en: string;
  message_es: string;
  created_at: string;
}

export interface AppData {
  authUsers: AuthUser[];
  profiles: Profile[];
  subscriptions: Subscription[];
  plans: Plan[];
  projects: Project[];
  intakeQuestions: IntakeQuestion[];
  intakeSubmissions: IntakeSubmission[];
  intakeAnswers: IntakeAnswer[];
  workItems: WorkItem[];
  workItemNotes: WorkItemNote[];
  contactMessages: ContactMessage[];
  siteSettings: SiteSettings;
  activity: ActivityItem[];
}
