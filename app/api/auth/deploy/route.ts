// app/api/deploy/route.ts (App Router)
// OR pages/api/deploy.ts (Pages Router)

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Optional: Add authentication/authorization
    // const authHeader = request.headers.get("authorization");
    // const expectedToken = process.env.DEPLOY_API_SECRET;

    // if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    // Your Vercel deploy hook URL (store in environment variable) 
    const deployHookUrl = process.env.VERCEL_DEPLOY_HOOK_URL;

    if (!deployHookUrl) {
      return NextResponse.json(
        { error: "Deploy hook URL not configured" },
        { status: 500 },
      );
    }

    // Optional: Get branch from request body
    const body = await request.json().catch(() => ({}));
    const branch = body.ref || "main";

    // Trigger the deploy hook
    const response = await fetch(deployHookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ref: branch }),
    });

    const deploymentData = await response.json();

    if (!response.ok) {
      throw new Error(`Deploy hook failed: ${response.statusText}`);
    }

    return NextResponse.json({
      success: true,
      message: "Deployment triggered successfully",
      deployment: deploymentData,
      branch,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Deploy hook error:", error);
    return NextResponse.json(
      {
        error: "Failed to trigger deployment",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

// Optional: Support GET requests for simple triggers
export async function GET() {
  return POST(new NextRequest("http://localhost/api/deploy"));
}
