"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { FormFieldTypes } from "@/config/enum";
import { allRoutes } from "@/config/routes";
import useSafeToast from "@/hooks/useSafeToast";
import { useLoginMutation } from "@/lib/queries/use-auth-queries";
import { LoginSchema } from "@/lib/schemas/user.schema";
import { useUserStore } from "@/store/user-store";

import { CustomFormField } from "../shared/custom-form-field";
import { Button } from "../ui/button";
import { Form } from "../ui/form";

export default function SignInForm() {
  const { isPending, mutate: LoginUser } = useLoginMutation();
  const { login } = useUserStore();
  const router = useRouter();
  const signInForm = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { safeSuccess, safeError } = useSafeToast();

  const handleSubmit = (values: z.infer<typeof LoginSchema>) => {
    LoginUser(values, {
      onSuccess: (data) => {
        if (data?.status) {
          login(data.user);
          safeSuccess("login-success", data.message || "Login successful!");
          router.refresh();
          router.push(`${allRoutes.user.dashboard.home.url}`);
        }
      },
      onError: (error) => {
        safeError(
          "login-error",
          error.message || "An error occurred during signing in.."
        );
      },
    });
  };

  return (
    <Form {...signInForm}>
      <form
        className="space-y-4"  
        onSubmit={signInForm.handleSubmit(handleSubmit)}
      >
        <div className="space-y-4">
          <CustomFormField
            control={signInForm.control}
            name="email"
            label="Email"
            fieldType={FormFieldTypes.INPUT}
            inputType="email"
            disabled={isPending}
            placeholder="Please enter your email address"
          />
          <CustomFormField
            control={signInForm.control}
            name="password"
            label="Password"
            fieldType={FormFieldTypes.PASSWORD}
            className="!bg-transparent"
            disabled={isPending}
            placeholder="Please enter your password"
          />
        </div>
        <div className="flex items-center justify-between">
          <CustomFormField
            control={signInForm.control}
            name="rememberMe"
            checkboxLabel="Remember me"
            fieldType={FormFieldTypes.CHECKBOX}
            disabled={isPending}
          />
          <Link
            href={allRoutes.auth.forgotPassword.url}
            className="text-blue-500 underline"
          >
            Forgot Password?
          </Link>
        </div>
        <div className="space-y-4">
          <Button
            type="submit"
            disabled={isPending}
            className="flex w-full items-center"
          >
            {isPending && <Loader2 className="me-2 size-4 animate-spin" />}
            {isPending ? "Logging In..." : "Login"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
