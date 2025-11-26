import { NextRequest, NextResponse } from "next/server";

import { getSession } from "./app/actions/session.actions";
import {
  apiAuthPrefix,
  authRoutes,
  guestRoutes,
  DEFAULT_ONBOARDING_REDIRECT,
  DEFAULT_LOGIN_REDIRECT,
  // LOGIN_LINK,
  DEFAULT_CAREGIVER_REDIRECT,
  REGISTER_LINK,
} from "./route";

// Helper function to validate and sanitize callback URLs
const sanitizeCallbackUrl = (url: string, base: string) => {
  try {
    const parsed = new URL(url, base);
    // Only allow same-origin callback URLs
    return parsed.origin === base ? `${parsed.pathname}${parsed.search}` : "";
  } catch {
    return "";
  }
};

export default async function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const { pathname, origin, search } = nextUrl;

  // Define accessible routes for unverified users
  const unverifiedAccessibleRoutes = [
    "/dashboard",
    "/dashboard/appointment",
    "/booked",
  ];
  const session = await getSession();
  const hasAccessToken = !!session?.accessToken;
  const isLoggedIn = session?.isLoggedIn || false;
  const isOnboarded = session?.isBoarded || false;
  const isVerified = session?.isVerified || false;

  console.log("SESSION", session);
  const isApiAuthRoute = pathname.startsWith(apiAuthPrefix);
  const isAuthRoute = authRoutes.includes(pathname);
  const isGuestRoute = guestRoutes.some((route) => pathname.endsWith(route));
  const isUnverifiedRoute = unverifiedAccessibleRoutes.some((route) =>
    pathname.endsWith(route)
  );

  const userType = session.userType;
  const isOnboardingRoute = pathname === DEFAULT_ONBOARDING_REDIRECT;
  const privateRoute = !isGuestRoute;

  // Role-based route checks
  const isCaregiverRoute = pathname.startsWith("/caregiver");
  const isDashboardRoute = pathname.startsWith("/dashboard");

  if (isApiAuthRoute) return NextResponse.next();

  // Special routes: require token in query
  if (pathname === "/reset-password" || pathname === "/confirm-email") {
    const url = new URL(req.url);
    if (!url.searchParams.has("token")) {
      return NextResponse.redirect(new URL("/sign-in", origin));
    }
  }

  // Role-based access control for logged in and onboarded users
  if (isLoggedIn && isOnboarded) {
    // Caregiver trying to access dashboard routes - redirect to caregiver area
    if (userType === "caregiver" && isDashboardRoute) {
      return NextResponse.redirect(new URL(DEFAULT_CAREGIVER_REDIRECT, origin));
    }

    // Normal user trying to access caregiver routes - redirect to dashboard
    if (userType !== "caregiver" && isCaregiverRoute) {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, origin));
    }
  }

  // Allow access to onboarding if accessToken is present (even if not logged in)
  // Onboarding flow logic
  if (isOnboardingRoute) {
    // If user is logged in and already onboarded, redirect to appropriate dashboard
    if (isLoggedIn && isOnboarded) {
      if (userType === "caregiver") {
        return NextResponse.redirect(
          new URL(DEFAULT_CAREGIVER_REDIRECT, origin)
        );
      } else {
        return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, origin));
      }
    }
    // If user has accessToken (registered but not fully logged in) or is logged in but not onboarded, allow access
    if (hasAccessToken || isLoggedIn) {
      return NextResponse.next();
    }
    // No access token, redirect to sign-in
    return NextResponse.redirect(new URL("/sign-in", nextUrl));
  }

  // If user is logged in but not onboarded, redirect to onboarding (except if already on onboarding)
  if (isLoggedIn && !isOnboarded && !isOnboardingRoute) {
    return NextResponse.redirect(new URL(DEFAULT_ONBOARDING_REDIRECT, origin));
  }
  // After onboarding check, before role-based checks:
  if (isLoggedIn && isOnboarded && !isVerified) {
    if (!isUnverifiedRoute) {
      //      const sanitizeCallback = sanitizeCallbackUrl(
      //   `${pathname}${search}`,
      //   origin
      // );
      // const callbackUrl = sanitizeCallback || DEFAULT_LOGIN_REDIRECT;
      // Redirect to dashboard with a message
      const uri = new URL(DEFAULT_LOGIN_REDIRECT, origin);
      uri.searchParams.set("verify", "required");
      return NextResponse.redirect(uri);
    }
  }
  // If user is on auth routes and already logged in, redirect to appropriate dashboard
  if (isAuthRoute && isLoggedIn) {
    if (userType === "caregiver") {
      return NextResponse.redirect(new URL(DEFAULT_CAREGIVER_REDIRECT, origin));
    } else {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, origin));
    }
  }

  // If trying to access private route and not logged in, redirect to login
  if (privateRoute && !isLoggedIn) {
    const sanitizeCallback = sanitizeCallbackUrl(
      `${pathname}${search}`,
      origin
    );
    const callbackUrl = sanitizeCallback || DEFAULT_LOGIN_REDIRECT;
    const registerUrl = new URL(REGISTER_LINK, origin);
    registerUrl.searchParams.set("callbackUrl", callbackUrl);
    return NextResponse.redirect(registerUrl);
  }

  if (pathname === "/") {
    if (isLoggedIn && isOnboarded) {
      if (userType === "caregiver") {
        return NextResponse.redirect(
          new URL(DEFAULT_CAREGIVER_REDIRECT, origin)
        );
      } else {
        return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, origin));
      }
    } else if (isLoggedIn && !isOnboarded) {
      return NextResponse.redirect(
        new URL(DEFAULT_ONBOARDING_REDIRECT, origin)
      );
    } else {
      return NextResponse.redirect(new URL(REGISTER_LINK, origin));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
