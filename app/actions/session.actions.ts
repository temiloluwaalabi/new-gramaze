"use server";

import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

import {
  defaultSessionData,
  SessionData,
  sessionOptions,
} from "@/lib/auth/session";
import { User } from "@/types";

async function getSessionInstance() {
  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions
  );
  return session;
}

export async function getSession() {
  // const shouldSleep = process.env.NODE_ENV === "development"; // Only sleep in development

  const session = await getSessionInstance();

  // if (shouldSleep) {
  //   await sleep(250);
  // }

  // ✅ Return only the data, not the session instance
  return {
    user_id: session.user_id ?? defaultSessionData.user_id,
    accessToken: session.accessToken ?? defaultSessionData.accessToken,
    refreshToken: session.refreshToken ?? defaultSessionData.refreshToken,
    email: session.email ?? defaultSessionData.email,
    firstName: session.firstName ?? defaultSessionData.firstName,
    isLoggedIn: session.isLoggedIn ?? defaultSessionData.isLoggedIn,
    userType: session.userType ?? defaultSessionData.userType,
    isBoarded: session.isBoarded ?? defaultSessionData.isBoarded,
    isVerified: session.isVerified ?? defaultSessionData.isVerified,
  };
}

export async function LoginSession(user: User, accessToken: string) {
  const session = await getSessionInstance();

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

  await session.save(); // ✅ Return plain data after saving
  return {
    user_id: session.user_id,
    accessToken: session.accessToken,
    email: session.email,
    firstName: session.firstName,
    isLoggedIn: session.isLoggedIn,
    userType: session.userType,
    isBoarded: session.isBoarded,
    isVerified: session.isVerified,
  } as SessionData;
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
  const session = await getSessionInstance();
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
  // ✅ Return plain data
  return {
    user_id: session.user_id,
    accessToken: session.accessToken,
    email: session.email,
    firstName: session.firstName,
    isLoggedIn: session.isLoggedIn,
    userType: session.userType,
    isBoarded: session.isBoarded,
    isVerified: session.isVerified,
  } as SessionData;
}
export async function UpdateVerificationStatus(isVerified: boolean) {
  const session = await getSessionInstance();
  session.isVerified = isVerified;
  await session.save();

  return {
    user_id: session.user_id,
    accessToken: session.accessToken,
    email: session.email,
    firstName: session.firstName,
    isLoggedIn: session.isLoggedIn,
    userType: session.userType,
    isBoarded: session.isBoarded,
    isVerified: session.isVerified,
  } as SessionData;
}
export async function OnboardSession() {
  const session = await getSessionInstance();
  // Set some initial session data, e.g., user ID or token
  session.isBoarded = true; // Set isBoarded to true when onboarding is complete
  await session.save();
  // ✅ Return plain data
  return {
    user_id: session.user_id,
    accessToken: session.accessToken,
    email: session.email,
    firstName: session.firstName,
    isLoggedIn: session.isLoggedIn,
    userType: session.userType,
    isBoarded: session.isBoarded,
    isVerified: session.isVerified,
  } as SessionData;
}
export async function SessionLogout() {
  const session = await getSessionInstance();
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
