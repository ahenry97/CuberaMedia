import { appHref, isStaticExport } from "@/lib/paths";
import type { Profile, Role } from "@/lib/types";

const sessionKey = "cubera_static_session";
const usersKey = "cubera_static_users";
const fallbackStorageKey = "__cubera_static_storage__";
const timestamp = "2026-06-07T00:00:00.000Z";

interface StaticUser {
  email: string;
  password: string;
  profile: Profile;
}

interface AuthResult {
  ok: boolean;
  profile?: Profile;
  error?: string;
}

const demoUsers: StaticUser[] = [
  {
    email: "customer@example.com",
    password: "Password123!",
    profile: {
      id: "profile-customer-1",
      auth_user_id: "auth-customer-1",
      full_name: "Marisol Rivera",
      email: "customer@example.com",
      phone: "787-555-0188",
      business_name: "Rivera Cafe",
      preferred_language: "en",
      role: "customer",
      created_at: timestamp,
      updated_at: timestamp
    }
  },
  {
    email: "developer@example.com",
    password: "Password123!",
    profile: {
      id: "profile-developer-1",
      auth_user_id: "auth-developer-1",
      full_name: "Aaron Henry",
      email: "developer@example.com",
      phone: "787-555-0100",
      business_name: "Cubera Digital Solutions",
      preferred_language: "en",
      role: "developer",
      created_at: timestamp,
      updated_at: timestamp
    }
  }
];

function hasStorage() {
  return typeof window !== "undefined" && isStaticExport;
}

function readFallbackStorage(): Record<string, string> {
  if (typeof window === "undefined") return {};

  try {
    const parsed = JSON.parse(window.name || "{}") as Record<string, unknown>;
    return typeof parsed[fallbackStorageKey] === "object" && parsed[fallbackStorageKey] !== null
      ? (parsed[fallbackStorageKey] as Record<string, string>)
      : {};
  } catch {
    return {};
  }
}

function writeFallbackStorage(values: Record<string, string>) {
  if (typeof window === "undefined") return;

  let parsed: Record<string, unknown> = {};
  try {
    parsed = JSON.parse(window.name || "{}") as Record<string, unknown>;
  } catch {
    parsed = {};
  }

  parsed[fallbackStorageKey] = values;
  window.name = JSON.stringify(parsed);
}

function storageGet(key: string) {
  if (!hasStorage()) return null;

  try {
    if (window.localStorage) return window.localStorage.getItem(key);
  } catch {
    // Fall back below.
  }

  return readFallbackStorage()[key] ?? null;
}

function storageSet(key: string, value: string) {
  if (!hasStorage()) return;

  try {
    if (window.localStorage) {
      window.localStorage.setItem(key, value);
      return;
    }
  } catch {
    // Fall back below.
  }

  writeFallbackStorage({ ...readFallbackStorage(), [key]: value });
}

function storageRemove(key: string) {
  if (!hasStorage()) return;

  try {
    if (window.localStorage) {
      window.localStorage.removeItem(key);
      return;
    }
  } catch {
    // Fall back below.
  }

  const values = readFallbackStorage();
  delete values[key];
  writeFallbackStorage(values);
}

function normalizeEmail(email: FormDataEntryValue | string | null) {
  return String(email ?? "").trim().toLowerCase();
}

function readUsers(): StaticUser[] {
  if (!hasStorage()) return demoUsers;

  const raw = storageGet(usersKey);
  const stored = raw ? (JSON.parse(raw) as StaticUser[]) : [];
  return [...demoUsers, ...stored];
}

function writeStoredUsers(users: StaticUser[]) {
  if (!hasStorage()) return;
  const storedOnly = users.filter((user) => !demoUsers.some((demo) => demo.email === user.email));
  storageSet(usersKey, JSON.stringify(storedOnly));
}

function setStaticProfile(profile: Profile) {
  if (!hasStorage()) return;
  storageSet(sessionKey, JSON.stringify(profile));
  window.dispatchEvent(new Event("cubera-static-auth-change"));
}

export function getStaticProfile(): Profile | null {
  if (!hasStorage()) return null;

  const raw = storageGet(sessionKey);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as Profile;
  } catch {
    storageRemove(sessionKey);
    return null;
  }
}

export function logoutStaticProfile() {
  if (!hasStorage()) return;
  storageRemove(sessionKey);
  window.dispatchEvent(new Event("cubera-static-auth-change"));
}

export function staticDashboardHref(role: Role) {
  return appHref(role === "developer" ? "/developer" : "/dashboard");
}

export function loginStaticAccount(formData: FormData): AuthResult {
  const email = normalizeEmail(formData.get("email"));
  const password = String(formData.get("password") ?? "");
  const user = readUsers().find((item) => item.email === email);

  if (!user || user.password !== password) {
    return { ok: false, error: "Use customer@example.com or developer@example.com with Password123!, or register a new customer account." };
  }

  setStaticProfile(user.profile);
  return { ok: true, profile: user.profile };
}

export function registerStaticAccount(formData: FormData): AuthResult {
  const email = normalizeEmail(formData.get("email"));
  const password = String(formData.get("password") ?? "");
  const fullName = String(formData.get("full_name") ?? "").trim();
  const businessName = String(formData.get("business_name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const preferredLanguage = String(formData.get("preferred_language") ?? "en") === "es" ? "es" : "en";

  if (!email || !password || !fullName || !businessName || !phone) {
    return { ok: false, error: "Complete all required fields." };
  }

  if (password.length < 8) {
    return { ok: false, error: "Password must be at least 8 characters." };
  }

  const users = readUsers();
  if (users.some((user) => user.email === email)) {
    return { ok: false, error: "An account with this email already exists." };
  }

  const idSuffix = `${Date.now()}`;
  const profile: Profile = {
    id: `profile-static-${idSuffix}`,
    auth_user_id: `auth-static-${idSuffix}`,
    full_name: fullName,
    email,
    phone,
    business_name: businessName,
    preferred_language: preferredLanguage,
    role: "customer",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const nextUsers = [...users, { email, password, profile }];
  writeStoredUsers(nextUsers);
  setStaticProfile(profile);
  return { ok: true, profile };
}
