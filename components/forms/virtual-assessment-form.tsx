"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Info } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { TIME_SLOTS } from "@/config/constants";
import { FormFieldTypes } from "@/config/enum";
import { useOnboarding } from "@/context/onboarding-context";
import { VirtualAssessmentSchema } from "@/lib/schemas/user.schema";
import { useUserStore } from "@/store/user-store";

import { CustomFormField } from "../shared/custom-form-field";
import { Button } from "../ui/button";
import { Form } from "../ui/form";
import { SelectItem } from "../ui/select";

export default function VirtualAssessmentForm() {
  const { user } = useUserStore();
  const { data, updateData, currentStep, markStepComplete } = useOnboarding();
  const BiodataForm = useForm<z.infer<typeof VirtualAssessmentSchema>>({
    resolver: zodResolver(VirtualAssessmentSchema),
    defaultValues: {
      time: data.appointment.time || "",
      email: data.appointment.email || user?.email || "",
      date: data.appointment.date
        ? new Date(data.appointment.date)
        : new Date(),
      notes: data.appointment.notes || "",
    },
  });

  const handleSubmit = (values: z.infer<typeof VirtualAssessmentSchema>) => {
    updateData("appointment", {
      type: data.appointment.type,
      physicalType: data.appointment.physicalType,
      date: values.date,
      email: values.email,
      time: values.time,
      notes: values.notes,
    });
    updateData("appointmentReadyForReview", true);
    markStepComplete(currentStep);
  };
  return (
    <Form {...BiodataForm}>
      <form
        className="space-y-4"
        onSubmit={BiodataForm.handleSubmit(handleSubmit)}
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <CustomFormField
              control={BiodataForm.control}
              name="date"
              label="Date"
              fieldType={FormFieldTypes.DATE_PICKER}
            />
            <CustomFormField
              control={BiodataForm.control}
              name="time"
              label="Time"
              fieldType={FormFieldTypes.SELECT}
              placeholder="Time"
            >
              {TIME_SLOTS.map((gender) => (
                <SelectItem
                  key={gender}
                  value={gender}
                  className="mb-2 cursor-pointer"
                >
                  {gender}
                </SelectItem>
              ))}
            </CustomFormField>
          </div>
          <CustomFormField
            control={BiodataForm.control}
            name="email"
            label="Email address"
            fieldType={FormFieldTypes.INPUT}
            inputType="email"
            // disabled={isPending}
            placeholder="Email Address"
          />
          <div className="flex h-[40px] items-center gap-2 rounded-[8px] bg-gray-100 px-3 py-2">
            <Info className="size-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-600">
              Web conferencing details will be emailed to you once your
              appointment is confirmed
            </span>
          </div>
          <CustomFormField
            control={BiodataForm.control}
            name="notes"
            label="Additional Notes"
            fieldType={FormFieldTypes.TEXTAREA}
            // disabled={isPending}
            placeholder="the patient uses a hearing aid"
          />
        </div>

        <div className="space-y-4">
          <Button
            type="submit"
            //   disabled={isPending}
            className="flex w-full items-center"
          >
            {/* {isPending && <Loader2 className="me-2 size-4 animate-spin" />} */}
            Confirm Appointment{" "}
          </Button>
        </div>
      </form>
    </Form>
  );
}
