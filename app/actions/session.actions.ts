"use server";

import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

import { SessionData, sessionOptions, sleep } from "@/lib/auth/session";
import { User } from "@/types";

export async function getSession() {
  const shouldSleep = process.env.NODE_ENV === "development"; // Only sleep in development

  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions
  );

  if (shouldSleep) {
    await sleep(250);
  }

  return session;
}

export async function LoginSession(user: User, accessToken: string) {
  const session = await getSession();

  Object.assign(session, {
    user_id: user.id,
    accessToken,
    email: user.email,
    firstName: user.first_name,
    isLoggedIn: true,
    userType: user.user_role,
    isBoarded: user.has_set_medical_history === "yes", // Default to false if not provided
    isVerified: user.user_status === "active",
  });

  await session.save();
}

export async function RegisterSession(
  accessToken: string,
  user_data: {
    first_name: string;
    last_name: string;
    email: string;
    agree_to_terms: boolean;
    updated_at: string;
    created_at: string;
    id: number;
  }
) {
  const session = await getSession();
  Object.assign(session, {
    user_id: user_data.id,
    accessToken,
    email: user_data.email,
    firstName: user_data.first_name,
    isLoggedIn: true,
    isVerified: false,
    isBoarded: false,
  });
  await session.save();
}
export async function OnboardSession() {
  const session = await getSession();
  // Set some initial session data, e.g., user ID or token
  session.isBoarded = true; // Set isBoarded to true when onboarding is complete
  await session.save();
}
export async function SessionLogout() {
  const session = await getSession();
  session.destroy();
  // Redirect to the homepage (or login page) immediately
  const headers = new Headers();
  headers.set("cache-control", "no-store");
  headers.set("location", "/"); // Correct location header setting

  return new Response(null, {
    status: 303,
    headers,
  });
}
