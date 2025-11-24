import Link from "next/link";
import React from "react";

import SignUpForm from "@/components/forms/sign-up-form";
import { AuthWrapper } from "@/components/shared/auth-wrapper";
import { allRoutes } from "@/config/routes";

export default function SignUpPage() {
  return (
    <AuthWrapper
      wrapper="h-full md:!h-screen"
      bgImage="https://res.cloudinary.com/davidleo/image/upload/v1744665655/6d1514ca15ce0516275ee0946cc6fe7a_ntkzw0.jpg"
      authTitle="Create an account"
      authDesc={
        <p className="text-sm md:text-[18px]">
          Already have an account?{" "}
          <Link
            className="cursor-pointer text-blue-500"
            href={allRoutes.auth.signIn.url}
          >
            Log in
          </Link>
        </p>
      }
      form={<SignUpForm />}
    />
  );
}
