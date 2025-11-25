"use client";
import Link from "next/link";
import React from "react";

import { LoginForm } from "@/components/forms/auth/login-form-wrapper";
import { AuthWrapper } from "@/components/shared/auth-wrapper";
import { allRoutes } from "@/config/routes";
import { useLoginStore } from "@/store/use-login-store";

export default function SignInPage() {
  const { currentStep } = useLoginStore();
  return (
    <AuthWrapper
      wrapper="!h-screen not-md:flex not-md:items-center not-md:justify-center"
      bgImage="/asset/images/home-bg.jpeg"
      authTitle={
        currentStep === 1 ? "Hi! Welcome back" : "Please verify your identity "
      }
      authDesc={
        currentStep === 1 ? (
          <p className="text-sm md:text-[18px]">
            Don&apos;t have an account?{" "}
            <Link
              className="cursor-pointer text-blue-500"
              href={allRoutes.auth.signUp.url}
            >
              Sign Up
            </Link>
          </p>
        ) : (
          <p className="text-center text-sm text-gray-500">
            For security reasons, we need to verify your identity. A unique code
            has been sent to your registered email address. Please check your
            inbox, retrieve the code, and enter it in the field below to
            complete the login process. This additional step ensures your
            account remains secure. If you do not see the email in your inbox,
            please check your spam or junk folder.
          </p>
        )
      }
      form={<LoginForm />}
    />
  );
}
