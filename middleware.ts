import { NextRequest, NextResponse } from "next/server";

import { getSession } from "./app/actions/session.actions";
import {
  apiAuthPrefix,
  authRoutes,
  guestRoutes,
  DEFAULT_ONBOARDING_REDIRECT,
  DEFAULT_LOGIN_REDIRECT,
  LOGIN_LINK,
  DEFAULT_CAREGIVER_REDIRECT,
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

  console.log("PATHNAME", pathname);
  const session = await getSession();
  const hasAccessToken = !!session?.accessToken;
  const isLoggedIn = session?.isLoggedIn || false;
  const isOnboarded = session?.isBoarded || false;

  console.log("SESSION", session);

  const isApiAuthRoute = pathname.startsWith(apiAuthPrefix);
  const isAuthRoute = authRoutes.includes(pathname);
  const isGuestRoute = guestRoutes.some((route) => pathname.endsWith(route));

  const userType = session.userType;
  const isOnboardingRoute = pathname === DEFAULT_ONBOARDING_REDIRECT;
  const privateRoute = !isGuestRoute;

  // Role-based route checks
  const isCaregiverRoute = pathname.startsWith("/caregiver");
  const isDashboardRoute = pathname.startsWith("/dashboard");

  console.log("IS PRIVATE ROUTE", privateRoute);

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
    console.log("IS ONBOARDING ROUTE", isOnboardingRoute);
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
    const loginUrl = new URL(LOGIN_LINK, origin);
    loginUrl.searchParams.set("callbackUrl", callbackUrl);
    return NextResponse.redirect(loginUrl);
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
      return NextResponse.redirect(new URL(LOGIN_LINK, origin));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
