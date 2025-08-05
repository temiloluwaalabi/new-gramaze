import Link from "next/link";
import React from "react";

import SignInForm from "@/components/forms/sign-in-form";
import { AuthWrapper } from "@/components/shared/auth-wrapper";
import { allRoutes } from "@/config/routes";

export default function SignInPage() {
  return (
    <AuthWrapper
      wrapper="!h-screen"
      bgImage="https://res.cloudinary.com/davidleo/image/upload/v1744665655/3864e698b0fd9e34562411ec01aaa7a8_y24v5h.png"
      authTitle="Hi! Welcome back"
      authDesc={
        <p className="text-sm md:text-[18px]">
          Don&apos;t have an account?{" "}
          <Link
            className="cursor-pointer text-blue-500"
            href={allRoutes.auth.signUp.url}
          >
            Sign Up
          </Link>
        </p>
      }
      form={<SignInForm />}
    />
  );
}
