import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import {
  SessionData,
  sessionOptions,
  defaultSessionData,
} from "@/lib/auth/session";
import { User } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const session = await getIronSession<SessionData>(
      await cookies(),
      sessionOptions
    );

    // Get user and accessToken from request body
    const body = await request.json();
    const { user, accessToken } = body as { user: User; accessToken: string };

    session.isLoggedIn = true;
    session.email = user.email;
    session.firstName = user.first_name;
    session.userType = user.user_type || "";
    session.isBoarded = user.has_set_medical_history === "yes";
    session.accessToken = accessToken;

    await session.save();

    const url = new URL("/dashboard", request.url);

    return NextResponse.redirect(url.toString(), 303);
  } catch (error) {
    console.error("Session creation error:", error);
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions
  );

  const action = new URL(request.url).searchParams.get("action");

  if (action === "logout") {
    session.destroy();
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // ✅ Only return plain data
  return NextResponse.json({
    accessToken: session.accessToken,
    refreshToken: session.refreshToken,
    email: session.email,
    firstName: session.firstName,
    userType: session.userType,
    isLoggedIn: session.isLoggedIn,
    isBoarded: session.isBoarded,
  });
}

export async function PATCH() {
  try {
    const session = await getIronSession<SessionData>(
      await cookies(),
      sessionOptions
    );

    // Update to a fixed expiration time (e.g., 1 hour)
    const fixedMaxAge = 3600; // 1 hour in seconds

    session.updateConfig({
      ...sessionOptions,
      cookieOptions: {
        ...sessionOptions.cookieOptions,
        maxAge: fixedMaxAge,
      },
    });

    await session.save();

    return NextResponse.json({ message: "Session updated successfully" });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: "Failed to update session", details: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "An unknown error occurred" },
      { status: 500 }
    );
  }
}

// logout
export async function DELETE() {
  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions
  );

  session.destroy();

  return Response.json(defaultSessionData);
}
