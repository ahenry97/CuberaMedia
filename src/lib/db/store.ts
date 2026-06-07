import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { createSeedData } from "@/lib/db/seed";
import type {
  AppData,
  ContactMessage,
  IntakeAnswer,
  IntakeAnswerValue,
  IntakeQuestion,
  IntakeSubmission,
  Language,
  OperationWorkflow,
  Plan,
  Profile,
  ProjectStatus,
  Role,
  SiteSettings,
  SubscriptionStatus,
  WorkItem,
  WorkItemNote,
  WorkItemPriority,
  WorkItemStatus
} from "@/lib/types";

const dataFilePath = () => path.resolve(process.cwd(), process.env.LOCAL_DATA_FILE ?? ".local-data/app-data.json");

const workStatusOptions: WorkItemStatus[] = [
  "new",
  "reviewing",
  "needs_client_info",
  "approved",
  "staged",
  "in_progress",
  "internal_review",
  "waiting_for_client_approval",
  "rejected",
  "complete",
  "archived"
];

async function ensureDataFile(): Promise<void> {
  const filePath = dataFilePath();
  await fs.mkdir(path.dirname(filePath), { recursive: true });

  try {
    await fs.access(filePath);
  } catch {
    const seedData = await createSeedData();
    await fs.writeFile(filePath, JSON.stringify(seedData, null, 2));
  }
}

export async function resetDataWithSeed(): Promise<AppData> {
  const filePath = dataFilePath();
  const seedData = await createSeedData();
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(seedData, null, 2));
  return seedData;
}

export async function readData(): Promise<AppData> {
  await ensureDataFile();
  const raw = await fs.readFile(dataFilePath(), "utf8");
  const data = JSON.parse(raw) as AppData;
  normalizeData(data);
  return data;
}

function defaultOperationWorkflows(timestamp = new Date().toISOString()): OperationWorkflow[] {
  return [
    {
      id: "workflow-default-intake",
      name: "Default intake workflow",
      description: "Standard workflow for new intake, support, and subscription review work items.",
      source_type: "intake",
      statuses: [
        "new",
        "reviewing",
        "needs_client_info",
        "approved",
        "staged",
        "in_progress",
        "internal_review",
        "waiting_for_client_approval",
        "complete"
      ],
      notification_rules: "Notify customers when more information, approval, or completion is needed.",
      document_rules: "Request documents only when a workflow stage requires client-supplied assets.",
      active: true,
      created_at: timestamp,
      updated_at: timestamp
    }
  ];
}

function normalizeData(data: AppData): void {
  data.operationWorkflows ??= defaultOperationWorkflows();
  data.plans = data.plans.map((plan) => ({
    ...plan,
    requires_verification: plan.requires_verification ?? false,
    notification_note_en: plan.notification_note_en ?? "",
    notification_note_es: plan.notification_note_es ?? ""
  }));
}

export async function writeData<T>(updater: (data: AppData) => T | Promise<T>): Promise<T> {
  await ensureDataFile();
  const data = await readData();
  const result = await updater(data);
  await fs.writeFile(dataFilePath(), JSON.stringify(data, null, 2));
  return result;
}

export async function findProfileByAuthUserId(authUserId: string): Promise<Profile | null> {
  const data = await readData();
  return data.profiles.find((profile) => profile.auth_user_id === authUserId) ?? null;
}

export async function findProfileByEmail(email: string): Promise<Profile | null> {
  const normalizedEmail = email.trim().toLowerCase();
  const data = await readData();
  return data.profiles.find((profile) => profile.email.toLowerCase() === normalizedEmail) ?? null;
}

