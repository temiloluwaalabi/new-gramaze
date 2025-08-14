"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { TIME_SLOTS, affiliateHospitals } from "@/config/constants";
import { FormFieldTypes } from "@/config/enum";
import { useOnboarding } from "@/context/onboarding-context";
import { VirtualAssessmentSchema } from "@/lib/schemas/user.schema";
import { useUserStore } from "@/store/user-store";

import { CustomFormField } from "../shared/custom-form-field";
import { Button } from "../ui/button";
import { Form } from "../ui/form";
import { SelectItem } from "../ui/select";

export default function HospitalVisitForm() {
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
      address: data.appointment.address || "",
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
      address:
        affiliateHospitals.find((hospital) => hospital.id === values.address)
          ?.location || "",
      hospitalName:
        affiliateHospitals.find((hospital) => hospital.id === values.address)
          ?.name || "",
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
          <div>
            <CustomFormField
              control={BiodataForm.control}
              name="address"
              label="Location"
              fieldType={FormFieldTypes.SELECT}
              // disabled={isPending}
              placeholder="Your address"
            >
              {affiliateHospitals.map((hospital) => (
                <SelectItem
                  key={hospital.id}
                  value={hospital.id}
                  className="mb-2 cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <MapPin />
                    <span className="flex flex-col items-start gap-1">
                      <span>{hospital.name}</span>
                      <span>{hospital.location}</span>
                    </span>
                  </span>
                </SelectItem>
              ))}
            </CustomFormField>
            <span className="mt-2 flex items-center gap-1 text-gray-500">
              <MapPin /> Use current location
            </span>
          </div>
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
            label="Preferred form of contact"
            fieldType={FormFieldTypes.INPUT}
            inputType="email"
            // disabled={isPending}
            placeholder="Your email address"
          />

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
