// PasswordResetConfirmation.tsx
'use client';

import { Button } from '@/components/ui/button';

interface PasswordResetConfirmationProps {
  email: string;
  onCheckEmail: () => void;
}

export default function PasswordResetConfirmation({
  email = 'designsync@gmail.com',
  onCheckEmail = () => (window.location.href = 'https://mail.google.com'),
}: PasswordResetConfirmationProps) {
  return (
    <div className=" w-full">
      <div className="">
        <h1 className="text-xl font-semibold mb-4">Password Reset Email Sent</h1>

        <p className="text-gray-600 mb-2">
          Instructions for password reset have been sent to {email}
        </p>

        <p className="text-gray-600 mb-2">
          If you don&apos;t receive it right away, check your spam folder
        </p>

        <p className="text-gray-600 mb-6">
          Contact our support team if you have any issues resetting your password
        </p>

        <Button
          className="w-fit text-sm !h-[51px] bg-gray-900 hover:bg-gray-800 text-white py-5"
          onClick={onCheckEmail}
        >
          Check email
        </Button>
      </div>
    </div>
  );
}