export async function registerCustomer(input: {
  full_name: string;
  email: string;
  password: string;
  business_name: string;
  phone: string;
  preferred_language: Language;
}): Promise<Profile> {
  const normalizedEmail = input.email.trim().toLowerCase();
  const existing = await findProfileByEmail(normalizedEmail);

  if (existing) {
    throw new Error("Email is already registered.");
  }

  const passwordHash = await hashPassword(input.password);
  const timestamp = new Date().toISOString();

  return writeData((data) => {
    const authUserId = crypto.randomUUID();
    const profileId = crypto.randomUUID();

    data.authUsers.push({
      id: authUserId,
      email: normalizedEmail,
      password_hash: passwordHash,
      provider: "email",
      created_at: timestamp,
      updated_at: timestamp
    });

    const profile: Profile = {
      id: profileId,
      auth_user_id: authUserId,
      full_name: input.full_name.trim(),
      email: normalizedEmail,
      phone: input.phone.trim(),
      business_name: input.business_name.trim(),
      preferred_language: input.preferred_language,
      role: "customer",
      created_at: timestamp,
      updated_at: timestamp
    };

    data.profiles.push(profile);
    data.subscriptions.push({
      id: crypto.randomUUID(),
      customer_id: profileId,
      plan_name: "Starter",
      status: "pending",
      renewal_date: null,
      included_services: ["Initial onboarding", "Digital profile checklist"],
      created_at: timestamp,
      updated_at: timestamp
    });
    data.activity.unshift({
      id: crypto.randomUUID(),
      message_en: `${profile.full_name} registered as a new customer.`,
      message_es: `${profile.full_name} se registro como cliente nuevo.`,
      created_at: timestamp
    });

    return profile;
  });
}

export async function authenticateUser(email: string, password: string): Promise<Profile | null> {
  const normalizedEmail = email.trim().toLowerCase();
  const data = await readData();
  const authUser = data.authUsers.find((user) => user.email.toLowerCase() === normalizedEmail);

  if (!authUser || !(await verifyPassword(password, authUser.password_hash))) {
    return null;
  }

  return data.profiles.find((profile) => profile.auth_user_id === authUser.id) ?? null;
}

export async function createContactMessage(input: Omit<ContactMessage, "id" | "status" | "created_at">): Promise<ContactMessage> {
  const timestamp = new Date().toISOString();
  return writeData((data) => {
    const message: ContactMessage = {
      id: crypto.randomUUID(),
      ...input,
      status: "new",
      created_at: timestamp
    };

    data.contactMessages.unshift(message);
    data.workItems.unshift({
      id: crypto.randomUUID(),
      customer_id: "",
      project_id: null,
      intake_submission_id: null,
      title: `Contact request from ${message.business_name || message.name}`,
      source_type: "contact",
      status: "new",
      priority: "normal",
      assigned_to: null,
      archived: false,
      created_at: timestamp,
      updated_at: timestamp
    });
    data.activity.unshift({
      id: crypto.randomUUID(),
      message_en: `New contact message from ${message.name}.`,
      message_es: `Nuevo mensaje de contacto de ${message.name}.`,
      created_at: timestamp
    });

    return message;
  });
}

export async function submitIntake(customerId: string, answers: Record<string, IntakeAnswerValue>): Promise<IntakeSubmission> {
  const timestamp = new Date().toISOString();

  return writeData((data) => {
    const activeQuestions = data.intakeQuestions.filter((question) => question.active && !question.archived);
    const submission: IntakeSubmission = {
      id: crypto.randomUUID(),
      customer_id: customerId,
      submitted_at: timestamp,
      status: "submitted",
      created_at: timestamp,
      updated_at: timestamp
    };

    const savedAnswers: IntakeAnswer[] = activeQuestions.map((question) => ({
      id: crypto.randomUUID(),
      submission_id: submission.id,
      question_id: question.id,
      answer_json: answers[question.id] ?? "",
      created_at: timestamp,
      updated_at: timestamp
    }));

    data.intakeSubmissions.unshift(submission);
    data.intakeAnswers.unshift(...savedAnswers);
    data.workItems.unshift({
      id: crypto.randomUUID(),
      customer_id: customerId,
      project_id: null,
      intake_submission_id: submission.id,
      title: "Review new intake submission",
      source_type: "intake",
      status: "new",
      priority: "normal",
      assigned_to: null,
      archived: false,
      created_at: timestamp,
      updated_at: timestamp
    });
    data.activity.unshift({
      id: crypto.randomUUID(),
      message_en: "A new intake form was submitted.",
      message_es: "Se envio un nuevo formulario de intake.",
      created_at: timestamp
    });

    return submission;
  });
}

