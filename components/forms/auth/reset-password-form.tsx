"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { Button } from "react-day-picker";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { CustomFormField } from "@/components/shared/custom-form-field";
import { Form } from "@/components/ui/form";
import { FormFieldTypes } from "@/config/enum";
import { allRoutes } from "@/config/routes";
import { usePasswordReset } from "@/lib/queries/use-auth-queries";
import { ResetPasswordSchema } from "@/lib/schemas/user.schema";

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tokenn = searchParams.get("token");
  const emaill = searchParams.get("email");
  useEffect(() => {
    if (!tokenn || !emaill) {
      toast.error("Reset Error");
      router.push("/sign-in");
    }
  }, [emaill, router, tokenn]);

  const { isPending, mutate: ResetPassword } = usePasswordReset();

  const ResetPasswordForm = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = (values: z.infer<typeof ResetPasswordSchema>) => {
    ResetPassword(
      {
        email: emaill || "",
        token: tokenn || "",
        password: values.password,
        password_confirmation: values.confirmPassword,
      },
      {
        onSuccess: (data) => {
          toast.success(data.message);
          router.push("/sign-in");
        },
      }
    );
  };
  return (
    <Form {...ResetPasswordForm}>
      <form
        className="space-y-4"
        onSubmit={ResetPasswordForm.handleSubmit(handleSubmit)}
      >
        <div className="space-y-4">
          <CustomFormField
            control={ResetPasswordForm.control}
            name="password"
            label="New Password"
            fieldType={FormFieldTypes.PASSWORD}
            className="!bg-transparent"
            disabled={isPending}
            placeholder="New Password"
          />{" "}
          <CustomFormField
            control={ResetPasswordForm.control}
            name="confirmPassword"
            label="Confirm new password"
            fieldType={FormFieldTypes.PASSWORD}
            className="!bg-transparent"
            disabled={isPending}
            placeholder="Confirm new password"
          />
        </div>

        <div className="space-y-4">
          <Button
            type="submit"
            disabled={isPending}
            className="flex w-full items-center"
          >
            {isPending && <Loader2 className="me-2 size-4 animate-spin" />}
            Reset Password
          </Button>
          <p className="text-[18px]">
            Already have an account?{" "}
            <Link
              className="cursor-pointer text-blue-500 underline"
              href={allRoutes.auth.signIn.url}
            >
              Log in
            </Link>
          </p>
        </div>
      </form>
    </Form>
  );
}
