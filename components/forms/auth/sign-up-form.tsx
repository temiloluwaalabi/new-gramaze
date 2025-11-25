"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { CustomFormField } from "@/components/shared/custom-form-field";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormFieldTypes } from "@/config/enum";
import useSafeToast from "@/hooks/useSafeToast";
import { useRegisterStepOne } from "@/lib/queries/use-auth-queries";
import { RegisterSchema } from "@/lib/schemas/user.schema";
import { useRegisterStore } from "@/store/use-register-store";
import { useUserStore } from "@/store/user-store";
import { User } from "@/types";

export default function SignUpForm() {
  const { currentStep, setCurrentStep } = useRegisterStore();

  const { setUser } = useUserStore();
  const { isPending, mutate: RegisterStepOne } = useRegisterStepOne();
  const SignUpForm = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      first_name: "",
      last_name: "",
    },
  });
  const { safeSuccess, safeError } = useSafeToast();

  console.log("REGISTER STEP 1 FORM", SignUpForm.watch());
  const handleSubmit = (values: z.infer<typeof RegisterSchema>) => {
    RegisterStepOne(values, {
      onSuccess: (data) => {
        if (data.data?.status) {
          safeSuccess(
            "register-success",
            "Registration successful! Please check your email for verification."
          );

          const userData: User = {
            id: data.data.user_data.id,
            first_name: data.data.user_data.first_name,
            last_name: data.data.user_data.last_name,
            email: data.data.user_data.email,
            email_verified_at: null,
            agree_to_terms: "",
            user_type: null,
            user_role: "",
            has_set_user_type: "",
            plan: null,
            dob: null,
            gender: null,
            phone: null,
            has_set_bio_data: "",
            address: null,
            medical_history: null,
            medical_file: null,
            has_set_medical_history: "",
            has_set_up_appointment: "",
            has_set_plan: "",
            user_status: "",
            last_login_time: null,
            created_at: "",
            updated_at: "",
            activities_notification: null,
            factor_authentication: null,
            reminder_notification: null,
            dependents: null,
            message_notification: null,
            relationship_to_emergency_contact: null,
            emergency_contact_name: null,
            emergency_contact_phone: null,
            connected_device: null,
            image: null,
          };

          setUser(userData);
          setCurrentStep(currentStep + 1);

          // router.push(`${allRoutes.auth.onboarding.url}?step=plan`);
        }
      },
      onError: (error) => {
        safeError(
          "register-error",
          error.message || "An error occurred during registration."
        );
      },
    });
  };

  return (
    <Form {...SignUpForm}>
      <form
        className="space-y-4"
        onSubmit={SignUpForm.handleSubmit(handleSubmit)}
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <CustomFormField
              control={SignUpForm.control}
              name="first_name"
              label="First Name"
              fieldType={FormFieldTypes.INPUT}
              inputType="text"
              disabled={isPending}
              placeholder="First Name"
            />
            <CustomFormField
              control={SignUpForm.control}
              name="last_name"
              label="Last Name"
              fieldType={FormFieldTypes.INPUT}
              inputType="text"
              disabled={isPending}
              placeholder="Last Name"
            />
          </div>
          <CustomFormField
            control={SignUpForm.control}
            name="email"
            label="Email"
            fieldType={FormFieldTypes.INPUT}
            inputType="email"
            disabled={isPending}
            placeholder="Please enter your email address"
          />
          <CustomFormField
            control={SignUpForm.control}
            name="password"
            label="Password"
            fieldType={FormFieldTypes.PASSWORD}
            disabled={isPending}
            placeholder="Please enter your password"
          />
        </div>
        <div className="flex items-center justify-between">
          <CustomFormField
            control={SignUpForm.control}
            name="agree_to_terms"
            checkboxLabel={
              <p className="text-gray-600">
                I agree to the{" "}
                <Link
                  className="text-blue-500 underline"
                  href="/terms-and-conditions"
                >
                  Terms & Conditions
                </Link>
              </p>
            }
            fieldType={FormFieldTypes.CHECKBOX}
            disabled={isPending}
          />
        </div>
        <div className="space-y-4">
          <Button
            type="submit"
            disabled={isPending}
            className="flex w-full items-center"
          >
            {isPending && <Loader2 className="me-2 size-4 animate-spin" />}
            Create an account
          </Button>
        </div>
      </form>
    </Form>
  );
}
