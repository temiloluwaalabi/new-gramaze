import React from "react";

import { RegisterVerifyOTPStep } from "@/components/forms/auth/register-step-verify-otp";
import { AuthWrapper } from "@/components/shared/auth-wrapper";

// import { OTPForm } from "@/components/forms/otp-form";

export default function VerifyOTP() {
  return (
    <AuthWrapper
      bgImage="/asset/images/home-bg.jpeg"
      wrapper="!h-screen not-md:flex not-md:items-center not-md:justify-center"
      authTitle="Verify OTP"
      authDesc="Enter the OTP sent to your registered phone number"
      form={<RegisterVerifyOTPStep isPasswordReset={true} />}
    />
  );
}
