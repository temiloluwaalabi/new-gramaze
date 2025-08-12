import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import {
  SessionData,
  sessionOptions,
  defaultSessionData,
} from "@/lib/auth/session";
import { User } from "@/types";

export async function POST(
  request: NextRequest,
  user: User,
  accessToken: string
) {
  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions
  );
  //   const formData = await request.formData(); 

  session.isLoggedIn = true;
  if (session.email) {
    session.email = user.email;
  }
  if (session.firstName) {
    session.firstName = user.first_name;
  }
  if (session.userType) {
    session.userType = user.user_type || "";
  }
  if (session.isBoarded) {
    session.isBoarded = user.has_set_medical_history === "yes";
  }
  session.accessToken = accessToken;
  await session.save();

  // await sleep(250);

  const url = new URL("/dashboard", request.url);

  return NextResponse.redirect(url.toString(), 303);
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

  // await sleep(250);

  // if (session.isLoggedIn !== true) {
  //   return NextResponse.json(defaultSessionData, { status: 401 });
  // }

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
