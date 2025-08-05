import React from "react";

import ForgotPasswordForm from "@/components/forms/forgot-password-form";
import { AuthWrapper } from "@/components/shared/auth-wrapper";

export default function ForgotPasswordPage() {
  return (
    <AuthWrapper
      wrapper="h-screen"
      bgImage="https://res.cloudinary.com/davidleo/image/upload/v1744665655/6d1514ca15ce0516275ee0946cc6fe7a_ntkzw0.jpg"
      authTitle="Forgot Password"
      authDesc={
        <p className="text-[18px]">
          We&apos;ll send you a link to reset your password
        </p>
      }
      form={<ForgotPasswordForm />}
    />
  );
}
