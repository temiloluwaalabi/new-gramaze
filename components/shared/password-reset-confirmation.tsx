// PasswordResetConfirmation.tsx
"use client";

import { Button } from "@/components/ui/button";

interface PasswordResetConfirmationProps {
  email: string;
  onCheckEmail: () => void;
}

export default function PasswordResetConfirmation({
  email = "designsync@gmail.com",
  onCheckEmail = () => (window.location.href = "https://mail.google.com"),
}: PasswordResetConfirmationProps) {
  return (
    <div className="w-full">
      <div className="">
        <h1 className="mb-4 text-xl font-semibold">
          Password Reset Email Sent
        </h1>

        <p className="mb-2 text-gray-600">
          Instructions for password reset have been sent to {email}
        </p>

        <p className="mb-2 text-gray-600">
          If you don&apos;t receive it right away, check your spam folder
        </p>

        <p className="mb-6 text-gray-600">
          Contact our support team if you have any issues resetting your
          password
        </p>

        <Button
          className="!h-[51px] w-fit bg-gray-900 py-5 text-sm text-white hover:bg-gray-800"
          onClick={onCheckEmail}
        >
          Check email
        </Button>
      </div>
    </div>
  );
}
