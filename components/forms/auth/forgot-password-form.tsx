"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { FormFieldTypes } from "@/config/enum";
import { allRoutes } from "@/config/routes";
import { useInitiatePasswordReset } from "@/lib/queries/use-auth-queries";
import { ForgotPasswordSchema } from "@/lib/schemas/user.schema";

import { CustomFormField } from "../../shared/custom-form-field";
import { Button } from "../../ui/button";
import { Form } from "../../ui/form";

export default function ForgotPasswordForm() {
  const router = useRouter();
  const ForgotPasswordForm = useForm<z.infer<typeof ForgotPasswordSchema>>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const { isPending, mutate: InitiatePasswordReset } =
    useInitiatePasswordReset(true);

  const handleSubmit = (values: z.infer<typeof ForgotPasswordSchema>) => {
    InitiatePasswordReset(
      {
        email: values.email,
      },
      {
        onSuccess: async (data) => {
          toast.success(data.message);
          router.push(allRoutes.auth.signIn.url);
        },
      }
    );
  };
  return (
    <Form {...ForgotPasswordForm}>
      <form
        className="space-y-4"
        onSubmit={ForgotPasswordForm.handleSubmit(handleSubmit)}
      >
        <div className="space-y-4">
          <CustomFormField
            control={ForgotPasswordForm.control}
            name="email"
            label="Email"
            fieldType={FormFieldTypes.INPUT}
            inputType="email"
            disabled={isPending}
            placeholder="Please enter your email address"
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
