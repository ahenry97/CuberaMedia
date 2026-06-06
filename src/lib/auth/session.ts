import crypto from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { NextResponse } from "next/server";
import { findProfileByAuthUserId } from "@/lib/db/store";
import type { Profile, Role } from "@/lib/types";

export const SESSION_COOKIE = "cubera_session";

export interface SessionPayload {
  authUserId: string;
  profileId: string;
  role: Role;
  email: string;
  expiresAt: number;
}

const encoder = new TextEncoder();

function getSecret(): string {
  return process.env.AUTH_SECRET || "local-development-secret-change-me";
}

function base64Url(input: string | Buffer): string {
  return Buffer.from(input).toString("base64url");
}

function sign(value: string): string {
  return crypto.createHmac("sha256", getSecret()).update(value).digest("base64url");
}

export function createSessionToken(profile: Profile): string {
  const payload: SessionPayload = {
    authUserId: profile.auth_user_id,
    profileId: profile.id,
    role: profile.role,
    email: profile.email,
    expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7
  };
  const encodedPayload = base64Url(JSON.stringify(payload));
  return `${encodedPayload}.${sign(encodedPayload)}`;
}

export function verifySessionToken(token: string | undefined): SessionPayload | null {
  if (!token) {
    return null;
  }

  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) {
    return null;
  }

  const expected = sign(encodedPayload);
  const expectedBytes = encoder.encode(expected);
  const signatureBytes = encoder.encode(signature);

  if (expectedBytes.length !== signatureBytes.length || !crypto.timingSafeEqual(expectedBytes, signatureBytes)) {
    return null;
  }

  const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8")) as SessionPayload;
  if (payload.expiresAt < Date.now()) {
    return null;
  }

  return payload;
}

export function setSessionCookie(response: NextResponse, profile: Profile): void {
  response.cookies.set(SESSION_COOKIE, createSessionToken(profile), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
}

export function clearSessionCookie(response: NextResponse): void {
  response.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0
  });
}

export async function getCurrentSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  return verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value);
}

export async function getCurrentProfile(): Promise<Profile | null> {
  const session = await getCurrentSession();
  if (!session) {
    return null;
  }

  return findProfileByAuthUserId(session.authUserId);
}

export async function requireAuth(): Promise<Profile> {
  const profile = await getCurrentProfile();
  if (!profile) {
    redirect("/login");
  }

  return profile;
}

export async function requireRole(roles: Role | Role[]): Promise<Profile> {
  const allowedRoles = Array.isArray(roles) ? roles : [roles];
  const profile = await requireAuth();

  if (!allowedRoles.includes(profile.role)) {
    redirect(profile.role === "developer" ? "/developer" : "/dashboard");
  }

  return profile;
}
