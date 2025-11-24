// app/api/session/update-verification/route.ts
import { NextResponse } from "next/server";

import { UpdateVerificationStatus } from "@/app/actions/session.actions";

export async function POST(request: Request) {
  try {
    const { isVerified } = await request.json();

    console.log("ISVERIFIED", isVerified);
    await UpdateVerificationStatus(isVerified);

    return NextResponse.json({ success: true });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update session" },
      { status: 500 }
    );
  }
}