export async function createSupportRequest(customerId: string, category: string, title: string, note: string): Promise<WorkItem> {
  const timestamp = new Date().toISOString();

  return writeData((data) => {
    const customer = data.profiles.find((profile) => profile.id === customerId);
    const workItem: WorkItem = {
      id: crypto.randomUUID(),
      customer_id: customerId,
      project_id: null,
      intake_submission_id: null,
      title: `${category}: ${title}`,
      source_type: "support_request",
      status: "new",
      priority: "normal",
      assigned_to: null,
      archived: false,
      created_at: timestamp,
      updated_at: timestamp
    };

    data.workItems.unshift(workItem);
    data.workItemNotes.unshift({
      id: crypto.randomUUID(),
      work_item_id: workItem.id,
      author_id: customerId,
      note: `Category: ${category}\n\n${note}`,
      visibility: "customer_visible",
      created_at: timestamp
    });
    data.activity.unshift({
      id: crypto.randomUUID(),
      message_en: `${customer?.business_name ?? "A customer"} submitted a ${category.toLowerCase()} support request.`,
      message_es: `${customer?.business_name ?? "Un cliente"} envio una solicitud de soporte: ${category}.`,
      created_at: timestamp
    });

    return workItem;
  });
}

export async function createSubscriptionChangeRequest(input: {
  customer_id: string;
  plan_name: string;
  note: string;
  requires_verification: boolean;
}): Promise<WorkItem> {
  const timestamp = new Date().toISOString();

  return writeData((data) => {
    const customer = data.profiles.find((profile) => profile.id === input.customer_id);
    const workItem: WorkItem = {
      id: crypto.randomUUID(),
      customer_id: input.customer_id,
      project_id: null,
      intake_submission_id: null,
      title: `Subscription request: ${input.plan_name}`,
      source_type: "subscription_request",
      status: "new",
      priority: input.requires_verification ? "high" : "normal",
      assigned_to: null,
      archived: false,
      created_at: timestamp,
      updated_at: timestamp
    };

    data.workItems.unshift(workItem);
    data.workItemNotes.unshift({
      id: crypto.randomUUID(),
      work_item_id: workItem.id,
      author_id: input.customer_id,
      note: [
        `Requested plan: ${input.plan_name}`,
        `Verification required: ${input.requires_verification ? "Yes" : "No"}`,
        input.note ? `Customer note: ${input.note}` : ""
      ]
        .filter(Boolean)
        .join("\n"),
      visibility: "customer_visible",
      created_at: timestamp
    });
    data.activity.unshift({
      id: crypto.randomUUID(),
      message_en: `${customer?.business_name ?? "A customer"} requested the ${input.plan_name} plan.`,
      message_es: `${customer?.business_name ?? "Un cliente"} solicito el plan ${input.plan_name}.`,
      created_at: timestamp
    });

    return workItem;
  });
}

export async function updateProfile(profileId: string, updates: Partial<Pick<Profile, "full_name" | "phone" | "business_name" | "preferred_language">>): Promise<Profile | null> {
  const timestamp = new Date().toISOString();

  return writeData((data) => {
    const profile = data.profiles.find((item) => item.id === profileId);
    if (!profile) {
      return null;
    }

    Object.assign(profile, updates, { updated_at: timestamp });
    return profile;
  });
}

export async function upsertIntakeQuestion(input: Partial<IntakeQuestion>): Promise<IntakeQuestion> {
  const timestamp = new Date().toISOString();

  return writeData((data) => {
    if (input.id) {
      const existing = data.intakeQuestions.find((question) => question.id === input.id);
      if (!existing) {
        throw new Error("Question not found.");
      }

      Object.entries(input).forEach(([key, value]) => {
        if (value !== undefined && key !== "id") {
          (existing as unknown as Record<string, unknown>)[key] = value;
        }
      });
      existing.updated_at = timestamp;
      return existing;
    }

    if (!input.label_en || !input.label_es || !input.question_type) {
      throw new Error("English label, Spanish label, and question type are required.");
    }

    const maxOrder = Math.max(0, ...data.intakeQuestions.map((question) => question.display_order));
    const question: IntakeQuestion = {
      id: crypto.randomUUID(),
      label_en: input.label_en,
      label_es: input.label_es,
      help_text_en: input.help_text_en ?? "",
      help_text_es: input.help_text_es ?? "",
      question_type: input.question_type,
      required: input.required ?? false,
      display_order: input.display_order ?? maxOrder + 1,
      active: input.active ?? true,
      archived: input.archived ?? false,
      options_json: input.options_json ?? [],
      created_at: timestamp,
      updated_at: timestamp
    };

    data.intakeQuestions.push(question);
    return question;
  });
}

