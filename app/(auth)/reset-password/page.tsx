import React from "react";

import ResetPasswordForm from "@/components/forms/reset-password-form";
import { AuthWrapper } from "@/components/shared/auth-wrapper";

export default function ResetPasswordPage() {
  return (
    <AuthWrapper
      wrapper="h-screen"
      bgImage="https://res.cloudinary.com/davidleo/image/upload/v1744665655/6d1514ca15ce0516275ee0946cc6fe7a_ntkzw0.jpg"
      authTitle="Reset Password"
      form={<ResetPasswordForm />}
    />
  );
}
