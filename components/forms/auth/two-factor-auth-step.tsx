/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, RotateCcw } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Resend2faOTP, Verify2faOTP } from "@/app/actions/auth.actions";
import { CustomFormField } from "@/components/shared/custom-form-field";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormFieldTypes } from "@/config/enum";
import { allRoutes } from "@/config/routes";
import useSession from "@/hooks/use-session";
import useSafeToast from "@/hooks/useSafeToast";
import {
  RegisterVerifyEmailStepSchema,
  RegisterVerifyEmailStepType,
} from "@/lib/schemas/user.schema";
import { useUserStore } from "@/store/user-store";

const RESEND_OTP_SECONDS = 60;

type RegisterVerifyOTPStepProps = {
  isPasswordReset?: boolean;
};

export const TwoFactorStep = ({
  isPasswordReset,
}: RegisterVerifyOTPStepProps) => {
  const { session } = useSession();
  const { user } = useUserStore();
  const [timer, setTimer] = React.useState(RESEND_OTP_SECONDS);
  const [isResending, setIsResending] = React.useState(false);
  const [isVerifyingOTP, setisVerifyingOTP] = React.useState(false);
  const [authError, setAuthError] = React.useState<string | null>(null);
  const [resendSuccess, setResendSuccess] = React.useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { safeSuccess, safeError } = useSafeToast();

  const registerForm = useForm<RegisterVerifyEmailStepType>({
    resolver: zodResolver(RegisterVerifyEmailStepSchema),
    defaultValues: {
      otp: "",
      email: "",
    },
    mode: "onChange",
  });

  React.useEffect(() => {
    registerForm.setValue("email", session?.email || user?.email || "");
  }, [registerForm, session?.email, user?.email]);

  // Timer effect
  React.useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  // Fixed resend OTP handler
  const handleResendOtp = async () => {
    setIsResending(true);
    setAuthError(null);
    setResendSuccess(null);

    try {
      const data = await Resend2faOTP(
        {
          email: session?.email || "",
        },
        pathname
      );

      if (data.success === true) {
        safeSuccess("resend-otp-success", "OTP sent successfully");
        setTimer(RESEND_OTP_SECONDS); // Reset the timer
        // normalize data.message (string | string[] | undefined) to string | null
        setResendSuccess(
          Array.isArray(data.message)
            ? data.message.join(", ")
            : (data.message ?? null)
        );
      } else {
        safeError("resend-otp-error", "Failed to send OTP");
        setAuthError(
          Array.isArray(data.message)
            ? data.message.join(", ")
            : (data.message ?? null)
        );
      }
    } catch (error: any) {
      console.error("Unexpected error:", error);
      const errorMessage = "An unexpected error occurred. Please try again.";
      setAuthError(errorMessage);
      safeError("resend-otp-error", errorMessage);
    } finally {
      setIsResending(false);
    }
  };

  console.log("VALUES", registerForm.watch());
  const handleSubmit = async (values: RegisterVerifyEmailStepType) => {
    setisVerifyingOTP(true);
    setAuthError(null);
    try {
      const data = await Verify2faOTP(
        {
          email: values.email,
          otp: values.otp,
        },
        pathname,
        isPasswordReset
      );

      if (data.success) {
        registerForm.reset();
        toast.success("Login successful! Redirecting to Dashboard");
        router.push(`${allRoutes.user.dashboard.home.url}`);
        // setCurrentStep(1);
      } else {
        safeError("verify-otp-error", data.data?.message || "Invalid OTP");
        setAuthError("Invalid OTP");
      }
    } catch (error: any) {
      console.error("Unexpected error:", error);
      const errorMessage = "An unexpected error occurred. Please try again.";
      setAuthError(errorMessage);
      safeError("verify-otp-error", errorMessage);
    } finally {
      setisVerifyingOTP(false);
    }
  };

  return (
    <Form {...registerForm}>
      <form
        className="mt-10 w-full space-y-4"
        onSubmit={registerForm.handleSubmit(handleSubmit)}
      >
        {authError && (
          <div className="rounded-md bg-red-100 p-2 text-center text-xs text-red-500">
            {authError}
          </div>
        )}
        {resendSuccess && (
          <div className="rounded-md bg-green-100 p-2 text-center text-xs text-green-700">
            {resendSuccess}
          </div>
        )}

        <div className="space-y-6">
          <CustomFormField
            control={registerForm.control}
            name="otp"
            fieldType={FormFieldTypes.INPT_OTP}
            disabled={isVerifyingOTP || isResending}
            maxLength={6}
            formDescription="Enter the 6-digit code sent to your email"
            formDescriptionClass="text-center"
            formMessage="text-center"
          />

          <div className="flex items-center justify-between">
            <Button
              type="submit"
              disabled={
                isVerifyingOTP || registerForm.watch("otp").length !== 6
              }
              className="flex h-[54px] w-full cursor-pointer items-center justify-center bg-black text-sm"
            >
              {isVerifyingOTP && (
                <Loader2 className="me-2 size-4 animate-spin" />
              )}
              Verify OTP
            </Button>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="text-xs text-gray-500">
              Didn&apos;t receive the code?
            </div>
            <Button
              type="button"
              variant="link"
              className="flex items-center gap-2 bg-blue-200 font-medium text-blue-600 disabled:opacity-60"
              onClick={handleResendOtp}
              disabled={timer > 0 || isResending}
            >
              <RotateCcw className="size-4" />
              {isResending
                ? "Resending..."
                : timer > 0
                  ? `Resend OTP in ${timer}s`
                  : "Resend OTP"}
            </Button>
          </div>

          {/* <div className="flex items-center justify-center gap-1 text-xs font-normal text-[#8F8F8F]">
            Already have an account?
            <Link
              href={allRoutes.auth.signIn.url}
              className="text-maroon-700 font-medium underline"
            >
              Log In
            </Link>
          </div> */}
        </div>
      </form>
    </Form>
  );
};