export async function updateWorkItem(input: {
  id: string;
  status?: WorkItemStatus;
  priority?: WorkItemPriority;
  project_id?: string | null;
  assigned_to?: string | null;
  archived?: boolean;
  note?: string;
  author_id: string;
}): Promise<WorkItem | null> {
  const timestamp = new Date().toISOString();

  return writeData((data) => {
    const workItem = data.workItems.find((item) => item.id === input.id);
    if (!workItem) {
      return null;
    }

    if (input.status) workItem.status = input.status;
    if (input.priority) workItem.priority = input.priority;
    if (input.project_id !== undefined) workItem.project_id = input.project_id;
    if (input.assigned_to !== undefined) workItem.assigned_to = input.assigned_to;
    if (input.archived !== undefined) workItem.archived = input.archived;
    workItem.updated_at = timestamp;

    if (input.note?.trim()) {
      const note: WorkItemNote = {
        id: crypto.randomUUID(),
        work_item_id: workItem.id,
        author_id: input.author_id,
        note: input.note.trim(),
        visibility: "internal",
        created_at: timestamp
      };
      data.workItemNotes.unshift(note);
    }

    return workItem;
  });
}

export async function updateCustomerSubscription(input: {
  customer_id: string;
  plan_name: string;
  status: SubscriptionStatus;
}): Promise<void> {
  const timestamp = new Date().toISOString();

  await writeData((data) => {
    const subscription = data.subscriptions.find((item) => item.customer_id === input.customer_id);
    if (!subscription) return;
    subscription.plan_name = input.plan_name;
    subscription.status = input.status;
    subscription.updated_at = timestamp;
  });
}

export async function updateCustomerAccount(input: {
  customer_id: string;
  plan_name: string;
  status: SubscriptionStatus;
  phone: string;
  developer_note: string;
  author_id: string;
}): Promise<Profile | null> {
  const timestamp = new Date().toISOString();

  return writeData((data) => {
    const profile = data.profiles.find((item) => item.id === input.customer_id);
    if (!profile) return null;

    const subscription = data.subscriptions.find((item) => item.customer_id === input.customer_id);
    if (subscription) {
      subscription.plan_name = input.plan_name;
      subscription.status = input.status;
      subscription.updated_at = timestamp;
    }

    profile.phone = input.phone;
    profile.updated_at = timestamp;

    data.activity.unshift({
      id: crypto.randomUUID(),
      message_en: `Account notification queued for ${profile.email}: ${input.developer_note}`,
      message_es: `Notificacion de cuenta preparada para ${profile.email}: ${input.developer_note}`,
      created_at: timestamp
    });

    data.workItems.unshift({
      id: crypto.randomUUID(),
      customer_id: profile.id,
      project_id: null,
      intake_submission_id: null,
      title: `Account update notification for ${profile.business_name}`,
      source_type: "manual",
      status: "complete",
      priority: "normal",
      assigned_to: input.author_id,
      archived: false,
      created_at: timestamp,
      updated_at: timestamp
    });

    return profile;
  });
}

export async function upsertPlan(input: Partial<Plan>): Promise<Plan> {
  const cleanFeatures = (features: unknown): string[] => {
    if (Array.isArray(features)) return features.map(String).map((feature) => feature.trim()).filter(Boolean);
    if (typeof features === "string") return features.split("\n").map((feature) => feature.trim()).filter(Boolean);
    return [];
  };

  return writeData((data) => {
    if (input.id) {
      const existing = data.plans.find((plan) => plan.id === input.id);
      if (!existing) throw new Error("Plan not found.");
      existing.name = input.name ?? existing.name;
      existing.monthly_price = input.monthly_price ?? existing.monthly_price;
      existing.description_en = input.description_en ?? existing.description_en;
      existing.description_es = input.description_es ?? existing.description_es;
      existing.features_en = input.features_en ? cleanFeatures(input.features_en) : existing.features_en;
      existing.features_es = input.features_es ? cleanFeatures(input.features_es) : existing.features_es;
      existing.requires_verification = input.requires_verification ?? existing.requires_verification ?? false;
      existing.notification_note_en = input.notification_note_en ?? existing.notification_note_en ?? "";
      existing.notification_note_es = input.notification_note_es ?? existing.notification_note_es ?? "";
      return existing;
    }

    if (!input.name || !input.monthly_price) {
      throw new Error("Plan name and monthly price are required.");
    }

    const plan: Plan = {
      id: crypto.randomUUID(),
      name: input.name,
      monthly_price: input.monthly_price,
      description_en: input.description_en ?? "",
      description_es: input.description_es ?? "",
      features_en: cleanFeatures(input.features_en),
      features_es: cleanFeatures(input.features_es),
      requires_verification: input.requires_verification ?? false,
      notification_note_en: input.notification_note_en ?? "",
      notification_note_es: input.notification_note_es ?? ""
    };

    data.plans.push(plan);
    return plan;
  });
}

