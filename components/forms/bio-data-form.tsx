"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { FormFieldTypes } from "@/config/enum";
import { useOnboarding } from "@/context/onboarding-context";
import { useUpdateBiodate } from "@/lib/queries/use-auth-queries";
import { BiodataSchema } from "@/lib/schemas/user.schema";
import { useUserStore } from "@/store/user-store";

import { CustomFormField } from "../shared/custom-form-field";
import { Button } from "../ui/button";
import { Form } from "../ui/form";
import { SelectItem } from "../ui/select";

export default function BiodataForm() {
  const { user, setUser } = useUserStore();
  console.log("USER", user);
  const { goToNextStep, updateData, currentStep, markStepComplete, data } =
    useOnboarding();
  const { isPending, mutate: UpdateBiodata } = useUpdateBiodate();
  const BiodataForm = useForm<z.infer<typeof BiodataSchema>>({
    resolver: zodResolver(BiodataSchema),
    defaultValues: {
      first_name: user?.first_name || data.personalInfo.fullName || "",
      last_name: user?.last_name || data.personalInfo.fullName || "",
      gender: user?.gender || data.personalInfo.gender || "",
      address: user?.address || data.personalInfo.address || "",
      dob: user?.dob
        ? new Date(user.dob)
        : data.personalInfo.dateOfBirth
          ? new Date(data.personalInfo.dateOfBirth)
          : new Date(),
      phoneNumber: user?.phone || data.personalInfo.phoneNumber || "",
    },
  });

  const hasFilledBiodate = user?.has_set_bio_data === "yes";

  console.log("BIODATE FORM", BiodataForm.watch());

  const handleSubmit = (values: z.infer<typeof BiodataSchema>) => {
    updateData("personalInfo", {
      fullName: values.first_name,
      dateOfBirth: values.dob,
      gender: values.gender,
      address: values.address,
      phoneNumber: values.phoneNumber,
    });

    UpdateBiodata(values, {
      onSuccess: (data) => {
        setUser(data.data!);
        // toast.success(data.message);
        markStepComplete(currentStep);
        goToNextStep();
      },
    });
  };
  return (
    <Form {...BiodataForm}>
      <form
        className="space-y-4"
        onSubmit={BiodataForm.handleSubmit(handleSubmit)}
      >
        <div className="space-y-4">
          <CustomFormField
            control={BiodataForm.control}
            name="first_name"
            label="First Name"
            fieldType={FormFieldTypes.INPUT}
            inputType="text"
            disabled={true}
            placeholder="First Name"
          />
          <CustomFormField
            control={BiodataForm.control}
            name="last_name"
            label="Last Name"
            fieldType={FormFieldTypes.INPUT}
            inputType="text"
            disabled={true}
            placeholder="Last Mame"
          />
          <div className="flex flex-col items-start gap-4 lg:flex-row lg:items-center">
            <CustomFormField
              control={BiodataForm.control}
              name="dob"
              label="Date of birth"
              fieldType={FormFieldTypes.DATE_PICKER}
              className="w-full"
              disabled={isPending || hasFilledBiodate}
            />
            <CustomFormField
              control={BiodataForm.control}
              name="gender"
              label="Gender"
              fieldType={FormFieldTypes.SELECT}
              className="w-full"
              placeholder="Select Gender"
              disabled={isPending || hasFilledBiodate}
            >
              {[
                {
                  id: "male",
                  label: "Male",
                },
                {
                  id: "female",
                  label: "Female",
                },
                {
                  id: "prefer-not-to-say",
                  label: "Prefer not to say",
                },
              ].map((gender) => (
                <SelectItem
                  key={gender.id}
                  value={gender.id}
                  className="cursor-pointer"
                >
                  {gender.label}
                </SelectItem>
              ))}
            </CustomFormField>
          </div>
          <CustomFormField
            control={BiodataForm.control}
            name="address"
            label="Where will the care be provided?"
            fieldType={FormFieldTypes.INPUT}
            inputType="text"
            disabled={isPending || hasFilledBiodate}
            placeholder="Address"
          />
          <CustomFormField
            control={BiodataForm.control}
            name="phoneNumber"
            label="Phone Number"
            fieldType={FormFieldTypes.PHONE_INPUT}
            disabled={isPending || hasFilledBiodate}
            placeholder="Please enter your number"
          />
        </div>

        <div className="space-y-4">
          <Button
            type="submit"
            disabled={isPending || hasFilledBiodate}
            className="flex w-full items-center"
          >
            {isPending && <Loader2 className="me-2 size-4 animate-spin" />}
            Continue{" "}
          </Button>
        </div>
      </form>
    </Form>
  );
}
