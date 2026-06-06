import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { createSeedData } from "@/lib/db/seed";
import type {
  AppData,
  ContactMessage,
  IntakeAnswer,
  IntakeQuestion,
  IntakeSubmission,
  Language,
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
  return JSON.parse(raw) as AppData;
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

export async function submitIntake(customerId: string, answers: Record<string, string | string[] | boolean>): Promise<IntakeSubmission> {
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

export async function createSupportRequest(customerId: string, title: string, note: string): Promise<WorkItem> {
  const timestamp = new Date().toISOString();

  return writeData((data) => {
    const workItem: WorkItem = {
      id: crypto.randomUUID(),
      customer_id: customerId,
      project_id: null,
      intake_submission_id: null,
      title,
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
      note,
      visibility: "customer_visible",
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
