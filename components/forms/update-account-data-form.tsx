"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { FormFieldTypes } from "@/config/enum";
import { useUpdateProfile } from "@/lib/queries/use-auth-queries";
import { BiodataSchema } from "@/lib/schemas/user.schema";
import { useUserStore } from "@/store/user-store";
import { User } from "@/types";

import { CustomFormField } from "../shared/custom-form-field";
import { Button } from "../ui/button";
import { Form } from "../ui/form";
import { SelectItem } from "../ui/select";
import { Separator } from "../ui/separator";

type UpdateAccountDataFormProps = {
  user: User;
};
export default function UpdateAccountDataForm({
  user,
}: UpdateAccountDataFormProps) {
  const { setUser } = useUserStore();

  const BiodataForm = useForm<z.infer<typeof BiodataSchema>>({
    resolver: zodResolver(BiodataSchema),
    defaultValues: {
      first_name: user?.first_name,
      last_name: user?.last_name || "",
      gender: user?.gender || "",
      address: user?.address || "",
      dob: user?.dob ? new Date(user?.dob) : new Date(),
      phoneNumber: user?.phone || "",
      email: user?.email || "",
      emergencyContact: {
        name: user?.emergency_contact_name || "",
        phoneNumber: user?.emergency_contact_phone || "",
        relationship: user?.relationship_to_emergency_contact || "",
      },
    },
  });

  const { isPending, mutate: UpdateProfile } = useUpdateProfile();
  const handleSubmit = (values: z.infer<typeof BiodataSchema>) => {
    UpdateProfile(values, {
      onSuccess: (data) => {
        setUser(data.user);
        toast.success(data.message);
      },
    });
  };
  return (
    <Form {...BiodataForm}>
      <form
        className="space-y-6"
        onSubmit={BiodataForm.handleSubmit(handleSubmit)}
      >
        <div className="space-y-6">
          <h6 className="text-[20px] font-bold text-[#212121]">
            Personal Information
          </h6>
          <div className="grid gap-4 md:grid-cols-2">
            <CustomFormField
              control={BiodataForm.control}
              name="first_name"
              label="First Name"
              fieldType={FormFieldTypes.INPUT}
              inputType="text"
              // disabled={true}
              placeholder="Firstname"
            />
            <CustomFormField
              control={BiodataForm.control}
              name="last_name"
              label="Last Name"
              fieldType={FormFieldTypes.INPUT}
              inputType="text"
              // disabled={true}
              placeholder="lastname"
            />
            <CustomFormField
              control={BiodataForm.control}
              name="dob"
              // disabled={true}
              label="Date of birth"
              fieldType={FormFieldTypes.DATE_PICKER}
            />
            <CustomFormField
              control={BiodataForm.control}
              name="address"
              label="Address"
              fieldType={FormFieldTypes.INPUT}
              inputType="text"
              // disabled={true}
              placeholder="Address"
            />
            <CustomFormField
              control={BiodataForm.control}
              name="gender"
              label="Gender"
              fieldType={FormFieldTypes.SELECT}
              // disabled={true}
              placeholder="Select Gender"
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

            <CustomFormField
              control={BiodataForm.control}
              name="phoneNumber"
              label="Phone Number"
              fieldType={FormFieldTypes.PHONE_INPUT}
              disabled={true}
              placeholder="Please enter your number"
            />
            <CustomFormField
              control={BiodataForm.control}
              name="email"
              label="Email address"
              fieldType={FormFieldTypes.INPUT}
              inputType="email"
              disabled={true}
              placeholder="deltapikin@aol.com"
            />
          </div>
        </div>{" "}
        <Separator className="bg-[#E8E8E8]" />
        <div className="space-y-6">
          <h6 className="text-[20px] font-bold text-[#212121]">
            Emergency Protocol
          </h6>
          <div className="grid gap-4 md:grid-cols-2">
            <CustomFormField
              control={BiodataForm.control}
              name="emergencyContact.name"
              label="Emergency Contact Name"
              fieldType={FormFieldTypes.INPUT}
              inputType="text"
              disabled={isPending}
              placeholder="Fullname"
            />

            <CustomFormField
              control={BiodataForm.control}
              name="emergencyContact.relationship"
              label="Relationship to Emergency Contact"
              fieldType={FormFieldTypes.INPUT}
              inputType="text"
              disabled={isPending}
              placeholder="Sister"
            />

            <CustomFormField
              control={BiodataForm.control}
              name="emergencyContact.phoneNumber"
              label="Emergency Contact Phone Number"
              fieldType={FormFieldTypes.PHONE_INPUT}
              disabled={isPending}
              placeholder="Please enter your number"
            />
          </div>
        </div>
        <div className="space-y-4">
          <Button
            type="submit"
            disabled={isPending}
            className="flex w-full items-center"
          >
            {isPending && <Loader2 className="me-2 size-4 animate-spin" />}
            Update Profile{" "}
          </Button>
        </div>
      </form>
    </Form>
  );
}
