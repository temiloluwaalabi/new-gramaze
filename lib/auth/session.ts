import { SessionOptions } from "iron-session";

export interface SessionData {
  user_id: number;
  accessToken: string;
  refreshToken?: string;
  email: string;
  firstName: string;
  isLoggedIn: boolean;
  userType: string;
  isBoarded: boolean;
}

export const defaultSessionData: SessionData = {
  user_id: 0,
  accessToken: "",
  refreshToken: undefined,
  email: "",
  firstName: "",
  userType: "",
  isLoggedIn: false,
  isBoarded: false,
};

export const sessionOptions: SessionOptions = {
  cookieName: "gramze-client-session",
  password: process.env.SESSION_PASSWORD as string,
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 3600,
  },
};
export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