export async function deletePlan(planId: string): Promise<void> {
  await writeData((data) => {
    data.plans = data.plans.filter((plan) => plan.id !== planId);
  });
}

export async function upsertOperationWorkflow(input: Partial<OperationWorkflow>): Promise<OperationWorkflow> {
  const timestamp = new Date().toISOString();
  const cleanStatuses = (statuses: unknown): WorkItemStatus[] => {
    const values = Array.isArray(statuses)
      ? statuses.map(String)
      : typeof statuses === "string"
        ? statuses.split("\n").map((status) => status.trim())
        : [];
    return values.filter((status): status is WorkItemStatus => workStatusOptions.includes(status as WorkItemStatus));
  };

  return writeData((data) => {
    if (input.id) {
      const existing = data.operationWorkflows.find((workflow) => workflow.id === input.id);
      if (!existing) throw new Error("Workflow not found.");
      existing.name = input.name ?? existing.name;
      existing.description = input.description ?? existing.description;
      existing.source_type = input.source_type ?? existing.source_type;
      existing.statuses = input.statuses ? cleanStatuses(input.statuses) : existing.statuses;
      existing.notification_rules = input.notification_rules ?? existing.notification_rules;
      existing.document_rules = input.document_rules ?? existing.document_rules;
      existing.active = input.active ?? existing.active;
      existing.updated_at = timestamp;
      return existing;
    }

    if (!input.name || !input.source_type) {
      throw new Error("Workflow name and source type are required.");
    }

    const workflow: OperationWorkflow = {
      id: crypto.randomUUID(),
      name: input.name,
      description: input.description ?? "",
      source_type: input.source_type,
      statuses: cleanStatuses(input.statuses).length ? cleanStatuses(input.statuses) : defaultOperationWorkflows(timestamp)[0].statuses,
      notification_rules: input.notification_rules ?? "",
      document_rules: input.document_rules ?? "",
      active: input.active ?? true,
      created_at: timestamp,
      updated_at: timestamp
    };

    data.operationWorkflows.push(workflow);
    return workflow;
  });
}

export async function deleteOperationWorkflow(workflowId: string): Promise<void> {
  await writeData((data) => {
    data.operationWorkflows = data.operationWorkflows.filter((workflow) => workflow.id !== workflowId);
  });
}

export async function updateProjectStatus(projectId: string, status: ProjectStatus): Promise<void> {
  const timestamp = new Date().toISOString();

  await writeData((data) => {
    const project = data.projects.find((item) => item.id === projectId);
    if (!project) return;
    project.status = status;
    project.updated_at = timestamp;
  });
}

export async function updateContactMessageStatus(messageId: string, status: ContactMessage["status"]): Promise<ContactMessage | null> {
  return writeData((data) => {
    const message = data.contactMessages.find((item) => item.id === messageId);
    if (!message) {
      return null;
    }

    message.status = status;
    return message;
  });
}

export async function updateSiteSettings(updates: SiteSettings): Promise<SiteSettings> {
  return writeData((data) => {
    data.siteSettings = updates;
    return data.siteSettings;
  });
}

export function canReadCustomerRecord(profile: Profile, customerId: string): boolean {
  return profile.role === "developer" || profile.id === customerId;
}

export function roleAllows(profile: Profile, role: Role): boolean {
  return profile.role === role;
}
